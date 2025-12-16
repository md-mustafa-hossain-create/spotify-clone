const { execSync } = require("child_process");
const fs = require("fs");

// ==========================================
// 🤖 PRO AI AUTO-COMMIT AGENT
// ==========================================
const CONFIG = {
  checkIntervalMinutes: 15,
  pushThresholdMinutes: 60,
  maxPendingCommits: 5,
};

let state = {
  lastPushTime: Date.now(),
  pendingCommits: 0,
};

console.log(
  `\x1b[36m[AI Agent]\x1b[0m 🧠 Initializing Pro Auto-Commit System...`
);
console.log(
  `\x1b[36m[AI Agent]\x1b[0m 🛡️  Mode: Intelligent Safety Net (Broken Code Detection Active)`
);

// ==========================================
// 🛠️  ANALYSIS TOOLS
// ==========================================

function run(command) {
  try {
    return execSync(command, { stdio: "pipe", encoding: "utf-8" }).trim();
  } catch (e) {
    return "";
  }
}

function checkSyntax(file) {
  if (!file.endsWith(".js")) return true; // Only checking JS for now based on project type
  try {
    execSync(`node --check "${file}"`, { stdio: "pipe" });
    return true;
  } catch (e) {
    return false;
  }
}

function analyzeContent(file) {
  try {
    const content = fs.readFileSync(file, "utf-8");
    // Heuristics for "Unfinished" work
    if (content.includes("TODO:") || content.includes("FIXME:")) return "wip";
    // Simple check for debugging leftovers
    if (content.match(/console\.log\(/g)?.length > 3) return "debug";
  } catch (e) {}
  return "clean";
}

function getFileStats() {
  const statusOutput = run("git status --porcelain");
  if (!statusOutput) return null;

  return statusOutput.split("\n").map((line) => {
    const trimmed = line.trim();
    const code = trimmed.substring(0, 2).trim();
    const file = trimmed.substring(2).trim();
    return { code, file, type: file.split(".").pop() };
  });
}

// ==========================================
// 🧠  INTELLIGENCE ENGINE
// ==========================================

function generateSmartMessage(changes) {
  let brokenFiles = [];
  let wipFiles = [];
  let types = new Set();

  // Analyze every changed file
  changes.forEach((f) => {
    // Skip deleted files for syntax check
    if (f.code !== "D" && fs.existsSync(f.file)) {
      // 1. Check for Broken Code
      if (!checkSyntax(f.file)) {
        brokenFiles.push(f.file);
      }
      // 2. Check for "Unfinished" code
      const contentStatus = analyzeContent(f.file);
      if (contentStatus === "wip" || contentStatus === "debug") {
        wipFiles.push(f.file);
      }
    }
    types.add(f.type);
  });

  // Strategy 1: Broken Code (Highest Priority)
  if (brokenFiles.length > 0) {
    // We still commit it (safety backup), but we flag it heavily
    const fileList = brokenFiles.map((f) => f.split("/").pop()).join(", ");
    return `⚠️ BROKEN: Syntax error in ${fileList} [Backup]`;
  }

  // Strategy 2: Unfinished / WIP
  if (wipFiles.length > 0) {
    const fileList = wipFiles.map((f) => f.split("/").pop()).join(", ");
    return `🚧 WIP: working on ${fileList} [Auto-save]`;
  }

  // Strategy 3: Clean Professional Commit
  let prefix = "chore";
  if (types.has("js")) prefix = "feat";
  if (types.has("css") && !types.has("js")) prefix = "style";
  if (types.has("html") && !types.has("js")) prefix = "refactor";

  const distinctFiles = [
    ...new Set(changes.map((f) => f.file.split("/").pop())),
  ];
  const display =
    distinctFiles.length > 2
      ? `${distinctFiles.slice(0, 2).join(", ")} +${distinctFiles.length - 2}`
      : distinctFiles.join(", ");

  return `${prefix}: update ${display} at ${new Date().toLocaleTimeString(
    "en-US",
    { hour: "2-digit", minute: "2-digit" }
  )}`;
}

function agentLoop() {
  console.log(`\n\x1b[30m[Scanner]\x1b[0m Checking workspace...`);

  const changes = getFileStats();
  if (!changes || changes.length === 0) return;

  console.log(`\x1b[33m[Detection]\x1b[0m Files changed: ${changes.length}`);

  // Commit Generation
  const message = generateSmartMessage(changes);
  console.log(`\x1b[36m[Generation]\x1b[0m 📝 Message: "${message}"`);

  // Execute
  try {
    run("git add .");
    execSync(`git commit -m "${message}"`);
    state.pendingCommits++;
    console.log(`\x1b[32m[Success]\x1b[0m Local save complete.`);
  } catch (e) {
    console.error(`Error: ${e.message}`);
  }

  // Push Logic
  const minutesSincePush = (Date.now() - state.lastPushTime) / 1000 / 60;
  if (
    state.pendingCommits >= CONFIG.maxPendingCommits ||
    minutesSincePush >= CONFIG.pushThresholdMinutes
  ) {
    console.log(
      `\x1b[35m[AI Decision]\x1b[0m 🚀 Conditions met. Pushing to Cloud...`
    );
    try {
      if (run("git remote")) {
        execSync("git push");
        state.lastPushTime = Date.now();
        state.pendingCommits = 0;
        console.log(`\x1b[32m[Synced]\x1b[0m Codebase matches Origin.`);
      }
    } catch (e) {
      console.error(`Push failed: ${e.message}`);
    }
  }
}

// Start
setInterval(agentLoop, CONFIG.checkIntervalMinutes * 60 * 1000);
agentLoop();
