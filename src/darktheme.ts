import { addDarkThemeCSS, removeDarkThemeCSS } from './darktheme_utils';

// Handles input
chrome.runtime.onMessage.addListener((request) => {
  // onMessage must return "true" if response is async.
  const isResponseAsync = false;

  if (request.darkThemeEnabled && request.message === 'enableDarkTheme') {
    chrome.storage.sync.set({ darkThemeEnabled: true }, function () {
      addDarkThemeCSS();
    });
  } else if (
    !request.darkThemeEnabled &&
    request.message === 'disableDarkTheme'
  ) {
    chrome.storage.sync.set({ darkThemeEnabled: false }, function () {
      removeDarkThemeCSS();
    });
  }

  return isResponseAsync;
});

// Handles on page load if dark theme is enabled
chrome.storage.sync.get('darkThemeEnabled', function (result) {
  if (result['darkThemeEnabled']) {
    addDarkThemeCSS();
  }
});
