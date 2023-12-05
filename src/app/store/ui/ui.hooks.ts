import { useAtom } from 'jotai';

import {
  errorStackTraceState,
  loadingState,
  showHighFeeConfirmationState,
  showTxSettingsCallback,
} from './ui';

export function useShowHighFeeConfirmationState() {
  return useAtom(showHighFeeConfirmationState);
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
