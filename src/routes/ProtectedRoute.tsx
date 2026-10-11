import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children?: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading, authError, refreshSession } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div role="status" className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
          <p className="mt-4 text-sm text-slate-400">Verifying your session…</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <section role="alert" className="max-w-md rounded-2xl border border-red-500/30 bg-slate-900 p-7 text-center">
          <h1 className="text-xl font-bold">Can’t verify your account</h1>
          <p className="mt-3 text-sm text-slate-400">{authError}</p>
          <button
            type="button"
            onClick={() => void refreshSession()}
            className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Try again
          </button>
          <Link to="/login" className="ml-4 text-sm text-cyan-400 hover:text-cyan-300">
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children ?? <Outlet />}</>;
}