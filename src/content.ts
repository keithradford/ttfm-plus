const fetchData = () => {
  const emoteData = [];
  fetch('https://api.betterttv.net/3/cached/emotes/global', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response.json())
    .then((json) => {
      json.forEach((x) => {
        const tempObj = { name: x.code, id: x.id };
        emoteData.push(tempObj);
      });
    });

  return emoteData;
};

const processMessage = (text, HTML) => {
  emotes.forEach((x) => {
    if (text.includes(x.name)) {
      HTML = HTML.replaceAll(
        x.name,
        `<img src='https://cdn.betterttv.net/emote/${x.id}/1x' style="margin-right: 4px; margin-left: 4px;" alignItems='center'/>`
      );
      document.getElementById('current-emote-check').innerHTML = HTML;
    }
  });
};

const callback = function (mutationsList, observer) {
  let text;
  let HTML;
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      if (mutation.addedNodes.length > 0) {
        if (mutation.addedNodes[0].childNodes.length > 1) {
          // this is the case if its a new person
          text = mutation.addedNodes[0].lastChild.innerText;
          HTML = mutation.addedNodes[0].lastChild.innerHTML;
          mutation.addedNodes[0].lastChild.lastChild.id = 'current-emote-check';
        } else {
          // this is the case if someone types multiple messages before a new person types
          text = mutation.addedNodes[0].innerText;
          HTML = mutation.addedNodes[0].outerHTML;
          mutation.addedNodes[0].id = 'current-emote-check';
        }
        processMessage(text, HTML);
        document.querySelector('div#current-emote-check').removeAttribute('id');
      }
    }
  }
};

// define what element should be observed by the observer
// and what types of mutations trigger the callback
function addObserverIfDesiredNodeAvailable() {
  const targetNode = document.getElementsByClassName('messages')[0];
  if (!targetNode) {
    //The node we need does not exist yet.
    //Wait 500ms and try again
    window.setTimeout(addObserverIfDesiredNodeAvailable, 500);
    return;
  }
  const config = { childList: true, subtree: true, attributes: true };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}

const emotes = fetchData();
addObserverIfDesiredNodeAvailable();
