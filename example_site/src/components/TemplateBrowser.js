import _ from "lodash";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { JsonEditor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import HoverVideoPlayer from 'react-hover-video-player';

import { useAppContext } from "./AppProvider";
import "./TemplateBrowser.css";
import Header from "./Header.js";
import { theBlue, durationFilters, aspectRatioFilters } from "./constants";

function Template({ template }) {
  const { openEditor } = useAppContext();

  return (
    <>
      <button className="template-button" title={template.id} onClick={() => openEditor({ template })}>
        <div className='image-container'>
          <HoverVideoPlayer
            className="hover-player-container"
            videoSrc={template.previewVideoURL}
            pausedOverlayWrapperClassName="hover-player-container"
            pausedOverlay={
              <img
                className="thumbnail"
                src={template.thumbnailImageURL}
                alt={`${template.name} thumbnail`}
              />
            }
            unloadVideoOnPaused={true}
            crossOrigin="anonymous"
            sizingMode="overlay"
          />
        </div>
        <ul>
          <li>Name: {template.name}</li>
          <li>Aspect Ratio: {template.aspectRatio}</li>
          <li>Duration: {template.duration}</li>
        </ul>
      </button>
    </>
  );
}

function Filter({
  filter,
  filterKey,
  templateFilter,
  setTemplateFilter,
}) {
  const [isFilterApplied, setIsFilterApplied] = useState(true);
  const filterNameColor = templateFilter[filterKey]===filter.value ? theBlue : 'black';

  const onSelectFilter = (newFilter) => {
    setIsFilterApplied(!isFilterApplied)
    if (isFilterApplied) {
      setTemplateFilter((currentFilter) => (
         {...currentFilter, [filterKey]: newFilter.value}
      )) 
       
    } else {
      setTemplateFilter((currentFilter) => {
        const newFilters = {...currentFilter};
        delete newFilters[filterKey];
        return newFilters;
      })
    }
  }

  return (
    <div className="category-name">
      <button 
        className="filter-name"
        onClick={() => {
          onSelectFilter(filter)
        }}>
        <div style={{'color': filterNameColor}}>
          {filter.displayName} 
        </div>
      </button>
    </div>
  );
}

function CollectionFilter({
  collection,
  selectedCollection,
  setSelectedCollection,
}) {
  const buttonColor = selectedCollection === collection ? theBlue : 'black';

  const onClick = (collection) => {
    setSelectedCollection(collection);
  };

  return (
    <div className="category-name">
      <button className="filter-name" onClick={() => onClick(collection)}>
        <div style={{'color': buttonColor}}>
          {collection.name} 
        </div>
      </button>
    </div>
  );
}

function CollectionTemplates({
  collection,
  templateFilter,
}) {
  const { waymarkInstance, addTemplates } = useAppContext();

  const { isLoading, isError, isSuccess, data: templates, error } = useQuery(
    ["templates", collection, templateFilter],
    () =>
      waymarkInstance.getTemplatesForCollection(
        collection.id,
        templateFilter
      ),
    { enabled: !!waymarkInstance }
  );

  useEffect(() => {
    if (!_.isEmpty(templates)) {
      addTemplates(templates);
    }
  }, [templates, addTemplates]);

  return (
    <>
      {isLoading ? (<div className="loading">Loading...</div>) : null}
      {isError ? (
        <div className="error">Error loading collection. {error}</div>
      ) : null}
      <div className="template-grids">
        {(isSuccess && templates) ? (
          templates.map((template) => (
            <Template key={template.id} template={template} />
          ))) : null}
      </div>
    </>
  );
}

export default function TemplateBrowser() {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [templateFilter, setTemplateFilter] = useState(() => ({}));
  const { waymarkInstance } = useAppContext();

  const { isLoading, isError, isSuccess, data: collections, error } = useQuery(
    ["collections"],
    () => waymarkInstance.getCollections(),
    {
      enabled: !!waymarkInstance,
    }
  );

  // set all_videos collection as default, sort collection names alphabetically
  useEffect(() => {
    if (isSuccess) {
      if (!selectedCollection) {
        setSelectedCollection(collections.find((collection) => (
          collection.id === "all_videos")));
      } 
      collections.sort((a, b) => {return a.name.localeCompare(b.name)});
    }
  }, [collections, isSuccess, selectedCollection]);

  return (
    <div className="collections-page panel">
      <Header 
        title="Display Templates"
        subtitle="Get a list of templates organized by category and
        filtered by length and/or aspect ratio. Show any or all of
        them any way that you like."
      />
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : null}

      {isError ? (
        <div className="error">Error: {error}</div>
      ) : null}

      {isSuccess ? (
        <>
          <div className="browser-columns">
            <div className="filters">
              <h2>Duration</h2>
              {durationFilters.map((filter) => (
                <Filter
                  filter={filter}
                  filterKey={"duration"}
                  templateFilter={templateFilter}
                  setTemplateFilter={setTemplateFilter}
                />
              ))}

              <h2>Aspect Ratio</h2>
              {aspectRatioFilters.map((filter) => (
                <Filter
                  filter={filter}
                  filterKey={"aspectRatio"}
                  templateFilter={templateFilter}
                  setTemplateFilter={setTemplateFilter}
                />
              ))}

              <h2>Categories</h2>
              {collections.map((collection) => (
                <CollectionFilter
                  collections={collections}
                  collection={collection}
                  selectedCollection={selectedCollection}
                  setSelectedCollection={setSelectedCollection}
                />
              ))}
            </div>
            <div className="templates">
              <CollectionTemplates 
                collection={selectedCollection}
                templateFilter={templateFilter}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
