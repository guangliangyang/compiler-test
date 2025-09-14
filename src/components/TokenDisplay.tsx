import type { Token } from '../types';

interface TokenDisplayProps {
  tokens: Token[];
  error?: string;
}

export function TokenDisplay({ tokens, error }: TokenDisplayProps) {
  if (error) {
    return (
      <div className="p-4 h-full">
        <div className="text-red-600 text-sm">
          <strong>错误:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-auto">
      <div className="space-y-2">
        {tokens.map((token, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded border"
          >
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
              {token.type}
            </span>
            <span className="font-mono">
              {typeof token.value === 'string' ? `"${token.value}"` : token.value}
            </span>
            <span className="text-gray-500 text-xs">
              @{token.position}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}