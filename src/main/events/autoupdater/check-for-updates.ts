import { AppUpdaterEvent } from "@types";
import { registerEvent } from "../register-event";
import updater, { UpdateInfo } from "electron-updater";
import { WindowManager } from "@main/services";
import { app } from "electron";

const { autoUpdater } = updater;

const sendEvent = (event: AppUpdaterEvent) => {
  WindowManager.mainWindow?.webContents.send("autoUpdaterEvent", event);
};

const sendEventsForDebug = false;

const mockValuesForDebug = () => {
  sendEvent({ type: "update-available", info: { version: "1.3.0" } });
  sendEvent({ type: "update-downloaded" });
};

const checkForUpdates = async (_event: Electron.IpcMainInvokeEvent) => {
  autoUpdater
    .once("update-available", (info: UpdateInfo) => {
      sendEvent({ type: "update-available", info });
    })
    .once("update-downloaded", () => {
      sendEvent({ type: "update-downloaded" });
    });

  if (app.isPackaged) {
    autoUpdater.checkForUpdates();
  } else if (sendEventsForDebug) {
    mockValuesForDebug();
  }
};

registerEvent("checkForUpdates", checkForUpdates);
