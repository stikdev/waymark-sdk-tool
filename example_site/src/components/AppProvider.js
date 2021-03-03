import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

const AppContext = React.createContext({
  waymarkInstance: null,
  setWaymarkInstance: () => {},
  isEditorOpen: false,
  setIsEditorOpen: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({children}) => {
  const [waymarkInstance, setWaymarkInstance] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const history = useHistory();

  const openEditor = ({template, video}) => {
    if (template) {
      waymarkInstance.openEditorForTemplate(template.id);
      setIsEditorOpen(true);
      history.push("/editor");
    }
  };
  const value = {
    waymarkInstance,
    setWaymarkInstance,
    isEditorOpen,
    openEditor,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
