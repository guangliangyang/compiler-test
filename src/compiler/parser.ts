import { Token, TokenType, ASTNode, ASTNodeType } from '../types';

export class Parser {
  private tokens: Token[];
  private currentTokenIndex: number = 0;
  private currentToken: Token;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.currentToken = this.tokens[this.currentTokenIndex];
  }

  private eat(tokenType: TokenType): void {
    if (this.currentToken.type === tokenType) {
      this.currentTokenIndex += 1;
      if (this.currentTokenIndex < this.tokens.length) {
        this.currentToken = this.tokens[this.currentTokenIndex];
      }
    } else {
      throw new Error(
        `Expected ${tokenType}, got ${this.currentToken.type} at position ${this.currentToken.position}`
      );
    }
  }

  // Grammar:
  // expr: term ((PLUS | MINUS) term)*
  // term: factor ((MULTIPLY | DIVIDE) factor)*
  // factor: (PLUS | MINUS) factor | power
  // power: atom (POWER atom)*
  // atom: NUMBER | IDENTIFIER | LPAREN expr RPAREN

  private atom(): ASTNode {
    const token = this.currentToken;

    if (token.type === TokenType.NUMBER) {
      this.eat(TokenType.NUMBER);
      return {
        type: ASTNodeType.NUMBER,
        value: token.value,
      };
    }

    if (token.type === TokenType.IDENTIFIER) {
      this.eat(TokenType.IDENTIFIER);
      return {
        type: ASTNodeType.IDENTIFIER,
        name: token.value as string,
      };
    }

    if (token.type === TokenType.LPAREN) {
      this.eat(TokenType.LPAREN);
      const node = this.expr();
      this.eat(TokenType.RPAREN);
      return node;
    }

    throw new Error(`Unexpected token ${token.type} at position ${token.position}`);
  }

  private power(): ASTNode {
    let node = this.atom();

    while (this.currentToken.type === TokenType.POWER) {
      const token = this.currentToken;
      this.eat(TokenType.POWER);
      node = {
        type: ASTNodeType.BINARY_OP,
        left: node,
        operator: token.value as string,
        right: this.atom(),
      };
    }

    return node;
  }

  private factor(): ASTNode {
    const token = this.currentToken;

    if (token.type === TokenType.PLUS) {
      this.eat(TokenType.PLUS);
      return {
        type: ASTNodeType.UNARY_OP,
        operator: '+',
        right: this.factor(),
      };
    }

    if (token.type === TokenType.MINUS) {
      this.eat(TokenType.MINUS);
      return {
        type: ASTNodeType.UNARY_OP,
        operator: '-',
        right: this.factor(),
      };
    }

    return this.power();
  }

  private term(): ASTNode {
    let node = this.factor();

    while ([TokenType.MULTIPLY, TokenType.DIVIDE].includes(this.currentToken.type)) {
      const token = this.currentToken;
      if (token.type === TokenType.MULTIPLY) {
        this.eat(TokenType.MULTIPLY);
      } else if (token.type === TokenType.DIVIDE) {
        this.eat(TokenType.DIVIDE);
      }

      node = {
        type: ASTNodeType.BINARY_OP,
        left: node,
        operator: token.value as string,
        right: this.factor(),
      };
    }

    return node;
  }

  private expr(): ASTNode {
    let node = this.term();

    while ([TokenType.PLUS, TokenType.MINUS].includes(this.currentToken.type)) {
      const token = this.currentToken;
      if (token.type === TokenType.PLUS) {
        this.eat(TokenType.PLUS);
      } else if (token.type === TokenType.MINUS) {
        this.eat(TokenType.MINUS);
      }

      node = {
        type: ASTNodeType.BINARY_OP,
        left: node,
        operator: token.value as string,
        right: this.term(),
      };
    }

    return node;
  }

  public parse(): ASTNode {
    const ast = this.expr();
    if (this.currentToken.type !== TokenType.EOF) {
      throw new Error(`Unexpected token ${this.currentToken.type} at position ${this.currentToken.position}`);
    }
    return ast;
  }
}