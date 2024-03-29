import { useState } from "react";
import "jsoneditor-react/es/editor.min.css";

import EventMonitor from "./EventMonitor";
import PerformanceStats from "./PerformanceStats";
import PerformanceTestingForm from "./PerformanceTestingForm";
import WaymarkInstanceInitializationControls from "./WaymarkInstanceInitializationControls";
import WaymarkInstanceManagerControls from "./WaymarkInstanceManagerControls";
import WebhookTestingForm from "./WebhookTestingForm";
import "./App.css";

function App() {
  const [waymarkInstance, setWaymarkInstance] = useState(null);
  const [shouldShowPerformanceStats, setShouldShowPerformanceStats] = useState(
    false
  );

  return (
    <main>
      {shouldShowPerformanceStats && <PerformanceStats />}
      <div
        id="waymark-embed-container"
        className={waymarkInstance ? "embedded" : ""}
      >
        {waymarkInstance ? "Initialized" : "Uninitialized"}
      </div>
      <div className="initialization-container">
        <WaymarkInstanceInitializationControls
          waymarkInstance={waymarkInstance}
          setWaymarkInstance={setWaymarkInstance}
        />
        <EventMonitor
          waymarkInstance={waymarkInstance}
        />
      </div>
      <div className="embed-controls-grid">
        {waymarkInstance && (
          <WaymarkInstanceManagerControls waymarkInstance={waymarkInstance} />
        )}
      </div>
      <div className="webhook-testing-container">
        <WebhookTestingForm />
      </div>
      <div className="performance-testing-container">
        <PerformanceTestingForm
          shouldShowPerformanceStats={shouldShowPerformanceStats}
          setShouldShowPerformanceStats={setShouldShowPerformanceStats}
        />
      </div>
    </main>
  );
}

export default App;
