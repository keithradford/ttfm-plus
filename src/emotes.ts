import { observer, addObserverIfNodeAvailable } from './utils/emotes';

// Handles button click events
chrome.runtime.onMessage.addListener((request) => {
  // onMessage must return "true" if response is async.
  const isResponseAsync = false;

  if (request.emotesEnabled && request.message === 'enableEmotes') {
    chrome.storage.sync.set({ emotesEnabled: true }, function () {
      addObserverIfNodeAvailable();
    });
  } else if (!request.emotesEnabled && request.message === 'disableEmotes') {
    chrome.storage.sync.set({ emotesEnabled: false }, function () {
      observer.disconnect();
    });
  }

  return isResponseAsync;
});

// Handles on page load if emotes are enabled
chrome.storage.sync.get('emotesEnabled', function (result) {
  if (result['emotesEnabled']) {
    addObserverIfNodeAvailable();
  }
});
