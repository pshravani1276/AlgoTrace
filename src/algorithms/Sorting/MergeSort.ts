export interface MergeNode {
  id: string;
  values: number[];
  level: number;
  visible?: boolean;
  left?: MergeNode;
  right?: MergeNode;
  state: "normal" | "active" | "completed";
}

export interface MergeSortVariables {
  left: number | string;
  mid: number | string;
  right: number | string;
  comparing: string;
  merging: string;
  sorted: string;
}

export interface MergeSortStep {
  step: number;
  line: number;
  array: number[];
  root: MergeNode;
  activeNode: string | null;
  variables: MergeSortVariables;
  explanation: string;
}

function createNode(
  id: string,
  values: number[],
  level: number
): MergeNode {
  return {
    id,
    values: [...values],
    level,
    state: "normal",
  };
}

function createTree(
  values: number[],
  id: string = "root",
  level: number = 0
): MergeNode {
  const node = createNode(id, values, level);

  if (values.length <= 1) {
    return node;
  }

  const mid = Math.floor(values.length / 2);

  node.left = createTree(
    values.slice(0, mid),
    `${id}-L`,
    level + 1
  );

  node.right = createTree(
    values.slice(mid),
    `${id}-R`,
    level + 1
  );

  return node;
}

function cloneNode(node: MergeNode): MergeNode {
  return {
    id: node.id,
    values: [...node.values],
    level: node.level,
    state: node.state,
    left: node.left
      ? cloneNode(node.left)
      : undefined,
    right: node.right
      ? cloneNode(node.right)
      : undefined,
  };
}

export function generateMergeSortSteps(
  input: number[]
): MergeSortStep[] {
  const steps: MergeSortStep[] = [];

  const array = [...input];
  const root = createTree(input);

  let stepCounter = 0;

  function addStep(
    line: number,
    activeNode: string | null,
    variables: MergeSortVariables,
    explanation: string
  ): void {
    steps.push({
      step: stepCounter,
      line,
      array: [...array],
      root: cloneNode(root),
      activeNode,
      variables,
      explanation,
    });

    stepCounter += 1;
  }

  addStep(
    1,
    "root",
    {
      left: 0,
      mid: "-",
      right: input.length - 1,
      comparing: "-",
      merging: "-",
      sorted: "-",
    },
    `Starting Merge Sort with [${input.join(", ")}].`
  );

  function mergeSort(
    left: number,
    right: number,
    node: MergeNode
  ): void {
    if (left >= right) {
      node.state = "completed";

      addStep(
        2,
        node.id,
        {
          left,
          mid: "-",
          right,
          comparing: "-",
          merging: "-",
          sorted: String(array[left]),
        },
        `The value ${array[left]} is a single element and is already sorted.`
      );

      return;
    }

    const mid = Math.floor((left + right) / 2);

    node.state = "active";

    addStep(
      3,
      node.id,
      {
        left,
        mid,
        right,
        comparing: "-",
        merging: "-",
        sorted: "-",
      },
      `Splitting the array from index ${left} to ${right} at middle index ${mid}.`
    );

    if (node.left) {
      mergeSort(left, mid, node.left);
    }

    if (node.right) {
      mergeSort(mid + 1, right, node.right);
    }

    merge(left, mid, right, node);
  }

  function merge(
    left: number,
    mid: number,
    right: number,
    node: MergeNode
  ): void {
    node.state = "active";

    const leftPart = array.slice(
      left,
      mid + 1
    );

    const rightPart = array.slice(
      mid + 1,
      right + 1
    );

    addStep(
      4,
      node.id,
      {
        left,
        mid,
        right,
        comparing: "-",
        merging: `${left}-${right}`,
        sorted: "-",
      },
      `Merging [${leftPart.join(", ")}] and [${rightPart.join(", ")}].`
    );

    let i = 0;
    let j = 0;
    let k = left;

    while (
      i < leftPart.length &&
      j < rightPart.length
    ) {
      addStep(
        5,
        node.id,
        {
          left,
          mid,
          right,
          comparing: `${leftPart[i]} vs ${rightPart[j]}`,
          merging: `${left}-${right}`,
          sorted: "-",
        },
        `Comparing ${leftPart[i]} and ${rightPart[j]}.`
      );

      if (leftPart[i] <= rightPart[j]) {
        array[k] = leftPart[i];
        i += 1;
      } else {
        array[k] = rightPart[j];
        j += 1;
      }

      addStep(
        6,
        node.id,
        {
          left,
          mid,
          right,
          comparing: "-",
          merging: `${left}-${right}`,
          sorted: String(array[k]),
        },
        `Placed ${array[k]} at position ${k}.`
      );

      k += 1;
    }

    while (i < leftPart.length) {
      array[k] = leftPart[i];

      addStep(
        6,
        node.id,
        {
          left,
          mid,
          right,
          comparing: "-",
          merging: `${left}-${right}`,
          sorted: String(array[k]),
        },
        `Copied remaining value ${array[k]} from the left half.`
      );

      i += 1;
      k += 1;
    }

    while (j < rightPart.length) {
      array[k] = rightPart[j];

      addStep(
        6,
        node.id,
        {
          left,
          mid,
          right,
          comparing: "-",
          merging: `${left}-${right}`,
          sorted: String(array[k]),
        },
        `Copied remaining value ${array[k]} from the right half.`
      );

      j += 1;
      k += 1;
    }

    node.values = array.slice(
      left,
      right + 1
    );

    node.state = "completed";

    addStep(
      7,
      node.id,
      {
        left,
        mid,
        right,
        comparing: "-",
        merging: "-",
        sorted: node.values.join(", "),
      },
      `Merge completed. [${node.values.join(", ")}] is sorted.`
    );
  }

  mergeSort(
    0,
    array.length - 1,
    root
  );

  root.state = "completed";

  addStep(
    8,
    "root",
    {
      left: 0,
      mid: "-",
      right: array.length - 1,
      comparing: "-",
      merging: "-",
      sorted: array.join(", "),
    },
    `Merge Sort completed. Final sorted array: [${array.join(", ")}].`
  );

  return steps;
}