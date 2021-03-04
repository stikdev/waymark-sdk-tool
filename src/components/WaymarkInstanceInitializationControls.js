import { useState } from "react";
import { JsonEditor } from "jsoneditor-react";

import Waymark, { TestModeWaymark } from "@waymark/waymark-sdk";

const DEFAULT_OPTIONS = {
  domElement: "#waymark-embed-container",
  editor: {
    orientation: "left",
    labels: {
      completeVideo: "Complete your video",
      exitEditor: "Exit the editor",
      videoName: "Custom Video Name",
    },
  },
  testJWTSecret: "test-secret",
  timeout: 5000,
};

const ENVIRONMENTS = {
  'harness': 'harness',
  'local': 'local',
  'demo': 'demo',
  'prod': 'prod',
  'custom': 'custom',
}

/**
 * Form provides controls to configure and create a new Waymark instance
 */
export default function WaymarkInstanceInitializationControls({
  setWaymarkInstance,
  waymarkInstance,
}) {
  // Config to pass in for theming the editor. Managed by a JsonEditor component
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [environment, setEnvironment] = useState(ENVIRONMENTS.harness);

  return (
    <form
      id="waymark-object-controls"
      onSubmit={async (event) => {
        event.preventDefault();

        // If there's already a Waymark Instance, remove it and return
        if (waymarkInstance) {
          waymarkInstance.cleanup().then(() => setWaymarkInstance(null));
          return;
        }

        const formElement = event.target;
        const partnerID = formElement.partnerID.value;          
        
        // Construct options with either a preset env slug or a custom environment host object.
        const waymarkOptions = {
          ...options,
          environment:
            environment === ENVIRONMENTS.custom
              ? { host: formElement.overrideHost.value }
              : environment,
        }; 

        const domElement = document.querySelector(waymarkOptions.domElement);
        
        let waymarkObject;
        // Create a new Waymark instance with our config
        if (environment === ENVIRONMENTS.harness) {
          waymarkObject = new TestModeWaymark(partnerID, {
            ...waymarkOptions,
            domElement,
          });
        } else {
          waymarkObject = new Waymark(partnerID, {
            ...waymarkOptions,
            domElement,
          });
        }

        try {
          await waymarkObject.connectionPromise;
          setWaymarkInstance(waymarkObject);
        } catch (error) {
          console.error("Failed to connect to Waymark");
          waymarkObject.cleanup();
        }
      }}
    >
      <h2>Waymark Embed Config</h2>

      <nav className="navbar">
        <ul>
          <li><a href="#">Test Site</a></li>
        </ul>
      </nav>

      <label className="form-label" htmlFor="partnerID">
        Partner ID
      </label>
      <input
        type="text"
        className="form-input"
        id="partnerID"
        name="partnerID"
        defaultValue="fake-partner-id"
      />
      <label className="form-label" htmlFor="env">
        Environment
      </label>
      <select
        id="env"
        name="env"
        defaultValue={ENVIRONMENTS.harness}
        onChange={(event) => setEnvironment(event.target.value)}
      >
        {Object.values(ENVIRONMENTS).map((environment) => (
          <option key={environment}>{environment}</option>
        ))}
      </select>
      {environment === ENVIRONMENTS.custom ? (
        <>
          <label className="form-label" htmlFor="overrideHost">
            Override host
          </label>
          <input
            type="text"
            className="form-input"
            id="overrideHost"
            name="overrideHost"
          />
        </>
      ) : null}
      <label className="form-label">Waymark Options</label>
      <JsonEditor
        value={options}
        onChange={(newOptions) => setOptions(newOptions)}
      />
      <button className="submit-button" data-test="initialize-sdk-button">
        {!waymarkInstance ? "Create Waymark Embed" : "Destroy Waymark Embed"}
      </button>
    </form>
  );
}
