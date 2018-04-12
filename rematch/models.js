import { dispatch } from '@rematch/core'; // 0.1.0-beta.8
import Expo from 'expo';
import { Dimensions } from 'react-native';
import Fire from '../ExpoParty/Fire';

export const score = {
  state: { current: 0, best: 0, last: null, isBest: false },
  reducers: {
    increment: ({ current, best, isBest, ...props }) => {
      const nextScore = current + 1;

      return {
        current: nextScore,
        best: Math.max(nextScore, best),
        isBest: nextScore > best,
        ...props,
      };
    },
    reset: state => {
      if (state.isBest && state.current >= state.best) {
        Fire.shared.saveScore(state.current);
      }

      return {
        ...state,
        current: 0,
        last: state.current,
        isBest: false,
      };
    },
  },
  effects: {},
};

export const game = {
  state: 'menu',
  reducers: {
    play: () => 'game',
    menu: () => 'menu',
  },
  effects: {},
};

export const dailyStreak = {
  state: 0,
  reducers: {
    increment: s => s + 1,
    assign: (s, props) => props,
    reset: () => 0,
  },
  effects: {
    rewardUser: async streak => {
      console.log('award', streak);
    },
  },
};

export const muted = {
  state: false,
  reducers: {
    toggle: state => !state,
  },
  effects: {},
};

export const screenshot = {
  state: null,
  reducers: {
    update: (state, uri) => uri,
  },
  effects: {
    updateAsync: async ({ ref }) => {
      const { width, height } = Dimensions.get('window');
      const options = {
        format: 'jpg',
        quality: 0.3,
        result: 'file',
        height,
        width,
      };
      const uri = await Expo.takeSnapshotAsync(ref, options);
      dispatch.screenshot.update(uri);
    },
  },
};
