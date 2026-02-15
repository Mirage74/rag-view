import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import fetchCreateNewChat from "../../../features/fetch-async/fetchCreateNewChat";
import fetchAddNewUserEntry from "../../../features/fetch-async/fetchAddNewUserEntry";
import fetchGetChat from "../../../features/fetch-async/fetchGetChat";
import { generateTitleFromMessage } from "../utils/titleUtils";
import { MESSAGE_ROLE } from "../../../features/constants";

const ChatArea = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const { loadedFiles } = useSelector((state) => state.userDetails);
  const activeChatId = useSelector((state) => state.chats.activeChatId);
  const messages = useSelector((state) => state.chats.messages);
  const isWaitingResponse = useSelector(
    (state) => state.chats.isWaitingResponse,
  );
  const messagesEndRef = useRef(null);
  const { isUseOnlyContextSearch, topK, topP } = useSelector(
    (state) => state.ragConfig,
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    if (!activeChatId) {
      // No active chat - create a new one, then send the entry
      const title = generateTitleFromMessage(trimmedInput);
      dispatch(fetchCreateNewChat(title)).then((result) => {
        if (fetchCreateNewChat.fulfilled.match(result)) {
          const newChatId = result.payload.id;
          dispatch(
            fetchAddNewUserEntry({
              chatId: newChatId,
              content: trimmedInput,
              onlyContext: isUseOnlyContextSearch,
              topK,
              topP,
            }),
          ).then((entryResult) => {
            if (fetchAddNewUserEntry.fulfilled.match(entryResult)) {
              dispatch(fetchGetChat(newChatId));
            }
          });
        }
      });
    } else {
      // Active chat exists - send message to it
      dispatch(
        fetchAddNewUserEntry({
          chatId: activeChatId,
          content: trimmedInput,
          onlyContext: isUseOnlyContextSearch,
          topK,
          topP,
        }),
      ).then((result) => {
        if (fetchAddNewUserEntry.fulfilled.match(result)) {
          dispatch(fetchGetChat(activeChatId));
        }
      });
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
      {/* Messages area */}
      <div className="min-h-50 max-h-[60vh] overflow-y-auto mb-6 space-y-3">
        {!activeChatId || messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">
              {!activeChatId
                ? "Start a new conversation..."
                : "No messages yet"}
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === MESSAGE_ROLE.USER;
            return (
              <div
                key={index}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-xl text-sm whitespace-pre-wrap ${
                    isUser
                      ? "bg-indigo-600/60 text-white rounded-br-sm"
                      : "bg-slate-700/60 text-slate-200 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        {isWaitingResponse && (
          <div className="flex justify-start">
            <div className="bg-slate-700/60 px-4 py-2.5 rounded-xl rounded-bl-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
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
