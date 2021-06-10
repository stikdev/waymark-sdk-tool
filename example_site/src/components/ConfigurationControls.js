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
    partnerID: defaultPartnerID,
    setPartnerID,
    waymarkInstance,
    setWaymarkInstance,
    openSnackbar,
  } = useAppContext();

  const watchFields = watch(
    [
      "shouldDefaultPersonalize",
      "shouldHideSaveButton",
      "shouldUseAdvancedDropdown",
      "shouldShowUnsavedChangesModal",
      "shouldShowConfirmCompleteVideoModal",
    ],
    {
      shouldDefaultPersonalize: false,
      shouldHideSaveButton: false,
      shouldUseAdvancedDropdown: false,
      shouldShowUnsavedChangesModal: true,
      shouldShowConfirmCompleteVideoModal: false,
    }
  );

  const {
    shouldDefaultPersonalize,
    shouldHideSaveButton,
    shouldUseAdvancedDropdown,
    shouldShowUnsavedChangesModal,
    shouldShowConfirmCompleteVideoModal,
  } = watchFields;

   const onSubmit = async (formData) => {
    const {
      environment,
      orientation,
      partnerID,
      shouldDefaultPersonalize,
      shouldHideSaveButton,
      completeVideoLabel,
      exitEditorLabel,
      shouldUseAdvancedDropdown,
      shouldShowUnsavedChangesModal,
      unsavedChangesModalTitle,
      unsavedChangesModalBody,
      unsavedChangesModalConfirmButton,
      unsavedChangesModalCancelButton,
      shouldShowConfirmCompleteVideoModal,
      confirmCompleteVideoModalTitle,
      confirmCompleteVideoModalBody,
      confirmCompleteVideoModalConfirmButton,
      confirmCompleteVideoModalCancelButton,
      editorBackgroundColor,
    } = formData;

    console.log(formData);

    if (waymarkInstance) {
      await waymarkInstance.cleanup();
    }

    setPartnerID(partnerID);
    setAccount(null);

    /* Correct orientation for editor */
    var finalOrientation = orientation ? "right" : "left";

    const waymarkOptions = {
      domElement: embedRef.current,
      editor: {
        orientation: finalOrientation,
        personalization: {
          isDefault: shouldDefaultPersonalize,
        },
        labels: {
          completeVideo: completeVideoLabel,
          exitEditor: exitEditorLabel,
          unsavedChangesConfirmation: {
            shouldShow: shouldShowUnsavedChangesModal,
            title: unsavedChangesModalTitle,
            body: unsavedChangesModalBody,
            confirmButton: unsavedChangesModalConfirmButton,
            cancelButton: unsavedChangesModalCancelButton,
          },
          completeVideoConfirmation: {
            shouldShow: shouldShowConfirmCompleteVideoModal,
            title: confirmCompleteVideoModalTitle,
            body: confirmCompleteVideoModalBody,
            confirmButton: confirmCompleteVideoModalConfirmButton,
            cancelButton: confirmCompleteVideoModalCancelButton,
          },
        },
        panelButtons: {
          shouldUseAdvancedDropdown: shouldUseAdvancedDropdown,
        },
        hideSaveButton: shouldHideSaveButton,
        backgroundColor: editorBackgroundColor,
      },
      environment,
      timeout: 5000,
      isDebug: true,
    };

    console.log("options", waymarkOptions);
    try {
      const newWaymarkInstance = new Waymark(partnerID, waymarkOptions);
      setWaymarkInstance(newWaymarkInstance);
      console.log(newWaymarkInstance);
    } catch (error) {
      openSnackbar(`Problem initializing SDK: ${error}`);
    }
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
        <select
          name="environment"
          ref={register({ required: true })}
          defaultValue="local"
        >
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
          defaultValue={defaultPartnerID}
          ref={register({ required: true })}
        />

        <button className="submit-button configuration-submit-button">
          {waymarkInstance ? "Reset SDK" : "Initialize SDK"}
        </button>
      </div>
      <div>
        <h2>Editor</h2>
        <h4>Form location: </h4>
        <label class="switch">
          <input 
            name="orientation"
            type="checkbox"
            ref={register}
          /> 
          <div class="slider round">
            <span class="on"><h4>Right</h4></span>
            <span class="off"><h4>Left</h4></span>
          </div>
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

        <label className="form-label" htmlFor="shouldHideSaveButton">
          <input
            name="shouldHideSaveButton"
            type="checkbox"
            defaultChecked={shouldHideSaveButton}
            ref={register}
          />
          Hide the save button?
        </label>

        <label className="form-label" htmlFor="shouldUseAdvancedDropdown">
          <input
            name="shouldUseAdvancedDropdown"
            type="checkbox"
            defaultChecked={shouldUseAdvancedDropdown}
            ref={register}
          />
          Use advanced dropdown?
        </label>

        <label className="form-label" htmlFor="editorBackgroundColor">
          Custom background color
        </label>
        <input
          type="text"
          className="form-input"
          name="editorBackgroundColor"
          defaultValue=""
          ref={register}
        />
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

        <div className="configuration-controls-subsection">
          <h3>Unsaved Changes Confirmation Modal</h3>

          <label className="form-label" htmlFor="shouldShowUnsavedChangesModal">
            <input
              name="shouldShowUnsavedChangesModal"
              type="checkbox"
              defaultChecked={shouldShowUnsavedChangesModal}
              ref={register}
            />
            Show the unsaved changes modal?
          </label>

          <label
            className="form-label configuration-column-3"
            htmlFor="unsavedChangesModalTitle"
          >
            Modal Title
          </label>
          <input
            type="text"
            className="form-input"
            name="unsavedChangesModalTitle"
            defaultValue="Exit Editor"
            ref={register}
          />

          <label
            className="form-label configuration-column-3"
            htmlFor="unsavedChangesModalBody"
          >
            Modal Body Text
          </label>
          <input
            type="text"
            className="form-input"
            name="unsavedChangesModalBody"
            defaultValue="Your video has unsaved edits. Are you sure you want to leave?"
            ref={register}
          />

          <label
            className="form-label configuration-column-3"
            htmlFor="unsavedChangesModalConfirmButton"
          >
            Modal Confirmation Button Label
          </label>
          <input
            type="text"
            className="form-input"
            name="unsavedChangesModalConfirmButton"
            defaultValue="Exit Editor"
            ref={register}
          />

          <label
            className="form-label configuration-column-3"
            htmlFor="unsavedChangesModalCancelButton"
          >
            Modal Cancel Button Label
          </label>
          <input
            type="text"
            className="form-input"
            name="unsavedChangesModalCancelButton"
            defaultValue="Cancel"
            ref={register}
          />
        </div>

        <div className="configuration-controls-subsection">
          <h3>Complete Video Confirmation Modal</h3>

          <label
            className="form-label"
            htmlFor="shouldShowConfirmCompleteVideoModal"
          >
            <input
              name="shouldShowConfirmCompleteVideoModal"
              type="checkbox"
              defaultChecked={shouldShowConfirmCompleteVideoModal}
              ref={register}
            />
            Show the complete video confirmation modal?
          </label>

          <label
            className="form-label configuration-column-3"
            htmlFor="confirmCompleteVideoModalTitle"
          >
            Modal Title
          </label>
          <input
            type="text"
            className="form-input"
            name="confirmCompleteVideoModalTitle"
            defaultValue="Finalize Video"
            ref={register}
          />

          <label
            className="form-label configuration-column-3"
            htmlFor="confirmCompleteVideoModalBody"
          >
            Modal Body Text
          </label>
          <input
            type="text"
            className="form-input"
            name="confirmCompleteVideoModalBody"
            defaultValue="By finalizing this video, you confirm that you own the rights to all of its content."
            ref={register}
          />

          <label
            className="form-label configuration-column-3"
            htmlFor="confirmCompleteVideoModalConfirmButton"
          >
            Modal Confirmation Button Label
          </label>
          <input
            type="text"
            className="form-input"
            name="confirmCompleteVideoModalConfirmButton"
            defaultValue="Confirm"
            ref={register}
          />

          <label
            className="form-label configuration-column-3"
            htmlFor="confirmCompleteVideoModalCancelButton"
          >
            Modal Cancel Button Label
          </label>
          <input
            type="text"
            className="form-input"
            name="confirmCompleteVideoModalCancelButton"
            defaultValue="Cancel"
            ref={register}
          />
        </div>
      </div>
    </form>
  );
}