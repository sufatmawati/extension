import { Suspense } from 'react';
import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { BroadcastErrorDialog } from '@app/components/broadcast-error-dialog/broadcast-error-dialog';
import { SendBtcDisabled } from '@app/components/crypto-assets/choose-crypto-asset/send-btc-disabled';
import { FullPageWithHeaderLoadingSpinner } from '@app/components/loading-spinner';
import { EditNonceDialog } from '@app/features/dialogs/edit-nonce-dialog/edit-nonce-dialog';
import { ledgerBitcoinTxSigningRoutes } from '@app/features/ledger/flows/bitcoin-tx-signing/ledger-bitcoin-sign-tx-container';
import { ledgerStacksTxSigningRoutes } from '@app/features/ledger/flows/stacks-tx-signing/ledger-sign-stacks-tx-container';
import { AccountGate } from '@app/routes/account-gate';

import { BroadcastError } from '../broadcast-error/broadcast-error';
import { ChooseCryptoAsset } from '../choose-crypto-asset/choose-crypto-asset';
import { SendContainer } from '../send-container';
import { Brc20SentSummary } from '../sent-summary/brc20-sent-summary';
import { BtcSentSummary } from '../sent-summary/btc-sent-summary';
import { StxSentSummary } from '../sent-summary/stx-sent-summary';
import { RecipientAccountsDialog } from './components/recipient-accounts-dialog/recipient-accounts-dialog';
import { SendBitcoinAssetContainer } from './family/bitcoin/components/send-bitcoin-asset-container';
import { Brc20SendForm } from './form/brc-20/brc20-send-form';
import { Brc20SendFormConfirmation } from './form/brc-20/brc20-send-form-confirmation';
import { BrcChooseFee } from './form/brc-20/brc-20-choose-fee';
import { BtcChooseFee } from './form/btc/btc-choose-fee';
import { BtcSendForm } from './form/btc/btc-send-form';
import { BtcSendFormConfirmation } from './form/btc/btc-send-form-confirmation';
import { Sip10TokenSendForm } from './form/stacks-sip10/sip10-token-send-form';
import { StacksSendFormConfirmation } from './form/stacks/stacks-send-form-confirmation';
import { StxSendForm } from './form/stx/stx-send-form';

const recipientAccountsDialogRoute = (
  <Route
    path={RouteUrls.SendCryptoAssetFormRecipientAccounts}
    element={<RecipientAccountsDialog />}
  />
);

const editNonceDialogRoute = <Route path={RouteUrls.EditNonce} element={<EditNonceDialog />} />;
const broadcastErrorDialogRoute = (
  <Route path={'confirm/broadcast-error'} element={<BroadcastErrorDialog />} />
);

export const sendCryptoAssetFormRoutes = (
  <Route element={<SendContainer />}>
    <Route
      path={RouteUrls.SendCryptoAsset}
      element={
        <AccountGate>
          <Suspense fallback={<FullPageWithHeaderLoadingSpinner />}>
            <ChooseCryptoAsset />
          </Suspense>
        </AccountGate>
      }
    />
    <Route element={<SendBitcoinAssetContainer />}>
      <Route
        path={RouteUrls.SendCryptoAssetForm.replace(':symbol', 'btc')}
        element={<BtcSendForm />}
      >
        {ledgerBitcoinTxSigningRoutes}
        {recipientAccountsDialogRoute}
      </Route>
      {/* FIXME - these routes need to be in RouteUrls */}
      <Route path="/send/btc/disabled" element={<SendBtcDisabled />} />
      <Route path="/send/btc/error" element={<BroadcastError />} />

      <Route path="/send/btc/confirm" element={<BtcSendFormConfirmation />} />
      <Route path={RouteUrls.SendBtcChooseFee} element={<BtcChooseFee />}>
        {ledgerBitcoinTxSigningRoutes}
      </Route>
      <Route path={RouteUrls.SentBtcTxSummary} element={<BtcSentSummary />} />

      <Route path={RouteUrls.SendBrc20SendForm} element={<Brc20SendForm />} />
      <Route path={RouteUrls.SendBrc20ChooseFee} element={<BrcChooseFee />}>
        {ledgerBitcoinTxSigningRoutes}
      </Route>
      <Route path={RouteUrls.SendBrc20Confirmation} element={<Brc20SendFormConfirmation />} />
      <Route path={RouteUrls.SentBrc20Summary} element={<Brc20SentSummary />} />
    </Route>
    <Route path={RouteUrls.SendCryptoAssetForm.replace(':symbol', 'stx')} element={<StxSendForm />}>
      {broadcastErrorDialogRoute}
      {editNonceDialogRoute}
      {recipientAccountsDialogRoute}
    </Route>{' '}
    {/* FIXME - check this */}
    <Route
      path={`${RouteUrls.SendCryptoAssetForm.replace(':symbol', 'stx')}/confirm`}
      element={<StacksSendFormConfirmation />}
    >
      {ledgerStacksTxSigningRoutes}
    </Route>
    <Route path={RouteUrls.SendSip10Form} element={<Sip10TokenSendForm />}>
      {broadcastErrorDialogRoute}
      {editNonceDialogRoute}
      {recipientAccountsDialogRoute}
    </Route>
    {/* FIXME - refactor this to use a proper route- is this even correct??? on send I hit sent/stx/0xa217094dca655f54385fd9cc57abb7429addf4ef5f2b84cf85a66d731d5b9cc2 */}
    <Route path="/send/:symbol/:contractId/confirm" element={<StacksSendFormConfirmation />}>
      {ledgerStacksTxSigningRoutes}
    </Route>
    <Route path={RouteUrls.SentStxTxSummary} element={<StxSentSummary />} />
  </Route>
);
