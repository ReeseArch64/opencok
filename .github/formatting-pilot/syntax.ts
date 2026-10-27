import assert from "node:assert/strict";
import ts from "typescript";

export function syntax(source: string, name: string): unknown {
  const tree = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true);
  const diagnostics = (tree as ts.SourceFile & { parseDiagnostics: unknown[] }).parseDiagnostics;

  assert.equal(diagnostics.length, 0, `Parse errors in ${name}`);

  function visit(node: ts.Node): unknown {
    if (ts.isParenthesizedExpression(node)) {
      return visit(node.expression);
    }

    const parent = node.parent;
    const controlBody =
      parent &&
      ((ts.isIfStatement(parent) &&
        (parent.thenStatement === node || parent.elseStatement === node)) ||
        ((ts.isForStatement(parent) ||
          ts.isForInStatement(parent) ||
          ts.isForOfStatement(parent) ||
          ts.isWhileStatement(parent) ||
          ts.isDoStatement(parent)) &&
          parent.statement === node));

    if (controlBody && ts.isBlock(node) && node.statements.length === 1) {
      return visit(node.statements[0]);
    }

    const children: unknown[] = [];

    ts.forEachChild(node, (child) => {
      if (ts.isJsxText(child) && child.text.includes("\n") && !child.text.trim()) {
        return;
      }

      if (!ts.isEmptyStatement(child) || !ts.isBlock(node)) {
        children.push(visit(child));
      }
    });

    const value =
      !ts.isSourceFile(node) && "text" in node
        ? node.text
        : node.kind <= ts.SyntaxKind.LastToken
          ? node.getText(tree)
          : undefined;

    return [ts.SyntaxKind[node.kind], value, children];
  }

  return visit(tree);
}
