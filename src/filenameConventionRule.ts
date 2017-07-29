import * as path from 'path';
import * as tslint from 'tslint';
import * as ts from 'typescript';

import upper_first = require('lodash.upperfirst');
import kebab_case = require('lodash.kebabcase');
import camel_case = require('lodash.camelcase');
import snake_case = require('lodash.snakecase');
const pascal_case = (str: string) => upper_first(camel_case(str));

export const enum NamingStyle {
  None = 'none',
  CamelCase = 'camelCase',
  KebabCase = 'kebab-case',
  PascalCase = 'PascalCase',
  SnakeCase = 'snake_case',
}

interface Options {
  namingStyle: NamingStyle;
  allowPrefixes: string[];
  allowSuffixes: string[];
  allowPatterns: string[];
}

const extnames = ['.ts', '.d.ts', '.tsx', '.js', '.jsx'];

export class Rule extends tslint.Rules.AbstractRule {
  public static get_failure_message(naming_style: NamingStyle) {
    return naming_style === NamingStyle.None
      ? 'filename is not in allowed pattern'
      : `filename is not in ${naming_style} or allowed pattern`;
  }
  public apply(source_file: ts.SourceFile): tslint.RuleFailure[] {
    const [raw_options = {}] = this.ruleArguments;
    const options: Options = {
      namingStyle: NamingStyle.KebabCase,
      allowPrefixes: [],
      allowSuffixes: [],
      allowPatterns: [],
      ...raw_options as Partial<Options>,
    };
    return this.applyWithWalker(
      new Walker(source_file, this.ruleName, options),
    );
  }
}

class Walker extends tslint.AbstractWalker<Options> {
  public walk(source_file: ts.SourceFile) {
    const raw_basename = cut_suffix(
      path.basename(source_file.fileName),
      extnames,
    );

    if (this.options.allowPatterns.length > 0) {
      const allow_regex = new RegExp(this.options.allowPatterns.join('|'));
      if (allow_regex.test(raw_basename)) {
        return;
      }
    }

    const basename = cut_prefix(
      cut_suffix(raw_basename, this.options.allowSuffixes),
      this.options.allowPrefixes,
    );

    const expected_basename = apply_naming_style(
      basename,
      this.options.namingStyle,
    );

    if (basename === expected_basename) {
      return;
    }

    this.addFailureAt(
      source_file.getStart(),
      1,
      Rule.get_failure_message(this.options.namingStyle),
    );
  }
}

function cut_suffix(str: string, suffixes: string[]) {
  for (const suffix of suffixes) {
    if (str.endsWith(suffix)) {
      return str.slice(0, -suffix.length);
    }
  }
  return str;
}

function cut_prefix(str: string, prefixes: string[]) {
  for (const prefix of prefixes) {
    if (str.startsWith(prefix)) {
      return str.slice(prefix.length);
    }
  }
  return str;
}

function apply_naming_style(str: string, naming_style: NamingStyle) {
  switch (naming_style) {
    case NamingStyle.CamelCase:
      return camel_case(str);
    case NamingStyle.KebabCase:
      return kebab_case(str);
    case NamingStyle.PascalCase:
      return pascal_case(str);
    case NamingStyle.SnakeCase:
      return snake_case(str);
    case NamingStyle.None:
      return `${str}-not-match`;
    // istanbul ignore next
    default:
      throw new Error(`Unexpected nameing style '${naming_style}'`);
  }
}
