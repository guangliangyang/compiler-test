interface BytecodeDisplayProps {
  bytecode: string[];
}

export function BytecodeDisplay({ bytecode }: BytecodeDisplayProps) {
  return (
    <div className="p-4 h-full">
      <div className="text-gray-500 text-sm">
        {bytecode.length > 0 ? (
          <div className="space-y-1">
            {bytecode.map((instruction, index) => (
              <div key={index} className="font-mono text-xs">
                <span className="text-gray-400 mr-2">{index.toString().padStart(3, '0')}:</span>
                {instruction}
              </div>
            ))}
          </div>
        ) : (
          '等待代码生成器实现...'
        )}
      </div>
    </div>
  );
}