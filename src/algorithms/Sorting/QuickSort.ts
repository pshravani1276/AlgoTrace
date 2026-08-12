export interface QuickSortStep {
  step: number;
  line: number;
  array: number[];

  low: number;
  high: number;

  pivotIndex: number | null;
  pivotValue: number | null;

  comparing: number[];
  swapping: number[];
  sorted: number[];

  explanation: string;
}

const createStep = (
  step: number,
  line: number,
  array: number[],
  low: number,
  high: number,
  pivotIndex: number | null,
  pivotValue: number | null,
  comparing: number[],
  swapping: number[],
  sorted: number[],
  explanation: string
): QuickSortStep => {
  return {
    step,
    line,
    array: [...array],
    low,
    high,
    pivotIndex,
    pivotValue,
    comparing: [...comparing],
    swapping: [...swapping],
    sorted: [...sorted],
    explanation,
  };
};

export function generateQuickSortSteps(
  input: number[]
): QuickSortStep[] {
  const array = [...input];

  const steps: QuickSortStep[] = [];

  let stepNumber = 0;

  const sorted = new Set<number>();

  const addStep = (
    line: number,
    low: number,
    high: number,
    pivotIndex: number | null,
    pivotValue: number | null,
    comparing: number[] = [],
    swapping: number[] = [],
    explanation: string
  ) => {
    steps.push(
      createStep(
        stepNumber++,
        line,
        array,
        low,
        high,
        pivotIndex,
        pivotValue,
        comparing,
        swapping,
        Array.from(sorted),
        explanation
      )
    );
  };

  const quickSort = (low: number, high: number): void => {
    /*
     * Base case
     */
    if (low > high) {
      return;
    }

    /*
     * Single element is already sorted
     */
    if (low === high) {
      sorted.add(low);

      addStep(
        2,
        low,
        high,
        low,
        array[low],
        [],
        [],
        `The element ${array[low]} is alone in this partition, so it is already sorted.`
      );

      return;
    }

    /*
     * Choose last element as pivot
     */
    const pivotIndex = high;
    const pivotValue = array[pivotIndex];

    addStep(
      4,
      low,
      high,
      pivotIndex,
      pivotValue,
      [pivotIndex],
      [],
      `Choose ${pivotValue} as the pivot for the current partition.`
    );

    /*
     * Partition
     */
    let i = low - 1;

    for (let j = low; j < high; j++) {
      addStep(
        6,
        low,
        high,
        pivotIndex,
        pivotValue,
        [j, pivotIndex],
        [],
        `Compare ${array[j]} with the pivot ${pivotValue}.`
      );

      if (array[j] <= pivotValue) {
        i++;

        /*
         * Swap only when necessary
         */
        if (i !== j) {
          const firstValue = array[i];
          const secondValue = array[j];

          addStep(
            8,
            low,
            high,
            pivotIndex,
            pivotValue,
            [i, j],
            [i, j],
            `${array[j]} is smaller than or equal to the pivot, so swap ${firstValue} and ${secondValue}.`
          );

          [array[i], array[j]] = [array[j], array[i]];

          addStep(
            8,
            low,
            high,
            pivotIndex,
            pivotValue,
            [],
            [],
            `The values have been swapped. Continue scanning the partition.`
          );
        } else {
          addStep(
            8,
            low,
            high,
            pivotIndex,
            pivotValue,
            [i],
            [],
            `${array[i]} is already in the correct partition position.`
          );
        }
      } else {
        addStep(
          6,
          low,
          high,
          pivotIndex,
          pivotValue,
          [j, pivotIndex],
          [],
          `${array[j]} is greater than the pivot, so it remains on the right side.`
        );
      }
    }

    /*
     * Put pivot into its final position
     */
    const pivotFinalIndex = i + 1;

    if (pivotFinalIndex !== high) {
      addStep(
        8,
        low,
        high,
        high,
        pivotValue,
        [pivotFinalIndex, high],
        [pivotFinalIndex, high],
        `Place the pivot ${pivotValue} into its final sorted position.`
      );

      [array[pivotFinalIndex], array[high]] = [
        array[high],
        array[pivotFinalIndex],
      ];

      addStep(
        8,
        low,
        high,
        pivotFinalIndex,
        array[pivotFinalIndex],
        [],
        [],
        `Pivot ${array[pivotFinalIndex]} is now in its final position.`
      );
    } else {
      addStep(
        8,
        low,
        high,
        pivotFinalIndex,
        pivotValue,
        [pivotFinalIndex],
        [],
        `The pivot ${pivotValue} is already in its correct position.`
      );
    }

    sorted.add(pivotFinalIndex);

    addStep(
      10,
      low,
      high,
      pivotFinalIndex,
      array[pivotFinalIndex],
      [],
      [],
      `The pivot ${array[pivotFinalIndex]} is fixed. Now recursively sort the left and right partitions.`
    );

    /*
     * Left partition
     */
    if (low < pivotFinalIndex - 1) {
      addStep(
        11,
        low,
        pivotFinalIndex - 1,
        null,
        null,
        [],
        [],
        `Move to the left partition from index ${low} to ${pivotFinalIndex - 1}.`
      );

      quickSort(low, pivotFinalIndex - 1);
    }

    /*
     * Right partition
     */
    if (pivotFinalIndex + 1 < high) {
      addStep(
        12,
        pivotFinalIndex + 1,
        high,
        null,
        null,
        [],
        [],
        `Move to the right partition from index ${pivotFinalIndex + 1} to ${high}.`
      );

      quickSort(pivotFinalIndex + 1, high);
    } else if (pivotFinalIndex + 1 === high) {
      quickSort(pivotFinalIndex + 1, high);
    }
  };

  /*
   * Initial state
   */
  addStep(
    1,
    0,
    Math.max(input.length - 1, 0),
    null,
    null,
    [],
    [],
    "Quick Sort starts by selecting a pivot and partitioning the array around it."
  );

  /*
   * Empty array
   */
  if (array.length === 0) {
    return steps;
  }

  /*
   * Start Quick Sort
   */
  quickSort(0, array.length - 1);

  /*
   * Make sure every index is finally marked sorted
   */
  for (let index = 0; index < array.length; index++) {
    sorted.add(index);
  }

  /*
   * Final completed state
   */
  steps.push(
    createStep(
      stepNumber++,
      13,
      array,
      0,
      Math.max(array.length - 1, 0),
      null,
      null,
      [],
      [],
      Array.from(sorted),
      "Quick Sort is complete. Every element is now in its final sorted position."
    )
  );

  return steps;
}