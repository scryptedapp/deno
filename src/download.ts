import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import { artifactDirectory, downloadDirectory, downloadFileCommon, getDenoPaths } from './common';

async function unzipDeno(zipPath: string, platform: typeof process.platform, arch: typeof process.arch, denoZipPath = 'deno', suffix = '') {
    const { filename, denoPath } = getDenoPaths(platform, arch, suffix);
    console.log('extracting', {
        zipPath,
        denoPath,
    });
    const zip = new AdmZip(zipPath);
    zip.extractEntryTo(denoZipPath, path.dirname(denoPath), false, true, false, filename);
    return denoPath;
}

async function downloadFile(url: string, platform: string, arch: string, version = currentDenoVersion, suffix = path.extname(url)) {
    const filename = `deno-${platform}-${arch}-${version}${suffix}`;
    const downloadPath = path.join(downloadDirectory, filename);

    return downloadFileCommon(url, downloadPath);
}

const currentDenoVersion = '1.45.5';

async function downloadMacX64(version = currentDenoVersion) {
    const denoZip = await downloadFile(`https://github.com/denoland/deno/releases/download/v${version}/deno-x86_64-apple-darwin.zip`, 'darwin', 'x64', version);
    return unzipDeno(denoZip, 'darwin', 'x64',);
}

async function downloadMacAppleArm64(version = currentDenoVersion) {
    const denoZip = await downloadFile(`https://github.com/denoland/deno/releases/download/v${version}/deno-aarch64-apple-darwin.zip`, 'darwin', 'arm64', version);
    return unzipDeno(denoZip, 'darwin', 'arm64',);
}

async function downloadLinuxX64(version = currentDenoVersion) {
    const denoZip = await downloadFile(`https://github.com/denoland/deno/releases/download/v${version}/deno-x86_64-unknown-linux-gnu.zip`, 'linux', 'x64', version, '.tar.xz');
    return unzipDeno(denoZip, 'linux', 'x64',);
}

async function downloadLinuxArm64(version = currentDenoVersion) {
    const denoZip = await downloadFile(`https://github.com/denoland/deno/releases/download/v${version}/deno-aarch64-unknown-linux-gnu.zip`, 'linux', 'arm64', version, '.tar.xz');
    return unzipDeno(denoZip, 'linux', 'arm64',);
}

async function downloadWindowsX64(version = currentDenoVersion) {
    const denoZip = await downloadFile(`https://github.com/denoland/deno/releases/download/v${version}/deno-x86_64-pc-windows-msvc.zip`, 'win32', 'x64', version);
    return unzipDeno(denoZip, 'win32', 'x64', 'deno.exe', '.exe');
}

export async function downloadDeno(platform: typeof process.platform, arch: typeof process.arch) {
    await fs.promises.mkdir(downloadDirectory, { recursive: true });
    await fs.promises.rm(artifactDirectory, { recursive: true, force: true });
    await fs.promises.mkdir(artifactDirectory, { recursive: true });

    if (!platform || platform === 'darwin') {
        if (!arch || arch === 'x64')
            await downloadMacX64();
        if (!arch || arch === 'arm64')
            await downloadMacAppleArm64();
    }

    if (!platform || platform === 'linux') {
        if (!arch || arch === 'x64')
            await downloadLinuxX64();
        if (!arch || arch === 'arm64')
            await downloadLinuxArm64();
    }

    if (!platform || platform === 'win32') {
        if (!arch || arch === 'x64')
            await downloadWindowsX64();
    }
}
