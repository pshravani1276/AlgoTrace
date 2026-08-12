export interface HeapSortStep {
  step: number;
  line: number;
  array: number[];

  i: number;
  j: number;

  heapSize: number;
  parent: number;
  leftChild: number;
  rightChild: number;
  largest: number;

  comparing: number[];
  swapping: number[];
  sorted: number[];

  phase: "building" | "heapifying" | "extracting" | "completed";

  explanation: string;
}

export function generateHeapSortSteps(
  input: number[]
): HeapSortStep[] {
  const array = [...input];
  const steps: HeapSortStep[] = [];

  const sorted: number[] = [];

  let stepNumber = 0;

  const addStep = (
    line: number,
    i: number,
    j: number,
    heapSize: number,
    parent: number,
    leftChild: number,
    rightChild: number,
    largest: number,
    comparing: number[],
    swapping: number[],
    phase: HeapSortStep["phase"],
    explanation: string
  ) => {
    steps.push({
      step: stepNumber,
      line,
      array: [...array],

      i,
      j,

      heapSize,
      parent,
      leftChild,
      rightChild,
      largest,

      comparing: [...comparing],
      swapping: [...swapping],
      sorted: [...sorted],

      phase,
      explanation,
    });

    stepNumber++;
  };

  const n = array.length;

  if (n === 0) {
    addStep(
      1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      [],
      [],
      "completed",
      "Heap Sort has no elements to process."
    );

    return steps;
  }

  /*
   * ---------------------------------------------------------
   * START
   * ---------------------------------------------------------
   */

  addStep(
    1,
    0,
    -1,
    n,
    -1,
    -1,
    -1,
    -1,
    [],
    [],
    "building",
    "Heap Sort starts by building a Max Heap from the array."
  );

  /*
   * ---------------------------------------------------------
   * HEAPIFY FUNCTION
   * ---------------------------------------------------------
   */

  const heapify = (
    heapSize: number,
    root: number
  ): void => {
    let current = root;

    while (true) {
      const left = 2 * current + 1;
      const right = 2 * current + 2;

      let largest = current;

      /*
       * Show current parent and children.
       */

      addStep(
        3,
        current,
        -1,
        heapSize,
        current,
        left < heapSize ? left : -1,
        right < heapSize ? right : -1,
        largest,
        [
          current,
          ...(left < heapSize ? [left] : []),
          ...(right < heapSize ? [right] : []),
        ],
        [],
        "heapifying",
        `Heapify checks the node at index ${current} and compares it with its children.`
      );

      /*
       * Compare left child.
       */

      if (
        left < heapSize &&
        array[left] > array[largest]
      ) {
        addStep(
          4,
          current,
          left,
          heapSize,
          current,
          left,
          right < heapSize ? right : -1,
          left,
          [current, left],
          [],
          "heapifying",
          `${array[left]} is greater than ${array[current]}, so the left child becomes the largest.`
        );

        largest = left;
      }

      /*
       * Compare right child.
       */

      if (
        right < heapSize &&
        array[right] > array[largest]
      ) {
        addStep(
          5,
          current,
          right,
          heapSize,
          current,
          left < heapSize ? left : -1,
          right,
          right,
          [current, right],
          [],
          "heapifying",
          `${array[right]} is greater than the current largest value, so the right child becomes the largest.`
        );

        largest = right;
      }

      /*
       * No change required.
       */

      if (largest === current) {
        addStep(
          6,
          current,
          -1,
          heapSize,
          current,
          left < heapSize ? left : -1,
          right < heapSize ? right : -1,
          current,
          [current],
          [],
          "heapifying",
          `${array[current]} is already the largest value in this subtree.`
        );

        break;
      }

      /*
       * Swap parent with largest child.
       */

      addStep(
        7,
        current,
        largest,
        heapSize,
        current,
        left < heapSize ? left : -1,
        right < heapSize ? right : -1,
        largest,
        [current, largest],
        [current, largest],
        "heapifying",
        `Swap ${array[current]} with ${array[largest]} to restore the Max Heap property.`
      );

      const temp = array[current];

      array[current] = array[largest];
      array[largest] = temp;

      addStep(
        8,
        current,
        largest,
        heapSize,
        largest,
        left < heapSize ? left : -1,
        right < heapSize ? right : -1,
        largest,
        [],
        [current, largest],
        "heapifying",
        `The subtree has been rearranged. Continue heapifying from index ${largest}.`
      );

      current = largest;
    }
  };

  /*
   * ---------------------------------------------------------
   * BUILD MAX HEAP
   * ---------------------------------------------------------
   */

  addStep(
    2,
    Math.floor(n / 2) - 1,
    -1,
    n,
    Math.floor(n / 2) - 1,
    -1,
    -1,
    -1,
    [],
    [],
    "building",
    "Starting from the last non-leaf node, build the Max Heap."
  );

  for (
    let i = Math.floor(n / 2) - 1;
    i >= 0;
    i--
  ) {
    addStep(
      2,
      i,
      -1,
      n,
      i,
      2 * i + 1 < n ? 2 * i + 1 : -1,
      2 * i + 2 < n ? 2 * i + 2 : -1,
      i,
      [
        i,
        ...(2 * i + 1 < n ? [2 * i + 1] : []),
        ...(2 * i + 2 < n ? [2 * i + 2] : []),
      ],
      [],
      "building",
      `Build the heap by heapifying the subtree rooted at index ${i}.`
    );

    heapify(n, i);
  }

  addStep(
    9,
    0,
    -1,
    n,
    0,
    1 < n ? 1 : -1,
    2 < n ? 2 : -1,
    0,
    [0],
    [],
    "building",
    "Max Heap is ready. The largest element is now at the root."
  );

  /*
   * ---------------------------------------------------------
   * EXTRACT MAX ELEMENTS
   * ---------------------------------------------------------
   */

  for (
    let end = n - 1;
    end > 0;
    end--
  ) {
    /*
     * Highlight root and last heap element.
     */

    addStep(
      10,
      10,
      end,
      end + 1,
      0,
      1 < end + 1 ? 1 : -1,
      2 < end + 1 ? 2 : -1,
      0,
      [0, end],
      [0, end],
      "extracting",
      `Move the largest value ${array[0]} from the heap to position ${end}.`
    );

    /*
     * Swap root with last element.
     */

    const temp = array[0];

    array[0] = array[end];
    array[end] = temp;

    /*
     * Mark extracted element as sorted.
     */

    sorted.unshift(end);

    addStep(
      11,
      11,
      end,
      end,
      0,
      1 < end ? 1 : -1,
      2 < end ? 2 : -1,
      0,
      [],
      [0, end],
      "extracting",
      `${array[end]} is now in its final sorted position at index ${end}.`
    );

    /*
     * Rebuild heap.
     */

    if (end > 1) {
      addStep(
        12,
        0,
        -1,
        end,
        0,
        1 < end ? 1 : -1,
        2 < end ? 2 : -1,
        0,
        [0],
        [],
        "heapifying",
        "The heap size decreases by one. Restore the Max Heap property."
      );

      heapify(end, 0);
    }
  }

  /*
   * ---------------------------------------------------------
   * FINAL ELEMENT
   * ---------------------------------------------------------
   */

  if (n > 0 && !sorted.includes(0)) {
    sorted.unshift(0);
  }

  addStep(
    13,
    0,
    -1,
    0,
    -1,
    -1,
    -1,
    -1,
    [],
    [],
    "completed",
    "Heap Sort completed successfully. The array is completely sorted."
  );

  return steps;
}