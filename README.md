# @peakon/mocha-split-tests

A tool that helps optimizing overall test runtime for big test suites that can be distributed across multiple containers / VMs running in parallel.

This project includes:
- a command-line tool that divides a list of spec files into a even groups (files from each group should then be executed in a separate contrainer / VM on CI environment).
- a mocha test reporter that is used to record spec runtimes.


# Usage

## Test runtime reporter

As a first step, add `@peakon/mocha-split-tests/reporter/mocha` reporter to your mocha tests setup.

As mocha v7 still doesn't support multiple reporters out of the box. So in order to enable `@peakon/mocha-split-tests/reporter/mocha` reporter, you have to use a 3rd-party package like [mocha-multi](https://github.com/peakon/mocha-multi). Here is an example config:

  ```js
  // mocha-multi-reporters.json
  {
    dot: '-',
    xunit: {
      stdout: '/dev/null',
      options: {
        output: 'junit/junit.xml'
      }
    },
    '@peakon/mocha-split-tests/reporter/mocha': 'runtime.log'
  }
  ```

`runtime.log` will be generated in project root folder after your run your tests like this:

```bash
multi=mocha-multi-reporters.json ./node_modules/.bin/mocha`
```

## CLI tool

CLI tool is used on CI environment to generate a list of specs that should be executed by a particular test container / VM.


```
Usage: mocha-split-tests [options]

Options:
  -V, --version                    output the version number
  -t, --total-groups <int>         Total number of test runner machines / containers
  -g, --group-number <int>         Number of group to get tests for (starts from 0)
  -r, --runtime-log <path>         Location of previously recorded test runtimes
  -f, --file-pattern <pattern>     e.g. "test/**/*.spec.js"
  -s, --result-separator <symbol>  Separator for resulting output (default: " ")
  -h, --help                       output usage information
```

Here is an example how to launch test on CircleCI:

```bash
export SPEC_FILES=$(npx mocha-split-tests -t $CIRCLE_NODE_TOTAL -g $CIRCLE_NODE_INDEX -r ./runtime.log -f 'test/**/*.spec.js')

./node_modules/.bin/mocha $SPEC_FILES
```


## License

MIT