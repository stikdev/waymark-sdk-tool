import AccountAuthentication from "../components/AccountAuthentication";
import AccountPage from "../components/AccountPage";
import AdPortalConfirmation from "../components/AdPortalConfirmation";
import AdPortalLanding from "../components/AdPortalLanding";
import Header from "../components/Header";
import AdPortalHeader from "../components/AdPortalHeader";

export const blueColor = "#005AFF";
export const blackColor = "#000000";

export const configurationIDs = {
  generic: "generic",
  adPortal: "adPortal",
  custom: "custom",
};

export const genericConfiguration = {
  environment: "demo",
  orientation: "left",
  partnerID: "fake-partner-id",
  partnerSecret: "zubbythewonderllamaeatsrhubarb",
  shouldDefaultPersonalize: false,
  shouldHideSaveButton: false,
  completeVideoLabel: "Buy",
  exitEditorLabel: "Exit",
  shouldUseAdvancedDropdown: false,
  shouldShowUnsavedChangesModal: true,
  unsavedChangesModalTitle: "Exit Editor",
  unsavedChangesModalBody:
    "Your video has unsaved edits. Are you sure you want to leave?",
  unsavedChangesModalConfirmButton: "Exit Editor",
  unsavedChangesModalCancelButton: "Cancel",
  shouldShowConfirmCompleteVideoModal: false,
  confirmCompleteVideoModalTitle: "Finalize Video",
  confirmCompleteVideoModalBody:
    "By finalizing this video, you confirm that you own the rights to all of its content.",
  confirmCompleteVideoModalConfirmButton: "Confirm",
  confirmCompleteVideoModalCancelButton: "Cancel",
  editorBackgroundColor: "",
};

export const adPortalConfiguration = {
  environment: "demo",
  orientation: "left",
  partnerID: "spectrum-reach-4dcQt4",
  partnerSecret: "test-secret",
  shouldDefaultPersonalize: false,
  shouldHideSaveButton: true,
  completeVideoLabel: "Done",
  exitEditorLabel: "Back",
  shouldUseAdvancedDropdown: true,
  shouldShowUnsavedChangesModal: true,
  unsavedChangesModalTitle: "Exit Editor",
  unsavedChangesModalBody:
    "Your video has unsaved edits. Are you sure you want to leave?",
  unsavedChangesModalConfirmButton: "Exit Editor",
  unsavedChangesModalCancelButton: "Cancel",
  shouldShowConfirmCompleteVideoModal: true,
  confirmCompleteVideoModalTitle: "Finalize Video",
  confirmCompleteVideoModalBody:
    "By finalizing this video, you confirm that you own the rights to all of its content.",
  confirmCompleteVideoModalConfirmButton: "Confirm",
  confirmCompleteVideoModalCancelButton: "Cancel",
  editorBackgroundColor: "#FFFFFF",
};

export const siteConfigurations = [
  {
    displayName: "Ad Portal",
    id: configurationIDs.adPortal,
    sdkOptions: adPortalConfiguration,
    thumbnailURL:
      "https://sp-prod-s3-images-web.s3.amazonaws.com/sdk_demo_site/adportal-thumbnail-transparent.png",
    navigations: {
      postConfiguration: AdPortalLanding,
      postEditor: AdPortalConfirmation,
    },
    templateBrowserHeader: (
      <>
        <AdPortalHeader />
        <div className="adportal-title">choose your template</div>
        <div className="adportal-subtitle">
          <b>Unlimited essentials — </b>
          These templates work across tons of industries, and subscribers can
          create them without using credits.
        </div>
      </>
    ),
  },
  {
    displayName: "Generic",
    id: configurationIDs.generic,
    sdkOptions: genericConfiguration,
    thumbnailURL:
      "https://sp-prod-s3-images-web.s3.amazonaws.com/sdk_demo_site/generic-thumbnail-transparent.png",
    navigations: {
      postConfiguration: AccountAuthentication,
      postEditor: AccountPage,
    },
    templateBrowserHeader: (
      <Header
        title="Display Templates"
        subtitle="Get a list of templates organized by category and
                filtered by length and/or aspect ratio. Show any or all of
                them any way that you like."
        isAdPortalFlow={false}
      />
    ),
  },
  {
    displayName: "Custom",
    id: configurationIDs.custom,
    thumbnailURL:
      "https://sp-prod-s3-images-web.s3.amazonaws.com/sdk_demo_site/custom-thumbnail-transparent.png",
    navigations: {
      postConfiguration: AccountAuthentication,
      postEditor: AccountPage,
    },
    templateBrowserHeader: (
      <Header
        title="Display Templates"
        subtitle="Get a list of templates organized by category and
                filtered by length and/or aspect ratio. Show any or all of
                them any way that you like."
        isAdPortalFlow={false}
      />
    ),
  },
];

