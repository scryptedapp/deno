import path from 'path';
import fs from 'fs';
import { https } from 'follow-redirects';

export const artifactDirectory = path.join(__dirname, '../artifacts');
export const downloadDirectory = path.join(__dirname, '../downloads');

export function getDenoPaths(platform = process.platform, arch = process.arch, suffix = platform === 'win32' ? '.exe' : '') {
    const filename = `deno${suffix}`;
    const denoPath = path.join(artifactDirectory, `${platform}-${arch}`, filename);

    return {
        filename,
        denoPath,
    }
}

export async function downloadFileCommon(url: string, downloadPath: string) {
    if (fs.existsSync(downloadPath))
        return downloadPath;

    console.log('downloading', {
        url,
        downloadPath
    });

    const file = fs.createWriteStream(downloadPath);
    await new Promise((resolve, reject) => {
        https.get(url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', error => {
            fs.unlink(downloadPath, () => { });
            reject(error.message);
        });
    });

    return downloadPath;
}
