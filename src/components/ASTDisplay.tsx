import type { ASTNode } from '../types';
import { ASTNodeType } from '../types';

interface ASTDisplayProps {
  ast: ASTNode | null;
}

function renderASTNode(node: ASTNode, depth: number = 0): React.JSX.Element {
  const indent = depth * 20;

  return (
    <div key={Math.random()} style={{ marginLeft: `${indent}px` }} className="py-1">
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 rounded text-xs font-mono ${
          node.type === ASTNodeType.NUMBER ? 'bg-green-100 text-green-800' :
          node.type === ASTNodeType.BINARY_OP ? 'bg-blue-100 text-blue-800' :
          node.type === ASTNodeType.UNARY_OP ? 'bg-purple-100 text-purple-800' :
          node.type === ASTNodeType.IDENTIFIER ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {node.type}
        </span>

        {node.type === ASTNodeType.NUMBER && (
          <span className="text-green-600 font-mono">{node.value}</span>
        )}

        {node.type === ASTNodeType.IDENTIFIER && (
          <span className="text-orange-600 font-mono">{node.name}</span>
        )}

        {(node.type === ASTNodeType.BINARY_OP || node.type === ASTNodeType.UNARY_OP) && (
          <span className="text-blue-600 font-bold">{node.operator}</span>
        )}
      </div>

      <div>
        {node.left && (
          <div>
            <div style={{ marginLeft: `${indent + 10}px` }} className="text-xs text-gray-500">├─ left:</div>
            {renderASTNode(node.left, depth + 1)}
          </div>
        )}
        {node.right && (
          <div>
            <div style={{ marginLeft: `${indent + 10}px` }} className="text-xs text-gray-500">
              {node.left ? '└─ right:' : '└─ operand:'}
            </div>
            {renderASTNode(node.right, depth + 1)}
          </div>
        )}
      </div>
    </div>
  );
}

export function ASTDisplay({ ast }: ASTDisplayProps) {
  return (
    <div className="p-4 h-full overflow-auto">
      {ast ? (
        <div className="text-sm">
          <div className="mb-2 text-gray-600 font-semibold">Abstract Syntax Tree (AST):</div>
          {renderASTNode(ast)}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">
          Enter expression to view syntax tree...
        </div>
      )}
    </div>
  );
}