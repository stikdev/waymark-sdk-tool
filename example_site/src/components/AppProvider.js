import _ from "lodash";
import React, { useCallback, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";

import { blueColor } from "../constants/app";

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
  editorNextURL: "/collections",
  setEditorNextURL: () => {},
  templates: {},
  useSnackbar: () => {},
  waymarkInstance: null,
  setWaymarkInstance: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [waymarkInstance, setWaymarkInstance] = useState(null);
  const [account, setAccount] = useState(null);
  const [templates, setTemplates] = useState({});
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [partnerID, setPartnerID] = useState("fake-partner-id");
  const [partnerSecret, setPartnerSecret] = useState("test-secret");
  const [editorNextURL, setEditorNextURL] = useState("/collections");
  const history = useHistory();
  const embedRef = React.useRef(null);

  const [openSnackbar] = useSnackbar({
    style: {
      backgroundColor: blueColor,
      textColor: "white",
      fontWeight: "bold",
      fontSize: "16px",
      whiteSpace: "pre-wrap",
    },
  });

  const openEditor = useCallback(
    ({ template }) => {
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
    history.push(editorNextURL);
  }, [setIsEditorOpen, history, editorNextURL]);

  const purchaseVideo = useCallback(() => {
      setEditorNextURL("/");
      setIsEditorOpen(false);
    }, [setIsEditorOpen, setEditorNextURL]);

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
    editorNextURL,
    setEditorNextURL,
    waymarkInstance,
    setWaymarkInstance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
