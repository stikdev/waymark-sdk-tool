import _ from "lodash";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import "jsoneditor-react/es/editor.min.css";
import HoverVideoPlayer from 'react-hover-video-player';

import { useAppContext } from "./AppProvider";
import "./TemplateBrowser.css";
import Header from "./Header.js";
import { blueColor, blackColor, durationFilters, aspectRatioFilters } from "../constants/app";

function Template({ template }) {
  const { openEditor } = useAppContext();

  return (
    <>
      <button 
        className="template-button" 
        title={template.id} 
        onClick={() => { openEditor({ template }) }}
      >
        <div className='template-container'>
          <HoverVideoPlayer
            style={{
              width: template.width > template.height ? '200px' :
                (template.width/(template.height/200)),
              height: template.height > template.width ? '200px' : 
                (template.height/(template.width/200)),
            }}
            videoSrc={template.previewVideoURL}
            pausedOverlay={
              <img
                className="thumbnail"
                src={template.thumbnailImageURL}
                alt={`${template.name} thumbnail`}
              />
            }
            sizingMode="container"
            videoClassName="video-fit"
            unloadVideoOnPaused={true}
            crossOrigin="anonymous"
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
  const filterNameColor = templateFilter[filterKey] === filter.value ? blueColor : blackColor;
  const filterFontWeight = templateFilter[filterKey] === filter.value ? 'var(--fontWeightExtraBold)' : 'var(--fontWeightRegular)';

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
    <button 
      className="filter-name"
      onClick={() => {
        onSelectFilter(filter)
      }}>
      <div 
        style={{
          color: filterNameColor, 
          fontWeight: filterFontWeight
        }}
      >
        {filter.displayName} 
      </div>
    </button>
  );
}

function CollectionFilter({
  collection,
  selectedCollection,
  setSelectedCollection,
}) {
  const filterNameColor = selectedCollection === collection ? blueColor : blackColor;
  const filterFontWeight = selectedCollection === collection ? 'var(--fontWeightExtraBold)' : 'var(--fontWeightRegular)';

  return (
    <button className="filter-name" onClick={() => setSelectedCollection(collection)}>
      <div 
        style={{
          color: filterNameColor, 
          fontWeight: filterFontWeight
        }}
      >
        {collection.name} 
      </div>
    </button>
  );
}

function CollectionTemplates({
  collection,
  templateFilter,
}) {
  const { waymarkInstance } = useAppContext();
  const collectionID = collection ? collection.id : "all_videos";

  const { isLoading, isError, isSuccess, data: templates, error } = useQuery(
    ["templates", collection, templateFilter],
    () =>
      waymarkInstance.getTemplatesForCollection(
        collectionID,
        templateFilter
      ),
    { enabled: !!waymarkInstance }
  );

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
              <div className="filter-title">Duration</div>
              <div className="category">
                {durationFilters.map((filter) => (
                  <Filter
                    key={filter.value}
                    filter={filter}
                    filterKey={"duration"}
                    templateFilter={templateFilter}
                    setTemplateFilter={setTemplateFilter}
                  />
                ))}
              </div>

              <div className="filter-title">Aspect Ratio</div>
              <div className="category">
                {aspectRatioFilters.map((filter) => (
                  <Filter
                    key={filter.value}
                    filter={filter}
                    filterKey={"aspectRatio"}
                    templateFilter={templateFilter}
                    setTemplateFilter={setTemplateFilter}
                  />
                ))}
              </div>

              <div className="filter-title">Categories</div>
              <div className="category">
                {collections.map((collection) => (
                  <CollectionFilter
                    key={collection.id}
                    collections={collections}
                    collection={collection}
                    selectedCollection={selectedCollection}
                    setSelectedCollection={setSelectedCollection}
                  />
                ))}
              </div>
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
