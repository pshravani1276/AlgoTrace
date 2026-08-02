import { Link, NavLink } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const navItems = [
    { name: "Searching", path: "/searching" },
    { name: "Sorting", path: "/sorting" },
    { name: "Graphs", path: "/graph" },
    { name: "Arrays", path: "/arrays" },
    { name: "Trees", path: "/tree" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}

        <Link
          to="/dashboard"
          className="text-2xl font-bold text-indigo-400"
        >
          AlgoTrace
        </Link>

        {/* Navigation */}

        <div className="hidden md:flex items-center gap-8">

          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-indigo-400 font-semibold"
                    : "text-slate-300 hover:text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

        </div>

        {/* Right Side */}

        <div className="flex items-center gap-4">

          <button className="text-slate-400 hover:text-white">
            <Search size={20} />
          </button>

          <button className="text-slate-400 hover:text-white">
            <Bell size={20} />
          </button>

          <ProfileMenu />

        </div>

      </div>

    </nav>
  );
}