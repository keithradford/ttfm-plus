import { Container, Divider, Heading, VStack } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { LabeledSwitch } from '../components/LabeledSwitch';

export function Popup(): JSX.Element {
  const [emotesEnabled, setEmotesEnabled] = useState(false);
  const [darkThemeEnabled, setDarkTheme] = useState(false);
  const [autolikeEnabled, setAutolikeEnabled] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(
      ['emotesEnabled', 'darkThemeEnabled', 'autoAwesome'],
      (result) => {
        setEmotesEnabled(result['emotesEnabled']);
        setDarkTheme(result['darkThemeEnabled']);
        setAutolikeEnabled(result['autoAwesome']);
      }
    );
  }, []);

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

  const changeEmoteStatus = useCallback(() => {
    // setState is not guaranteed to mutate state immediately, need new value
    const currentEmoteStatus = !emotesEnabled;
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

  return (
    <Container w="25em" h="fit-content" bgColor="#243454" color="#a37b04">
      <Heading>tt.fm+</Heading>
      <Divider mb="1em" />
      <VStack justifyContent="space-between" pb="1em">
        <LabeledSwitch
          label="twitch emotes"
          name="emotes-switch"
          isChecked={emotesEnabled}
          onChange={changeEmoteStatus}
        />
        <LabeledSwitch
          label="auto-awesome"
          name="auto-awesome-switch"
          onChange={changeAutolike}
          isChecked={autolikeEnabled}
        />
        <LabeledSwitch
          label="dark mode"
          name="dark-mode-switch"
          onChange={changeThemeStatus}
          isChecked={darkThemeEnabled}
        />
      </VStack>
    </Container>
  );
}
