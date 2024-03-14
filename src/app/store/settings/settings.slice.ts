import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { UserSelectedTheme } from '@app/common/theme-provider';

type HasAcceptedAnalytics = null | boolean;
interface InitialState {
  userSelectedTheme: UserSelectedTheme;
  hasAllowedAnalytics: HasAcceptedAnalytics;
  dismissedMessages: string[];
}

const initialState: InitialState = {
  userSelectedTheme: 'system',
  hasAllowedAnalytics: null,
  dismissedMessages: [],
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUserSelectedTheme(state, action: PayloadAction<UserSelectedTheme>) {
      state.userSelectedTheme = action.payload;
    },
    setHasAllowedAnalytics(state, action: PayloadAction<boolean>) {
      state.hasAllowedAnalytics = action.payload;
    },
    messageDismissed(state, action: PayloadAction<string>) {
      if (!Array.isArray(state.dismissedMessages)) state.dismissedMessages = [];
      state.dismissedMessages = [...state.dismissedMessages, action.payload];
    },
    resetMessages(state) {
      state.dismissedMessages = [];
    },
  },
});
