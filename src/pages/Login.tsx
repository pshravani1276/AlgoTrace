import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";
import AnimatedBackground from "../components/auth/AnimatedBackground";

export default function Login() {
  const navigate = useNavigate();

  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(email, password);

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setError("");

      await googleLogin();

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
  <div className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center px-4">

    {/* Animated Background */}

    <AnimatedBackground />

    {/* Login Card */}

    <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">

      {/* Logo */}

      <div className="text-center mb-8">

        <h1 className="text-4xl font-bold text-white">
          AlgoTrace
        </h1>

        <p className="text-slate-300 mt-2">
          Learn Algorithms Visually
        </p>

      </div>

      <h2 className="text-2xl font-semibold text-white mb-2">
        Welcome Back 👋
      </h2>

      <p className="text-slate-400 mb-6">
        Login to continue your learning journey.
      </p>

      {error && (
        <div className="mb-5 rounded-lg bg-red-500/20 border border-red-500 p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleLogin}
        className="space-y-5"
      >

        {/* Email */}

        <div>

          <label className="text-sm text-slate-300 block mb-2">
            Email
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg bg-slate-900/70 border border-slate-700 py-3 pl-10 pr-4 text-white outline-none focus:border-indigo-500"
            />

          </div>

        </div>

        {/* Password */}

        <div>

          <label className="text-sm text-slate-300 block mb-2">
            Password
          </label>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-lg bg-slate-900/70 border border-slate-700 py-3 pl-10 pr-12 text-white outline-none focus:border-indigo-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-3 text-slate-400"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

        </div>

        <div className="flex justify-end">

          <Link
            to="/forgot-password"
            className="text-indigo-400 hover:text-indigo-300 text-sm"
          >
            Forgot Password?
          </Link>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-lg py-3 font-semibold text-white flex items-center justify-center gap-2 transition disabled:opacity-50"
        >

          <LogIn size={18} />

          {loading
            ? "Logging In..."
            : "Login"}

        </button>

      </form>

      <div className="flex items-center my-6">

        <div className="flex-1 h-px bg-slate-700" />

        <span className="px-3 text-slate-400 text-sm">
          OR
        </span>

        <div className="flex-1 h-px bg-slate-700" />

      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full bg-white hover:bg-gray-100 rounded-lg py-3 font-medium flex justify-center items-center gap-3 transition text-black"
      >

        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />

        Continue with Google

      </button>

      <p className="text-center text-slate-400 mt-8">

        Don't have an account?

        <Link
          to="/signup"
          className="text-indigo-400 ml-2 hover:text-indigo-300 font-medium"
        >
          Sign Up
        </Link>

      </p>

    </div>

  </div>
);
}