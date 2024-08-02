// download all the different denos

import { rimraf } from "rimraf";
import { downloadDeno } from "./download";
import { downloadDirectory } from "./common";

rimraf.sync(downloadDirectory);

downloadDeno('darwin', 'x64');
downloadDeno('darwin', 'arm64');
downloadDeno('linux', 'x64');
downloadDeno('linux', 'arm64');
downloadDeno('win32', 'x64');
