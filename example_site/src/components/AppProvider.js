import _ from "lodash";
import React, { useCallback, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";

import { theBlue } from "./constants";

const AppContext = React.createContext({
  account: false,
  setAccount: () => {},
  addTemplates: () => {},
  closeEditor: () => {},
  embedRef: null,
  isEditorOpen: false,
  openEditor: () => {},
  openSnackbar: () => {},
  partnerID: "test-partner",
  setPartnerID: () => {},
  purchaseVideo: () => {},
  purchasedVideo: null,
  templates: {},
  useSnackbar: () => {},
  waymarkInstance: null,
  setWaymarkInstance: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [waymarkInstance, setWaymarkInstance] = useState(null);
  const [account, setAccount] = useState(null);
  const [purchasedVideo, setPurchasedVideo] = useState(null);
  const [templates, setTemplates] = useState({});
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [partnerID, setPartnerID] = useState("fake-partner-id");
  const history = useHistory();
  const embedRef = React.useRef(null);

  const [openSnackbar] = useSnackbar({
    style: {
      backgroundColor: theBlue,
      textColor: "white",
      fontWeight: "bold",
      fontSize: "16px",
    },
  });

  const openEditor = useCallback(
    ({ template, video }) => {
      if (template) {
        waymarkInstance.openEditorForTemplate(template.id);
        setIsEditorOpen(true);
        history.push("/editor");
      }
    },
    [waymarkInstance, setIsEditorOpen, history]
  );

  const closeEditor = useCallback(() => {
    setIsEditorOpen(false);
    history.push("/collections");
  }, [setIsEditorOpen, history]);

  const purchaseVideo = useCallback(
    (video) => {
      setIsEditorOpen(false);
      setPurchasedVideo(video);
      history.push("/purchase");
    },
    [setIsEditorOpen, setPurchasedVideo, history]
  );

  const addTemplates = useCallback(
    (newTemplates) => {
      if (_.isEmpty(newTemplates)) return;

      const allTemplates = { ...templates };
      newTemplates.forEach((template) => {
        allTemplates[template.id] = template;
      });
      setTemplates(allTemplates);
    },
    [setTemplates]
  );

  const getTemplateByID = (templateID) => {
    return templates[templateID];
  };

  const goHome = () => {
    console.log("HOME");
    setIsEditorOpen(false);
    history.push("/");
  };

  const value = {
    account,
    setAccount,
    addTemplates,
    closeEditor,
    embedRef,
    getTemplateByID,
    goHome,
    isEditorOpen,
    openEditor,
    openSnackbar,
    partnerID,
    setPartnerID,
    purchaseVideo,
    purchasedVideo,
    waymarkInstance,
    setWaymarkInstance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
