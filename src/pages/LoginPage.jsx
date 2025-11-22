import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/60 p-8">
        <h1 className="text-2xl font-semibold text-slate-50 text-center mb-2">
          Login
        </h1>
        <p className="text-sm text-slate-400 text-center mb-6">
          Enter your email and password, then press the button to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full rounded-xl bg-slate-800/80 border border-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/60 focus:outline-none px-4 py-2.5 text-slate-100 placeholder:text-slate-500 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full rounded-xl bg-slate-800/80 border border-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/60 focus:outline-none px-4 py-2.5 text-slate-100 placeholder:text-slate-500 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 transition-colors px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
