import { useSelector } from "react-redux";

const ChatArea = () => {
  const { loadedFiles } = useSelector((state) => state.userDetails);

  if (!loadedFiles || loadedFiles.length === 0) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 text-center">
        <svg
          className="w-12 h-12 text-amber-400 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-amber-200 font-medium">Unable to make RAG query</p>
        <p className="text-amber-300/70 text-sm mt-1">
          Please upload at least one context file first
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/40 text-center">
      <p className="text-slate-400">Start a conversation...</p>
    </div>
  );
};

export default ChatArea;
