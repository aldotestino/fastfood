import { ChakraProvider, theme } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import SocketProvider from './SocketProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <SocketProvider>
          <App />
        </SocketProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
