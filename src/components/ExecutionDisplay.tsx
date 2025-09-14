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
          Waiting for execution process...
        </div>
      </div>
    );
  }

  const step = execution.steps[currentStep];
  const maxStep = execution.steps.length - 1;

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Control buttons */}
      <div className="flex items-center space-x-2 mb-4 pb-2 border-b">
        <button
          onClick={() => onStepChange?.(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 text-xs"
        >
          Previous
        </button>
        <button
          onClick={() => onStepChange?.(Math.min(maxStep, currentStep + 1))}
          disabled={currentStep === maxStep}
          className="px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 text-xs"
        >
          Next
        </button>
        <span className="text-xs text-gray-600">
          {currentStep + 1} / {execution.steps.length}
        </span>
      </div>

      {/* Current instruction */}
      <div className="mb-3">
        <div className="text-xs text-gray-600 mb-1">Current Instruction:</div>
        <div className="bg-blue-50 p-2 rounded text-sm font-mono">
          {step.instruction}
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {step.description}
        </div>
      </div>

      {/* Stack state */}
      <div className="flex-1">
        <div className="text-xs text-gray-600 mb-2">Stack State Changes:</div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Before execution stack state */}
          <div>
            <div className="text-gray-500 mb-1">Before:</div>
            <div className="bg-gray-50 p-2 rounded min-h-16">
              {step.stackBefore.length === 0 ? (
                <div className="text-gray-400">Empty Stack</div>
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

          {/* After execution stack state */}
          <div>
            <div className="text-gray-500 mb-1">After:</div>
            <div className="bg-green-50 p-2 rounded min-h-16">
              {step.stackAfter.length === 0 ? (
                <div className="text-gray-400">Empty Stack</div>
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