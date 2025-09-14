import type { ASTNode } from '../types';
import { ASTNodeType } from '../types';

export class CodeGenerator {
  private instructions: string[] = [];

  public generate(ast: ASTNode): string[] {
    this.instructions = [];
    this.visit(ast);
    return this.instructions;
  }

  private visit(node: ASTNode): void {
    switch (node.type) {
      case ASTNodeType.NUMBER:
        this.instructions.push(`PUSH ${node.value}`);
        break;

      case ASTNodeType.IDENTIFIER:
        this.instructions.push(`LOAD ${node.name}`);
        break;

      case ASTNodeType.BINARY_OP:
        // 访问左子树
        if (node.left) {
          this.visit(node.left);
        }
        // 访问右子树
        if (node.right) {
          this.visit(node.right);
        }
        // 生成操作指令
        this.generateBinaryOp(node.operator!);
        break;

      case ASTNodeType.UNARY_OP:
        // 访问操作数
        if (node.right) {
          this.visit(node.right);
        }
        // 生成一元操作指令
        this.generateUnaryOp(node.operator!);
        break;

      default:
        throw new Error(`Unknown AST node type: ${node.type}`);
    }
  }

  private generateBinaryOp(operator: string): void {
    switch (operator) {
      case '+':
        this.instructions.push('ADD');
        break;
      case '-':
        this.instructions.push('SUB');
        break;
      case '*':
        this.instructions.push('MUL');
        break;
      case '/':
        this.instructions.push('DIV');
        break;
      case '^':
        this.instructions.push('POW');
        break;
      default:
        throw new Error(`Unknown binary operator: ${operator}`);
    }
  }

  private generateUnaryOp(operator: string): void {
    switch (operator) {
      case '+':
        // 正号不需要操作
        break;
      case '-':
        this.instructions.push('NEG');
        break;
      default:
        throw new Error(`Unknown unary operator: ${operator}`);
    }
  }
}