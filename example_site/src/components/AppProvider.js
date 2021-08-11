import React, { useCallback, useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import KJUR from "jsrsasign";
import faker from "faker";

const AppContext = React.createContext({
  account: false,
  setAccount: () => {},
  closeEditor: () => {},
  purchaseVideo: () => {},
  embedRef: null,
  isEditorOpen: false,
  openEditor: () => {},
  partnerID: "test-partner",
  setPartnerID: () => {},
  partnerSecret: "zubbythewonderllamaeatsrhubarb",
  setPartnerSecret: () => {},
  editorNextURL: "/templates",
  setEditorNextURL: () => {},
  waymarkInstance: null,
  setWaymarkInstance: () => {},
  showCustomForm: false,
  setShowCustomForm: () => {},
  siteConfiguration: {},
  setSiteConfiguration: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [waymarkInstance, setWaymarkInstance] = useState(null);
  const [account, setAccount] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [partnerID, setPartnerID] = useState("fake-partner-id");
  const [partnerSecret, setPartnerSecret] = useState("zubbythewonderllamaeatsrhubarb");
  const [editorNextURL, setEditorNextURL] = useState("/templates");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [siteConfiguration, setSiteConfiguration] = useState({});

  const history = useHistory();
  const embedRef = React.useRef(null);

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

  const goHome = () => {
    console.log("HOME");
    setIsEditorOpen(false);
    history.push("/");
  };

  const getSignedJWT = (accountData, partnerID, partnerSecret) => {
    // Header
    const header = { alg: "HS256", typ: "JWT" };
    // Payload
    const payload = {
      jti: faker.random.uuid(),
      iss: partnerID,
      aud: "waymark.com",
      iat: KJUR.jws.IntDate.get("now"),
      exp: KJUR.jws.IntDate.get("now + 1hour"),
      "https://waymark.com/sdk/account": accountData,
    };
  
    // Sign JWT with our secret
    return KJUR.jws.JWS.sign(
      "HS256",
      JSON.stringify(header),
      JSON.stringify(payload),
      partnerSecret
    );
  };

  async function onResetWaymarkInstance() {
    await waymarkInstance.cleanup();
    setWaymarkInstance(null);
    setAccount(null);
    setEditorNextURL('/templates');
    setShowCustomForm(false);
}

  const value = {
    account,
    setAccount,
    closeEditor,
    purchaseVideo, 
    embedRef,
    goHome,
    getSignedJWT,
    onResetWaymarkInstance,
    isEditorOpen,
    openEditor,
    partnerID,
    setPartnerID,
    partnerSecret,
    setPartnerSecret,
    editorNextURL,
    setEditorNextURL,
    showCustomForm,
    setShowCustomForm,
    siteConfiguration,
    setSiteConfiguration,
    waymarkInstance,
    setWaymarkInstance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
