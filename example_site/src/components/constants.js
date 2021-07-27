export const blueColor = "#005AFF";
export const blackColor = "#000000";

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

export const accountVideos = [
    {
        videoName: "Bold",
        createdAt: "2021-03-09T07:37:55.714759-04:00",
        updatedAt: "2021-03-19T07:37:55.714759-04:00",
        purchasedAt: null,
        thumbnailURL: "https://socialproof-prod.imgix.net/video_creatives/videotemplatevariant/thumbnail/971_1589225218.png?ixlib=react-8.6.4&auto=compress%2Cformat&fit=max&w=512",
    },
    {
        videoName: "Keystrokes",
        createdAt: "2021-07-01T07:37:55.714759-04:00",
        updatedAt: "2021-07-02T07:37:55.714759-04:00",
        purchasedAt: "2021-07-02T07:37:55.714759-04:00",
        thumbnailURL: "https://socialproof-prod.imgix.net/video_creatives/videotemplatevariant/thumbnail/1010_1591127654.png?ixlib=react-8.6.4&auto=compress%2Cformat&fit=max&w=798",
    },
    {
        videoName: "Genius",
        createdAt: "2021-05-18T07:37:55.714759-04:00",
        updatedAt: "2021-05-19T07:37:55.714759-04:00",
        purchasedAt: "2021-05-19T07:37:55.714759-04:00",
        thumbnailURL: "https://socialproof-prod.imgix.net/video_creatives/videotemplatevariant/thumbnail/1209_1597265598.png?ixlib=react-8.6.4&auto=compress%2Cformat&fit=max&w=512",
    },
    {
        videoName: "Retro",
        createdAt: "2021-06-22T07:37:55.714759-04:00",
        updatedAt: "2021-06-22T07:37:55.714759-04:00",
        purchasedAt: "2021-06-22T07:37:55.714759-04:00",
        thumbnailURL: "https://socialproof-prod.imgix.net/video_creatives/videotemplatevariant/thumbnail/965_1588797279.png?ixlib=react-8.6.4&auto=compress%2Cformat&fit=max&w=512",
    },
    {
        videoName: "Burst",
        createdAt: "2021-04-02T07:37:55.714759-04:00",
        updatedAt: "2021-05-20T07:37:55.714759-04:00",
        purchasedAt: null,
        thumbnailURL: "https://socialproof-prod.imgix.net/video_creatives/videotemplatevariant/thumbnail/1272_1600189314.png?ixlib=react-8.6.4&auto=compress%2Cformat&fit=max&w=512",
    }, 
];

export const durationFilters = [
    {
      displayName: '6 seconds',
      value: 6,
    },
    {
      displayName: '15 seconds',
      value: 15,
    },
    {
      displayName: '30 seconds',
      value: 30,
    }
];

export const aspectRatioFilters = [
    {
      displayName: "16:9 (TV-Ready)",
      value: "16:9",
    },
    {
      displayName: "4:5 (Digital Only)",
      value: "4:5",
    }
];
