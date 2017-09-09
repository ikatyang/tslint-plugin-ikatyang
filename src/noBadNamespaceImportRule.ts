import * as tslint from 'tslint';
import * as utils from 'tsutils';
import * as ts from 'typescript';

export class Rule extends tslint.Rules.TypedRule {
  public static readonly failure_message = 'bad namespace import is not allowed';

  // tslint:disable-next-line:naming-convention
  public applyWithProgram(
    source_file: ts.SourceFile,
    program: ts.Program,
  ): tslint.RuleFailure[] {
    return this.applyWithFunction(
      source_file,
      walk,
      undefined,
      program.getTypeChecker(),
    );
  }
}

function walk(context: tslint.WalkContext<void>, type_checker: ts.TypeChecker) {
  return ts.forEachChild(context.sourceFile, callback);

  function callback(node: ts.Node): void {
    if (
      utils.isImportDeclaration(node) &&
      node.importClause !== undefined &&
      node.importClause.namedBindings !== undefined &&
      utils.isNamespaceImport(node.importClause.namedBindings)
    ) {
      const namespace_import = node.importClause.namedBindings;
      const namespace_import_type = type_checker.getTypeAtLocation(
        namespace_import,
      );

      const semicolon = node.getText().endsWith(';') ? ';' : '';
      const identifier = namespace_import.name.getText();
      const module_specifier = node.moduleSpecifier.getText();

      if (
        (namespace_import_type.flags !== ts.TypeFlags.Any &&
          namespace_import_type.flags !== ts.TypeFlags.Object) ||
        has_signature(namespace_import_type, type_checker)
      ) {
        context.addFailureAtNode(
          node,
          Rule.failure_message,
          tslint.Replacement.replaceNode(
            node,
            `import ${identifier} = require(${module_specifier})${semicolon}`,
          ),
        );
      }
    }

    return ts.forEachChild(node, callback);
  }
}

function has_signature(type: ts.Type, type_checker: ts.TypeChecker) {
  return !!(
    type_checker.getSignaturesOfType(type, ts.SignatureKind.Call).length ||
    type_checker.getSignaturesOfType(type, ts.SignatureKind.Construct).length
  );
}
