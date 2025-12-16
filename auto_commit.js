const { execSync } = require('child_process');

// Configuration
const INTERVAL_MINUTES = 5;
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000;

console.log(`\x1b[36m[Auto-Commit]\x1b[0m Starting auto-commit watcher.`);
console.log(`\x1b[36m[Auto-Commit]\x1b[0m Will check for changes every ${INTERVAL_MINUTES} minutes.`);
console.log(`\x1b[36m[Auto-Commit]\x1b[0m Press Ctrl+C to stop.`);

function runCommand(command) {
    try {
        return execSync(command, { stdio: 'pipe', encoding: 'utf-8' }).trim();
    } catch (error) {
        return ''; 
    }
}

function autoCommit() {
    const timestamp = new Date().toLocaleTimeString();
    
    // 1. Check if there are any changes
    // 'git status --porcelain' gives a short, machine-readable status of the repo
    const status = runCommand('git status --porcelain');

    if (!status || status.length === 0) {
        // No changes detected - Do NOT commit
        return; 
    }

    console.log(`\n\x1b[36m[Auto-Commit]\x1b[0m Changes detected at ${timestamp}. Proceeding to commit.`);

    // 2. Add all changes
    runCommand('git add .');

    // 3. Generate message
    const lines = status.split('\n');
    // Get list of modified files for the message
    const files = lines.map(line => line.trim().substring(2).trim()).join(', '); // substring(2) removes status flags like 'M '
    const message = `Auto-save: Updated ${files} at ${timestamp}`;

    // 4. Commit
    try {
        execSync(`git commit -m "${message}"`);
        console.log(`\x1b[32m[Success]\x1b[0m Committed changes: "${message}"`);
    } catch (error) {
        console.error(`\x1b[31m[Error]\x1b[0m Failed to commit: ${error.message}`);
    }
}

// Start the loop
setInterval(autoCommit, INTERVAL_MS);

// Run once immediately on start to catch any pending changes
autoCommit();
