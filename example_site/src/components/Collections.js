import { useEffect, useState } from "react";
import { useQuery } from "react-query";

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

function Collection({ collection, setSelectedCollection, expand }) {
  const { waymarkInstance, addTemplates } = useAppContext();

  const { isLoading, isError, isSuccess, data: templates, error } = useQuery(
    ["templates", collection.id],
    () => waymarkInstance.getTemplatesForCollection(collection.id),
    { enabled: !!waymarkInstance && expand }
  );

  useEffect(() => {
    if (templates && templates.length) {
      addTemplates(templates);
    }
  }, [templates, addTemplates]);

  const onClick = (collection) => {
    setSelectedCollection(collection);
  };

  return (
    <li className="collection">
      <button className="collection-name" onClick={() => onClick(collection)}>
        {collection.name} ({collection.id})
      </button>
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
  const { waymarkInstance } = useAppContext();

  const { isLoading, isError, isSuccess, data: collections, error } = useQuery(
    "collections",
    () => waymarkInstance.getCollections(),
    {
      enabled: !!waymarkInstance,
    }
  );

  return (
    <div className="collections-page">
      <h2>Collections</h2>
      {isLoading && <div className="loading">Loading...</div>}
      {isError && <div className="error">Error: {error}</div>}
      <ul className="collections">
        {isSuccess &&
          collections.map((collection) => (
            <Collection
              key={collection.id}
              collection={collection}
              setSelectedCollection={setSelectedCollection}
              expand={Boolean(
                selectedCollection && selectedCollection.id === collection.id
              )}
            />
          ))}
      </ul>
    </div>
  );
}
