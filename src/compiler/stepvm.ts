import { ExecutionStep, ExecutionState } from '../types';

export class SteppingVirtualMachine {
  private stack: number[] = [];
  private variables: Map<string, number> = new Map();
  private steps: ExecutionStep[] = [];

  public executeWithSteps(instructions: string[]): ExecutionState {
    this.stack = [];
    this.steps = [];

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      const stackBefore = [...this.stack];

      try {
        this.executeInstruction(instruction);
        const stackAfter = [...this.stack];
        const description = this.getInstructionDescription(instruction, stackBefore, stackAfter);

        this.steps.push({
          instruction,
          instructionIndex: i,
          stackBefore,
          stackAfter,
          description,
        });
      } catch (error) {
        const stackAfter = [...this.stack];
        this.steps.push({
          instruction,
          instructionIndex: i,
          stackBefore,
          stackAfter,
          description: `错误: ${error instanceof Error ? error.message : '未知错误'}`,
        });
        break;
      }
    }

    return {
      steps: this.steps,
      currentStep: 0,
      isRunning: false,
      isComplete: true,
    };
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
          throw new Error(`未定义的变量: ${varName}`);
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
          if (b === 0) throw new Error('除零错误');
          return a / b;
        });
        break;

      case 'POW':
        this.binaryOperation((a, b) => Math.pow(a, b));
        break;

      case 'NEG':
        if (this.stack.length < 1) {
          throw new Error('栈下溢');
        }
        const operand = this.stack.pop()!;
        this.stack.push(-operand);
        break;

      default:
        throw new Error(`未知指令: ${instruction}`);
    }
  }

  private binaryOperation(op: (a: number, b: number) => number): void {
    if (this.stack.length < 2) {
      throw new Error('栈下溢');
    }

    const b = this.stack.pop()!;
    const a = this.stack.pop()!;
    const result = op(a, b);
    this.stack.push(result);
  }

  private getInstructionDescription(
    instruction: string,
    stackBefore: number[],
    stackAfter: number[]
  ): string {
    const parts = instruction.split(' ');
    const opcode = parts[0];

    switch (opcode) {
      case 'PUSH':
        return `将数值 ${parts[1]} 压入栈`;
      case 'LOAD':
        return `加载变量 ${parts[1]} 的值`;
      case 'ADD':
        const [addA, addB] = stackBefore.slice(-2);
        return `计算 ${addA} + ${addB} = ${stackAfter[stackAfter.length - 1]}`;
      case 'SUB':
        const [subA, subB] = stackBefore.slice(-2);
        return `计算 ${subA} - ${subB} = ${stackAfter[stackAfter.length - 1]}`;
      case 'MUL':
        const [mulA, mulB] = stackBefore.slice(-2);
        return `计算 ${mulA} * ${mulB} = ${stackAfter[stackAfter.length - 1]}`;
      case 'DIV':
        const [divA, divB] = stackBefore.slice(-2);
        return `计算 ${divA} / ${divB} = ${stackAfter[stackAfter.length - 1]}`;
      case 'POW':
        const [powA, powB] = stackBefore.slice(-2);
        return `计算 ${powA} ^ ${powB} = ${stackAfter[stackAfter.length - 1]}`;
      case 'NEG':
        const negOperand = stackBefore[stackBefore.length - 1];
        return `计算 -${negOperand} = ${stackAfter[stackAfter.length - 1]}`;
      default:
        return `执行指令: ${instruction}`;
    }
  }

  public getFinalResult(): number | null {
    if (this.stack.length === 1) {
      return this.stack[0];
    }
    return null;
  }
}