import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAuthEntity } from "../models/authEntity";

function RegisterPage() {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [authEntity, setAuthEntity] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Password and Confirm password do not match");
      return;
    }

    const payload = {
      username: login,
      email: email,
      password: password,
      confirmPassword: confirm,
    };

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Register failed:", text);
        alert("Registration failed");
        return;
      }

      const raw = await response.json();
      const entity = createAuthEntity(raw);

      setAuthEntity(entity);

      if (entity && entity.payload.token) {
        localStorage.setItem("jwt", entity.payload.token);
      }

      navigate("/");
    } catch (err) {
      console.error("Request error:", err);
      alert("Network error");
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/60 p-8">
        <h1 className="text-2xl font-semibold text-slate-50 text-center mb-2">
          Register
        </h1>
        <p className="text-sm text-slate-400 text-center mb-6">
          Create a new account by choosing a login, email and a strong password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">
              Login
            </label>
            <input
              type="text"
              value={login}
              minLength={3}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Your login"
              className="w-full rounded-xl bg-slate-800/80 border border-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/60 focus:outline-none px-4 py-2.5 text-slate-100 placeholder:text-slate-500 text-sm"
              required
            />
          </div>

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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">
              Confirm password
            </label>
            <input
              type="password"
              value={confirm}
              minLength={8}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className="w-full rounded-xl bg-slate-800/80 border border-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/60 focus:outline-none px-4 py-2.5 text-slate-100 placeholder:text-slate-500 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 transition-colors px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30"
          >
            Register
          </button>
        </form>

        {authEntity && (
          <p className="mt-4 text-xs text-slate-400">
            Server message: {authEntity.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
