import { Navigate, useParams } from "react-router-dom";
import SearchAlgorithmVisualizer, {
  type SearchAlgorithm,
} from "../components/SearchAlgorithmVisualizer";

const SEARCH_ALGORITHM_IDS: SearchAlgorithm[] = [
  "linear-search",
  "jump-search",
  "interpolation-search",
  "exponential-search",
  "fibonacci-search",
  "hash-search",
];

function isSearchAlgorithm(value: string | undefined): value is SearchAlgorithm {
  return value !== undefined && SEARCH_ALGORITHM_IDS.includes(value as SearchAlgorithm);
}

export default function SearchAlgorithmPage() {
  const { algorithm } = useParams();

  if (!isSearchAlgorithm(algorithm)) {
    return <Navigate to="/searching" replace />;
  }

  return <SearchAlgorithmVisualizer algorithm={algorithm} />;
}
