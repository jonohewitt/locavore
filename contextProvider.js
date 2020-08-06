import React, { useState } from 'react';

export const myContext = React.createContext();

const Provider = props => {
  const [isDark, setTheme] = useState(false);
  const [settingsOpen, toggleSettings] = useState(false);

  return (
    <myContext.Provider value={{
      isDark,
      changeTheme: () => setTheme(!isDark),
      settingsOpen,
      toggleSettings: () => toggleSettings(!settingsOpen)
    }}>
      {props.children}
    </myContext.Provider>
  )
};

export default ({ element }) => (
  <Provider>
    {element}
  </Provider>
);
