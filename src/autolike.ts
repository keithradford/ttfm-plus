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

  if (request.isEnabled) {
    autoAwesome = setInterval(voteAwesome, 10000);
  } else {
    clearInterval(autoAwesome);
  }

  return isResponseAsync;
});
