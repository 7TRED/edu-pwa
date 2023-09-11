import React from 'react';
import logo from './logo.svg';
import './App.css';
import ChatPage from './pages/ChatPage';
import { MessagesContextProvider } from './context/MessagesContext';

function App() {
  return (
    <MessagesContextProvider>
      <ChatPage/>
    </MessagesContextProvider>
  );
}

export default App;
