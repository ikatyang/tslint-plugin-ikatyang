import * as tslint from 'tslint';
import * as utils from 'tsutils';
import * as ts from 'typescript';

export class Rule extends tslint.Rules.AbstractRule {
  public static readonly failure_message = 'mixed parameter properties are not allowed';
  public apply(source_file: ts.SourceFile): tslint.RuleFailure[] {
    return this.applyWithWalker(
      new Walker(source_file, this.ruleName, undefined),
    );
  }
}

class Walker extends tslint.AbstractWalker<void> {
  public walk(source_file: ts.SourceFile) {
    const callback = (node: ts.Node): void => {
      if (utils.isClassDeclaration(node) || utils.isClassExpression(node)) {
        this._check_class_declaration_or_expression(node, source_file);
      }
      return ts.forEachChild(node, callback);
    };
    return ts.forEachChild(source_file, callback);
  }

  private _check_class_declaration_or_expression(
    node: ts.ClassDeclaration | ts.ClassExpression,
    source_file: ts.SourceFile,
  ) {
    const has_properties = node.members.some(utils.isPropertyDeclaration);

    if (!has_properties) {
      return;
    }

    node.members
      .filter(utils.isConstructorDeclaration)
      .forEach(constructor_declaration => {
        const leading_spaces = get_leading_space(constructor_declaration);
        const has_content = constructor_declaration.body!.statements.length > 0;
        constructor_declaration.parameters
          .filter(utils.isParameterProperty)
          .forEach((parameter_property, index, { length }) => {
            const parameter_name = parameter_property.name.getText();
            const is_last_parameter = index === length - 1;
            this.addFailureAtNode(parameter_property, Rule.failure_message, [
              // remove modifiers from parameter property
              tslint.Replacement.replaceNode(
                parameter_property,
                emit(get_extracted_parameter(parameter_property), source_file),
              ),
              // add property
              tslint.Replacement.appendText(
                constructor_declaration.getStart(),
                `${emit(
                  get_extracted_property(parameter_property),
                  source_file,
                )}\n${leading_spaces}`,
              ),
              // add 'this.x = x'
              tslint.Replacement.appendText(
                constructor_declaration.body!.getStart() + 1, // tslint:disable-line:restrict-plus-operands
                `\n${leading_spaces}  this.${parameter_name} = ${parameter_name};${
                  !has_content && is_last_parameter ? `\n${leading_spaces}` : ''
                }`,
              ),
            ]);
          });
      });
  }
}

function get_leading_space(node: ts.Node) {
  const source_file = node.getSourceFile();
  const start = node.getStart();
  const { character } = source_file.getLineAndCharacterOfPosition(start);
  return ' '.repeat(character);
}

function get_extracted_property(node: ts.ParameterDeclaration) {
  return ts.createProperty(
    node.decorators,
    node.modifiers,
    node.name.getText(),
    node.questionToken,
    node.type,
    undefined,
  );
}

function get_extracted_parameter(node: ts.ParameterDeclaration) {
  return ts.createParameter(
    node.decorators,
    undefined,
    node.dotDotDotToken,
    node.name,
    node.questionToken,
    node.type,
    node.initializer,
  );
}

function emit(node: ts.Node, source_file: ts.SourceFile) {
  return ts
    .createPrinter()
    .printNode(ts.EmitHint.Unspecified, node, source_file);
}
