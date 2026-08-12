export interface SelectionSortStep {
  step: number;
  line: number;
  array: number[];
  i: number;
  j: number;
  minIndex: number;
  comparing: number[];
  swapping: number[];
  sorted: number[];
  explanation: string;
}

export function generateSelectionSortSteps(
  input: number[]
): SelectionSortStep[] {
  const array = [...input];
  const steps: SelectionSortStep[] = [];
  const sorted: number[] = [];

  let stepNumber = 0;

  const addStep = (
    line: number,
    i: number,
    j: number,
    minIndex: number,
    comparing: number[],
    swapping: number[],
    explanation: string
  ): void => {
    steps.push({
      step: stepNumber,
      line,
      array: [...array],
      i,
      j,
      minIndex,
      comparing: [...comparing],
      swapping: [...swapping],
      sorted: [...sorted],
      explanation,
    });

    stepNumber++;
  };

  const n = array.length;

  // Empty array protection
  if (n === 0) {
    addStep(
      1,
      0,
      0,
      0,
      [],
      [],
      "Selection Sort received an empty array."
    );

    return steps;
  }

  // Initial state
  addStep(
    1,
    0,
    0,
    0,
    [],
    [],
    "Selection Sort starts by searching for the smallest element."
  );

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    // Start new selection pass
    addStep(
      2,
      i,
      i,
      minIndex,
      [i],
      [],
      `Start position i = ${i}. Assume ${array[i]} is the minimum.`
    );

    for (let j = i + 1; j < n; j++) {
      // Compare current element with minimum
      addStep(
        4,
        i,
        j,
        minIndex,
        [j, minIndex],
        [],
        `Compare ${array[j]} with the current minimum ${array[minIndex]}.`
      );

      if (array[j] < array[minIndex]) {
        minIndex = j;

        // New minimum found
        addStep(
          6,
          i,
          j,
          minIndex,
          [j],
          [],
          `${array[j]} is smaller, so it becomes the new minimum.`
        );
      }
    }

    // Swap minimum into position
    if (minIndex !== i) {
      addStep(
        8,
        i,
        minIndex,
        minIndex,
        [i, minIndex],
        [i, minIndex],
        `Swap ${array[i]} with the minimum value ${array[minIndex]}.`
      );

      const temp = array[i];
      array[i] = array[minIndex];
      array[minIndex] = temp;

      addStep(
        9,
        i,
        minIndex,
        i,
        [],
        [i, minIndex],
        `The minimum value is now placed at index ${i}.`
      );
    } else {
      addStep(
        9,
        i,
        i,
        i,
        [],
        [],
        `${array[i]} is already in the correct position.`
      );
    }

    // Mark position as sorted
    sorted.push(i);

    addStep(
      10,
      i,
      i,
      i,
      [],
      [],
      `Position ${i} is sorted.`
    );
  }

  // Last element is automatically sorted
  sorted.push(n - 1);

  addStep(
    11,
    n - 1,
    n - 1,
    n - 1,
    [],
    [],
    "Selection Sort completed successfully!"
  );

  return steps;
}