import { useState } from "react"

import Header from "./components/Header"
import CodePanel from "./components/CodePanel"
import ArrayVisualizer from "./components/ArrayVisualizer"
import VariablePanel from "./components/VariablePanel"
import ExplanationPanel from "./components/ExplanationPanel"
import DebuggerControls from "./components/DebuggerControls"

import { generateBubbleSortSteps } from "./algorithms/bubbleSort"

function App() {
  const steps = generateBubbleSortSteps([5, 3, 8, 2, 1])

  const [currentStep, setCurrentStep] = useState(0)

  const step = steps[currentStep]

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Header />

      <main className="p-4 lg:p-6">

        <div className="grid min-h-[520px] grid-cols-1 gap-4 lg:grid-cols-12">

          <div className="lg:col-span-4">
            <CodePanel currentLine={step.line} />
          </div>

          <div className="lg:col-span-5">
            <ArrayVisualizer
              array={step.array}
              comparing={step.comparing}
              swapping={step.swapping}
              sorted={step.sorted}
            />
          </div>

          <div className="lg:col-span-3">
            <VariablePanel variables={step.variables} />
          </div>

        </div>

        <div className="mt-4">
          <ExplanationPanel
            explanation={step.explanation}
          />
        </div>

        <div className="mt-4">
          <DebuggerControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onNext={() => {
              setCurrentStep((prev) =>
                Math.min(prev + 1, steps.length - 1)
              )
            }}
            onPrevious={() => {
              setCurrentStep((prev) =>
                Math.max(prev - 1, 0)
              )
            }}
            onReset={() => {
              setCurrentStep(0)
            }}
          />
        </div>

      </main>

    </div>
  )
}

export default App