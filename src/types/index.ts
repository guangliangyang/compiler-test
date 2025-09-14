export enum TokenType {
  NUMBER = 'NUMBER',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  POWER = 'POWER',
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  IDENTIFIER = 'IDENTIFIER',
  ASSIGN = 'ASSIGN',
  EOF = 'EOF',
}

export interface Token {
  type: TokenType;
  value: string | number;
  position: number;
}

export enum ASTNodeType {
  NUMBER = 'NUMBER',
  BINARY_OP = 'BINARY_OP',
  UNARY_OP = 'UNARY_OP',
  IDENTIFIER = 'IDENTIFIER',
  ASSIGNMENT = 'ASSIGNMENT',
}

export interface ASTNode {
  type: ASTNodeType;
  value?: any;
  left?: ASTNode;
  right?: ASTNode;
  operator?: string;
  name?: string;
}

export interface ExecutionStep {
  instruction: string;
  instructionIndex: number;
  stackBefore: number[];
  stackAfter: number[];
  description: string;
}

export interface ExecutionState {
  steps: ExecutionStep[];
  currentStep: number;
  isRunning: boolean;
  isComplete: boolean;
}

export interface CompilationResult {
  tokens: Token[];
  ast: ASTNode | null;
  bytecode: string[];
  result: number | null;
  execution?: ExecutionState;
  error?: string;
}