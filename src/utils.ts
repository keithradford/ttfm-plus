export const getCurrentTabUrl = (
  callback: (url: string | undefined) => void
): void => {
  const queryInfo = { active: true, lastFocusedWindow: true };

  chrome.tabs &&
    chrome.tabs.query(queryInfo, (tabs) => {
      callback(tabs[0].url);
    });
};
