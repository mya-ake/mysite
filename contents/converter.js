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
    CORRECT_VALUES: new Set(['pages', 'slides']),
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
    if (argObject.CORRECT_VALUES.has(value) === false) {
      console.error(colors.red(`Error: Invalid value '${value}' in ${argObject.NAME}[${argObject.COMMAND}].`));
      process.exit();
    }
  }
};

/** main process */
const argv = process.argv.filter((value, index) => index > 1);

const argTargets = extractArgv(argv, ARGV.TARGET.COMMAND);
verifyValues(argTargets, ARGV.TARGET);

const argFiles = extractArgv(argv, ARGV.FILE.COMMAND);

console.info(colors.green('Completed.'));