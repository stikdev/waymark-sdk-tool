import { useEffect, useRef, useState } from "react";

const EVENTS = [
  "editorOpened",
  "editorOpenFailed",
  "editorExited",
  "videoCompleted",
  "videoCreated",
  "videoRendered",
];

/**
 * Displays a list of SDK events.
 */
export default function EventMonitor({ waymarkInstance }) {
  const [events, setEvents] = useState([{
      timestamp: new Date().toLocaleTimeString(),
      name: "started",
  }]);
  const eventsLoaded = useRef(false);

  useEffect(() => {
    if (eventsLoaded.current || !waymarkInstance) return;
    eventsLoaded.current = true;

    EVENTS.forEach((event) => {
      waymarkInstance.on(event, (value) => {
        const eventRecord = {
          timestamp: new Date().toLocaleTimeString(),
          name: event,
          value,
        };
        setEvents((oldEvents) => [...oldEvents, eventRecord]);
      });
    });
  }, [waymarkInstance, events, setEvents]);

  return (
      <section className="eventMonitor" data-test="event-list">
      <h2>SDK Event Log</h2>
      {events.map((eventRecord, index) => (
        <div key={index} data-test="event-name-{eventRecord.name}">
          {index + 1}. {eventRecord.timestamp}{" "}
          <span className="eventName">{eventRecord.name}</span>{" "}
          <div className="eventRecord">
            <pre data-test="event-value">
              {JSON.stringify(eventRecord.value, null, 2)}
            </pre>
          </div>
        </div>
      ))}
    </section>
  );
}
