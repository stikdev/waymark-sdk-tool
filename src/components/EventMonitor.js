import { useEffect, useState } from 'react';


/**
 * Form provides controls to configure and create a new Waymark instance
 */
export default function EventMonitor({
  waymarkInstance,
}) {

  const {eventList, setEventList} = useState([]);

  useEffect(() => {
    console.log('Event register.');
    waymarkInstance.on("videoCompleted", (payload) => setEventList((oldEvents) => [...oldEvents, payload]));

    return () => {
      console.log('Event cleanup.');
    };

  }, [waymarkInstance]);

  return (
      <div className="event-monitor">
      <h2>Event Monitor</h2>
      </div>
  );
}
