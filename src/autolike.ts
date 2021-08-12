// clicks the awesome-button if lame-button is not in the 'selected' state
function voteAwesome() {
  if (
    <HTMLElement>document.getElementsByClassName('lame-button selected')[0] ==
      undefined &&
    <HTMLElement>document.getElementsByClassName('awesome-button')[0]
  ) {
    (<HTMLElement>document.getElementsByClassName('awesome-button')[0]).click();
  }
}

let autoAwesome;

// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener((request) => {
  // onMessage must return "true" if response is async.
  const isResponseAsync = false;

  if (request.autoAwesome && request.message === 'enableAutoAwesome') {
    chrome.storage.sync.set({ autoAwesome: true }, function () {
      autoAwesome = setInterval(voteAwesome, 10000);
    });
  } else if (!request.autoAwesome && request.message === 'disableAutoAwesome') {
    chrome.storage.sync.set({ autoAwesome: false }, function () {
      clearInterval(autoAwesome);
    });
  }

  return isResponseAsync;
});

chrome.storage.sync.get('autoAwesome', function (result) {
  if (result['autoAwesome']) {
    autoAwesome = setInterval(voteAwesome, 10000);
  }
});
