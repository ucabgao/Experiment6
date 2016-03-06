'use strict';

const electron = require('electron');
const path = require('path');
const WindowHandler = require('./main/window-handler');
const tick = require('./main/tick');
const runner = require('./main/runner');
const update = require('./main/update');
const logger = require('./main/logger');
const appActions = require('./common/action-types/app');
const bus = require('./main/event-bus');
const notifier = require('node-notifier');
const app = electron.app;
const Tray = electron.Tray;
const crashReporter = electron.crashReporter;
const ipc = electron.ipcMain;

require('electron-debug')();
crashReporter.start();

// Log exceptions
process.once('uncaughtException', (error) => {
  logger.error('uncaughtException', { message: error.message, stack: error.stack });

  // Exit with error
  process.exit(1);
});

app.on('ready', () => {
  const tray = new Tray(path.join(app.getAppPath(), 'IconTemplate.png'));
  let cachedBounds;
  let appUrl;

  // Load app
  if (process.env.HOT) {
    appUrl = `file://${__dirname}/app/hot-dev-app.html`;
  } else {
    appUrl = `file://${__dirname}/app/app.html`;
  }

  let windowHandler = new WindowHandler(appUrl);

  // Handle close
  windowHandler.window.on('closed', () => {
    windowHandler = null;
  });

  function click(e, bounds) {
    if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) {
      return windowHandler.hide();
    }

    if (windowHandler.window.isVisible()) {
      return windowHandler.hide();
    }

    cachedBounds = bounds || cachedBounds;
    windowHandler.show(cachedBounds);
  }

  // Register tray events
  tray
  .on('click', click)
  .on('double-click', click);

  bus.on(appActions.APP_TITLE, (title) => {
    tray.setTitle(title);
  });

  bus.on(appActions.APP_NOTIFY, (notification) => {
    notifier.notify(notification);
  });

  // Hide Dock
  if (app.dock) {
    app.dock.hide();
  }

  runner(ipc, tick);
  update(false);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
