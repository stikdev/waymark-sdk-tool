export const theBlue = "#337AB7";

export const partnerPresets = {
    default: 'default',
    spectrum: 'spectrum',
    custom: 'custom',
};

export const defaultConfiguration = {
    "environment": 'demo',
    "orientation": 'left',
    "partnerID": 'fake-partner-id',
    "partnerSecret": 'zubbythewonderllamaeatsrhubarb',
    "shouldDefaultPersonalize": false,
    "shouldHideSaveButton": false,
    "completeVideoLabel": 'Buy',
    "exitEditorLabel": 'Exit',
    "shouldUseAdvancedDropdown": false,
    "shouldShowUnsavedChangesModal": true,
    "unsavedChangesModalTitle": 'Exit Editor',
    "unsavedChangesModalBody": 'Your video has unsaved edits. Are you sure you want to leave?',
    "unsavedChangesModalConfirmButton": 'Exit Editor',
    "unsavedChangesModalCancelButton": 'Cancel',
    "shouldShowConfirmCompleteVideoModal": false,
    "confirmCompleteVideoModalTitle": 'Finalize Video',
    "confirmCompleteVideoModalBody": 'By finalizing this video, you confirm that you own the rights to all of its content.',
    "confirmCompleteVideoModalConfirmButton": 'Confirm',
    "confirmCompleteVideoModalCancelButton": 'Cancel',
    "editorBackgroundColor": '',
};

export const spectrumConfiguration = {
    "environment": 'demo',
    "orientation": 'left',
    "partnerID": 'spectrum-reach-4dcQt4',
    "partnerSecret": 'test-secret',
    "shouldDefaultPersonalize": false,
    "shouldHideSaveButton": true,
    "completeVideoLabel": 'Done',
    "exitEditorLabel": 'Back',
    "shouldUseAdvancedDropdown": true,
    "shouldShowUnsavedChangesModal": true,
    "unsavedChangesModalTitle": 'Exit Editor',
    "unsavedChangesModalBody": 'Your video has unsaved edits. Are you sure you want to leave?',
    "unsavedChangesModalConfirmButton": 'Exit Editor',
    "unsavedChangesModalCancelButton": 'Cancel',
    "shouldShowConfirmCompleteVideoModal": true,
    "confirmCompleteVideoModalTitle": 'Finalize Video',
    "confirmCompleteVideoModalBody": 'By finalizing this video, you confirm that you own the rights to all of its content.',
    "confirmCompleteVideoModalConfirmButton": 'Confirm',
    "confirmCompleteVideoModalCancelButton": 'Cancel',
    "editorBackgroundColor": '#FFFFFF',
};

export const partnerConfigurations = {
    [partnerPresets.default]: defaultConfiguration,
    [partnerPresets.spectrum]: spectrumConfiguration,
};