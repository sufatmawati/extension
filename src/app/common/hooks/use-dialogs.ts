import { useShowHighFeeConfirmationState, useShowTxSettingsCallback } from '@app/store/ui/ui.hooks';

export function useDialogs() {
  const [isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation] =
    useShowHighFeeConfirmationState();

  const [isShowingTxSettingsCallback, setIsShowingTxSettingsCallback] = useShowTxSettingsCallback();

  return {
    isShowingHighFeeConfirmation,
    setIsShowingHighFeeConfirmation,
    isShowingTxSettingsCallback,
    setIsShowingTxSettingsCallback,
  };
}
