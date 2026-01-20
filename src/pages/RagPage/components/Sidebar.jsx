import NewChatButton from "./NewChatButton";
import ChatList from "./ChatList";
import SettingsPanel from "./SettingsPanel";

const Sidebar = ({ chats }) => {
  return (
    <aside className="w-64 bg-slate-900/80 border-r border-slate-700/50 flex flex-col backdrop-blur-sm">
      <NewChatButton />
      <ChatList chats={chats} />
      <SettingsPanel />
    </aside>
  );
};

export default Sidebar;
