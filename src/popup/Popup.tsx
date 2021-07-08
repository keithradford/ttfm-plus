import React, { useEffect, useState } from 'react';
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

  return (
    <div>
      Hello, {url}! <button onClick={sendAMessage}>yo</button>
    </div>
  );
}
