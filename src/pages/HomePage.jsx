import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/userDetailsSlice";
import { TOKEN_UNDEFINED } from "../features/constants";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.userDetails.token);
  const userId = useSelector((state) => state.userDetails.userId);
  const userName = useSelector((state) => state.userDetails.userName);
  const userEmail = useSelector((state) => state.userDetails.userEmail);
  const loadedFiles = useSelector((state) => state.userDetails.loadedFiles);
  const loading = useSelector((state) => state.userDetails.loading);

  const auth =
    typeof token === "string" &&
    token !== TOKEN_UNDEFINED &&
    token.trim() !== "";

  const handleLogout = () => {
    dispatch(logoutUser());
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
          <div className="space-y-6">
            {/* User Info Section */}
            <div className="bg-slate-800/50 rounded-2xl p-4 text-left border border-slate-700/50">
              <h2 className="text-lg font-semibold mb-3 text-slate-200">
                User Profile
              </h2>
              {loading ? (
                <p className="text-slate-400 text-sm">Loading...</p>
              ) : (
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-slate-400">ID:</span>{" "}
                    <span className="text-slate-200">{userId ?? "—"}</span>
                  </p>
                  <p>
                    <span className="text-slate-400">Username:</span>{" "}
                    <span className="text-slate-200">{userName}</span>
                  </p>
                  <p>
                    <span className="text-slate-400">Email:</span>{" "}
                    <span className="text-slate-200">{userEmail}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Loaded Files Section */}
            <div className="bg-slate-800/50 rounded-2xl p-4 text-left border border-slate-700/50">
              <h2 className="text-lg font-semibold mb-3 text-slate-200">
                Loaded Documents ({loadedFiles.length})
              </h2>
              {loading ? (
                <p className="text-slate-400 text-sm">Loading...</p>
              ) : loadedFiles.length === 0 ? (
                <p className="text-slate-400 text-sm">
                  No documents uploaded yet
                </p>
              ) : (
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {loadedFiles.map((file) => (
                    <li
                      key={file.id}
                      className="flex items-center gap-2 text-sm bg-slate-700/30 rounded-lg px-3 py-2"
                    >
                      <svg
                        className="w-4 h-4 text-indigo-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-slate-200 truncate">
                        {file.fileName}
                      </span>
                      <span className="text-slate-500 text-xs ml-auto">
                        #{file.id}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Action Buttons */}
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
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
