import React, { useEffect } from "react";
import "jsoneditor-react/es/editor.min.css";
import { Route } from "react-router-dom";

import TemplateBrowser from "./TemplateBrowser";
import ConfigurationControls from "./ConfigurationControls";
import { useAppContext } from "./AppProvider";
import "./App.css";
import Editor from "./Editor.js";
import { configurationIDs } from "../constants/app";

function App() {
  const {
    account,
    closeEditor,
    purchaseVideo,
    waymarkInstance,
    siteConfiguration,
    setEditorNextURL,
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
      // Temporary solution to redirecting to correct page after editor
      setEditorNextURL("/");
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
  }, [waymarkInstance, closeEditor, purchaseVideo, setEditorNextURL]);

  const getRootPathComponent = () => {
    if (!waymarkInstance) return (<ConfigurationControls />);

    const PostConfigurationComponent = siteConfiguration.navigations.postConfiguration;
    if (!account) return (<PostConfigurationComponent />);

    const PostEditorComponent = siteConfiguration.navigations.postEditor;
    return (<PostEditorComponent />);
  }
 
  return (
    <main>
      <Route exact path="/">
        {getRootPathComponent()}
      </Route>

      <Editor />

      <Route path="/templates">
        <TemplateBrowser 
          waymarkInstance={waymarkInstance} 
          isAdPortalFlow={siteConfiguration.id === configurationIDs.adPortal}
        />
      </Route>
    </main>
  );
}

export default App;
