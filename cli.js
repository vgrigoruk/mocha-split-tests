"use strict";

const { distributeByRuntime, loadRuntimeStats, listFiles } = require("./index");

module.exports = {
  async run() {
    function parseIntValue(value, _) {
      // parseInt takes a string and an optional radix
      return parseInt(value);
    }

    const program = require("commander");
    const version = require("./package").version;
    program
      .version(version)
      .requiredOption(
        "-t, --totalGroups <int>",
        "Total number of test runner machines / containers",
        parseIntValue
      )
      .requiredOption(
        "-g, --groupNumber <int>",
        "Number of group to get tests for (starts from 0)",
        parseIntValue
      )
      .requiredOption(
        "-r, --runtime-log <path>",
        "Location of previously recorded test runtimes"
      )
      .requiredOption(
        '-f, --file-pattern "<pattern>"',
        'e.g. "test/**/*.spec.js"'
      )
      .option("-rs, --resultSeparator", 'default: " "', " ");

    const {
      filePattern,
      runtimeLog,
      totalGroups,
      groupNumber,
      resultSeparator
    } = program.parse(process.argv).opts();

    const testFiles = listFiles(filePattern);
    const runtimeStats = await loadRuntimeStats(runtimeLog);
    const buckets = distributeByRuntime({
      testFiles,
      runtimeStats,
      totalGroups
    });
    return buckets[groupNumber].files.join(resultSeparator);
  }
};
