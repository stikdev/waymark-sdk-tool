import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";

import axios from "axios";
import classnames from "classnames";
import KJUR from "jsrsasign";
import faker from "faker";

import { theBlue } from "./constants";
import { useAppContext } from "./AppProvider";
import "./Collections.css";

function Template({ template }) {
  const { waymarkInstance, openEditor } = useAppContext();
  const history = useHistory();

  return (
      <li className="Template">
      <a title={template.id} onClick={() => openEditor({ template })}>
      <img className="Thumbnail" src={template.thumbnailImageURL} />
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
          <ul className="Collection">
            {templates &&
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

  const history = useHistory();

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
