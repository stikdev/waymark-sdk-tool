import React, { useEffect } from "react";
import "jsoneditor-react/es/editor.min.css";
import { Link, Route } from "react-router-dom";
import classnames from "classnames";

import Waymark from "@waymark/waymark-sdk";
import AccountForm from "./AccountForm";
import AccountPage from "./AccountPage";
import Collections from "./Collections";
import PurchaseVideo from "./PurchaseVideo";
import { useAppContext } from "./AppProvider";
import "./App.css";

const PARTNER_ID = "spectrum-reach";

function App() {
  const {
    waymarkInstance,
    setWaymarkInstance,
    account,
    isEditorOpen,
    closeEditor,
    purchaseVideo,
    openSnackbar,
  } = useAppContext();
  const embedRef = React.createRef();

  useEffect(() => {
    if (waymarkInstance) return;

    const waymarkOptions = {
      domElement: embedRef.current,
      editor: {
        orientation: "left",
        labels: {
          completeVideo: "Complete your video",
          exitEditor: "Exit the editor",
          videoName: "Custom Video Name",
        },
      },
      testJWTSecret: "test-partner-secret",
      environment: "local",
      timeout: 5000,
    };

    const newWaymarkInstance = new Waymark(PARTNER_ID, waymarkOptions);
    setWaymarkInstance(newWaymarkInstance);
    console.log(newWaymarkInstance);
  }, [embedRef, setWaymarkInstance, waymarkInstance]);

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

  const embedClasses = classnames({
    embedded: waymarkInstance,
    visible: isEditorOpen,
  });

  return (
    <main>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/collections">Collections</Link>
          </li>
          <li>
            {account
              ? `Account : ${account.firstName} ${account.lastName}`
              : "<no account>"}
          </li>
        </ul>
      </nav>

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
