import type { ExecutionState } from '../types';

interface ExecutionDisplayProps {
  execution?: ExecutionState;
  currentStep?: number;
  onStepChange?: (step: number) => void;
}

export function ExecutionDisplay({ execution, currentStep = 0, onStepChange }: ExecutionDisplayProps) {

  if (!execution || execution.steps.length === 0) {
    return (
      <div className="p-4 h-full">
        <div className="text-gray-500 text-sm">
          等待执行过程...
        </div>
      </div>
    );
  }

  const step = execution.steps[currentStep];
  const maxStep = execution.steps.length - 1;

  return (
    <div className="p-4 h-full flex flex-col">
      {/* 控制按钮 */}
      <div className="flex items-center space-x-2 mb-4 pb-2 border-b">
        <button
          onClick={() => onStepChange?.(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 text-xs"
        >
          上一步
        </button>
        <button
          onClick={() => onStepChange?.(Math.min(maxStep, currentStep + 1))}
          disabled={currentStep === maxStep}
          className="px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 text-xs"
        >
          下一步
        </button>
        <span className="text-xs text-gray-600">
          {currentStep + 1} / {execution.steps.length}
        </span>
      </div>

      {/* 当前指令 */}
      <div className="mb-3">
        <div className="text-xs text-gray-600 mb-1">当前指令:</div>
        <div className="bg-blue-50 p-2 rounded text-sm font-mono">
          {step.instruction}
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {step.description}
        </div>
      </div>

      {/* 栈状态 */}
      <div className="flex-1">
        <div className="text-xs text-gray-600 mb-2">栈状态变化:</div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* 执行前栈状态 */}
          <div>
            <div className="text-gray-500 mb-1">执行前:</div>
            <div className="bg-gray-50 p-2 rounded min-h-16">
              {step.stackBefore.length === 0 ? (
                <div className="text-gray-400">空栈</div>
              ) : (
                <div className="space-y-1">
                  {step.stackBefore.slice().reverse().map((value, index) => (
                    <div key={index} className="bg-white p-1 rounded text-center font-mono">
                      {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 执行后栈状态 */}
          <div>
            <div className="text-gray-500 mb-1">执行后:</div>
            <div className="bg-green-50 p-2 rounded min-h-16">
              {step.stackAfter.length === 0 ? (
                <div className="text-gray-400">空栈</div>
              ) : (
                <div className="space-y-1">
                  {step.stackAfter.slice().reverse().map((value, index) => (
                    <div key={index} className="bg-green-100 p-1 rounded text-center font-mono">
                      {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}