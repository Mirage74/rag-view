import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import fetchGetChatList from "../../features/fetch-async/fetchGetChatList";

import Sidebar from "./components/Sidebar";
import UserProfile from "./components/UserProfile";
import ChatArea from "./components/ChatArea";

const RagPage = () => {
  const dispatch = useDispatch();
  const chatList = useSelector((state) => state.chats.chatList);

  const sortedChats = [...chatList].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  useEffect(() => {
    if (chatList.length === 0) {
      dispatch(fetchGetChatList());
    }
  }, [dispatch, chatList.length]);

  return (
    <div className="h-full bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 flex">
      <Sidebar chats={sortedChats} />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              RAG Query
            </h1>
            <div className="h-1 w-24 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full mt-2" />
          </header>

          <UserProfile />
          <ChatArea />
        </div>
      </main>
    </div>
  );
};

export default RagPage;
