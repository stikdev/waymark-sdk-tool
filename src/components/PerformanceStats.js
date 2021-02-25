import Stats from "stats.js";
import { useRef, useEffect } from "react";

import "./PerformanceStats.css";

export default function PerformanceStats() {
  const statsContainerRef = useRef();

  useEffect(() => {
    // stats.js allows you to measure performance and render canvas graphs based on this info for the
    // fps, frame time, and memory usage of the app
    const stats = new Stats();
    // Manually fiddling with the stats elements' styling so it will display in the top-right corner rather than
    // the top-left
    stats.dom.style.left = "unset";
    stats.dom.style.right = "0";

    statsContainerRef.current.appendChild(stats.dom);

    let animationFrameId;

    function animationFrame() {
      // Measure the time between each animation frame by calling end()
      // at the start and then calling begin() to start the next frame measurement
      stats.end();

      stats.begin();

      animationFrameId = requestAnimationFrame(animationFrame);
    }

    stats.begin();

    animationFrameId = requestAnimationFrame(animationFrame);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <div id="performance-stats-container" ref={statsContainerRef} />;
}
