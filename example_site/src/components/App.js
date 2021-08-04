import React, { useEffect } from "react";
import "jsoneditor-react/es/editor.min.css";
import { Route } from "react-router-dom";

import AccountAuthentication from "./AccountAuthentication";
import AccountPage from "./AccountPage";
import TemplateBrowser from "./TemplateBrowser";
import ConfigurationControls from "./ConfigurationControls";
import PurchaseVideo from "./PurchaseVideo";
import AdPortalLanding from "./AdPortalLanding";
import AdPortalConfirmation from "./AdPortalConfirmation";
import { useAppContext } from "./AppProvider";
import "./App.css";
import Editor from "./Editor.js";

function App() {
  const {
    account,
    closeEditor,
    isEditorOpen,
    purchaseVideo,
    waymarkInstance,
  } = useAppContext();

  useEffect(() => {
    if (!waymarkInstance) {
      return;
    }

    waymarkInstance.on("editorOpened", (event) => {
      console.log("editorOpened", event);
    });
    waymarkInstance.on("editorOpenFailed", (event) => {
      console.log("editorOpenFailed", event);
    });
    waymarkInstance.on("editorExited", (event) => {
      console.log("editorExited", event);
      closeEditor();
    });
    waymarkInstance.on("videoCompleted", (event) => {
      console.log("videoCompleted", event);
      purchaseVideo(event);
    });
    waymarkInstance.on("videoRendered", (event) => {
      console.log("videoRendered", event);
    });
  }, [waymarkInstance, closeEditor, purchaseVideo]);
 
  return (
    <main>
      <ConfigurationControls />

      <Editor />

      <Route path="/editor">{ !isEditorOpen && "Editor is closed."}</Route>
      <Route path="/collections">
        <TemplateBrowser waymarkInstance={waymarkInstance} />
      </Route>

      <Route exact path="/">
        <div>
          {account ? (
            <AccountPage />
          ) : (
            waymarkInstance && <AccountAuthentication />
          )}
        </div>
      </Route>

      <Route path="/purchase">
        <PurchaseVideo />
      </Route>
    </main>
  );
}

export default App;
