const GhReleases = require('electron-gh-releases');
const electron = require('electron');
const pkg = require('../package.json');
const logger = require('./logger');

const app = electron.app;
const dialog = electron.dialog;

const updater = new GhReleases({
  repo: pkg.repo,
  currentVersion: app.getVersion()
});

module.exports = function update(showAlert) {
  // Check for updates
  updater.check((err, status) => {
    if (!err && status) {
      updater.download();
    } else {
      if (showAlert) {
        dialog.showMessageBox({
          type: 'info',
          buttons: ['Close'],
          title: 'No update available',
          message: 'You are currently running the latest version of Pomo.'
        });
      }
    }
  });

  updater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'question',
      buttons: ['Update & Restart', 'Cancel'],
      title: 'Update Available',
      cancelId: 99,
      message: 'There is an update available. Would you like to update Pomo now?'
    }, (response) => {
      logger.info('Exit: ' + response);
      if (response === 0) {
        updater.install();
      }
    });
  });
};
