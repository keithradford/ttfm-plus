import { ChakraProvider } from '@chakra-ui/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Popup } from './Popup';

chrome.tabs.query({ active: true, currentWindow: true }, () => {
  ReactDOM.render(
    <ChakraProvider>
      <Popup />
    </ChakraProvider>,
    document.getElementById('popup')
  );
});
