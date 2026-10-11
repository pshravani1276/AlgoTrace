import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { lazy, Suspense } from "react";

// ============================================================
// WORKING CORE PAGES
// ============================================================

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProgressNotifications from "./components/ProgressNotifications";

// ============================================================
// OTHER PAGES
// ============================================================

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Categories = lazy(() => import("./pages/Categories"));
const Sorting = lazy(() => import("./pages/Sorting"));
const BubbleSort = lazy(() => import("./pages/BubbleSort"));
const SelectionSort = lazy(() => import("./pages/SelectionSort"));
const InsertionSort = lazy(() => import("./pages/InsertionSort"));
const MergeSort = lazy(() => import("./pages/MergeSort"));
const QuickSort = lazy(() => import("./pages/QuickSort"));
const HeapSort = lazy(() => import("./pages/HeapSort"));
const BreadthFirstSearch = lazy(() =>
  import("./pages/Graph/BreadthFirstSearch"),
);
const BinarySearch = lazy(() => import("./pages/BinarySearch"));

const Searching = lazy(() =>
  import("./pages/Searching").then((module) => ({
    default: module.default ?? PageFallback,
  })),
);

const SearchAlgorithmPage = lazy(() =>
  import("./pages/SearchAlgorithm").then((module) => ({
    default: module.default,
  })),
);

const Tree = lazy(() => Promise.resolve({ default: PageFallback }));

// IMPORTANT:
// Explicitly load Graph/index.tsx.
// This avoids resolving another Graph.tsx file.
const Graph = lazy(() =>
  import("./pages/Graph/index").then((module) => ({
    default: module.default,
  })),
);

const Arrays = lazy(() =>
  import("./pages/Arrays").then((module) => ({
    default: module.default ?? PageFallback,
  })),
);

const Profile = lazy(() => Promise.resolve({ default: PageFallback }));

const Settings = lazy(() => Promise.resolve({ default: PageFallback }));

const ForgetPassword = lazy(() =>
  import("./pages/ForgetPassword").then((module) => ({
    default: module.default ?? PageFallback,
  })),
);

// ============================================================
// FALLBACK
// ============================================================

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <h1 className="text-xl font-bold">
          Page
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          This section is being prepared.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// LOADING
// ============================================================

function PageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-center">

        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

        <p className="mt-4 text-sm text-slate-400">
          Loading AlgoTrace...
        </p>

      </div>
    </div>
  );
}

// ============================================================
// APP
// ============================================================

export default function App() {
  return (
    <BrowserRouter>

      <Suspense fallback={<PageLoading />}>

        <Routes>

          {/* ==================================================
              AUTHENTICATION
          ================================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/forgot-password"
            element={<ForgetPassword />}
          />

          <Route element={<ProtectedRoute />}>
          {/* ==================================================
              DEFAULT
          ================================================== */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* ==================================================
              DASHBOARD
          ================================================== */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* ==================================================
              CATEGORIES
          ================================================== */}

          <Route
            path="/categories"
            element={<Categories />}
          />

          {/* ==================================================
              SORTING CATEGORY
          ================================================== */}

          <Route
            path="/sorting"
            element={<Sorting />}
          />

          {/* ==================================================
              SORTING ALGORITHMS
          ================================================== */}

          <Route
            path="/sorting/bubble-sort"
            element={<BubbleSort />}
          />

          <Route
            path="/sorting/selection-sort"
            element={<SelectionSort />}
          />

          <Route
            path="/sorting/insertion-sort"
            element={<InsertionSort />}
          />

          <Route
            path="/sorting/merge-sort"
            element={<MergeSort />}
          />

          <Route
            path="/sorting/quick-sort"
            element={<QuickSort />}
          />

          <Route
            path="/sorting/heap-sort"
            element={<HeapSort />}
          />

          {/* ==================================================
              OTHER ALGORITHM CATEGORIES
          ================================================== */}

          <Route
            path="/searching"
            element={<Searching />}
          />

          <Route
            path="/binary-search"
            element={<BinarySearch />}
          />

          <Route
            path="/searching/binary-search"
            element={<BinarySearch />}
          />

          <Route
            path="/searching/:algorithm"
            element={<SearchAlgorithmPage />}
          />

          <Route
            path="/tree"
            element={<Tree />}
          />

          {/* ==================================================
              GRAPH CATEGORY
          ================================================== */}

          <Route
            path="/graph"
            element={<Graph />}
          />

          {/* ==================================================
              BREADTH FIRST SEARCH
          ================================================== */}

          <Route
            path="/graph/bfs"
            element={<BreadthFirstSearch />}
          />

          {/* ==================================================
              ARRAYS
          ================================================== */}

          <Route
            path="/arrays"
            element={<Arrays />}
          />

          {/* ==================================================
              USER
          ================================================== */}

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          {/* ==================================================
              OLD SORTING LINKS
              Keep these working.
          ================================================== */}

          <Route
            path="/bubble-sort"
            element={
              <Navigate
                to="/sorting/bubble-sort"
                replace
              />
            }
          />

          <Route
            path="/selection-sort"
            element={
              <Navigate
                to="/sorting/selection-sort"
                replace
              />
            }
          />

          <Route
            path="/insertion-sort"
            element={
              <Navigate
                to="/sorting/insertion-sort"
                replace
              />
            }
          />

          <Route
            path="/merge-sort"
            element={
              <Navigate
                to="/sorting/merge-sort"
                replace
              />
            }
          />

          <Route
            path="/quick-sort"
            element={
              <Navigate
                to="/sorting/quick-sort"
                replace
              />
            }
          />

          <Route
            path="/heap-sort"
            element={
              <Navigate
                to="/sorting/heap-sort"
                replace
              />
            }
          />

          {/* ==================================================
              UNKNOWN URL
          ================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
          </Route>

        </Routes>

      </Suspense>

      <ProgressNotifications />

    </BrowserRouter>
  );
}