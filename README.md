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

// TODO: custom rules

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
