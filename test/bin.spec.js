"use strict";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

describe("bin/mocha-split-tests script", function() {
  it("can be executed", async function() {
    const { stdout, stderr } = await exec(
      `./bin/mocha-split-tests -t 3 -g 2 -r test/data/fakeSpecs/runtime.log -f 'test/data/fakeSpecs/**/*.spec' -s ';'`
    );
    expect(stdout).toMatchSnapshot();
  });
});
