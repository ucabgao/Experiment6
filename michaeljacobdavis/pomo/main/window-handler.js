'use strict';

const Positioner = require('electron-positioner');
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

function WindowHandler(url) {
  const defaults = {
    resizable: process.env.NODE_ENV === 'development' ? true : false,
    show: false,
    frame: false,
    width: 200,
    height: 300
  };
  const window = new BrowserWindow(defaults);

  const positioner = new Positioner(window);

  // Handle loss of focus
  if (process.env.NODE_ENV !== 'development') {
    window.on('blur', this.hide.bind(this));
  }

  window.loadURL(url);

  if (process.env.NODE_ENV === 'development') {
    window.openDevTools();
  }

  this.window = window;
  this.positioner = positioner;
}

WindowHandler.prototype.show = function show(trayPos) {
  const windowPosition = (process.platform === 'win32') ? 'trayBottomCenter' : 'trayCenter';
  let noBoundsPosition = null;

  // Default the window to the right if `trayPos` bounds are undefined or null.
  if ((typeof trayPos === 'undefined' || trayPos.x === 0) && windowPosition.substr(0, 4) === 'tray') {
    noBoundsPosition = (process.platform === 'win32') ? 'bottomRight' : 'topRight';
  }

  const position = this.positioner.calculate(noBoundsPosition || windowPosition, trayPos);

  this.window.setPosition(position.x, position.y);
  this.window.show();
  return;
};

WindowHandler.prototype.hide = function hide() {
  if (!this.window) return;
  this.window.hide();
};

module.exports = WindowHandler;
