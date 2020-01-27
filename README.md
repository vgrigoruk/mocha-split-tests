# @peakon/mocha-split-tests

A simple command-line tool that splits a list of test files into a evenly-distributed buckets based on previously recorded test runtimes.
It is useful on CI environments, where multiple VMs/containers can execute tests in parallel. 

# Usage

```
Usage: mocha-split-tests [options]

Options:
  -V, --version                   output the version number
  -t, --total-groups <int>         Total number of test runner machines / containers
  -g, --group-number <int>         Number of group to get tests for (starts from 0)
  -r, --runtime-log [path]        Location of previously recorded test runtimes
  -f, --file-pattern '[pattern]'  e.g. "test/**/*.spec.js"
  -s, --resultSeparator          default: " "
  -h, --help                      output usage information
```

# Examples

## CircleCI

```
export SPEC_FILES=$(npx mocha-split-tests -t $CIRCLE_NODE_TOTAL -g $CIRCLE_NODE_INDEX -r ./runtime.log -f 'test/**/*.spec.js')

# Make sure your test execution script accepts a list of specs that should be executed. E.g:
npm test -- --specFiles="$SPEC_FILES"
```


## License

MIT