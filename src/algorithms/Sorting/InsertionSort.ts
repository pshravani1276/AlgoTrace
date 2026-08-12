export type InsertionSortStep = {
  step: number;
  line: number;
  array: number[];
  i: number;
  j: number;
  key: number;
  comparing: number[];
  shifting: number[];
  inserted: number[];
  sorted: number[];
  explanation: string;
};

export function generateInsertionSortSteps(
  input: number[]
): InsertionSortStep[] {
  const array = [...input];
  const steps: InsertionSortStep[] = [];

  let stepNumber = 0;

  const addStep = (
    line: number,
    i: number,
    j: number,
    key: number,
    comparing: number[],
    shifting: number[],
    inserted: number[],
    sorted: number[],
    explanation: string
  ) => {
    steps.push({
      step: stepNumber,
      line,
      array: [...array],
      i,
      j,
      key,
      comparing: [...comparing],
      shifting: [...shifting],
      inserted: [...inserted],
      sorted: [...sorted],
      explanation,
    });

    stepNumber++;
  };

  // Initial state
  addStep(
    1,
    -1,
    -1,
    -1,
    [],
    [],
    [],
    [0],
    "Insertion Sort starts. The first element is already considered sorted."
  );

  // Main insertion sort loop
  for (let i = 1; i < array.length; i++) {
    const key = array[i];

    addStep(
      4,
      i,
      i - 1,
      key,
      [i],
      [],
      [i],
      Array.from({ length: i }, (_, index) => index),
      `Select ${key} as the key element and prepare to insert it into the sorted portion.`
    );

    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      addStep(
        8,
        i,
        j,
        key,
        [j, j + 1],
        [],
        [i],
        Array.from({ length: i }, (_, index) => index),
        `Compare ${array[j]} with key ${key}. Since ${array[j]} is larger, it must be shifted right.`
      );

      // Shift larger element right
      array[j + 1] = array[j];

      addStep(
        9,
        i,
        j,
        key,
        [],
        [j, j + 1],
        [i],
        Array.from({ length: i }, (_, index) => index),
        `${array[j + 1]} has been shifted one position to the right.`
      );

      j--;

      addStep(
        10,
        i,
        j,
        key,
        [],
        [],
        [i],
        Array.from({ length: i }, (_, index) => index),
        "Move the pointer j to the left and continue searching for the correct position."
      );
    }

    // Insert key
    array[j + 1] = key;

    const sortedIndices = Array.from(
      { length: i + 1 },
      (_, index) => index
    );

    addStep(
      13,
      i,
      j,
      key,
      [],
      [],
      [j + 1],
      sortedIndices,
      `Insert key ${key} at position ${j + 1}. The sorted portion has now grown.`
    );
  }

  // Final state
  addStep(
    15,
    -1,
    -1,
    -1,
    [],
    [],
    [],
    Array.from(
      { length: array.length },
      (_, index) => index
    ),
    "Insertion Sort is complete. All elements are now sorted."
  );

  return steps;
}