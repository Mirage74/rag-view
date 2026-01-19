let currentAbortController = null;

export const getAbortController = () => currentAbortController;

export const createAbortController = () => {
  currentAbortController = new AbortController();
  return currentAbortController;
};

export const abortAndClear = () => {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
};

export const clearAbortController = () => {
  currentAbortController = null;
};
