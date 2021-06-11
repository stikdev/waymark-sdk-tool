import _ from "lodash";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { JsonEditor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";

import { useAppContext } from "./AppProvider";
import "./Collections.css";

function Template({ template }) {
  const { openEditor } = useAppContext();

  return (
    <li className="template">
      <button title={template.id} onClick={() => openEditor({ template })}>
        <img
          className="thumbnail"
          src={template.thumbnailImageURL}
          alt={`${template.name} thumbnail`}
        />
        <div>{template.name}</div>
      </button>
    </li>
  );
}

function Collection({
  collection,
  setSelectedCollection,
  expand,
  templateFilter,
}) {
  const { waymarkInstance, addTemplates } = useAppContext();

  const [currentTemplateFilter, setCurrentTemplateFilter] = useState(
    templateFilter
  );

  const { isLoading, isError, isSuccess, data: templates, error } = useQuery(
    ["templates", collection.id, currentTemplateFilter],
    () =>
      waymarkInstance.getTemplatesForCollection(
        collection.id,
        currentTemplateFilter
      ),
    { enabled: !!waymarkInstance && expand }
  );

  useEffect(() => {
    if (!_.isEmpty(templates)) {
      addTemplates(templates);
    }
  }, [templates, addTemplates]);

  const onClick = (collection) => {
    setSelectedCollection(collection);
  };

  const shouldShowRefetchWithFilterButton = !_.isEqual(
    templateFilter,
    currentTemplateFilter
  );

  return (
    <li className="collection">
      <button className="collection-name" onClick={() => onClick(collection)}>
        {collection.name} ({collection.id})
      </button>
      {shouldShowRefetchWithFilterButton && (
        <button
          onClick={() => setCurrentTemplateFilter(templateFilter)}
          className="collection-filter-refetch"
        >
          Refetch with new filters
        </button>
      )}
      {expand && (
        <>
          {isLoading && <div className="loading">Loading...</div>}
          {isError && (
            <div className="error">Error loading collection. {error}</div>
          )}
          <ul className="collection">
            {isSuccess &&
              templates &&
              templates.map((template) => (
                <Template key={template.id} template={template} />
              ))}
          </ul>
        </>
      )}
    </li>
  );
}

export default function Collections() {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [templateFilter, setTemplateFilter] = useState(() => ({
    aspectRatio: "16:9",
  }));
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
      <h2>Collections</h2>
      {isLoading && <div className="loading">Loading...</div>}
      {isError && <div className="error">Error: {error}</div>}
      {isSuccess && (
        <>
          <h3>Template Filters</h3>
          <JsonEditor value={templateFilter} onChange={setTemplateFilter} />
          <ul className="collections">
            {collections.map((collection) => (
              <Collection
                key={collection.id}
                collection={collection}
                setSelectedCollection={setSelectedCollection}
                expand={Boolean(
                  selectedCollection && selectedCollection.id === collection.id
                )}
                templateFilter={templateFilter}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