export const accountVideos = [
  {
    videoName: "Bold",
    createdAt: "2021-03-09T07:37:55.714759-04:00",
    updatedAt: "2021-03-19T07:37:55.714759-04:00",
    purchasedAt: null,
    thumbnailURL:
      "https://socialproof-prod.imgix.net/video_creatives/videotemplatevariant/thumbnail/971_1589225218.png?ixlib=react-8.6.4&auto=compress%2Cformat&fit=max&w=512",
    width: 1080,
    height: 1350,
  },
  {
    videoName: "Keystrokes",
    createdAt: "2021-07-01T07:37:55.714759-04:00",
    updatedAt: "2021-07-02T07:37:55.714759-04:00",
    purchasedAt: "2021-07-02T07:37:55.714759-04:00",
    thumbnailURL:
      "https://socialproof-prod.imgix.net/video_creatives/videotemplatevariant/thumbnail/1010_1591127654.png?ixlib=react-8.6.4&auto=compress%2Cformat&fit=max&w=798",
    width: 1920,
    height: 1080,
  },
  {
    videoName: "Genius",
    createdAt: "2021-05-18T07:37:55.714759-04:00",
    updatedAt: "2021-05-19T07:37:55.714759-04:00",
    purchasedAt: "2021-05-19T07:37:55.714759-04:00",
    thumbnailURL:
      "https://socialproof-prod.imgix.net/video_creatives/videotemplatevariant/thumbnail/1209_1597265598.png?ixlib=react-8.6.4&auto=compress%2Cformat&fit=max&w=512",
    width: 1080,
    height: 1350,
  },
  {
    videoName: "Retro",
    createdAt: "2021-06-22T07:37:55.714759-04:00",
    updatedAt: "2021-06-22T07:37:55.714759-04:00",
    purchasedAt: "2021-06-22T07:37:55.714759-04:00",
    thumbnailURL:
      "https://socialproof-prod.imgix.net/video_creatives/videotemplatevariant/thumbnail/965_1588797279.png?ixlib=react-8.6.4&auto=compress%2Cformat&fit=max&w=512",
    width: 1080,
    height: 1350,
  },
  {
    videoName: "Burst",
    createdAt: "2021-04-02T07:37:55.714759-04:00",
    updatedAt: "2021-05-20T07:37:55.714759-04:00",
    purchasedAt: null,
    thumbnailURL:
      "https://socialproof-prod.imgix.net/video_creatives/videotemplatevariant/thumbnail/1272_1600189314.png?ixlib=react-8.6.4&auto=compress%2Cformat&fit=max&w=512",
    width: 1080,
    height: 1350,
  },
];

export const durationFilters = [
  {
    displayName: "6 seconds",
    value: 6,
  },
  {
    displayName: "15 seconds",
    value: 15,
  },
  {
    displayName: "30 seconds",
    value: 30,
  },
];

export const aspectRatioFilters = [
  {
    displayName: "16:9 (TV-Ready)",
    value: "16:9",
  },
  {
    displayName: "4:5 (Digital Only)",
    value: "4:5",
  },
];
