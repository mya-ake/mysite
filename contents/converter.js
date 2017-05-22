'use strict';

const fs = require('fs');
const path = require('path');
const marked = require('marked');
const highlight = require('highlight.js');
const colors = require('colors/safe');

/** constants */
const ARGV = Object.freeze({
  TARGET: {
    NAME: 'target',
    COMMAND: '-t',
    CORRECT_VALUES: ['pages', 'slides'],
  },
  FILE: {
    NAME: 'file',
    COMMAND: '-f',
  },
});

/** functions */
const extractArgv = (argv, command) => {
  let isExtract = false;
  return argv.filter((value) => {
    if (/^-/.test(value) === true) {
      isExtract = value === command;
      return false;
    }
    return isExtract;
  });
};

const verifyValues = (values, argObject) => {
  for (let value of values) {
    if (argObject.CORRECT_VALUES.includes(value) === false) {
      console.error(colors.red(`Error: Invalid value '${value}' in ${argObject.NAME}[${argObject.COMMAND}].`));
      process.exit();
    }
  }
};

const createTargets = (argTargets) => {
  let targets = [];
  if (argTargets.length === 0) {
    targets = Array.from(ARGV.TARGET.CORRECT_VALUES);
  } else {
    targets = Array.from(argTargets);
  }
  return targets;
};

const getFolderFileNames = (folderName) => {
  try {
    return fs.readdirSync(folderName);
  } catch (err) {
    console.error(colors.red(err));
    process.exit();
  }
};

const getTargetFileNames = (targets) => {
  const fileNames = {};
  for (let target of targets) {
    fileNames[target] = getFolderFileNames(target);
  }
  return fileNames;
};

/** main process */
const argv = process.argv.filter((value, index) => index > 1);

// Targets
const argTargets = extractArgv(argv, ARGV.TARGET.COMMAND);
verifyValues(argTargets, ARGV.TARGET);
const targets = createTargets(argTargets);
console.info(colors.cyan(`Target Folders: ${targets.join(',')}`));

// File Names
const fileNames = getTargetFileNames(targets);
console.info(fileNames);

// const argFiles = extractArgv(argv, ARGV.FILE.COMMAND);

console.info(colors.green('Completed.'));
