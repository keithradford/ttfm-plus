import React, { useCallback, useEffect, useState } from 'react';

export default function Popup(): JSX.Element {
  const [emotesEnabled, setEmotesEnabled] = useState(null);

  useEffect(() => {
    chrome.storage.sync.get(['emotesEnabled'], (result) => {
      setEmotesEnabled(result['emotesEnabled']);
    });
  }, []);

  const changeEmoteStatus = useCallback(() => {
    const currentEmoteStatus = !emotesEnabled; // setState is not guaranteed to mutate state immediately, need new value
    setEmotesEnabled((emotesEnabled) => !emotesEnabled);
    const message: string = currentEmoteStatus
      ? 'enableEmotes'
      : 'disableEmotes';
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        emotesEnabled: currentEmoteStatus,
        message: message
      });
    });
  }, [emotesEnabled]);

  const emotesButton = emotesEnabled ? (
    <input
      type="checkbox"
      name="emotesCheckbox"
      onChange={changeEmoteStatus}
      checked
    />
  ) : (
    <input type="checkbox" name="emotesCheckbox" onChange={changeEmoteStatus} />
  );

  return (
    <div style={{ width: '150px' }}>
      <h3>tt.fm+</h3>
      <br />
      Twitch Emotes
      {emotesButton}
    </div>
  );
}
