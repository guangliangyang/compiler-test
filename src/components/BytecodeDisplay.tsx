import { ExecutionState } from '../types';

interface BytecodeDisplayProps {
  bytecode: string[];
  execution?: ExecutionState;
  currentStep?: number;
}

export function BytecodeDisplay({ bytecode, execution, currentStep = 0 }: BytecodeDisplayProps) {
  const getCurrentInstructionIndex = () => {
    if (execution && execution.steps.length > 0 && currentStep < execution.steps.length) {
      return execution.steps[currentStep].instructionIndex;
    }
    return -1;
  };

  const currentInstructionIndex = getCurrentInstructionIndex();

  return (
    <div className="p-4 h-full">
      <div className="text-sm">
        {bytecode.length > 0 ? (
          <div className="space-y-1">
            <div className="mb-2 text-gray-600 font-semibold">生成的字节码:</div>
            {bytecode.map((instruction, index) => (
              <div
                key={index}
                className={`font-mono text-xs p-1 rounded ${
                  index === currentInstructionIndex
                    ? 'bg-yellow-100 border border-yellow-300'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-gray-400 mr-2">{index.toString().padStart(3, '0')}:</span>
                <span className={index === currentInstructionIndex ? 'font-bold text-yellow-800' : ''}>
                  {instruction}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">
            等待代码生成...
          </div>
        )}
      </div>
    </div>
  );
}