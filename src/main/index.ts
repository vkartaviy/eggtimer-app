import { app } from 'electron';
import { reaction } from 'mobx';
import path from 'path';
import store from './store';
import { createTray } from './tray';
import { createMenu } from './menu';
import { Mode, State } from './types';
import { isMac, isWindows } from './env';
import { APP_TITLE } from './constants';

declare const __static: string;

if (app.dock && app.dock.hide) {
  app.dock.hide();
}

app.on('ready', () => {
  const tray = createTray();
  const menu = createMenu();

  tray.setContextMenu(menu);

  // Prevent app being put to sleep
  // powerSaveBlocker.start("prevent-app-suspension");

  function hideTimer(): void {
    tray.setTitle('');
    tray.setToolTip(APP_TITLE);
  }

  function formatTimer(timer: number): string {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    return `${`0${minutes}`.slice(-2)}:${`0${seconds}`.slice(-2)}`;
  }

  function updateTimer(timer: number): void {
    if (timer <= 0) {
      return hideTimer();
    }

    const formatted = formatTimer(timer);

    tray.setTitle(formatted);
    tray.setToolTip(formatted);
  }

  function updateAction(): void {
    const { state } = store;

    menu.getMenuItemById('action:start').enabled = state !== State.Active;
    menu.getMenuItemById('action:stop').enabled = state === State.Active;
  }

  const menuItemIdByMode = {
    [Mode.Pomodoro]: 'mode:pomodoro',
    [Mode.ShortBreak]: 'mode:short-break',
    [Mode.LongBreak]: 'mode:long-break'
  };

  function updateMode(mode: Mode): void {
    menu.getMenuItemById(menuItemIdByMode[mode]).checked = true;
  }

  function updateImage(): void {
    const { mode, state } = store;

    if (state === State.Active && mode === Mode.Pomodoro) {
      tray.setImage(path.resolve(__static, 'icons', 'eggActiveTemplate.png'));
    } else {
      tray.setImage(path.resolve(__static, 'icons', 'eggTemplate.png'));
    }
  }

  reaction(() => store.state, updateAction);
  reaction(() => store.mode, updateMode);
  reaction(() => store.remainingTime, updateTimer);

  if (!isWindows) {
    reaction(() => [store.mode, store.state], updateImage);
  }
});

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (!isMac) {
    app.quit();
  }
});
