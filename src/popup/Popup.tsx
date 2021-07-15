import React, { useCallback, useEffect, useState } from 'react';

export default function Popup(): JSX.Element {
  const [emotesEnabled, setEmotesEnabled] = useState(null);
  const [darkThemeEnabled, setDarkTheme] = useState(null);

  useEffect(() => {
    chrome.storage.sync.get(['emotesEnabled', 'darkThemeEnabled'], (result) => {
      setEmotesEnabled(result['emotesEnabled']);
      setDarkTheme(result['darkThemeEnabled']);
    });
  }, []);

  /* Emote Hook + Conditonal Rendering */

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

  /* Theme Hook + Conditonal Rendering */

  const changeThemeStatus = useCallback(() => {
    const currentThemeStatus = !darkThemeEnabled;
    setDarkTheme((darkThemeEnabled) => !darkThemeEnabled);
    const message: string = currentThemeStatus
      ? 'enableDarkTheme'
      : 'disableDarkTheme';
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        darkThemeEnabled: currentThemeStatus,
        message: message
      });
    });
  }, [darkThemeEnabled]);

  const themeButton = darkThemeEnabled ? (
    <input
      type="checkbox"
      name="darkthemeCheckbox"
      onChange={changeThemeStatus}
      checked
    />
  ) : (
    <input
      type="checkbox"
      name="darkthemeCheckbox"
      onChange={changeThemeStatus}
    />
  );

  return (
    <div style={{ width: '150px' }}>
      <h3>tt.fm+</h3>
      <br />
      Twitch Emotes
      {emotesButton}
      <br />
      Dark Theme
      {themeButton}
    </div>
  );
}
