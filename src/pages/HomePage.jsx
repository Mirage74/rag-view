import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function hasToken() {
  return typeof window !== "undefined" && Boolean(localStorage.getItem("jwt"));
}

function HomePage() {
  const [auth, setAuth] = useState(hasToken());
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setAuth(hasToken());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setAuth(false);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-lg bg-slate-900/80 rounded-3xl border border-slate-700/70 shadow-2xl p-8 text-center">
        <h1 className="text-2xl font-semibold mb-2">RAG Viewer</h1>
        <p className="text-sm text-slate-400 mb-8">
          Choose an option to start working with your text files and RAG
          queries.
        </p>

        {!auth ? (
          <div className="space-y-4">
            <button
              onClick={() => navigate("/register")}
              className="w-full py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-sm font-semibold shadow-lg shadow-indigo-500/30 transition-colors"
            >
              Register
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-sm font-semibold transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/guest-login")}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-sm font-semibold shadow-lg shadow-emerald-500/30 transition-colors"
            >
              Login as guest
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => navigate("/upload")}
              className="w-full py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-sm font-semibold shadow-lg shadow-indigo-500/30 transition-colors"
            >
              Upload TXT file
            </button>
            <button
              onClick={() => navigate("/rag")}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-sm font-semibold transition-colors"
            >
              Create new RAG query
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-2xl bg-red-500 hover:bg-red-400 active:bg-red-600 text-sm font-semibold shadow-lg shadow-red-500/30 transition-colors"
            >
              Logout
            </button>
          </div>
        )}

        <p className="mt-6 text-[11px] text-slate-500">
          Authentication state is determined by the presence of a JWT token in
          localStorage.
        </p>
      </div>
    </div>
  );
}

export default HomePage;
