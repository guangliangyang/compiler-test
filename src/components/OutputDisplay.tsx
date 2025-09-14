interface OutputDisplayProps {
  result: number | null;
  error?: string;
}

export function OutputDisplay({ result, error }: OutputDisplayProps) {
  return (
    <div className="p-4 h-full">
      {error ? (
        <div className="text-red-600 text-sm">
          <strong>Error:</strong> {error}
        </div>
      ) : result !== null ? (
        <div className="text-green-600 text-lg font-mono">
          <strong>Result:</strong> {result}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">
          Waiting for execution result...
        </div>
      )}
    </div>
  );
}