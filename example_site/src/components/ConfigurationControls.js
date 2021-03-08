//import { useState } from "react";
import { useForm } from "react-hook-form";
import classnames from "classnames";

import Waymark from "@waymark/waymark-sdk";

import { useAppContext } from "./AppProvider";
import "./ConfigurationControls.css";

/**
 * Configuration fo the entire application.
 */
export default function ConfigurationControls({ isOpen }) {
  const { register, watch, handleSubmit } = useForm();
  const {
    embedRef,
    setPartnerID,
    waymarkInstance,
    setWaymarkInstance,
  } = useAppContext();

  const shouldDefaultPersonalize = watch("shouldDefaultPersonalize", false);

  const onSubmit = async (formData) => {
    const {
      orientation,
      partnerID,
      shouldDefaultPersonalize,
      completeVideoLabel,
      exitEditorLabel,
      customVideoName,
    } = formData;

    console.log(formData);

    if (waymarkInstance) {
      await waymarkInstance.cleanup();
    }

    setPartnerID(partnerID);

    const waymarkOptions = {
      domElement: embedRef.current,
      editor: {
        orientation,
        personalization: {
          isDefault: shouldDefaultPersonalize,
        },
        labels: {
          completeVideo: completeVideoLabel,
          exitEditor: exitEditorLabel,
          videoName: customVideoName,
        },
      },
      environment: "demo",
      timeout: 5000,
    };

    console.log("options", waymarkOptions);
    const newWaymarkInstance = new Waymark(partnerID, waymarkOptions);
    setWaymarkInstance(newWaymarkInstance);
    console.log(newWaymarkInstance);
  };

  const formClasses = classnames({
    "configuration-controls-form": true,
    panel: true,
    open: isOpen,
    closed: !isOpen,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formClasses}>
      <h2>Configuration</h2>

      <label className="form-label" labelfor="leftOrientation">
        <input
          id="leftOrientation"
          name="orientation"
          type="radio"
          value="left"
          ref={register({ required: true })}
          defaultChecked={true}
        />
        Editor Form On Left
      </label>
      <label className="form-label" labelfor="rightOrientation">
        <input
          id="rightOrientation"
          name="orientation"
          type="radio"
          value="right"
          ref={register({ required: true })}
        />
        Editor Form On Right
      </label>

      <label className="form-label" htmlFor="shouldDefaultPersonalize">
        <input
          name="shouldDefaultPersonalize"
          type="checkbox"
          defaultChecked={shouldDefaultPersonalize}
          ref={register}
        />
        Start the editor in personalization?
      </label>

      <label className="form-label" htmlFor="partnerID">
        Partner ID
      </label>
      <input
        type="text"
        className="form-input"
        name="partnerID"
        defaultValue="fake-partner-id"
        ref={register({ required: true })}
      />

      <label className="form-label" htmlFor="exitEditorLabel">
        Exit Editor Label
      </label>
      <input
        type="text"
        className="form-input"
        name="exitEditorLabel"
        defaultValue="Exit"
        ref={register}
      />

      <label className="form-label" htmlFor="completeVideoLabel">
        Purchase Video Label
      </label>
      <input
        type="text"
        className="form-input"
        name="completeVideoLabel"
        defaultValue="Purchase"
        ref={register}
      />

      <label className="form-label" htmlFor="customVideoName">
        Custom Video Name
      </label>
      <input
        type="text"
        className="form-input"
        name="customVideoName"
        defaultValue="My Summer Vacation"
        ref={register}
      />

      <button className="submit-button">
        {waymarkInstance ? "Reset SDK" : "Initialize SDK"}
      </button>
    </form>
  );
}
