import type { Language } from "../components/LanguageSelector";

function pythonCondition(condition: string): string {
  return condition
    .replace(/([A-Za-z_$][\w$]*(?:\[[^\]]+\])?)\.length/g, "len($1)")
    .replace(/([A-Za-z_$][\w$]*)\.has\(([^)]+)\)/g, "$2 in $1")
    .replace(/!==/g, "!=")
    .replace(/===/g, "==")
    .replace(/&&/g, " and ")
    .replace(/\|\|/g, " or ")
    .replace(/!\s*(?!=)/g, "not ")
    .replace(/\bInfinity\b/g, 'float("inf")')
    .replace(/\bnull\b/g, "None");
}

function pythonLine(line: string): string {
  const leadingWhitespace = line.match(/^\s*/)?.[0] ?? "";
  const indent = " ".repeat(leadingWhitespace.length * 2);
  let code = line.trim();

  if (!code) return "";
  if (code === "}") return `${indent}# end block`;
  const blockIndent = indent.slice(0, Math.max(0, indent.length - 4));
  const ifElseMatch = code.match(/^} else if\s*\((.+)\)\s*\{$/);
  if (ifElseMatch) return `${blockIndent}elif ${pythonCondition(ifElseMatch[1])}:`;
  if (code.startsWith("} else")) return `${blockIndent}else:`;
  if (code.startsWith("} catch")) return `${blockIndent}except:`;

  const functionMatch = code.match(/^function\s+([\w$]+)\((.*)\)\s*\{$/);
  if (functionMatch) {
    const parameters = functionMatch[2]
      .replace(/:\s*(?:number|string|boolean|unknown|any)(?:\[\])?/g, "")
      .replace(/:\s*Record<[^>]+>/g, "");
    return `${indent}def ${functionMatch[1]}(${parameters}):`;
  }

  const forOfMatch = code.match(/^for\s*\((?:const|let|var)\s+(\w+)\s+of\s+(.+)\)\s*\{$/);
  if (forOfMatch) return `${indent}for ${forOfMatch[1]} in ${forOfMatch[2]}:`;

  const forMatch = code.match(/^for\s*\((?:const|let|var)\s+(\w+)\s*=\s*([^;]+);\s*\1\s*<\s*(.+?);\s*\1\+\+\)\s*\{$/);
  if (forMatch) {
    return `${indent}for ${forMatch[1]} in range(${forMatch[2]}, ${pythonCondition(forMatch[3])}):`;
  }
  const decrementLoop = code.match(/^for\s*\((?:const|let|var)\s+(\w+)\s*=\s*(.+?);\s*\1\s*>\s*0;\s*\1--\)\s*\{$/);
  if (decrementLoop) {
    return `${indent}for ${decrementLoop[1]} in range(${decrementLoop[2]}, 0, -1):`;
  }

  const whileMatch = code.match(/^while\s*\((.+)\)\s*\{$/);
  if (whileMatch) return `${indent}while ${pythonCondition(whileMatch[1])}:`;

  const ifMatch = code.match(/^if\s*\((.+)\)\s*\{$/);
  if (ifMatch) return `${indent}if ${pythonCondition(ifMatch[1])}:`;

  const inlineIfMatch = code.match(/^if\s*\((.+)\)\s+(.+)$/);
  if (inlineIfMatch) {
    const statement = pythonLine(inlineIfMatch[2]);
    return `${indent}if ${pythonCondition(inlineIfMatch[1])}: ${statement.trim()}`;
  }

  code = code
    .replace(/^(?:const|let|var)\s+/, "")
    .replace(/;\s*$/, "")
    .replace(/:\s*(?:number|string|boolean|unknown|any)(?:\[\])?/g, "")
    .replace(/:\s*Record<[^>]+>/g, "")
    .replace(/\bnew Set\(\[([^\]]*)\]\)/g, "{$1}")
    .replace(/\bnew Set\(\)/g, "set()")
    .replace(/([A-Za-z_$][\w$]*)\.push\(/g, "$1.append(")
    .replace(/([A-Za-z_$][\w$]*)\.shift\(\)/g, "$1.pop(0)")
    .replace(/([A-Za-z_$][\w$]*)\.length/g, "len($1)")
    .replace(/\b(\w+)\[(\d+)\.\.(\w+)\]/g, "$1[$2:$3]")
    .replace(/(\w+)\[(\d+)\]\s*\?\?\s*(\d+)/g, "$1[$2] if len($1) > $2 else $3")
    .replace(/([A-Za-z_$][\w$]*)\.has\(([^)]+)\)/g, "$2 in $1")
    .replace(/Math\.max/g, "max")
    .replace(/Math\.min/g, "min")
    .replace(/Infinity/g, 'float("inf")')
    .replace(/\bnull\b/g, "None")
    .replace(/!==/g, "!=")
    .replace(/===/g, "==")
    .replace(/&&/g, " and ")
    .replace(/\|\|/g, " or ")
    .replace(/!\s*(?!=)/g, "not ");

  code = code.replace(
    /^return \{\s*(\w+),\s*(\w+)\s*\}$/,
    'return {"$1": $1, "$2": $2}',
  );
  return `${indent}${code}`;
}

function addTypeAnnotations(line: string): string {
  const functionMatch = line.match(/^(\s*)function\s+([\w$]+)\(([^)]*)\)(.*)$/);
  if (!functionMatch) return line;

  const [, indent, name, parameters, ending] = functionMatch;
  const typedParameters = parameters
    .split(",")
    .map((parameter) => {
      const trimmed = parameter.trim();
      if (!trimmed || trimmed.includes(":")) return trimmed;
      const type = /^(?:values|array|prefix)$/.test(trimmed)
        ? "number[]"
        : /^matrix$/.test(trimmed)
          ? "number[][]"
          : /^(?:input)$/.test(trimmed)
            ? "string"
            : /^(?:index|value|target|k|windowSize|start|right|left|row|col|count|cursor|end|startIndex)$/.test(trimmed)
              ? "number"
              : "";
      return type ? `${trimmed}: ${type}` : trimmed;
    })
    .join(", ");
  return `${indent}function ${name}(${typedParameters})${ending}`;
}

function splitParameters(parameters: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;

  for (let index = 0; index < parameters.length; index += 1) {
    if (parameters[index] === "<") depth += 1;
    if (parameters[index] === ">") depth -= 1;
    if (parameters[index] === "," && depth === 0) {
      parts.push(parameters.slice(start, index));
      start = index + 1;
    }
  }

  parts.push(parameters.slice(start));
  return parts;
}

function convertCStyle(line: string, language: "Java" | "C" | "C++"): string {
  const code = line;
  const functionMatch = code.match(/^(\s*)function\s+([\w$]+)\((.*)\)\s*\{$/);
  if (functionMatch) {
    const [, indent, name, parameters] = functionMatch;
    const convertedParameters = splitParameters(parameters)
      .map((parameter) => {
        const value = parameter.trim()
          .replace(/:\s*Record<[^>]+>/, "")
          .replace(/:\s*(?:number|string|boolean|unknown|any)(?:\[\])?$/, "");
        if (!value) return "";
        const type = /^(?:values|array|prefix)$/.test(value)
          ? language === "Java" ? "int[]" : language === "C++" ? "vector<int>" : "int[]"
          : /^matrix$/.test(value)
            ? language === "Java" ? "int[][]" : language === "C++" ? "vector<vector<int>>" : "int[][]"
            : /^(?:graph)$/.test(value)
              ? language === "Java" ? "Graph" : language === "C++" ? "Graph&" : "Graph"
              : /^(?:index|value|target|k|windowSize|start|goal)$/.test(value)
                ? "int"
                : value === "heuristic"
                  ? "Heuristic"
                  : "auto";
        return `${type} ${value}`;
      })
      .join(", ");
    const matrixResult = /^(?:addMatrices|transpose|multiplyMatrices)$/.test(name);
    const arrayResult = /^(?:createArray|insert|removeAt|traverse|reverse|rotateRight|insertionSort|prefixSums|topologicalSort|dagShortestPath)$/.test(name);
    const resultType = arrayResult
      ? language === "Java" ? "static int[]" : language === "C++" ? "vector<int>" : "int*"
      : matrixResult
        ? language === "Java" ? "static int[][]" : language === "C++" ? "vector<vector<int>>" : "int**"
      : language === "Java" ? "static int" : language === "C++" ? "int" : "int";
    return `${indent}${resultType} ${name}(${convertedParameters}) {`;
  }

  const indentation = code.match(/^\s*/)?.[0] ?? "";
  let statement = code.trim()
    .replace(/:\s*Record<[^>]+>/g, "")
    .replace(/:\s*(?:number|string|boolean|unknown|any)(?:\[\])?(?=\s*=)/g, "");
  const forOfMatch = statement.match(/^for\s*\(\s*(?:const|let|var)\s+(\w+)\s+of\s+(.+)\)\s*\{$/);
  if (forOfMatch) {
    if (language === "C") {
      return `${indentation}for (int ${forOfMatch[1]}Index = 0; ${forOfMatch[1]}Index < ${forOfMatch[2]}.length; ${forOfMatch[1]}Index++) {`;
    }
    const itemType = /^(?:edge)$/.test(forOfMatch[1]) ? "Edge" : /^(?:node|next)$/.test(forOfMatch[1]) ? "Node" : "int";
    return `${indentation}for (${itemType} ${forOfMatch[1]} : ${forOfMatch[2]}) {`;
  }
  const declarationMatch = statement.match(/^(?:const|let|var)\s+(\w+)\s*=\s*(.*);?$/);
  if (declarationMatch) {
    const [, name, value] = declarationMatch;
    const type = /^(?:index|cursor|left|right|row|col|count|k|target|value|current|neighbor|start|goal|minimum|maximum|sum|candidate|pass|V|windowSum|best|endingHere|orCost|andCost)$/.test(name)
      ? "int"
      : /^(?:values|array|prefix|order|traversal|traversalOrder)$/.test(name)
        ? language === "Java" ? "List<Integer>" : language === "C++" ? "vector<int>" : "int*"
        : /^(?:matrix|result)$/.test(name) && /zeros/.test(value)
          ? language === "Java" ? "int[][]" : language === "C++" ? "vector<vector<int>>" : "int**"
          : /^(?:queue|stack)$/.test(name)
            ? language === "Java" ? "List<Integer>" : language === "C++" ? "vector<int>" : "int*"
            : /^(?:current|leaf|edge|node)$/.test(name)
              ? language === "Java" ? "Node" : language === "C++" ? "auto" : "Node"
            : /^(?:dist|bestCost|indegree)$/.test(name)
              ? language === "Java" ? "Map<Integer, Integer>" : language === "C++" ? "unordered_map<int, int>" : "Map"
            : name === "visited"
              ? language === "Java" ? "Set<Integer>" : language === "C++" ? "unordered_set<int>" : "Set"
              : /new Map/.test(value)
                ? language === "Java" ? "Map<Integer, Integer>" : language === "C++" ? "unordered_map<int, int>" : "Map"
                  : "auto";
    statement = `${type} ${name} = ${value.replace(/;\s*$/, "")};`;
    if (/^\[.*\]$/.test(value.trim())) {
      const contents = value.trim().slice(1, -1);
      statement = language === "Java"
        ? `${type} ${name} = new ArrayList<>(List.of(${contents}));`
        : language === "C++"
          ? `${type} ${name}{${contents}};`
          : `${type} ${name} = { ${contents} };`;
    }
    if (/new Set(?:<[^>]+>)?/.test(value)) {
      const initialItems = value.match(/new Set(?:<[^>]+>)?\(\[([^\]]*)\]\)/)?.[1];
      statement = language === "Java"
        ? `Set<Integer> ${name} = new HashSet<>(Arrays.asList(${initialItems ?? ""}));`
        : language === "C++"
          ? `unordered_set<int> ${name}{${initialItems ?? ""}};`
          : `Set ${name} = { ${initialItems ?? ""} };`;
    }
  }

  statement = statement
    .replace(/^for\s*\(\s*(?:const|let|var)\s+(\w+)/, "for (int $1")
    .replace(/\bconst\b|\blet\b|\bvar\b/g, "")
    .replace(/\.length\b/g, ".length")
    .replace(/===/g, "==")
    .replace(/!==/g, "!=")
    .replace(/\bnull\b/g, language === "Java" ? "null" : language === "C++" ? "nullptr" : "NULL")
    .replace(/\.push\(/g, language === "Java" ? ".add(" : language === "C++" ? ".push_back(" : ".push(")
    .replace(/\.shift\(\)/g, language === "Java" ? ".remove(0)" : language === "C++" ? ".erase(queue.begin())" : ".dequeue()");
  return `${indentation}${statement}`;
}

export function translateSourceCode(source: string[], language: Language): string[] {
  switch (language) {
    case "JavaScript":
      return source.map((line) =>
        line
          .replace(/:\s*number\[\]/g, "")
          .replace(/:\s*number\b/g, "")
          .replace(/:\s*Record<[^>]+>/g, "")
          .replace(/:\s*string\b/g, "")
          .replace(/:\s*boolean\b/g, "")
          .replace(/!\./g, ".")
          .replace(/!\s*;/g, ";"),
      );
    case "Python":
      return source.map(pythonLine);
    case "Java":
    case "C":
    case "C++":
      return source.map((line) => convertCStyle(line, language));
    case "TypeScript":
      return source.map(addTypeAnnotations);
  }
}
