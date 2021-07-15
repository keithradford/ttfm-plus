import { emotes } from './emote_list';

const parseMessage = (text, HTML) => {
  const emotesInMessage = [];
  const messageString = text.split(' ');

  // determine the emotes within the message
  emotes.forEach(({ name, id }) => {
    if (text.includes(name)) {
      emotesInMessage.push({ name, id });
    }
  });

  messageString.forEach((word: string) => {
    emotesInMessage.forEach((emote) => {
      if (word === emote.name) {
        HTML = HTML.replace(
          emote.name,
          `<img src='https://cdn.betterttv.net/emote/${emote.id}/1x' class="emote" />`
        );
        document.getElementById('current-emote-check').innerHTML = HTML;
      }
    });
  });
};

const mutationCallback = (mutationsList) => {
  let text, HTML;

  for (const mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      console.log(mutation);

      if (
        mutation.addedNodes[0].childNodes.length > 1 &&
        mutation.addedNodes[0].className === 'message'
      ) {
        // this is the case if its a message from new person
        if (mutation.addedNodes[0].lastChild.className === 'textContainer') {
          text = mutation.addedNodes[0].lastChild.innerText; // div.textContainer
          HTML = mutation.addedNodes[0].lastChild.innerHTML;
          mutation.addedNodes[0].lastChild.lastChild.id = 'current-emote-check'; // div.text
        }
      } else {
        // this is the case if someone types multiple messages before a new person types
        if (mutation.addedNodes[0].className === 'text') {
          text = mutation.addedNodes[0].innerText; // div.text
          HTML = mutation.addedNodes[0].outerHTML;
          mutation.addedNodes[0].id = 'current-emote-check';
        }
      }
      try {
        parseMessage(text, HTML);
        document.getElementById('current-emote-check').removeAttribute('id');
      } catch {
        // this catches a type error that would be thrown by document.getElementById due to a callback of a callback
        return;
      }
    }
  }
};

// define what element should be observed by the observer
// and what types of mutations trigger the callback
const addObserverIfDesiredNodeAvailable = () => {
  const targetNode = document.getElementsByClassName('messages')[0];
  if (!targetNode) {
    // The node we need does not exist yet.
    // Wait 500ms and try again
    window.setTimeout(addObserverIfDesiredNodeAvailable, 500);
    return;
  }
  const config = { childList: true, subtree: true, attributes: false };
  const observer = new MutationObserver(mutationCallback);
  observer.observe(targetNode, config);
};

addObserverIfDesiredNodeAvailable();
