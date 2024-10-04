import { StorageKeys } from "~constants";
import { storage } from "~services/storage";

chrome.action.onClicked.addListener(async (tab) => {
  await storage.set(StorageKeys.ShowContent, true);
});
