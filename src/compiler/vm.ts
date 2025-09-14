export class VirtualMachine {
  private stack: number[] = [];
  private variables: Map<string, number> = new Map();

  public execute(instructions: string[]): number {
    this.stack = [];

    for (const instruction of instructions) {
      this.executeInstruction(instruction);
    }

    if (this.stack.length !== 1) {
      throw new Error('Invalid stack state after execution');
    }

    return this.stack[0];
  }

  private executeInstruction(instruction: string): void {
    const parts = instruction.split(' ');
    const opcode = parts[0];

    switch (opcode) {
      case 'PUSH':
        const value = parseFloat(parts[1]);
        this.stack.push(value);
        break;

      case 'LOAD':
        const varName = parts[1];
        const varValue = this.variables.get(varName);
        if (varValue === undefined) {
          throw new Error(`Undefined variable: ${varName}`);
        }
        this.stack.push(varValue);
        break;

      case 'ADD':
        this.binaryOperation((a, b) => a + b);
        break;

      case 'SUB':
        this.binaryOperation((a, b) => a - b);
        break;

      case 'MUL':
        this.binaryOperation((a, b) => a * b);
        break;

      case 'DIV':
        this.binaryOperation((a, b) => {
          if (b === 0) throw new Error('Division by zero');
          return a / b;
        });
        break;

      case 'POW':
        this.binaryOperation((a, b) => Math.pow(a, b));
        break;

      case 'NEG':
        if (this.stack.length < 1) {
          throw new Error('Stack underflow');
        }
        const operand = this.stack.pop()!;
        this.stack.push(-operand);
        break;

      default:
        throw new Error(`Unknown instruction: ${instruction}`);
    }
  }

  private binaryOperation(op: (a: number, b: number) => number): void {
    if (this.stack.length < 2) {
      throw new Error('Stack underflow');
    }

    const b = this.stack.pop()!;
    const a = this.stack.pop()!;
    const result = op(a, b);
    this.stack.push(result);
  }

  public getStack(): number[] {
    return [...this.stack];
  }

  public setVariable(name: string, value: number): void {
    this.variables.set(name, value);
  }
}