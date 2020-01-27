"use strict";

const fs = require("fs");
const glob = require("glob");
const readline = require("readline");

module.exports = {
  async loadRuntimeStats(runtimeLog) {
    let runtimes = new Map();
    return new Promise(function(resolve, reject) {
      const readStream = fs
        .createReadStream(runtimeLog)
        .on("error", function(error) {
          reject(error.message);
        });
      readline
        .createInterface({
          input: readStream,
          terminal: false
        })
        .on("line", function(line) {
          const [file, timeStr] = line.split(":");
          const time = parseInt(timeStr);
          if (Number.isInteger(time) && time >= 0) {
            runtimes.set(file, time);
          }
        })
        .on("close", function() {
          resolve(runtimes);
        });
    });
  },

  listFiles(pattern) {
    const files = glob.sync(pattern);
    if (files.length === 0) {
      throw `No files matching a pattern: ${pattern}`;
    }
    return files;
  },

  addKnownRuntimes(testFiles, runtimeStats) {
    return testFiles.map(file => {
      const runtime = runtimeStats.get(file) || 0;
      return [file, runtime];
    });
  },

  distributeByRuntime({ testFiles, runtimeStats, totalGroups }) {
    const filesWithRuntimes = module.exports.addKnownRuntimes(
      testFiles,
      runtimeStats
    );
    const sortedFilesWithRuntimes = filesWithRuntimes.sort(
      (a, b) => b[1] - a[1]
    );
    function createBuckets(totalGroups) {
      const buckets = [];
      for (let i = 0; i < totalGroups; i++) {
        buckets.push({ runtime: 0, files: [] });
      }
      return buckets;
    }
    function nextBucket(buckets) {
      const minRuntime = Math.min(...buckets.map(b => b.runtime));
      return buckets.find(bucket => bucket.runtime === minRuntime);
    }
    const buckets = createBuckets(totalGroups);
    for (let i = 0; i < sortedFilesWithRuntimes.length; i++) {
      const [file, runtime] = sortedFilesWithRuntimes[i];
      const bucket = nextBucket(buckets);
      bucket.runtime += runtime;
      bucket.files.push(file);
    }
    return buckets;
  }
};
