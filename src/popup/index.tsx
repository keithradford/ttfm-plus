import { ChakraProvider } from '@chakra-ui/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { theme } from '../theme';
import { Popup } from './Popup';

chrome.tabs.query({ active: true, currentWindow: true }, () => {
  ReactDOM.render(
    <ChakraProvider theme={theme}>
      <Popup />
    </ChakraProvider>,
    document.getElementById('popup')
  );
});
