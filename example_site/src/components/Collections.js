import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

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
      <a href={template.previewVideoURL} target="_blank">
        <img src={template.thumbnailImageURL} />
      </a>
      <a title={template.id} onClick={() => openEditor({ template })}>
        {template.name}
    </a>
    </li>
  );
}

function Collection({ collection, setSelectedCollection, expand }) {
  const { waymarkInstance } = useAppContext();
  const [templates, setTemplates] = useState([]);
  const [isGettingTemplates, setIsGettingTemplates] = useState(false);

  useEffect(() => {
    if (!waymarkInstance || isGettingTemplates || templates.length) {
      return;
    }
    if (!expand) {
      return;
    }

    setIsGettingTemplates(true);
    waymarkInstance
      .getTemplatesForCollection(collection.id)
      .then((templates) => {
        setIsGettingTemplates(false);
        setTemplates(templates);
      });
  }, [waymarkInstance, expand, templates]);

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
          {isGettingTemplates && (<div className="Loading">Loading...</div>)}
          <ul className="Collection">
            {templates.map((template) => (
              <Template key={template.id} template={template} />
            ))}
          </ul>
        </>
      )}
    </li>
  );
}

export default function Collections({ openSnackbar, setAccount }) {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isGettingCollections, setIsGettingCollections] = useState(false);
  const { waymarkInstance } = useAppContext();

  const history = useHistory();

  useEffect(() => {
    if (!waymarkInstance || isGettingCollections || collections.length) {
      return;
    }
    setIsGettingCollections(true);
    waymarkInstance.getCollections().then((collections) => {
      setIsGettingCollections(false);
      setCollections(collections);
    });
  }, [waymarkInstance, isGettingCollections, collections]);

  return (
    <div className="CollectionsPage">
      <h2>Collections</h2>
      {isGettingCollections && (<div className="Loading">Loading...</div>)}
      <ul className="Collections">
        {collections.map((collection) => (
          <Collection
            key={collection.id}
            collection={collection}
            setSelectedCollection={setSelectedCollection}
            expand={
              selectedCollection && selectedCollection.id === collection.id
            }
          />
        ))}
      </ul>
    </div>
  );
}
