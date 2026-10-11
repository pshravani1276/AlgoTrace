import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();

  const { signup } = useAuth();

  const [name, setName] = useState("");

  const [institution, setInstitution] = useState("");

  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

    const passwordValidation = {
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /[0-9]/.test(password),
  symbol: /[^A-Za-z0-9]/.test(password),
};

const isPasswordValid =
  passwordValidation.length &&
  passwordValidation.uppercase &&
  passwordValidation.lowercase &&
  passwordValidation.number &&
  passwordValidation.symbol;

  async function handleSignup(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    if (!isPasswordValid) {
  setError("Please create a stronger password.");
  return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
     

    try {
      setLoading(true);

      await signup(name, institution, phone, email, password);

      navigate("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-4">

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white">
            AlgoTrace
          </h1>

          <p className="text-slate-300 mt-2">
            Learn Algorithms Visually
          </p>

        </div>

        <h2 className="text-2xl font-bold text-white">
          Create Account 🚀
        </h2>

        <p className="text-slate-400 mt-2 mb-6">
          Start your DSA learning journey.
        </p>

        {error && (
          <div className="mb-5 rounded-lg border border-red-500 bg-red-500/20 p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSignup}
          className="space-y-5"
        >
                  {/* Name */}

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-lg bg-slate-900/70 border border-slate-700 py-3 pl-10 pr-4 text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Institution */}

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Institution
            </label>

            <input
              type="text"
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Enter your institution"
              className="w-full rounded-lg bg-slate-900/70 border border-slate-700 py-3 px-4 text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Phone */}

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full rounded-lg bg-slate-900/70 border border-slate-700 py-3 px-4 text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Email */}

          <div>
            <label className="block text-sm text-slate-300 mb-2">
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
            <label className="block text-sm text-slate-300 mb-2">
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
                placeholder="Create password"
                className="w-full rounded-lg bg-slate-900/70 border border-slate-700 py-3 pl-10 pr-12 text-white outline-none focus:border-indigo-500"
              />
                <div className="mt-3 text-sm space-y-1">

                 <p className={passwordValidation.length ? "text-green-400" : "text-slate-400"}>
                     {passwordValidation.length ? "✅" : "⭕"} At least 8 characters
                </p>

                 <p className={passwordValidation.uppercase ? "text-green-400" : "text-slate-400"}>
                    {passwordValidation.uppercase ? "✅" : "⭕"} One uppercase letter
                 </p>

                <p className={passwordValidation.lowercase ? "text-green-400" : "text-slate-400"}>
                    {passwordValidation.lowercase ? "✅" : "⭕"} One lowercase letter
                </p>

                <p className={passwordValidation.number ? "text-green-400" : "text-slate-400"}>
                    {passwordValidation.number ? "✅" : "⭕"} One number
                </p>

                <p className={passwordValidation.symbol ? "text-green-400" : "text-slate-400"}>
                  {passwordValidation.symbol ? "✅" : "⭕"} One special character
                </p>

</div>
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

          {/* Confirm Password */}

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                required
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm password"
                className="w-full rounded-lg bg-slate-900/70 border border-slate-700 py-3 pl-10 pr-12 text-white outline-none focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-3 text-slate-400"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Signup Button */}

          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition rounded-lg py-3 font-semibold text-white flex justify-center items-center gap-2 disabled:opacity-50"
          >
            <UserPlus size={18} />

            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8">
          Already have an account?

          <Link
            to="/login"
            className="text-indigo-400 ml-2 hover:text-indigo-300 font-medium"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}