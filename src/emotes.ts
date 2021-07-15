import { emotes } from './static/emote_list';

/* -------------------- HELPER FUNCTIONS -------------------- */

const parseMessage = (text: string, HTML: string) => {
  const emotesInMessage = [];
  const messageString = text.split(' ');

  // determine which emotes are within the message
  emotes.forEach(({ name, id }) => {
    if (text.includes(name)) {
      emotesInMessage.push({ name, id });
    }
  });

  // compare each word in the message with the emotes, if there is an exact match, replace them
  messageString.forEach((word) => {
    emotesInMessage.forEach(({ name, id }) => {
      if (word === name) {
        HTML = HTML.replace(
          name,
          `<img src='https://cdn.betterttv.net/emote/${id}/1x' class="emote" />`
        );
        document.getElementById('current-message').innerHTML = HTML;
      }
    });
  });
};

const mutationCallback = (mutationsList) => {
  let text: string, HTML: string;

  for (const mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      if (
        mutation.addedNodes[0].childNodes.length > 1 &&
        mutation.addedNodes[0].className === 'message'
      ) {
        // this is the case if its the first message from new person
        text = mutation.addedNodes[0].lastChild.innerText; // div.textContainer
        HTML = mutation.addedNodes[0].lastChild.innerHTML;
        mutation.addedNodes[0].lastChild.lastChild.id = 'current-message'; // div.text
      } else {
        // this is the case if someone types multiple messages before a new person types
        text = mutation.addedNodes[0].innerText; // div.text
        HTML = mutation.addedNodes[0].outerHTML;
        mutation.addedNodes[0].id = 'current-message';
      }
      try {
        parseMessage(text, HTML);
        document.getElementById('current-message').removeAttribute('id');
      } catch {
        // this catches a TypeError that is thrown by document.getElementById due to a callback of a callback
        return;
      }
    }
  }
};

// This gets the targetNode the MutationObserver needs to watch
const addObserverIfNodeAvailable = () => {
  const targetNode = document.getElementsByClassName('messages')[0];
  if (!targetNode) {
    // The node we need does not exist yet.
    // Wait 500ms and try again
    window.setTimeout(addObserverIfNodeAvailable, 500);
    return;
  }

  const config = { childList: true, subtree: true, attributes: false };
  observer = new MutationObserver(mutationCallback);
  observer.observe(targetNode, config);
};

/* ---------------------------------------------------------- */

/* ----------------------- MAIN DRIVER ---------------------- */

// global variable for the MutationObserver
let observer: MutationObserver;

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

/* ---------------------------------------------------------- */
