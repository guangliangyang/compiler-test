import { useState } from 'react'
import { CodeEditor } from './components/CodeEditor'
import { TokenDisplay } from './components/TokenDisplay'
import { ASTDisplay } from './components/ASTDisplay'
import { BytecodeDisplay } from './components/BytecodeDisplay'
import { ExecutionDisplay } from './components/ExecutionDisplay'
import { OutputDisplay } from './components/OutputDisplay'
import { Lexer } from './compiler/lexer'
import { Parser } from './compiler/parser'
import { CodeGenerator } from './compiler/codegen'
import { VirtualMachine } from './compiler/vm'
import { SteppingVirtualMachine } from './compiler/stepvm'
import type { CompilationResult } from './types'

function App() {
  const [code, setCode] = useState('5 + 3 * 2')
  const [result, setResult] = useState<CompilationResult>({
    tokens: [],
    ast: null,
    bytecode: [],
    result: null,
  })
  const [currentExecutionStep, setCurrentExecutionStep] = useState(0)

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    setCurrentExecutionStep(0) // 重置执行步骤
    try {
      const lexer = new Lexer(newCode)
      const tokens = lexer.tokenize()

      let ast = null;
      let bytecode: string[] = [];
      let result = null;
      let executionState = undefined;

      try {
        const parser = new Parser(tokens)
        ast = parser.parse()

        // 生成字节码
        const codegen = new CodeGenerator()
        bytecode = codegen.generate(ast)

        // 执行字节码
        const vm = new VirtualMachine()
        result = vm.execute(bytecode)

        // 生成步进执行状态
        const stepVm = new SteppingVirtualMachine()
        executionState = stepVm.executeWithSteps(bytecode)
      } catch (parseError) {
        // If parsing fails, still show tokens
      }

      setResult({
        tokens,
        ast,
        bytecode,
        result,
        execution: executionState,
      })
    } catch (error) {
      setResult({
        tokens: [],
        ast: null,
        bytecode: [],
        result: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Compiler Demo - Interactive Visualization</h1>
        <p className="text-blue-100">Learn compiler principles and working process through interactive visualization</p>
      </header>

      <main className="flex-1 grid grid-cols-3 grid-rows-3 gap-4 p-4 overflow-hidden">
        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h2 className="font-semibold text-gray-700">Source Code Input</h2>
          </div>
          <CodeEditor value={code} onChange={handleCodeChange} />
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h2 className="font-semibold text-gray-700">Lexical Analysis</h2>
          </div>
          <TokenDisplay tokens={result.tokens} error={result.error} />
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h2 className="font-semibold text-gray-700">Syntax Analysis Tree</h2>
          </div>
          <ASTDisplay ast={result.ast} />
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h2 className="font-semibold text-gray-700">Bytecode Generation</h2>
          </div>
          <BytecodeDisplay
            bytecode={result.bytecode}
            execution={result.execution}
            currentStep={currentExecutionStep}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h2 className="font-semibold text-gray-700">Execution Process</h2>
          </div>
          <ExecutionDisplay
            execution={result.execution}
            currentStep={currentExecutionStep}
            onStepChange={setCurrentExecutionStep}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h2 className="font-semibold text-gray-700">Output Results</h2>
          </div>
          <OutputDisplay result={result.result} error={result.error} />
        </div>
      </main>
    </div>
  )
}

export default App
