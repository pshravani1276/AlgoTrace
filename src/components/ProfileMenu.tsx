import { useState } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLogoutError(null);
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Unable to sign out.",
      );
    }
  };
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold"
      >
        {user?.displayName?.charAt(0) ||
          user?.email?.charAt(0).toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-xl">
          {logoutError && (
            <p role="alert" className="border-b border-red-500/20 p-3 text-xs text-red-300">
              {logoutError}
            </p>
          )}

          <div className="p-4 border-b border-slate-700">

            <p className="font-semibold text-white">
              {user?.displayName || "User"}
            </p>

            <p className="text-sm text-slate-400">
              {user?.email}
            </p>

          </div>

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-slate-300">
            <User size={18} />
            Profile
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-slate-300">
            <Settings size={18} />
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 text-red-400"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      )}

    </div>
  );
}