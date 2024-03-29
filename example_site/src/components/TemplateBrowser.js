import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import "jsoneditor-react/es/editor.min.css";
import HoverVideoPlayer from "react-hover-video-player";
import classnames from "classnames";

import { useAppContext } from "./AppProvider";
import "./TemplateBrowser.css";
import {
  blueColor,
  blackColor,
  durationFilters,
  aspectRatioFilters,
} from "../constants/app";

function Template({ template }) {
  const { openEditor, account } = useAppContext();

  return (
    <>
      <button
        className="template-button"
        title={template.id}
        onClick={() => {
          let options;

          if (account) {
            options = {
              businessName: account.companyName,
              businessCity: account.city,
            };
          }

          openEditor({
            template,
            options,
          });
        }}
      >
        <div className="template-container">
          <HoverVideoPlayer
            style={{
              width:
                template.width > template.height
                  ? "200px"
                  : template.width / (template.height / 200),
              height:
                template.height > template.width
                  ? "200px"
                  : template.height / (template.width / 200),
            }}
            videoSrc={template.previewVideoURL}
            pausedOverlay={
              <img
                className="thumbnail"
                src={template.thumbnailImageURL}
                alt={`${template.name} thumbnail`}
                loading="lazy"
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

function Filter({ filter, filterKey, templateFilter, setTemplateFilter }) {
  const [isFilterApplied, setIsFilterApplied] = useState(true);
  const filterNameColor =
    templateFilter[filterKey] === filter.value ? blueColor : blackColor;
  const filterFontWeight =
    templateFilter[filterKey] === filter.value
      ? "var(--fontWeightExtraBold)"
      : "var(--fontWeightRegular)";

  const onSelectFilter = (newFilter) => {
    setIsFilterApplied(!isFilterApplied);
    if (isFilterApplied) {
      setTemplateFilter((currentFilter) => ({
        ...currentFilter,
        [filterKey]: newFilter.value,
      }));
    } else {
      setTemplateFilter((currentFilter) => {
        const newFilters = { ...currentFilter };
        delete newFilters[filterKey];
        return newFilters;
      });
    }
  };

  return (
    <button
      className="filter-name"
      onClick={() => {
        onSelectFilter(filter);
      }}
    >
      <div
        style={{
          color: filterNameColor,
          fontWeight: filterFontWeight,
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
  const filterNameColor =
    selectedCollection === collection ? blueColor : blackColor;
  const filterFontWeight =
    selectedCollection === collection
      ? "var(--fontWeightExtraBold)"
      : "var(--fontWeightRegular)";

  return (
    <button
      className="filter-name"
      onClick={() => setSelectedCollection(collection)}
    >
      <div
        style={{
          color: filterNameColor,
          fontWeight: filterFontWeight,
        }}
      >
        {collection.name}
      </div>
    </button>
  );
}

function CollectionTemplates({ collection, templateFilter }) {
  const { waymarkInstance } = useAppContext();
  const collectionID = collection ? collection.id : "all_videos";

  const { isLoading, isError, isSuccess, data: templates, error } = useQuery(
    ["templates", collection, templateFilter],
    () =>
      waymarkInstance.getTemplatesForCollection(collectionID, templateFilter),
    { enabled: !!waymarkInstance }
  );

  return (
    <>
      {isLoading ? <div className="loading">Loading...</div> : null}
      {isError ? (
        <div className="error">Error loading collection. {error}</div>
      ) : null}
      <div className="template-grids">
        {isSuccess && templates
          ? templates.map((template) => (
              <Template key={template.id} template={template} />
            ))
          : null}
      </div>
    </>
  );
}

export default function TemplateBrowser({ isAdPortalFlow }) {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [templateFilter, setTemplateFilter] = useState(() =>
    isAdPortalFlow ? { aspectRatio: "16:9", duration: [15, 30] } : {}
  );
  const durationFiltersForFlow = isAdPortalFlow
    ? durationFilters.filter(
        (filter) => filter.value === 15 || filter.value === 30
      )
    : durationFilters;

  const { waymarkInstance, siteConfiguration } = useAppContext();

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
        setSelectedCollection(
          collections.find((collection) => collection.id === "all_videos")
        );
      }
      collections.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }
  }, [collections, isSuccess, selectedCollection]);

  const templateBrowserClasses = classnames({
    collectionsPage: true,
    panel: true,
    poppins: isAdPortalFlow,
  });

  return (
    <div className={templateBrowserClasses} data-testid="templateBrowser">
      {siteConfiguration.templateBrowserHeader}

      {isLoading ? <div className="loading">Loading...</div> : null}

      {isError ? <div className="error">Error: {error}</div> : null}

      {isSuccess ? (
        <>
          <div className="browser-columns">
            <div
              className="filters"
              style={{ marginTop: isAdPortalFlow ? "-60px" : "0px" }}
            >
              <div className="filter-title">Duration</div>
              <div className="category">
                {durationFiltersForFlow.map((filter) => (
                  <Filter
                    key={filter.value}
                    filter={filter}
                    filterKey={"duration"}
                    templateFilter={templateFilter}
                    setTemplateFilter={setTemplateFilter}
                  />
                ))}
              </div>

              {isAdPortalFlow ? null : (
                <>
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
                </>
              )}

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
