import { useState } from 'react';

import './PerformanceTestingForm.css';
import GPUIntensiveTask from './GPUIntensiveTask';

/**
 * Form for fiddling with stuff for performance testing
 */
export default function PerformanceTestingForm({
  shouldShowPerformanceStats,
  setShouldShowPerformanceStats,
}) {
  const [loadedImages, setLoadedImages] = useState([]);

  /**
   * Get a given number of random image URLs from unsplash's /random API endpoint
   */
  const loadRandomImages = async (imageCount) => {
    if (imageCount === 0) setLoadedImages([]);

    const randomImagePromises = new Array(imageCount);

    for (let i = 0; i < imageCount; i += 1) {
      randomImagePromises[i] = fetch(
        `https://source.unsplash.com/random?sig=${Math.round(Math.random() * 10000)}`,
      ).then((apiResponse) => apiResponse.url);
    }

    const imageURLs = await Promise.all(randomImagePromises);

    setLoadedImages(imageURLs);
  };

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          const formElement = event.target;

          const numImagesToLoad = Number(formElement.numImagesToLoad.value);
          loadRandomImages(numImagesToLoad);
        }}
        className="performance-testing-form"
      >
        <label
          title="Simulates memory load of having X number of images loaded into the page via Unsplash's random image API"
          className="form-label"
        >
          Number of random images to load*
        </label>
        <input type="number" defaultValue="0" name="numImagesToLoad" className="form-input" />
        <div className="performance-image-grid">
          {loadedImages.map((imageURL, index) => (
            <img alt="" src={imageURL} key={`${imageURL}-${index}`} />
          ))}
        </div>
        <GPUIntensiveTask />
        <button className="submit-button">Update</button>
        <button
          onClick={() => setShouldShowPerformanceStats(!shouldShowPerformanceStats)}
          className="operation-button"
        >
          {shouldShowPerformanceStats ? 'Hide Performance Stats' : 'Show Performance Stats'}
        </button>
      </form>
    </>
  );
}
