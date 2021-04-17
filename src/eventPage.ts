// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener((request) => {
  // onMessage must return "true" if response is async.
  const isResponseAsync = false;

  if (request.popupMounted) {
    console.log('eventPage notified that Popup.tsx has mounted.');
  }

  const avatar: HTMLCollectionOf<Element> = document.getElementsByClassName(
    'avatar'
  );
  for (let i = 0, l = avatar.length; i < l; i++) {
    console.log(avatar);
    avatar[i].setAttribute(
      'style',
      'background-image: url("https://cdn.discordapp.com/emojis/738485733144395858.png?v=1")'
    );
  }

  return isResponseAsync;
});
