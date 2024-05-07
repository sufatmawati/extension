import { createContext, useContext, useState } from 'react';

import type { HasChildren } from '@app/common/has-children';

export interface StacksCommonSendFormContext {
  showHighFeeWarningDialog: boolean;
  setShowHighFeeWarningDialog(val: boolean): void;
  hasBypassedFeeWarning: boolean;
  setHasBypassedFeeWarning(val: boolean): void;
}

export const stacksCommonSendFormContext = createContext<StacksCommonSendFormContext | null>(null);

export function useStacksCommonSendFormContext() {
  const ctx = useContext(stacksCommonSendFormContext);
  if (!ctx) throw new Error(`stacksCommonSendFormContext must be used within a context`);
  return ctx;
}

export const StacksCommonSendFormProvider = stacksCommonSendFormContext.Provider;

interface StacksCommonSendFormContainerProps extends HasChildren {}
export function StacksCommonSendFormContainer({ children }: StacksCommonSendFormContainerProps) {
  const [showHighFeeWarningDialog, setShowHighFeeWarningDialog] = useState(false);
  const [hasBypassedFeeWarning, setHasBypassedFeeWarning] = useState(false);
  return (
    <StacksCommonSendFormProvider
      value={{
        showHighFeeWarningDialog,
        setShowHighFeeWarningDialog,
        hasBypassedFeeWarning,
        setHasBypassedFeeWarning,
      }}
    >
      {children}
    </StacksCommonSendFormProvider>
  );
}
