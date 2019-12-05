import { Tray } from 'electron';
import path from 'path';
import { isWindows } from './env';
import { APP_TITLE } from './constants';

declare const __static: string;

export function createTray(): Tray {
  const tray = new Tray(
    isWindows
      ? path.resolve(__static, 'icons', 'eggColored.png')
      : path.resolve(__static, 'icons', 'eggTemplate.png')
  );

  tray.setToolTip(APP_TITLE);

  return tray;
}
