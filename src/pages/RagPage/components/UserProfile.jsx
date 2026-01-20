import { useSelector } from "react-redux";

const UserProfile = () => {
  const { userName, userEmail, loading } = useSelector(
    (state) => state.userDetails,
  );

  return (
    <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/40 mb-6 backdrop-blur-sm">
      <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
        <svg
          className="w-4 h-4 text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        User Profile
      </h2>
      {loading ? (
        <p className="text-slate-400 text-xs">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5">Username</span>
            <span className="text-slate-200 font-medium">
              {userName || "—"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Email</span>
            <span className="text-slate-200 truncate block font-medium">
              {userEmail || "—"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
