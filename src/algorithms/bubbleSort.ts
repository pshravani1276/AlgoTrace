export type BubbleSortStep = {
  step: number
  line: number
  array: number[]
  variables: {
    i: number | null
    j: number | null
    comparisons: number
    swaps: number
  }
  comparing: number[]
  swapping: number[]
  sorted: number[]
  explanation: string
}

export function generateBubbleSortSteps(
  input: number[]
): BubbleSortStep[] {
  const arr = [...input]

  const steps: BubbleSortStep[] = []

  let comparisons = 0
  let swaps = 0
  let step = 0

  const sorted: number[] = []

  // Initial state
  steps.push({
    step: step++,
    line: 1,
    array: [...arr],
    variables: {
      i: null,
      j: null,
      comparisons,
      swaps,
    },
    comparing: [],
    swapping: [],
    sorted: [],
    explanation: "Bubble Sort is ready to begin.",
  })

  for (let i = 0; i < arr.length - 1; i++) {
    // Line 1
    steps.push({
      step: step++,
      line: 1,
      array: [...arr],
      variables: {
        i,
        j: null,
        comparisons,
        swaps,
      },
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      explanation: `Starting outer loop. i = ${i}.`,
    })

    for (let j = 0; j < arr.length - i - 1; j++) {
      // Line 2
      steps.push({
        step: step++,
        line: 2,
        array: [...arr],
        variables: {
          i,
          j,
          comparisons,
          swaps,
        },
        comparing: [],
        swapping: [],
        sorted: [...sorted],
        explanation: `Inner loop. j = ${j}.`,
      })

      // Line 3 - comparison
      comparisons++

      steps.push({
        step: step++,
        line: 3,
        array: [...arr],
        variables: {
          i,
          j,
          comparisons,
          swaps,
        },
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        explanation: `Comparing ${arr[j]} and ${arr[j + 1]}.`,
      })

      if (arr[j] > arr[j + 1]) {
        // Line 4 - swap
        steps.push({
          step: step++,
          line: 4,
          array: [...arr],
          variables: {
            i,
            j,
            comparisons,
            swaps,
          },
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          explanation: `${arr[j]} is greater than ${arr[j + 1]}. Swapping them.`,
        })

        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp

        swaps++

        // State after swap
        steps.push({
          step: step++,
          line: 4,
          array: [...arr],
          variables: {
            i,
            j,
            comparisons,
            swaps,
          },
          comparing: [],
          swapping: [],
          sorted: [...sorted],
          explanation: `Swap completed. Array is now [${arr.join(", ")}].`,
        })
      } else {
        steps.push({
          step: step++,
          line: 3,
          array: [...arr],
          variables: {
            i,
            j,
            comparisons,
            swaps,
          },
          comparing: [],
          swapping: [],
          sorted: [...sorted],
          explanation: `${arr[j]} is not greater than ${arr[j + 1]}. No swap needed.`,
        })
      }
    }

    // The largest remaining element is now at the end.
    sorted.unshift(arr.length - 1 - i)

    steps.push({
      step: step++,
      line: 1,
      array: [...arr],
      variables: {
        i,
        j: null,
        comparisons,
        swaps,
      },
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      explanation: `Pass ${i + 1} completed. The largest remaining element is in its correct position.`,
    })
  }

  // Final state
  const allSorted = Array.from(
    { length: arr.length },
    (_, index) => index
  )

  steps.push({
    step: step++,
    line: 1,
    array: [...arr],
    variables: {
      i: null,
      j: null,
      comparisons,
      swaps,
    },
    comparing: [],
    swapping: [],
    sorted: allSorted,
    explanation: "Bubble Sort completed successfully!",
  })

  return steps
}