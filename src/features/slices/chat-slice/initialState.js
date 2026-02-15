import { NO_ACTIVE_CHAT_ID } from "../../constants";

export const initialState = {
  chatList: [],
  activeChatId: NO_ACTIVE_CHAT_ID,
  activeTitle: "",
  messages: [],
  isWaitingResponse: false,
};
