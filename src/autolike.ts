import { setupAutolike } from './utils/autolike';

setupAutolike();

// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener((request) => {
  // onMessage must return "true" if response is async.
  const isResponseAsync = false;

  if (request.autoAwesome && request.message === 'enableAutoAwesome') {
    chrome.storage.sync.set({ autoAwesome: true }, function () {
      (<HTMLElement>document.querySelector('#init_autolike')).click();
    });
  } else if (!request.autoAwesome && request.message === 'disableAutoAwesome') {
    chrome.storage.sync.set({ autoAwesome: false }, function () {
      (<HTMLElement>document.querySelector('#destruct_autolike')).click();
    });
  }

  return isResponseAsync;
});

chrome.storage.sync.get('autoAwesome', function (result) {
  if (result['autoAwesome']) {
    // Delay so setupAutolike can run first
    setTimeout(() => {
      (<HTMLElement>document.querySelector('#init_autolike')).click();
    }, 2000);
  }
});