import React, { createContext, Dispatch, SetStateAction, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

export const ContextData = createContext({
  contextData: {pageCode: ''},
  setContextData: (() => {}) as Dispatch<SetStateAction<any>>
});

export const ContextProvider = ({ children }: any) => {
  const [contextData, setContextData] = useState({pageCode: ''});

  return (
    <ContextData.Provider value={{ contextData, setContextData }}>
      {children}
    </ContextData.Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>,
);
