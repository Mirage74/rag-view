import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchRegisterUser,
  USER_NAME_UNDEFINED,
  USER_EMAIL_UNDEFINED,
} from "../features/userDetailsSlice";

function RegisterPage() {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userName, userEmail, loading, error } = useSelector(
    (state) => state.userDetails
  );

  useEffect(() => {
    if (
      !loading &&
      userName !== USER_NAME_UNDEFINED &&
      userEmail !== USER_EMAIL_UNDEFINED
    ) {
      navigate("/rag");
    }
  }, [loading, userName, userEmail, navigate]);

  useEffect(() => {
    if (error) {
      setLogin("");
      setEmail("");
      setPassword("");
      setConfirm("");
    }
  }, [error]);

  const handleSubmit = (e) => {
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

    dispatch(fetchRegisterUser(payload));
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

        {error && (
          <div className="mb-4 text-sm text-red-400 text-center">{error}</div>
        )}

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
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed active:bg-indigo-600 transition-colors px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
