const { execSync } = require("child_process");

// ==========================================
// 🤖 AI AUTO-COMMIT AGENT CONFIGURATION
// ==========================================
const CONFIG = {
  checkIntervalMinutes: 5,
  pushThresholdMinutes: 30, // Push to remote every 30 mins
  maxPendingCommits: 5, // Or push if we have 5 local commits accumulated
};

// State memory
let state = {
  lastPushTime: Date.now(),
  pendingCommits: 0,
};

console.log(
  `\x1b[36m[AI Agent]\x1b[0m 🧠 Initializing Intelligent Auto-Commit System...`
);
console.log(
  `\x1b[36m[AI Agent]\x1b[0m ⏱️  Poll Interval: ${CONFIG.checkIntervalMinutes} mins`
);
console.log(
  `\x1b[36m[AI Agent]\x1b[0m 🚀 Push Strategy: Every ${CONFIG.pushThresholdMinutes} mins or ${CONFIG.maxPendingCommits} commits.`
);

// ==========================================
// 🛠️  CORE FUNCTIONS
// ==========================================

function run(command) {
  try {
    return execSync(command, { stdio: "pipe", encoding: "utf-8" }).trim();
  } catch (e) {
    return "";
  }
}

function getFileStats() {
  // Get list of changed files with status
  const statusOutput = run("git status --porcelain");
  if (!statusOutput) return null;

  const files = statusOutput.split("\n").map((line) => {
    const trimmed = line.trim();
    const code = trimmed.substring(0, 2).trim();
    const file = trimmed.substring(2).trim();
    return { code, file, type: getFileType(file) };
  });

  return files;
}

function getFileType(filename) {
  if (filename.endsWith(".js")) return "logic";
  if (filename.endsWith(".css")) return "style";
  if (filename.endsWith(".html")) return "structure";
  if (filename.includes("json")) return "config";
  return "assets";
}

function analyzeImpact(files) {
  // Determine the 'scope' and 'type' of the commit based on file extensions and count
  const types = files.map((f) => f.type);

  // Heuristic: Message Type
  let type = "chore";
  if (types.includes("logic")) type = "feat";
  if (types.includes("style") && !types.includes("logic")) type = "style";
  if (types.includes("structure") && !types.includes("logic"))
    type = "refactor";

  // Heuristic: Scope
  const fileNames = files.map((f) => f.file.split("/").pop().split(".")[0]);
  const distinctFiles = [...new Set(fileNames)].slice(0, 2).join(", ");
  const extraCount = Math.max(0, fileNames.length - 2);

  // Construct simplified message
  let message = `${type}: update ${distinctFiles}${
    extraCount > 0 ? ` +${extraCount} files` : ""
  }`;

  // Add timestamp for uniqueness and trace
  message += ` [Auto-save ${new Date().toLocaleTimeString()}]`;

  return message;
}

function decidePush() {
  const now = Date.now();
  const minutesSincePush = (now - state.lastPushTime) / 1000 / 60;

  console.log(
    `\x1b[35m[AI Decision]\x1b[0m Pending Commits: ${
      state.pendingCommits
    } | Time since push: ${Math.floor(minutesSincePush)}m`
  );

  if (state.pendingCommits >= CONFIG.maxPendingCommits) {
    return { shouldPush: true, reason: "Commit buffer full" };
  }

  if (
    minutesSincePush >= CONFIG.pushThresholdMinutes &&
    state.pendingCommits > 0
  ) {
    return { shouldPush: true, reason: "Time threshold reached" };
  }

  return { shouldPush: false, reason: "Accumulating local changes" };
}

// ==========================================
// 🧠  MAIN LOOP
// ==========================================

function agentLoop() {
  console.log(`\n\x1b[30m[Scanner]\x1b[0m Checking workspace...`);

  // 1. Perception: Check Environment
  const changes = getFileStats();

  if (!changes || changes.length === 0) {
    // No execution needed
    return;
  }

  console.log(
    `\x1b[33m[Detection]\x1b[0m Found ${changes.length} changed files.`
  );
  changes.forEach((f) => console.log(`  - [${f.code}] ${f.file}`));

  // 2. Action: Stage
  run("git add .");

  // 3. Intelligence: Generate Commit Message
  const commitMsg = analyzeImpact(changes);
  console.log(
    `\x1b[36m[Generation]\x1b[0m Constructed message: "${commitMsg}"`
  );

  // 4. Action: Commit
  try {
    execSync(`git commit -m "${commitMsg}"`);
    state.pendingCommits++;
    console.log(`\x1b[32m[Success]\x1b[0m Saved to local history.`);
  } catch (e) {
    console.error(`Error committing: ${e.message}`);
    return;
  }

  // 5. Decision: Push to Remote?
  const decision = decidePush();

  if (decision.shouldPush) {
    console.log(
      `\x1b[35m[AI Decision]\x1b[0m 🚀 Initiating Push detected: ${decision.reason}...`
    );
    try {
      // Check if remote exists first to avoid error spam
      const remotes = run("git remote");
      if (remotes) {
        execSync("git push");
        console.log(`\x1b[32m[Success]\x1b[0m ☁️  Synced with Origin.`);
        state.lastPushTime = Date.now();
        state.pendingCommits = 0;
      } else {
        console.log(
          `\x1b[33m[Warning]\x1b[0m No remote configured. Skipping push.`
        );
      }
    } catch (e) {
      console.error(`\x1b[31m[Error]\x1b[0m Push failed: ${e.message}`);
    }
  } else {
    console.log(
      `\x1b[30m[AI Decision]\x1b[0m 🔒 Keeping changes local for now.`
    );
  }
}

// Start
setInterval(agentLoop, CONFIG.checkIntervalMinutes * 60 * 1000);

// Run immediately
agentLoop();
