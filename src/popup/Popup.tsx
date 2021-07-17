import { Container, Divider, Heading, VStack } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { LabeledSwitch } from '../components/LabeledSwitch';

export function Popup(): JSX.Element {
  const [emotesEnabled, setEmotesEnabled] = useState(null);

  useEffect(() => {
    chrome.storage.sync.get(['emotesEnabled'], (result) => {
      setEmotesEnabled(result['emotesEnabled']);
    });
  }, []);

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

  return (
    <Container w="25em" h="15em" bgColor="#243454" color="#a37b04">
      <Heading>tt.fm+</Heading>
      <Divider mb="1em" />
      <VStack justifyContent="space-between">
        <LabeledSwitch
          label="twitch emotes"
          name="emotes-switch"
          isChecked={emotesEnabled}
          onChange={changeEmoteStatus}
        />
        <LabeledSwitch label="test" name="test-switch" />
      </VStack>
    </Container>
  );
}
