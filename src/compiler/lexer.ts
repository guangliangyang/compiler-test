import type { Token } from '../types';
import { TokenType } from '../types';

export class Lexer {
  private input: string;
  private position: number = 0;
  private currentChar: string | null = null;

  constructor(input: string) {
    this.input = input;
    this.currentChar = this.input[this.position] || null;
  }

  private advance(): void {
    this.position += 1;
    if (this.position >= this.input.length) {
      this.currentChar = null;
    } else {
      this.currentChar = this.input[this.position];
    }
  }

  private skipWhitespace(): void {
    while (this.currentChar && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  private number(): Token {
    let numStr = '';
    const startPos = this.position;

    while (this.currentChar && /[\d\.]/.test(this.currentChar)) {
      numStr += this.currentChar;
      this.advance();
    }

    return {
      type: TokenType.NUMBER,
      value: parseFloat(numStr),
      position: startPos,
    };
  }

  private identifier(): Token {
    let idStr = '';
    const startPos = this.position;

    while (this.currentChar && /[a-zA-Z0-9_]/.test(this.currentChar)) {
      idStr += this.currentChar;
      this.advance();
    }

    return {
      type: TokenType.IDENTIFIER,
      value: idStr,
      position: startPos,
    };
  }

  public getNextToken(): Token {
    while (this.currentChar) {
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

      if (/\d/.test(this.currentChar)) {
        return this.number();
      }

      if (/[a-zA-Z_]/.test(this.currentChar)) {
        return this.identifier();
      }

      const char = this.currentChar;
      const pos = this.position;
      this.advance();

      switch (char) {
        case '+':
          return { type: TokenType.PLUS, value: '+', position: pos };
        case '-':
          return { type: TokenType.MINUS, value: '-', position: pos };
        case '*':
          return { type: TokenType.MULTIPLY, value: '*', position: pos };
        case '/':
          return { type: TokenType.DIVIDE, value: '/', position: pos };
        case '^':
          return { type: TokenType.POWER, value: '^', position: pos };
        case '(':
          return { type: TokenType.LPAREN, value: '(', position: pos };
        case ')':
          return { type: TokenType.RPAREN, value: ')', position: pos };
        case '=':
          return { type: TokenType.ASSIGN, value: '=', position: pos };
        default:
          throw new Error(`Invalid character: ${char} at position ${pos}`);
      }
    }

    return { type: TokenType.EOF, value: 'EOF', position: this.position };
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    let token = this.getNextToken();

    while (token.type !== TokenType.EOF) {
      tokens.push(token);
      token = this.getNextToken();
    }

    tokens.push(token);
    return tokens;
  }
}