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

function Template({template}) {
  const {waymarkInstance, openEditor} = useAppContext();
  const history = useHistory();

  console.log('TEMPLA', template);
  return (
      <li>
      <a title={template.id} onClick={() => openEditor({template})}>{template.name}</a>
      <a href={template.previewVideoURL} target="_blank"><img src={template.thumbnailImageURL}/></a>
    </li>
  );
}

function Collection({collection, setSelectedCollection, expand}) {
  const {waymarkInstance} = useAppContext();
  const [templates, setTemplates] = useState([]);
  const [isGettingTemplates, setIsGettingTemplates] = useState(false);

  useEffect(() => {
    if (!waymarkInstance || isGettingTemplates) { return; }
    if (!expand) { return; }

    setIsGettingTemplates(true);
    waymarkInstance.getTemplatesForCollection(collection.id)
      .then( (templates) => {
        setTemplates(templates);
      });

  }, [waymarkInstance, expand]);

  const onClick = ((collection) => {
    setSelectedCollection(collection);
  });

  return (
      <li>
      <a onClick={() => onClick(collection)}>{collection.name} ({collection.id})</a>
      {expand && (
        <ul>
          {templates.map((template) => (<Template key={template.id} template={template}/>))}
        </ul>
      )}
      </li>
  );
}

export default function Collections ({ openSnackbar, setAccount }) {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isGettingCollections, setIsGettingCollections] = useState(false);
  const {waymarkInstance} = useAppContext();

  const history = useHistory();

  useEffect(() => {
    if (!waymarkInstance || isGettingCollections) { return; }
    setIsGettingCollections(true);
    waymarkInstance.getCollections()
      .then( (collections) => {
        setCollections(collections);
      });

  }, [waymarkInstance, isGettingCollections]);

  return (
    <div>
      <h2>Collections</h2>
      <ul>
      {
        collections.map((collection) => (<Collection key={collection.id} collection={collection} setSelectedCollection={setSelectedCollection} expand={selectedCollection && selectedCollection.id === collection.id}/>))
      }
    </ul>
    </div>
  );
}
