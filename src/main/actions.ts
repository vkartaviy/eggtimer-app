import { action } from 'mobx';
import { Duration, Mode, State } from './types';
import { POMODORO_ROUNDS_BEFORE_LONG_BREAK } from './constants';
import notify from './notify';
import store from './store';

const durationByMode = {
  [Mode.Pomodoro]: Duration.Pomodoro,
  [Mode.ShortBreak]: Duration.ShortBreak,
  [Mode.LongBreak]: Duration.LongBreak
};

const nameByMode = {
  [Mode.Pomodoro]: 'Pomodoro',
  [Mode.ShortBreak]: 'Short Break',
  [Mode.LongBreak]: 'Long Break'
};

const notificationByMode = {
  [Mode.Pomodoro]: 'Your Pomodoro is over!',
  [Mode.ShortBreak]: 'Your short break is over!',
  [Mode.LongBreak]: 'Your long break is over!'
};

const tick = action(() => {
  if (store.state !== State.Active) {
    return;
  }

  const { startTime, mode, duration } = store;
  const currentTime = Date.now();
  const timeDiff = startTime ? currentTime - startTime : 0;
  const remainingTime = duration - Math.floor(timeDiff / 1e3);

  if (remainingTime > 0) {
    store.remainingTime = remainingTime;
  } else {
    stop();

    if (store.mode === Mode.Pomodoro) {
      if (store.round % POMODORO_ROUNDS_BEFORE_LONG_BREAK === 0) {
        changeMode(Mode.LongBreak);
      } else {
        changeMode(Mode.ShortBreak);
      }
    } else {
      changeMode(Mode.Pomodoro);
    }

    notifyEndTime(mode, store.mode);
  }

  setTimeout(tick, 1e3);
});

const notifyEndTime = (prevMode: Mode, nextMode: Mode): void => {
  notify(
    notificationByMode[prevMode],
    {
      wait: true,
      actions: nameByMode[nextMode]
    },
    action((err: Error | null, response: string) => {
      if (response === 'activate') {
        changeMode(nextMode);
        start();
      }
    })
  );
};

const changeMode = action((mode: Mode, reset: boolean = false): void => {
  const willChange = store.mode !== mode;

  store.mode = mode;
  store.duration = durationByMode[mode];

  if (willChange) {
    stop();

    if (reset) {
      store.round = 0;
    }
  }
});

const changeState = action((state: State) => {
  const willStart = state === State.Active && store.state !== State.Active;
  const willStop = state === State.Stopped && store.state !== State.Stopped;

  store.state = state;

  if (willStart) {
    store.startTime = Date.now();
    store.remainingTime = store.duration;

    if (store.mode === Mode.Pomodoro) {
      store.round += 1;
    }

    tick();
  } else if (willStop) {
    store.startTime = null;
    store.remainingTime = 0;
  }
});

const start = action(() => {
  changeState(State.Active);
});

const stop = action(() => {
  changeState(State.Stopped);
});

const reset = action(() => {
  stop();
  changeMode(Mode.Pomodoro);

  store.round = 0;
});

export { changeMode, changeState, start, stop, reset };
