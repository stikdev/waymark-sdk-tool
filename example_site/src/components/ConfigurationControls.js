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
    setAccount,
    setPartnerID,
    waymarkInstance,
    setWaymarkInstance,
  } = useAppContext();

  const shouldDefaultPersonalize = watch("shouldDefaultPersonalize", false);

  const onSubmit = async (formData) => {
    const {
      environment,
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
    setAccount(null);

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
      environment,
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
      <div>
        <h2>Configuration</h2>

        <label title="Environment" className="form-label" htmlFor="environment">
          Environment Connection
        </label>
        <select name="environment" ref={register({ required: true })}>
          <option value="demo">Demo</option>
          <option value="prod">Production</option>
          <option value="local">Local</option>
        </select>

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

        <button className="submit-button configuration-submit-button">
          {waymarkInstance ? "Reset SDK" : "Initialize SDK"}
        </button>
      </div>
      <div>
        <h2>Editor</h2>
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
      </div>
      <div>
        <h2>Labels</h2>
        <label
          className="form-label configuration-column-3"
          htmlFor="exitEditorLabel"
        >
          Exit Editor Label
        </label>
        <input
          type="text"
          className="form-input"
          name="exitEditorLabel"
          defaultValue="Exit"
          ref={register}
        />

        <label
          className="form-label configuration-column-3"
          htmlFor="completeVideoLabel"
        >
          Purchase Video Label
        </label>
        <input
          type="text"
          className="form-input"
          name="completeVideoLabel"
          defaultValue="Purchase"
          ref={register}
        />

        <label
          className="form-label configuration-column-3"
          htmlFor="customVideoName"
        >
          Custom Video Name
        </label>
        <input
          type="text"
          className="form-input"
          name="customVideoName"
          defaultValue="My Summer Vacation"
          ref={register}
        />
      </div>
    </form>
  );
}
