import { formatDate } from "../utils/formatDate";

const ChatList = ({ chats }) => {
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
        {chats.map((chat) => (
          <button
            key={chat.id}
            className="w-full text-left px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors group"
          >
            <p className="text-sm truncate">{chat.title}</p>
            <p className="text-xs text-slate-500 group-hover:text-slate-400">
              {formatDate(chat.createdAt)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
