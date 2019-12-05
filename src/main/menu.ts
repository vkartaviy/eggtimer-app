import { app, Menu, MenuItem } from 'electron';
import { Mode } from './types';
import { changeMode, start, stop, reset } from './actions';

const startButton = new MenuItem({
  id: 'action:start',
  label: '▶︎ Start',
  click: (): void => start()
});

const stopButton = new MenuItem({
  id: 'action:stop',
  label: '◼︎ Stop',
  enabled: false,
  click: (): void => stop()
});

const resetButton = new MenuItem({
  id: 'action:reset',
  label: '⏎ Reset',
  click: (): void => reset()
});

const pomodoroMode = new MenuItem({
  id: 'mode:pomodoro',
  label: 'Pomodoro',
  type: 'radio',
  accelerator: 'Command+Shift+P',
  checked: true,
  click: (): void => changeMode(Mode.Pomodoro)
});

const shortBreakMode = new MenuItem({
  id: 'mode:short-break',
  label: 'Short Break',
  type: 'radio',
  accelerator: 'Command+Shift+S',
  click: (): void => changeMode(Mode.ShortBreak)
});

const longBreakMode = new MenuItem({
  id: 'mode:long-break',
  label: 'Long Break',
  type: 'radio',
  accelerator: 'Command+Shift+L',
  click: (): void => changeMode(Mode.LongBreak)
});

const quitButton = new MenuItem({
  label: 'Quit',
  accelerator: 'Command+Q',
  click: (): void => app.quit()
});

const separator = new MenuItem({
  type: 'separator'
});

const menuItems = [
  startButton,
  stopButton,
  resetButton,
  separator,
  pomodoroMode,
  shortBreakMode,
  longBreakMode,
  separator,
  quitButton
];

export function createMenu(): Menu {
  const menu = new Menu();

  menuItems.forEach((menuItem) => {
    menu.append(menuItem);
  });

  return menu;
}
