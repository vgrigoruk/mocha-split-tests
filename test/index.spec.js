"use strict";

const {
  listFiles,
  loadRuntimeStats,
  addKnownRuntimes,
  distributeByRuntime
} = require("../index");

describe("utils", function() {
  describe("listFiles", function() {
    it("should fail when no files are found", function() {
      const pattern = "**/doesnotexist/*.js";
      expect(() => listFiles(pattern)).toThrow(
        `No files matching a pattern: ${pattern}`
      );
    });

    it("should return files when pattern is correct", function() {
      expect(listFiles("*.json")).toEqual(
        expect.arrayContaining(["package.json", "package-lock.json"])
      );
    });
  });

  describe("loadRuntimeStats", function() {
    describe("when runtime.log contains malformed rows", function() {
      it("loads only well-formed rows from file", async function() {
        const stats = await loadRuntimeStats("./test/data/runtimes2.log");
        expect(stats.size).toEqual(3);
        expect(stats).toMatchSnapshot();
      });
    });

    describe("when runtime.log has no malformed rows", function() {
      it("loads all stats from a well-formed file", async function() {
        const stats = await loadRuntimeStats("./test/data/runtimes1.log");
        expect(stats.size).toEqual(11);
        expect(stats).toMatchSnapshot();
      });
    });

    describe("when runtime.log does not exist", function() {
      it("should fail with error", async function() {
        await expect(
          loadRuntimeStats("/invalid/path/to/runtime.log")
        ).rejects.toMatch(
          "no such file or directory, open '/invalid/path/to/runtime.log'"
        );
      });
    });
  });

  describe("addKnownRuntimes", function() {
    it("adds runtime stats to test backlog", function() {
      const testBacklog = [
        "test/1.spec.js",
        "test/2.spec.js",
        "test/3.spec.js"
      ];
      const runtimeStats = new Map()
        .set("test/1.spec.js", 100)
        .set("test/2.spec.js", 200)
        .set("test/4.spec.js", 400);
      expect(addKnownRuntimes(testBacklog, runtimeStats)).toEqual([
        ["test/1.spec.js", 100],
        ["test/2.spec.js", 200],
        ["test/3.spec.js", 0]
      ]);
    });
  });

  describe("distributeByRuntime", function() {
    it("evenly distributes test files between buckets", async function() {
      const runtimeStats = new Map()
        .set("1", 100)
        .set("2", 200)
        .set("3", 300)
        .set("4", 400)
        .set("5", 500)
        .set("6", 600)
        .set("7", 700)
        .set("8", 800)
        .set("9", 900);
      const testFiles = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      const result = await distributeByRuntime({
        testFiles,
        runtimeStats,
        totalGroups: 4
      });
      expect(result).toMatchSnapshot();
    });
  });
});
