import { useState } from "react";
import { useQuery } from "react-query";

import { useAppContext } from "./AppProvider";
import "./Collections.css";

function Template({ template }) {
  const { openEditor } = useAppContext();

  return (
      <li className="Template">
      <a title={template.id} onClick={() => openEditor({ template })}>
      <img className="Thumbnail" src={template.thumbnailImageURL} alt={`${template.name} thumbnail`} />
      <div>{template.name}</div>
      </a>
    </li>
  );
}

function Collection({ collection, setSelectedCollection, expand }) {
  const { waymarkInstance } = useAppContext();

  const { isLoading, isError, isSuccess, data: templates, error } = useQuery(
    ["templates", collection.id],
    () => waymarkInstance.getTemplatesForCollection(collection.id),
    { enabled: !!waymarkInstance && expand }
  );

  const onClick = (collection) => {
    setSelectedCollection(collection);
  };

  return (
    <li className="Collection">
      <a className="CollectionName" onClick={() => onClick(collection)}>
        {collection.name} ({collection.id})
      </a>
      {expand && (
        <>
          {isLoading && <div className="Loading">Loading...</div>}
        {isError && <div className="Error">Error loading collection. {error}</div>}
          <ul className="Collection">
            {isSuccess && templates &&
              templates.map((template) => (
                <Template key={template.id} template={template} />
              ))}
          </ul>
        </>
      )}
    </li>
  );
}

export default function Collections({ openSnackbar, setAccount }) {
  //const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const { waymarkInstance } = useAppContext();

  const {
    isLoading,
    isError,
    isSuccess,
    data: collections,
    error,
  } = useQuery("collections", () => waymarkInstance.getCollections(), {
    enabled: !!waymarkInstance,
  });

  return (
    <div className="CollectionsPage">
      <h2>Collections</h2>
      {isLoading && <div className="Loading">Loading...</div>}
      {isError && <div className="Error">Error: {error}</div>}
      <ul className="Collections">
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
