import {
  IS_SEARCH_RESULT_ONLY_WITH_CONTEXT_DEFAULT,
  TOP_K_DEFAULT_VALUE,
  TOP_P_DEFAULT_VALUE,
} from "../../constants";

export const initialState = {
  isUseOnlyContextSearch: IS_SEARCH_RESULT_ONLY_WITH_CONTEXT_DEFAULT,
  topK: TOP_K_DEFAULT_VALUE,
  topP: TOP_P_DEFAULT_VALUE,
};
