import { observable } from 'mobx';
import { Duration, Mode, State } from './types';

type Store = {
  mode: Mode;
  state: State;
  round: number;
  duration: Duration;
  startTime: number | null;
  remainingTime: number;
};

const store: Store = observable<Store>({
  mode: Mode.Pomodoro,
  state: State.Stopped,
  round: 0,
  duration: Duration.Pomodoro,
  startTime: null,
  remainingTime: 0
});

export default store;
