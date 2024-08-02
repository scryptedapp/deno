import fs from 'fs';
import { artifactDirectory, downloadDirectory, getDenoPaths } from "./common";
import { downloadDeno } from './download';
import { rimraf } from 'rimraf';


const packageJson = require('../package.json');

const version = packageJson.version.split('-')[0];
console.log(version);

const { denoPath } = getDenoPaths();

console.log(denoPath);
async function install() {
    await fs.promises.mkdir(artifactDirectory, { recursive: true });
    await downloadDeno(process.platform, process.arch);
    if (process.platform !== 'win32')
        fs.chmodSync(denoPath, 0o755);
}

install();
