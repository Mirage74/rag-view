export const reducers = {
  switchSearchMode(state) {
    state.isUseOnlyContextSearch = !state.isUseOnlyContextSearch;
  },

  setTopK(state, action) {
    state.topK = action.payload;
  },

  setTopP(state, action) {
    state.topP = action.payload;
  },
};
