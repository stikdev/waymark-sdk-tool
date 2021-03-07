import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";

import { theBlue } from "./constants";

const AppContext = React.createContext({
  waymarkInstance: null,
  setWaymarkInstance: () => {},
  account: false,
  setaccount: () => {},
  isEditorOpen: false,
  openEditor: () => {},
  closeEditor: () => {},
  purchaseVideo: () => {},
  purchasedVideo: null,
  templates: {},
  addTemplates: () => {},
  useSnackbar: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [waymarkInstance, setWaymarkInstance] = useState(null);
  const [account, setAccount] = useState(null);
  const [purchasedVideo, setPurchasedVideo] = useState(null);
  const [templates, setTemplates] = useState({});
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const history = useHistory();

  const [openSnackbar] = useSnackbar({
    style: {
      backgroundColor: theBlue,
      textColor: "white",
      fontWeight: "bold",
      fontSize: "16px",
    },
  });

  const openEditor = ({ template, video }) => {
    if (template) {
      waymarkInstance.openEditorForTemplate(template.id);
      setIsEditorOpen(true);
      history.push("/editor");
    }
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    history.push("/collections");
  };

  const purchaseVideo = (video) => {
    setIsEditorOpen(false);
    setPurchasedVideo(video);
    history.push("/purchase");
  };

  const addTemplates = (newTemplates) => {
    if (!newTemplates || !newTemplates.length) return;

    const allTemplates = {...templates};
    newTemplates.forEach((template) => {
      allTemplates[template.id] = template;
    });
    setTemplates(allTemplates);
  };

  const getTemplateByID = (templateID) => {
    return templates[templateID];
  };

  const goHome = () => {
    console.log("HOME");
    history.push("/");
  };

  const value = {
    waymarkInstance,
    setWaymarkInstance,
    account,
    setAccount,
    isEditorOpen,
    openEditor,
    closeEditor,
    purchaseVideo,
    purchasedVideo,
    getTemplateByID,
    addTemplates,
    goHome,
    openSnackbar,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
