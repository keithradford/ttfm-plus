import React, { useEffect, useState, useCallback } from 'react';
import { getCurrentTabUrl } from '../utils';

export default function Popup(): JSX.Element {
  const [url, setUrl] = useState<string>('');

  const [autolikeEnabled, setAutolikeEnabled] = useState(null);

  useEffect(() => {
    getCurrentTabUrl((url) => {
      setUrl(url || 'undefined');
    });
    chrome.storage.sync.get(['autoAwesome'], (result) => {
      setAutolikeEnabled(result['autoAwesome']);
    });
  }, []);

  const sendAMessage = () => {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ popupMounted: true });
  };

  const changeAutolike = useCallback(() => {
    const currentLikeStatus = !autolikeEnabled;
    setAutolikeEnabled((autolikeEnabled) => !autolikeEnabled);
    const message = currentLikeStatus
      ? 'enableAutoAwesome'
      : 'disableAutoAwesome';
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        autoAwesome: currentLikeStatus,
        message: message
      });
    });
  }, [autolikeEnabled]);

  const autoLikeButton = autolikeEnabled ? (
    <input
      type="checkbox"
      name="autolikeCheckbox"
      onChange={changeAutolike}
      checked
    />
  ) : (
    <input type="checkbox" name="autolikeCheckbox" onChange={changeAutolike} />
  );

  return (
    <div>
      Hello, {url}! <button onClick={sendAMessage}>yo</button>
      <br />
      Auto-Awesome
      {autoLikeButton}
    </div>
  );
}
