// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener((request) => {
  // onMessage must return "true" if response is async.
  const isResponseAsync = false;

  if (request.popupMounted) {
    alert('eventPage notified that Popup.tsx has mounted.');
  }

  return isResponseAsync;
});
