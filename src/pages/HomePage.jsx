import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutUser,
  clearDeleteStatus,
} from "../features/slices/details-slice";
import fetchDeleteUploaded from "../features/fetch-async/fetchDeleteUploaded";
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
  const deleting = useSelector((state) => state.userDetails.deleting);
  const deleteSuccess = useSelector((state) => state.userDetails.deleteSuccess);
  const deletedCount = useSelector((state) => state.userDetails.deletedCount);

  const auth =
    typeof token === "string" &&
    token !== TOKEN_UNDEFINED &&
    token.trim() !== "";

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleDeleteUploaded = () => {
    if (window.confirm("Are you sure you want to delete all uploaded files?")) {
      dispatch(fetchDeleteUploaded());
    }
  };

  const handleClearDeleteStatus = () => {
    dispatch(clearDeleteStatus());
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-950 p-4 overflow-hidden">
      <div className="w-full max-w-md bg-slate-900/90 rounded-2xl border border-slate-700/60 shadow-xl p-6">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-semibold text-white">RAG Viewer</h1>
          <p className="text-xs text-slate-400 mt-1">
            Choose an option to start working with your text files and RAG
            queries.
          </p>
        </div>

        {!auth ? (
          <div className="space-y-3">
            <button
              onClick={() => navigate("/register")}
              className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-colors"
            >
              Register
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-sm font-medium text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/guest-login")}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-sm font-medium text-white shadow-md shadow-emerald-500/25 transition-colors"
            >
              Login as guest
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* User Info Section */}
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/40">
              <h2 className="text-sm font-semibold text-slate-200 mb-2">
                User Profile
              </h2>
              {loading ? (
                <p className="text-slate-400 text-xs">Loading...</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">ID</span>
                    <span className="text-slate-200">{userId ?? "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Username</span>
                    <span className="text-slate-200">{userName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Email</span>
                    <span className="text-slate-200 truncate block">
                      {userEmail}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Delete Success Message */}
            {deleteSuccess && (
              <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-xl p-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-emerald-400 text-xs">
                    Successfully deleted {deletedCount} file(s)
                  </p>
                  <button
                    onClick={handleClearDeleteStatus}
                    className="text-emerald-400 hover:text-emerald-300 text-xs ml-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Loaded Files Section */}
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/40">
              <h2 className="text-sm font-semibold text-slate-200 mb-2">
                Loaded Documents ({loadedFiles.length})
              </h2>
              {loading ? (
                <p className="text-slate-400 text-xs">Loading...</p>
              ) : loadedFiles.length === 0 ? (
                <p className="text-slate-400 text-xs">
                  No documents uploaded yet
                </p>
              ) : (
                <ul className="space-y-1.5 max-h-24 overflow-y-auto">
                  {loadedFiles.map((file) => (
                    <li
                      key={file.id}
                      className="flex items-center gap-2 text-xs bg-slate-700/40 rounded-lg px-2.5 py-1.5"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0"
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
                      <span className="text-slate-200 truncate flex-1">
                        {file.fileName}
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        #{file.id}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Action Buttons - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate("/upload")}
                className="py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-xs font-medium text-white shadow-md shadow-indigo-500/25 transition-colors"
              >
                Upload TXT
              </button>
              <button
                onClick={() => navigate("/rag")}
                className="py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-xs font-medium text-white transition-colors"
              >
                New RAG Query
              </button>
              <button
                onClick={handleDeleteUploaded}
                disabled={deleting || loadedFiles.length === 0}
                className="py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-xs font-medium text-white shadow-md shadow-orange-500/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Delete Files"}
              </button>
              <button
                onClick={handleLogout}
                className="py-2.5 rounded-xl bg-red-500 hover:bg-red-400 active:bg-red-600 text-xs font-medium text-white shadow-md shadow-red-500/25 transition-colors"
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
