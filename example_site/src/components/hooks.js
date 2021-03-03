import { useContext, useEffect, useState } from 'react';

export const useWaymarkInstance = () => {
  const [waymarkInstance, setWaymarkInstance] = useState(null);

  return [
    waymarkInstance,
    setWaymarkInstance,
  ];
}

export const useEditor = () => {
  const [waymarkInstance, setWaymarkInstance] = useWaymarkInstance();

  const openEditorForTemplate = (template) => {

  };

  return {
    openEditorForTemplate
  };
}
