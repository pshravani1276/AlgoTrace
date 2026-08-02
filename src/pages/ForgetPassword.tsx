import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-4">

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">

        {/* Logo */}

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white">
            AlgoTrace
          </h1>

          <p className="text-slate-300 mt-2">
            Reset your password
          </p>

        </div>

        <h2 className="text-2xl font-semibold text-white mb-2">
          Forgot Password?
        </h2>

        <p className="text-slate-400 mb-8">
          Enter your email and we'll send you a password reset link.
        </p>

        <form className="space-y-6">

          <div>

            <label className="text-sm text-slate-300 mb-2 block">
              Email
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg bg-slate-900/70 border border-slate-700 py-3 pl-10 pr-4 text-white outline-none focus:border-indigo-500"
              />

            </div>

          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-lg py-3 font-semibold text-white flex justify-center items-center gap-2 transition"
          >
            <Send size={18} />
            Send Reset Link
          </button>

        </form>

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-2 text-indigo-400 hover:text-indigo-300"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>

      </div>

    </div>
  );
}