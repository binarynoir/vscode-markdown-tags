#!/usr/bin/env node
// Downloads the .vsix attached to a GitHub release (the latest one unless a tag
// is given) and opens the Marketplace publisher page, where it is uploaded by hand.
// Requires the GitHub CLI (`gh`), signed in.
import { execSync } from 'node:child_process';

const repo = 'binarynoir/vscode-markdown-tags';
const publisherUrl = 'https://marketplace.visualstudio.com/manage/publishers/binarynoir';

function run(cmd) {
    console.log(`$ ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
}

function runCapture(cmd) {
    return execSync(cmd, { encoding: 'utf-8' }).trim();
}

try {
    runCapture('gh --version');
} catch {
    console.error('The GitHub CLI (gh) is required — install it from https://cli.github.com and run `gh auth login`.');
    process.exit(1);
}

const tag = process.argv[2] ?? runCapture(`gh release view --repo ${repo} --json tagName --jq .tagName`);
const file = `vscode-markdown-tags-${tag.replace(/^v/, '')}.vsix`;

run(`gh release download ${tag} --repo ${repo} --pattern "*.vsix" --clobber`);

const opener = { darwin: 'open', win32: 'start ""' }[process.platform] ?? 'xdg-open';
try {
    execSync(`${opener} "${publisherUrl}"`, { stdio: 'ignore' });
} catch {
    // No browser available — the URL is printed below.
}

console.log(`\nDownloaded ${file}.`);
console.log(`Upload it at ${publisherUrl} — "..." next to the extension → Update.`);
