import {
  DURATION_LONG_BREAK,
  DURATION_POMODORO,
  DURATION_SHORT_BREAK,
  MODE_LONG_BREAK,
  MODE_POMODORO,
  MODE_SHORT_BREAK,
  STATE_ACTIVE,
  STATE_PAUSED,
  STATE_STOPPED
} from './constants';

export enum Mode {
  Pomodoro = MODE_POMODORO,
  ShortBreak = MODE_SHORT_BREAK,
  LongBreak = MODE_LONG_BREAK
}

export enum State {
  Active = STATE_ACTIVE,
  Stopped = STATE_STOPPED,
  Paused = STATE_PAUSED
}

export enum Duration {
  Pomodoro = DURATION_POMODORO,
  ShortBreak = DURATION_SHORT_BREAK,
  LongBreak = DURATION_LONG_BREAK
}
