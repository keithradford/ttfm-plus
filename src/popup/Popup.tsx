import React, { useEffect, useState, useCallback } from 'react';
import { getCurrentTabUrl } from '../utils';

export default function Popup(): JSX.Element {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    getCurrentTabUrl((url) => {
      setUrl(url || 'undefined');
    });
  }, []);

  const sendAMessage = () => {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ popupMounted: true });
  };

  const [isEnabled, setIsEnabled] = useState(true);
  
  const changeAutolike = useCallback(() => {
    setIsEnabled(!isEnabled);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {isEnabled: isEnabled});
    });
  }, [isEnabled]);

  return (
    <div>
      Hello, {url}! <button onClick={sendAMessage}>yo</button>
      <br>
      </br>
      Auto-Awesome <input type="checkbox" name="autolikeCheckbox" onChange={changeAutolike} />
    </div>
  );
}

