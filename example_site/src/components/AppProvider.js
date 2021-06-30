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
  purchaseVideo: () => {},
  embedRef: null,
  isEditorOpen: false,
  openEditor: () => {},
  openSnackbar: () => {},
  partnerID: "test-partner",
  setPartnerID: () => {},
  partnerSecret: "test-secret",
  setPartnerSecret: () => {},
  purchasedVideo: null,
  setPurchasedVideo: () => {},
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
  const [partnerSecret, setPartnerSecret] = useState("test-secret");
  const history = useHistory();
  const embedRef = React.useRef(null);

  const [openSnackbar] = useSnackbar({
    style: {
      backgroundColor: theBlue,
      textColor: "white",
      fontWeight: "bold",
      fontSize: "16px",
      whiteSpace: "pre-wrap",
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
    if (purchasedVideo) {
      history.push("/");
    } else {
      history.push("/collections");
    }
  }, [setIsEditorOpen, history, purchasedVideo]);

  const purchaseVideo = useCallback(
    (video) => {
      setIsEditorOpen(false);
      setPurchasedVideo(video);
      history.push("/");
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
    purchaseVideo, 
    embedRef,
    getTemplateByID,
    goHome,
    isEditorOpen,
    openEditor,
    openSnackbar,
    partnerID,
    setPartnerID,
    partnerSecret,
    setPartnerSecret,
    purchasedVideo,
    setPurchasedVideo,
    waymarkInstance,
    setWaymarkInstance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
