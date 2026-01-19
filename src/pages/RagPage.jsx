import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  switchSearchMode,
  setTopK,
  setTopP,
} from "../features/slices/rag-slice";
import fetchCreateNewChat from "../features/fetch-async/fetchCreateNewChat";
import {
  TOP_K_MIN_VALUE,
  TOP_K_DEFAULT_VALUE,
  TOP_K_MAX_VALUE,
  TOP_P_FAST_VALUE,
  TOP_P_DEFAULT_VALUE,
  TOP_P_SLOW_VALUE,
} from "../features/constants";

const RagPage = () => {
  const dispatch = useDispatch();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");

  // User details selectors
  const { userName, userEmail, loadedFiles, loading } = useSelector(
    (state) => state.userDetails,
  );

  // RAG config selectors
  const { isUseOnlyContextSearch, topK, topP } = useSelector(
    (state) => state.ragConfig,
  );

  // Mock chats data (replace with real data)
  const chats = [
    { id: 1, title: "Chat about RAG", date: "Today" },
    { id: 2, title: "Document analysis", date: "Yesterday" },
    { id: 3, title: "Query optimization", date: "Jan 15" },
  ];

  const handleSearchModeChange = () => {
    dispatch(switchSearchMode());
  };

  const handleTopKChange = (value) => {
    dispatch(setTopK(value));
  };

  const handleTopPChange = (value) => {
    dispatch(setTopP(value));
  };

  const handleNewChatClick = () => {
    setIsCreatingChat(true);
    setNewChatTitle("");
  };

  const handleCreateChat = () => {
    if (newChatTitle.trim()) {
      dispatch(fetchCreateNewChat(newChatTitle.trim()));
      setIsCreatingChat(false);
      setNewChatTitle("");
    }
  };

  const handleCancelCreate = () => {
    setIsCreatingChat(false);
    setNewChatTitle("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && newChatTitle.trim()) {
      handleCreateChat();
    } else if (e.key === "Escape") {
      handleCancelCreate();
    }
  };

  return (
    <div className="h-full bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-slate-900/80 border-r border-slate-700/50 flex flex-col backdrop-blur-sm">
        {/* New Chat Button / Input */}
        <div className="p-3">
          {isCreatingChat ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleCancelCreate}
                placeholder="Title"
                autoFocus
                className="flex-1 px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500"
              />
              {newChatTitle.trim() && (
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleCreateChat}
                  className="px-3 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                >
                  Ok
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={handleNewChatClick}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
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
          )}
        </div>

        {/* Chats Section */}
        <div className="flex-1 overflow-y-auto px-3">
          <div className="flex items-center gap-2 px-2 py-2 text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm font-medium">Chats</span>
          </div>

          {/* Chat List */}
          <div className="space-y-1">
            {chats.map((chat) => (
              <button
                key={chat.id}
                className="w-full text-left px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors group"
              >
                <p className="text-sm truncate">{chat.title}</p>
                <p className="text-xs text-slate-500 group-hover:text-slate-400">
                  {chat.date}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Dropdown at Bottom */}
        <div className="p-3 pb-4 border-t border-slate-700/50 shrink-0 relative">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm font-medium">Settings</span>
            </div>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${isSettingsOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>

          {/* Settings Dropdown Content */}
          {isSettingsOpen && (
            <div className="mt-2 bg-slate-800/80 rounded-lg border border-slate-700/50 p-3 space-y-3">
              {/* Search Mode */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Search Mode
                </h4>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="searchMode"
                      checked={isUseOnlyContextSearch}
                      onChange={handleSearchModeChange}
                      className="w-3 h-3 text-indigo-500 bg-slate-700 border-slate-600"
                    />
                    <span className="text-slate-300">Only context</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="searchMode"
                      checked={!isUseOnlyContextSearch}
                      onChange={handleSearchModeChange}
                      className="w-3 h-3 text-indigo-500 bg-slate-700 border-slate-600"
                    />
                    <span className="text-slate-300">Allow external</span>
                  </label>
                </div>
              </div>

              {/* Top K */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Top K
                </h4>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="topK"
                      checked={topK === TOP_K_MIN_VALUE}
                      onChange={() => handleTopKChange(TOP_K_MIN_VALUE)}
                      className="w-3 h-3 text-indigo-500 bg-slate-700 border-slate-600"
                    />
                    <span className="text-slate-300">Precise</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="topK"
                      checked={topK === TOP_K_DEFAULT_VALUE}
                      onChange={() => handleTopKChange(TOP_K_DEFAULT_VALUE)}
                      className="w-3 h-3 text-indigo-500 bg-slate-700 border-slate-600"
                    />
                    <span className="text-slate-300">Default</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="topK"
                      checked={topK === TOP_K_MAX_VALUE}
                      onChange={() => handleTopKChange(TOP_K_MAX_VALUE)}
                      className="w-3 h-3 text-indigo-500 bg-slate-700 border-slate-600"
                    />
                    <span className="text-slate-300">Extended</span>
                  </label>
                </div>
              </div>

              {/* Top P */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Top P
                </h4>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="topP"
                      checked={topP === TOP_P_FAST_VALUE}
                      onChange={() => handleTopPChange(TOP_P_FAST_VALUE)}
                      className="w-3 h-3 text-indigo-500 bg-slate-700 border-slate-600"
                    />
                    <span className="text-slate-300">Fast</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="topP"
                      checked={topP === TOP_P_DEFAULT_VALUE}
                      onChange={() => handleTopPChange(TOP_P_DEFAULT_VALUE)}
                      className="w-3 h-3 text-indigo-500 bg-slate-700 border-slate-600"
                    />
                    <span className="text-slate-300">Default</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="topP"
                      checked={topP === TOP_P_SLOW_VALUE}
                      onChange={() => handleTopPChange(TOP_P_SLOW_VALUE)}
                      className="w-3 h-3 text-indigo-500 bg-slate-700 border-slate-600"
                    />
                    <span className="text-slate-300">Large scan</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              RAG Query
            </h1>
            <div className="h-1 w-24 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full mt-2" />
          </header>

          {/* User Info Section */}
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

          {/* Warning if no files */}
          {(!loadedFiles || loadedFiles.length === 0) && (
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
              <p className="text-amber-200 font-medium">
                Unable to make RAG query
              </p>
              <p className="text-amber-300/70 text-sm mt-1">
                Please upload at least one context file first
              </p>
            </div>
          )}

          {/* Chat area placeholder */}
          {loadedFiles && loadedFiles.length > 0 && (
            <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/40 text-center">
              <p className="text-slate-400">Start a conversation...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RagPage;
