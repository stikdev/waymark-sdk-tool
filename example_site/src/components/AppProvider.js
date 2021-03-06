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
  useSnackbar: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [waymarkInstance, setWaymarkInstance] = useState(null);
  const [account, setAccount] = useState(null);
  const [purchasedVideo, setPurchasedVideo] = useState(null);
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
    goHome,
    openSnackbar,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
