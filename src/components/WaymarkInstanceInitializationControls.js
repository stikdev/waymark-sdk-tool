import { useState } from 'react';
import { JsonEditor } from 'jsoneditor-react';

import { TestModeWaymark } from '@waymark/waymark-sdk';

const DEFAULT_OPTIONS = {
  domElement: '#waymark-embed-container',
  editor: {
    orientation: 'left',
    labels: {
      completeVideo: 'Complete your video',
      exitEditor: 'Exit the editor',
      videoName: 'Custom Video Name',
    },
  },
  testJWTSecret: 'test-secret',
  timeout: 5000,
};

/**
 * Form provides controls to configure and create a new Waymark instance
 */
export default function WaymarkInstanceInitializationControls({
  setWaymarkInstance,
  waymarkInstance,
}) {
  // Config to pass in for theming the editor. Managed by a JsonEditor component
  const [options, setOptions] = useState(DEFAULT_OPTIONS);

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

        // Create a new Waymark instance with our config
        const waymarkObject = new TestModeWaymark(partnerID, {
          ...options,
          domElement: document.querySelector(options.domElement),
        });

        try {
          await waymarkObject.connectionPromise;
          setWaymarkInstance(waymarkObject);
        } catch (error) {
          console.error('Failed to connect to Waymark');
          waymarkObject.cleanup();
        }
      }}
    >
      <h2>Waymark Embed Config</h2>
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
      <label className="form-label">Waymark Options</label>
      <JsonEditor value={options} onChange={(newOptions) => setOptions(newOptions)} />
      <button className="submit-button" data-test="initialize-sdk-button">
        {!waymarkInstance ? 'Create Waymark Embed' : 'Destroy Waymark Embed'}
      </button>
    </form>
  );
}
