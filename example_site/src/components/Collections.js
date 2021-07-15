import _ from "lodash";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { JsonEditor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";

import { useAppContext } from "./AppProvider";
import "./Collections.css";
import Header from "./Header.js";

function Template({ template }) {
  const { openEditor } = useAppContext();

  return (
    <div>
      <button className="template-button" title={template.id} onClick={() => openEditor({ template })}>
        <div className='image-container'>
            <img
              className="thumbnail"
              src={template.thumbnailImageURL}
              alt={`${template.name} thumbnail`}
            />
        </div>
        <div>Name: {template.name}</div>
        <div>Aspect Ratio: {template.aspectRatio}</div>
        <div>Duration: {template.duration}</div>
      </button>
    </div>
  );
}

function CollectionNames({
  collection,
  setSelectedCollection,
  templateFilter,
}) {
  const { waymarkInstance, addTemplates } = useAppContext();

  const [currentTemplateFilter, setCurrentTemplateFilter] = useState(
    templateFilter
  );

  const onClick = (collection) => {
    setSelectedCollection(collection);
    console.log("Clicked");
  };

  const shouldShowRefetchWithFilterButton = !_.isEqual(
    templateFilter,
    currentTemplateFilter
  );

  return (
    <div className="category-name">
      <button className="collection-name" onClick={() => onClick(collection)}>
            {collection.name}
      </button>

      {shouldShowRefetchWithFilterButton ? (
        <button
          onClick={() => setCurrentTemplateFilter(templateFilter)}
          className="collection-filter-refetch"
        >
          Refetch with new filters
        </button>
      ) : null}
    </div>
  );
}

function CollectionTemplates({
  collection,
  expand,
  templateFilter,
}) {
  const { waymarkInstance, addTemplates } = useAppContext();

  // const [currentTemplateFilter, setCurrentTemplateFilter] = useState(
  //   templateFilter
  // );

  // useQuery to get the right templates given the collection name
  const { isLoading, isError, isSuccess, data: templates, error } = useQuery(
    ["templates", collection, /* currentTemplateFilter*/],
    () =>
      waymarkInstance.getTemplatesForCollection(
        collection.id,
        /*currentTemplateFilter*/
      ),
    { enabled: !!waymarkInstance && expand }
  );

  useEffect(() => {
    if (!_.isEmpty(templates)) {
      addTemplates(templates);
    }
  }, [templates, addTemplates]);

  return (
      <>
        {expand ?  (
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
        ) : null}
      </>
  );
}

export default function Collections() {
  const [selectedCollection, setSelectedCollection] = useState(null);
  // const [templateFilter, setTemplateFilter] = useState(() => ({}));
  const { waymarkInstance } = useAppContext();

  const { isLoading, isError, isSuccess, data: collections, error } = useQuery(
    ["collections"],
    () => waymarkInstance.getCollections(),
    {
      enabled: !!waymarkInstance,
    }
  );

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
        <>{/*
          <h3>Template Filters</h3>
        <JsonEditor value={templateFilter} onChange={setTemplateFilter} /> */}
          <div className="browser-columns">
            <div className="categories">
              <h2>Categories</h2>
              {collections.map((collection) => (
                <CollectionNames
                collection ={collection}
                setSelectedCollection={setSelectedCollection}
                />
              ))}
            </div>
            <div className="templates">
              <CollectionTemplates
                collection ={selectedCollection}
                expand={selectedCollection != null}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
