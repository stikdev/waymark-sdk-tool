import { useForm } from "react-hook-form";

import Waymark from "@waymark/waymark-sdk";

import { useAppContext } from "./AppProvider";
import "./ConfigurationControls.css";
import Header from "./Header.js";

import { siteConfigurations } from "../constants/app";

/**
 * Configuration for the entire application.
 */
export default function ConfigurationControls() {
  const { register, watch, handleSubmit } = useForm();

  const {
    embedRef,
    setAccount,
    partnerID: defaultPartnerID,
    setPartnerID,
    partnerSecret: defaultPartnerSecret,
    setPartnerSecret,
    showCustomForm,
    setShowCustomForm,
    setSiteConfiguration,
    waymarkInstance,
    setWaymarkInstance,
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

  function clickButton (selectSiteConfiguration) {
    setSiteConfiguration(selectSiteConfiguration);
    if (selectSiteConfiguration.id === 'custom') {
      setShowCustomForm(!showCustomForm);
      return;
    }
    onSelectConfiguration(selectSiteConfiguration.sdkOptions);   
  }

  const onSelectConfiguration = async (configuration) => {

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
      console.error(`Problem initializing SDK: ${error}`);
    }
  };

  return (
    <div className="title-description">
      <Header 
        title="Welcome to the Waymark SDK"
        subtitle="This demo site is intended to give you a sense of 
        what you can do with Waymark's SDK.
        The possibilities are limitless, but hopefully 
        this gets your gears turning about how the
        Waymark SDK could work for you."
        isAdPortalFlow={false}
      />
      
      <div className='center'>
        <h4>To get started, choose an example flow</h4>
      </div>

      <div className='three-columns'>
        {siteConfigurations.map((config) => (
          <div className='configuration-controls-subsection' key={config.id}>
            <button
              className='configuration-card'
              onClick={() => clickButton(config)}
              key={config.displayName}
            >
              <img 
                className='configuration-image'
                src={config.thumbnailURL}
                alt={`${config.displayName} thumbnail`}
                key={config.displayName}
              />
              {config.displayName}
          </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(async (formData) => onSelectConfiguration(formData))}>
        <div 
          className='center-form fade-in-out'
          style={{
            opacity: showCustomForm ? 1 : 0
          }}
        >
          <div 
            className="configuration-controls-form"
          >
            <div className="configuration-controls-subsection"> 
              <div className="column-title">Configuration</div>

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
                name="partnerID"
                defaultValue={defaultPartnerID}
                ref={register({ required: true })}
              />

              <label className="form-label" htmlFor="partnerSecret">
                Partner Secret
              </label>
              <input
                type="text"
                name="partnerSecret"
                defaultValue={defaultPartnerSecret}
                ref={register({ required: true })}
              />

              <button 
                className="submit-button configuration-submit-button">
                See How It Works
              </button>
            </div>

            <div className="configuration-controls-subsection">
              <div className="column-title">Editor</div>
              <div className="form-label">Editor Orientation:</div>
              <label className="switch">
                <input 
                  name="orientation"
                  type="checkbox"
                  ref={register}
                /> 
                <div className="slider round">
                  <span className="switchOn">Right</span>
                  <span className="switchOff">Left</span>
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
                name="editorBackgroundColor"
                defaultValue=""
                ref={register}
              />

              <div className="column-title">Labels</div>
              <label
                className="form-label configuration-column-3"
                htmlFor="exitEditorLabel"
              >
                Exit Editor Label
              </label>
              <input
                type="text"
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
                name="completeVideoLabel"
                defaultValue="Buy"
                ref={register}
              />
            </div>

            <div className="configuration-controls-subsection">
              <div className="column-title">Modals</div>
              Unsaved Changes Confirmation Modal

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
                  name="unsavedChangesModalCancelButton"
                  defaultValue="Cancel"
                  ref={register}
                />
              </div>
            </div>
            
            <div className="configuration-controls-subsection modal-align">
              Complete Video Confirmation Modal

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
                  name="confirmCompleteVideoModalCancelButton"
                  defaultValue="Cancel"
                  ref={register}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
