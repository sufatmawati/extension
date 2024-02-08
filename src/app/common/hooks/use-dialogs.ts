import {
  useShowHighFeeConfirmationState,
  useShowSwitchAccountsState,
  useShowTxSettingsCallback,
} from '@app/store/ui/ui.hooks';

export function useDialogs() {
  //  TODO try and refactor out this isShowingAccounts logic
  const [isShowingAccounts, setIsShowingSwitchAccountsState] = useShowSwitchAccountsState();
  const [isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation] =
    useShowHighFeeConfirmationState();

  const [isShowingTxSettingsCallback, setIsShowingTxSettingsCallback] = useShowTxSettingsCallback();

  return {
    isShowingAccounts,
    setIsShowingSwitchAccountsState,
    isShowingHighFeeConfirmation,
    setIsShowingHighFeeConfirmation,
    isShowingTxSettingsCallback,
    setIsShowingTxSettingsCallback,
  };
}
