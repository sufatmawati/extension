import { useAtom } from 'jotai';

import {
  errorStackTraceState,
  loadingState,
  showHighFeeConfirmationState,
  showSwitchAccountsState,
  showTxSettingsCallback,
} from './ui';

export function useShowHighFeeConfirmationState() {
  return useAtom(showHighFeeConfirmationState);
}

export function useShowSwitchAccountsState() {
  return useAtom(showSwitchAccountsState);
}

export function useShowTxSettingsCallback() {
  return useAtom(showTxSettingsCallback);
}

export function useLoadingState(key: string) {
  return useAtom(loadingState(key));
}

export function useErrorStackTraceState() {
  return useAtom(errorStackTraceState);
}
