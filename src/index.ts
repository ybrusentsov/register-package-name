#!/usr/bin/env node

import { program } from 'commander';
import fs from 'node:fs';
import { exec } from 'node:child_process';
import path from 'node:path';

const RESULT_FOLDER = './tmp';

program.argument('<package-name>');
program.parse();

const packageName = program.args[0];
console.log(`Trying to publish "${packageName}" package`);

const packageJsonContent = {
  name: packageName,
  version: '0.0.0-dev',
};

if (!fs.existsSync(RESULT_FOLDER)) {
  fs.mkdirSync(RESULT_FOLDER);
}

const runCommand = (command: string): Promise<undefined> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      console.log(stdout);
      console.error(stderr);
      if (error) {
        return reject();
      }
      return resolve(undefined);
    });
  });
};

fs.writeFileSync(
  path.join(RESULT_FOLDER, './package.json'),
  JSON.stringify(packageJsonContent)
);

runCommand(`cd ${RESULT_FOLDER} && npm publish --tag dev`)
  .then(() => {
    console.log('Package published successfully.');
  })
  .catch(() => {
    console.log('Package was not published.');
  })
  .finally(() => {
    fs.rmSync(RESULT_FOLDER, { recursive: true, force: true });
  });
