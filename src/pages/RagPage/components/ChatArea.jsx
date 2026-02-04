import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import fetchCreateNewChat from "../../../features/fetch-async/fetchCreateNewChat";
import fetchAddNewUserEntry from "../../../features/fetch-async/fetchAddNewUserEntry";
import { generateTitleFromMessage } from "../utils/titleUtils";

const ChatArea = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const { loadedFiles } = useSelector((state) => state.userDetails);
  const activeChatId = useSelector((state) => state.chats.activeChatId);

  const handleSendMessage = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    if (!activeChatId) {
      // No active chat - create a new one with auto-generated title
      const title = generateTitleFromMessage(trimmedInput);
      dispatch(fetchCreateNewChat(title, trimmedInput));
    } else {
      // Active chat exists - send message to it
      dispatch(
        fetchAddNewUserEntry({ chatId: activeChatId, content: trimmedInput }),
      );
    }

    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
    <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/40">
      {/* Messages area - placeholder for future messages */}
      <div className="min-h-50 flex items-center justify-center mb-6">
        {!activeChatId ? (
          <p className="text-slate-500">Start a new conversation...</p>
        ) : (
          <p className="text-slate-500">Chat messages will appear here</p>
        )}
      </div>

      {/* Input area */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            activeChatId ? "Type your message..." : "Start a conversation..."
          }
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-600/50 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          className={`p-3 rounded-xl transition-all ${
            inputValue.trim()
              ? "bg-linear-to-br from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white shadow-lg shadow-orange-500/25"
              : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
          }`}
          aria-label="Send message"
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
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
