import { useSelector, useDispatch } from "react-redux";
import { setActiveChat } from "../../../features/slices/chat-slice";
import { formatDate } from "../utils/formatDate";
import fetchDeleteChat from "../../../features/fetch-async/fetchDeleteChat";

const ChatList = ({ chats }) => {
  const dispatch = useDispatch();
  const activeChatId = useSelector((state) => state.chats.activeChatId);

  const handleChatClick = (chat) => {
    dispatch(setActiveChat(chat));
  };

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    dispatch(fetchDeleteChat(chatId));
  };

  // Sort chats: active chat first, then by date
  const sortedChats = [...chats].sort((a, b) => {
    if (a.id === activeChatId) return -1;
    if (b.id === activeChatId) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
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

      <div className="space-y-1">
        {sortedChats.map((chat) => {
          const isActive = chat.id === activeChatId;

          return (
            <button
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors group flex items-center justify-between gap-2 ${
                isActive
                  ? "bg-indigo-600/30 text-indigo-200 border border-indigo-500/40"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{chat.title}</p>
                <p
                  className={`text-xs ${
                    isActive
                      ? "text-indigo-400/70"
                      : "text-slate-500 group-hover:text-slate-400"
                  }`}
                >
                  {formatDate(chat.createdAt)}
                </p>
              </div>
              <button
                onClick={(e) => handleDeleteChat(e, chat.id)}
                className={`shrink-0 p-1.5 rounded-md transition-colors ${
                  isActive
                    ? "hover:bg-red-500/20 text-indigo-300 hover:text-red-400"
                    : "hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                }`}
                aria-label="Delete chat"
              >
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
