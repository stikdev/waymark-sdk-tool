import React, { useEffect, useState } from "react";
import "jsoneditor-react/es/editor.min.css";
import { Link, Route } from "react-router-dom";
import classnames from "classnames";

import AccountForm from "./AccountForm";
import AccountPage from "./AccountPage";
import Collections from "./Collections";
import ConfigurationControls from "./ConfigurationControls";
import PurchaseVideo from "./PurchaseVideo";
import { useAppContext } from "./AppProvider";
import "./App.css";

function App() {
  const {
    account,
    closeEditor,
    embedRef,
    isEditorOpen,
    openSnackbar,
    purchaseVideo,
    waymarkInstance,
  } = useAppContext();

  const [isConfigurationOpen, setIsConfigurationOpen] = useState(true);

  useEffect(() => {
    if (!waymarkInstance) {
      return;
    }

    setIsConfigurationOpen(false);

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

  const embedClasses = classnames({
    embedded: waymarkInstance,
    visible: isEditorOpen,
  });

  return (
    <main>
      <nav className="navbar">
        <ul>
          <li data-test-id="navbar-home">
            <Link to="/">Home</Link>
          </li>
          <li data-test-id="navbar-collections">
            <Link to="/collections">Collections</Link>
          </li>
          <li data-test-id="navbar-account">
            {account
              ? `Account : ${account.firstName} ${account.lastName}`
              : "<no account>"}
          </li>
          <li>
            {" "}
            <button
              className="hide-configuration"
              onClick={() => setIsConfigurationOpen(!isConfigurationOpen)}
            >
              {isConfigurationOpen
                ? "Hide Configuration"
                : "Show Configuration"}
            </button>
          </li>
        </ul>
      </nav>

      <ConfigurationControls isOpen={isConfigurationOpen} />

      <div
        id="waymark-embed-container"
        className={embedClasses}
        ref={embedRef}
      ></div>

      <Route path="/editor">{!isEditorOpen && "Editor is closed."}</Route>
      <Route path="/collections">
        <Collections waymarkInstance={waymarkInstance} />
      </Route>

      <Route exact path="/">
        <div className="webhook-testing-container">
          {account ? <AccountPage /> : waymarkInstance && <AccountForm />}
        </div>
      </Route>

      <Route path="/purchase">
        <PurchaseVideo />
      </Route>
    </main>
  );
}

export default App;
