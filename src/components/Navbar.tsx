import { useState } from "react";

import {
  Search,
  Flame,
  User,
  LogOut,
  Layers,
  X,
  ChevronDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { searchAlgorithms } from "../data/searchCatalog";

import CodingStreak from "./CodingStreak";

export default function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [showProfile, setShowProfile] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const [search, setSearch] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  /*
   * ============================================================
   * GITHUB STYLE PROFILE ID
   * ============================================================
   */

  const getProfileId = () => {
    if (!user?.email) {
      return "guest";
    }

    const emailName = user.email.split("@")[0];

    const shortName = emailName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 12);

    return shortName || "user";
  };

  /*
   * ============================================================
   * SEARCH
   *
   * Normal website-style search.
   * No algorithm list appears underneath.
   * Search happens when Enter is pressed.
   * ============================================================
   */

  const searchResults = searchAlgorithms(search);

  const handleSearch = () => {
    if (!search.trim()) {
      setSearchMessage("Enter an algorithm or topic to search.");
      return;
    }

    const firstResult = searchResults[0];
    if (!firstResult) {
      setSearchMessage("No matching algorithms or topics found.");
      return;
    }

    navigate(firstResult.path);
    setSearch("");
    setSearchMessage("");
    setShowSearch(false);
  };

  const openSearchResult = (path: string) => {
    navigate(path);
    setSearch("");
    setSearchMessage("");
    setShowSearch(false);
  };
  /*
   * ============================================================
   * CLOSE ALL POPUPS
   * ============================================================
   */

  const closeAllPopups = () => {
    setShowProfile(false);
    setShowStreak(false);
    setShowSearch(false);
    setShowCategories(false);
  };

  return (
    <nav
      className="
        sticky
        top-0
        z-[200]
        border-b
        border-slate-800
        bg-slate-950/95
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          px-6
          py-4
        "
      >
        {/* =====================================================
            LOGO
        ====================================================== */}

        <button
          type="button"
          onClick={() => {
            closeAllPopups();
            navigate("/dashboard");
          }}
          className="
            flex
            items-center
            gap-3
            transition
            hover:scale-105
          "
        >
          <img
            src="/favicon.svg"
            alt="AlgoTrace"
            className="
              h-10
              w-10
              rounded-xl
              object-contain
            "
          />

          <div className="text-left">
            <h1
              className="
                text-2xl
                font-extrabold
                tracking-tight
                text-white
              "
            >
              Algo
              <span className="text-cyan-400">
                Trace
              </span>
            </h1>

            <p
              className="
                text-[10px]
                font-medium
                tracking-[0.2em]
                text-slate-500
              "
            >
              VISUALIZE • LEARN • MASTER
            </p>
          </div>
        </button>

        {/* =====================================================
            RIGHT SIDE CONTROLS
        ====================================================== */}

        <div
          className="
            relative
            flex
            items-center
            gap-3
          "
        >
          {/* =================================================
              SEARCH BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() => {
              setShowSearch((previous) => !previous);

              setShowCategories(false);
              setShowProfile(false);
              setShowStreak(false);
            }}
            className="
              relative
              z-[210]
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-800
              bg-slate-900
              px-4
              py-2
              text-slate-300
              transition
              hover:border-cyan-500/40
              hover:bg-slate-800
              hover:text-white
            "
          >
            <Search size={18} />

            <span className="hidden sm:inline">
              Search
            </span>
          </button>

          {/* =================================================
              CATEGORIES
          ================================================== */}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowCategories(
                  (previous) => !previous
                );

                setShowSearch(false);
                setShowProfile(false);
                setShowStreak(false);
              }}
              className="
                relative
                z-[210]
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-800
                bg-slate-900
                px-4
                py-2
                text-slate-300
                transition
                hover:border-cyan-500/40
                hover:bg-slate-800
                hover:text-white
              "
            >
              <Layers size={18} />

              <span className="hidden sm:inline">
                Categories
              </span>

              <ChevronDown
                size={15}
                className={`
                  transition-transform
                  ${
                    showCategories
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {/* =================================================
                CATEGORY DROPDOWN
            ================================================== */}

            {showCategories && (
              <div
                className="
                  absolute
                  right-0
                  top-14
                  z-[220]
                  w-64
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-950
                  p-2
                  shadow-2xl
                  shadow-black/40
                "
              >
                <div className="px-3 py-2">
                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-widest
                      text-slate-500
                    "
                  >
                    Learning Categories
                  </p>
                </div>

                {/* SORTING */}

                <button
                  type="button"
                  onClick={() => {
                    navigate("/sorting");
                    setShowCategories(false);
                  }}
                  className="
                    w-full
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium
                    text-slate-200
                    transition
                    hover:bg-cyan-500/10
                    hover:text-cyan-400
                  "
                >
                  <div className="flex items-center justify-between">
                    <span>Sorting</span>

                    <span className="text-xs text-slate-500">
                      Algorithms
                    </span>
                  </div>
                </button>

                {/* SEARCHING */}

                <button
                  type="button"
                  onClick={() => {
                    navigate("/searching");
                    setShowCategories(false);
                  }}
                  className="
                    w-full
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium
                    text-slate-200
                    transition
                    hover:bg-cyan-500/10
                    hover:text-cyan-400
                  "
                >
                  <div className="flex items-center justify-between">
                    <span>Searching</span>

                    <span className="text-xs text-slate-500">
                      Algorithms
                    </span>
                  </div>
                </button>

                {/* TREES */}

                <button
                  type="button"
                  onClick={() => {
                    navigate("/tree");
                    setShowCategories(false);
                  }}
                  className="
                    w-full
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium
                    text-slate-200
                    transition
                    hover:bg-cyan-500/10
                    hover:text-cyan-400
                  "
                >
                  <div className="flex items-center justify-between">
                    <span>Trees</span>

                    <span className="text-xs text-slate-500">
                      Data Structures
                    </span>
                  </div>
                </button>

                {/* GRAPH */}

                <button
                  type="button"
                  onClick={() => {
                    navigate("/graph");
                    setShowCategories(false);
                  }}
                  className="
                    w-full
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium
                    text-slate-200
                    transition
                    hover:bg-cyan-500/10
                    hover:text-cyan-400
                  "
                >
                  <div className="flex items-center justify-between">
                    <span>Graphs</span>

                    <span className="text-xs text-slate-500">
                      Data Structures
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* =================================================
              STREAK
          ================================================== */}

          <button
            type="button"
            onClick={() => {
              /*
               * IMPORTANT:
               * Functional state update prevents stale state
               * and makes the button reliably open/close every time.
               */

              setShowStreak(
                (previous) => !previous
              );

              setShowSearch(false);
              setShowCategories(false);
              setShowProfile(false);
            }}
            className="
              relative
              z-[210]
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-orange-500/20
              bg-orange-500/10
              px-4
              py-2
              text-orange-400
              transition
              hover:bg-orange-500/20
            "
          >
            <Flame size={18} />

            <span className="hidden sm:inline">
              Streak
            </span>
          </button>

          {/* =================================================
              PROFILE
          ================================================== */}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowProfile(
                  (previous) => !previous
                );

                setShowSearch(false);
                setShowCategories(false);
                setShowStreak(false);
              }}
              className="
                relative
                z-[210]
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-slate-700
                bg-slate-800
                text-white
                transition
                hover:border-cyan-400/50
                hover:bg-slate-700
              "
            >
              <User size={20} />
            </button>

            {/* =================================================
                PROFILE MENU
            ================================================== */}

            {showProfile && (
              <div
                className="
                  absolute
                  right-0
                  top-14
                  z-[220]
                  w-72
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-950
                  p-5
                  shadow-2xl
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      bg-gradient-to-br
                      from-cyan-400
                      to-purple-600
                      text-lg
                      font-bold
                      text-white
                    "
                  >
                    {getProfileId()
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3
                      className="
                        font-bold
                        text-white
                      "
                    >
                      Profile
                    </h3>

                    <p
                      className="
                        text-sm
                        text-cyan-400
                      "
                    >
                      @{getProfileId()}
                    </p>
                  </div>
                </div>

                {/* ACCOUNT */}

                <div
                  className="
                    mt-4
                    rounded-xl
                    bg-slate-900
                    p-3
                  "
                >
                  <p className="text-xs text-slate-500">
                    Account
                  </p>

                  <p
                    className="
                      mt-1
                      break-all
                      text-sm
                      text-slate-300
                    "
                  >
                    {user?.email ?? "Guest"}
                  </p>
                </div>

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await logout();

                      closeAllPopups();

                      navigate("/login");
                    } catch (error) {
                      console.error(
                        "Logout failed:",
                        error
                      );
                    }
                  }}
                  className="
                    mt-4
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-red-500/10
                    py-3
                    text-red-400
                    transition
                    hover:bg-red-500/20
                  "
                >
                  <LogOut size={18} />

                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH POPUP
      ====================================================== */}

      {showSearch && (
        <div
          className="
            fixed
            right-32
            top-[76px]
            z-[190]
            w-[360px]
            max-w-[calc(100vw-24px)]
            rounded-2xl
            border
            border-slate-800
            bg-slate-950
            p-5
            shadow-2xl
          "
        >
          <div
            className="
              mb-4
              flex
              items-center
              justify-between
            "
          >
            <div>
              <h2
                className="
                  font-bold
                  text-white
                "
              >
                Search AlgoTrace
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                Search for algorithms and concepts
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowSearch(false);
                setSearch("");
                setSearchMessage("");
              }}
              aria-label="Close search"
              className="
                text-slate-400
                transition
                hover:text-white
              "
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch();
            }}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              px-3
            "
          >
            <Search
              size={18}
              className="text-slate-500"
            />

            <input
              autoFocus
              value={search}
              onChange={(event) =>
                {
                  setSearch(event.target.value);
                  setSearchMessage("");
                }
              }
              aria-label="Search algorithms and topics"
              aria-autocomplete="list"
              aria-controls="algorithm-search-results"
              placeholder="Search algorithms, topics..."
              className="
                w-full
                bg-transparent
                py-3
                text-sm
                text-white
                outline-none
                placeholder:text-slate-600
              "
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="rounded-lg p-2 text-cyan-400 transition hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              <Search size={17} />
            </button>
          </form>

          {search.trim() ? (
            <div
              id="algorithm-search-results"
              role="listbox"
              aria-label="Search results"
              className="mt-3 space-y-1"
            >
              {searchResults.length ? (
                searchResults.map((result) => (
                  <button
                    key={result.path}
                    type="button"
                    role="option"
                    aria-selected="false"
                    onClick={() => openSearchResult(result.path)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <span>
                      <span className="block text-sm font-medium text-slate-100">
                        {result.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {result.description}
                      </span>
                    </span>
                    <span className="shrink-0 text-[10px] uppercase tracking-wide text-cyan-400">
                      {result.category}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-sm text-slate-400">
                  No matches yet. Try “merge sort”, “binary search”, or “graph”.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-xs text-slate-600">
              Type to see results, then press Enter or select one.
            </p>
          )}
          {searchMessage && (
            <p role="status" className="mt-2 text-xs text-amber-300">
              {searchMessage}
            </p>
          )}
        </div>
      )}

      {/* =====================================================
          STREAK POPUP
      ====================================================== */}

      {showStreak && (
        <div
          className="
            fixed
            right-6
            top-[76px]
            z-[190]
            w-[390px]
            max-w-[calc(100vw-24px)]
          "
        >
          <div
            className="
              max-h-[calc(100vh-90px)]
              overflow-y-auto
              rounded-3xl
              border
              border-slate-800
              bg-slate-950
              shadow-2xl
              shadow-black/50
            "
          >
            <CodingStreak />
          </div>
        </div>
      )}
    </nav>
  );
}