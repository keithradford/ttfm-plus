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
    autoAwesome = setInterval(voteAwesome, 10000);
    chrome.storage.sync.set({ autoAwesome: true }, function () {
      console.log("Auto-awesomeing!");
    });
  } else if (!request.autoAwesome && request.message === 'disableAutoAwesome') {
    clearInterval(autoAwesome);
    chrome.storage.sync.set({ autoAwesome: false }, function () {
      console.log("Not auto-awesomeing.");
    });
  }

  return isResponseAsync;
});

chrome.storage.sync.get('autoAwesome', function (result) {
  if (result['autoAwesome']) {
    autoAwesome = setInterval(voteAwesome, 10000);
    console.log('Auto-Awesome Enabled.');
  }
});
