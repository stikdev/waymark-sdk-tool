import { useState } from "react";
import { useForm } from "react-hook-form";
import classnames from "classnames";

import Waymark from "@waymark/waymark-sdk";

import { useAppContext } from "./AppProvider";
import "./ConfigurationControls.css";
import Header from "./Header.js";

import { partnerPresets, partnerConfigurations } from "./constants";

/**
 * Configuration for the entire application.
 */
export default function ConfigurationControls({ isOpen }) {
  const { register, watch, handleSubmit } = useForm();
  const [partner, setPartner] = useState('default');
  const {
    embedRef,
    setAccount,
    partnerID: defaultPartnerID,
    setPartnerID,
    partnerSecret: defaultPartnerSecret,
    setPartnerSecret,
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

  /**
   * Returns proper configuration settings for SDK Demo Site.
   * If the partner chosen is one of the predefined options,
   * then the configuration settings will be set to the 
   * their respective hardcoded settings. 
   * If the partner chosen is the custom configuration, then
   * the configuration settings will be set to what the user
   * has inputted.
   */
  const getConfiguration = (formData) => {
    let configuration = partnerConfigurations[formData.partner];
    // custom configuration
    if (!configuration) {
      configuration = formData;
    }
    return configuration;
  }

  /**
   * Returns proper orientation for editor
   */
  const getOrientation = (orientation) => {
    if (orientation === 'left' || orientation === 'right') {
      return orientation;
    }
    // Custom configuration results in value of false when user
    // desires left orientation and true when user desires
    // right orientation due to checkbox implementation
    return orientation ? 'right' : 'left';
  }

  const onSubmit = async (formData) => {
    const configuration = getConfiguration(formData);

    const {
      environment,
      orientation,
      partnerID,
      partnerSecret,
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
    } = configuration;

    console.log("Configuration:", configuration);

    if (waymarkInstance) {
      await waymarkInstance.cleanup();
    }

    setPartnerID(partnerID);
    setPartnerSecret(partnerSecret);
    setAccount(null);

    const waymarkOptions = {
      domElement: embedRef.current,
      editor: {
        orientation: getOrientation(orientation),
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
          shouldUseAdvancedDropdown,
        },
        hideSaveButton: shouldHideSaveButton,
        backgroundColor: editorBackgroundColor,
      },
      environment,
      timeout: 5000,
      isDebug: true,
    };

    console.log("Waymark Options", waymarkOptions);
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
    'fade-in-out': true,
     panel: true,
     open: isOpen,
     closed: !isOpen,
  });

  const titlePanel = classnames({
    "title-description": true,
     panel: true,
     open: isOpen,
     closed: !isOpen,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={titlePanel}>
      <div className='center'>
        <Header 
          title="Welcome to the Waymark SDK"
          subtitle="This demo site is intended to give you a sense of 
          what you can do with Waymark's SDK.
          The possibilities are limitless, but hopefully 
          this gets your gears turning about how the
          Waymark SDK could work for you."
        />

        <h4>To get started, choose an example partner</h4>

        <select
          name="partner"
          className="select-input"
          ref={register({ required: true })}
          value={partner}
          onChange={(e) => setPartner(e.target.value)}
        >
          <option selected value={partnerPresets.default}>Default Partner</option>
          <option value={partnerPresets.spectrum}>Spectrum Reach</option>
          <option value={partnerPresets.custom}>Custom</option>
        </select>
        
        <button 
          className="submit-button configuration-submit-button">
          See How It Works
        </button>
      </div>
      <div className='center-form'>
        <div 
          className={formClasses}
          style={{
            opacity: partner === 'custom' ? 1 : 0
          }}
        >
          <div>
            <h2>Configuration</h2>

            <label title="Environment" className="form-label" htmlFor="environment">
              Environment Connection
            </label>
            <select
              name="environment"
              ref={register({ required: true })}
              defaultValue="demo"
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

            <label className="form-label" htmlFor="partnerSecret">
              Partner Secret
            </label>
            <input
              type="text"
              className="form-input"
              name="partnerSecret"
              defaultValue={defaultPartnerSecret}
              ref={register({ required: true })}
            />
          </div>

          <div>
            <h2>Editor</h2>
            <h4>Editor Orientation: </h4>
            <label className="switch">
              <input 
                name="orientation"
                type="checkbox"
                ref={register}
              /> 
              <div className="slider round">
                <span className="switchOn"><h4>Right</h4></span>
                <span className="switchOff"><h4>Left</h4></span>
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
              defaultValue="Buy"
              ref={register}
            />
          </div>

          <div className="configuration-controls-subsection">
            <h2>Modals</h2>
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

            <div 
              className='fade-in-out'
              style={{
                opacity: shouldShowUnsavedChangesModal ? 1 : 0
              }}
            >
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
                defaultValue="Your video has unsaved edits. Are you 
                sure you want to leave?"
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
              
          </div>
          
          <div className="configuration-controls-subsection modal-align">
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

            <div 
              className='fade-in-out'
              style={{
                opacity: shouldShowConfirmCompleteVideoModal ? 1 : 0
              }}
            >
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
        </div>
      </div>
    </form>
  );
}
