# tslint-plugin-ikatyang

[![npm](https://img.shields.io/npm/v/tslint-plugin-ikatyang.svg)](https://www.npmjs.com/package/tslint-plugin-ikatyang)
[![build](https://img.shields.io/travis/ikatyang/tslint-plugin-ikatyang/master.svg)](https://travis-ci.org/ikatyang/tslint-plugin-ikatyang/builds)
[![coverage](https://img.shields.io/codecov/c/github/ikatyang/tslint-plugin-ikatyang/master.svg)](https://codecov.io/gh/ikatyang/tslint-plugin-ikatyang)

tslint rules for ikatyang

[Changelog](https://github.com/ikatyang/tslint-plugin-ikatyang/blob/master/CHANGELOG.md)

## Install

```sh
# using npm
npm install --save-dev tslint-plugin-ikatyang tslint

# using yarn
yarn add --dev tslint-plugin-ikatyang tslint
```

## Usage

(tslint.json)

for `tslint@5.0.0+`

```json
{
  "extends": ["tslint-plugin-ikatyang"],
  "rules": {
    ...
  }
}
```

for `tslint@5.2.0+`

```json
{
  "rulesDirectory": ["tslint-plugin-ikatyang"],
  "rules": {
    ...
  }
}
```

## Rules

### `filename-convention`

Enforces all linted files to have their names in a certain case style

Options:

- namingStyle
  - default: `'kebab-case'`
  - type: `'camelCase' | 'kebab-case' | 'PascalCase' | 'snake_case' | 'none'`
  - `'none'` means only accept `allowPatterns`
- allowPrefixes
  - default: `[]`
  - type: `string[]`
  - e.g. `['.']` (dotfile)
- allowSuffixes
  - default: `[]`
  - type: `string[]`
  - e.g. `['.test', '.spec']` (test files)
- allowPatterns
  - default: `[]`
  - type: `string[]`
  - regex patterns, extname excluded

### `no-mixed-parameter-properties`

Disallow mixed parameter properties

- pass

  ```ts
  class MyClass {
    public prop;
    constructor(arg1, arg2) {}
  }
  ```

- fail

  ```ts
  class MyClass {
    public prop;
    constructor(public propArg, arg) {}
    //          ~~~~~~~~~~~~~~ [fail]
  }
  ```

- fixed

  ```ts
  class MyClass {
    public prop;
    public propArg;
    constructor(propArg, arg) {
      this.propArg = propArg;
    }
  }
  ```

## Development

```sh
# lint
yarn run lint

# format
yarn run format

# build
yarn run build

# test
yarn run test
```

## License

MIT © [Ika](https://github.com/ikatyang)
