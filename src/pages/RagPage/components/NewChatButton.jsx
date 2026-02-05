import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import fetchCreateNewChat from "../../../features/fetch-async/fetchCreateNewChat";
import { NO_ACTIVE_CHAT_ID } from "../../../features/constants";

const NewChatButton = () => {
  const dispatch = useDispatch();
  const activeChatId = useSelector((state) => state.chats.activeChatId);
  const isDisabled = activeChatId === NO_ACTIVE_CHAT_ID;
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");

  const handleCreate = () => {
    if (title.trim()) {
      // Create new chat with title only (no initial message)
      dispatch(fetchCreateNewChat(title.trim()));
      setIsCreating(false);
      setTitle("");
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setTitle("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && title.trim()) handleCreate();
    if (e.key === "Escape") handleCancel();
  };

  if (isCreating) {
    return (
      <div className="p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleCancel}
            placeholder="Title"
            autoFocus
            className="flex-1 px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500"
          />
          {title.trim() && (
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleCreate}
              className="px-3 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
            >
              Ok
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <button
        onClick={() => setIsCreating(true)}
        disabled={isDisabled}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
          isDisabled
            ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500 text-white"
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        New chat
      </button>
    </div>
  );
};

export default NewChatButton;
