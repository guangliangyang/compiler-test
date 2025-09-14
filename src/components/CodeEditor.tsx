interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <div className="p-4 h-full">
      <textarea
        className="w-full h-full border rounded-md p-2 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="输入数学表达式，例如: 5 + 3 * 2"
      />
    </div>
  );
}