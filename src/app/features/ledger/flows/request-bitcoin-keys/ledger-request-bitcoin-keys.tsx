import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import BitcoinApp from 'ledger-bitcoin';

import { bitcoinNetworkModeToCoreNetworkMode } from '@shared/crypto/bitcoin/bitcoin.utils';

import { pullBitcoinKeysFromLedgerDevice } from '@app/features/ledger/flows/request-bitcoin-keys/request-bitcoin-keys.utils';
import { ledgerRequestKeysRoutes } from '@app/features/ledger/generic-flows/request-keys/ledger-request-keys-route-generator';
import { LedgerRequestKeysContext } from '@app/features/ledger/generic-flows/request-keys/ledger-request-keys.context';
import { RequestKeysFlow } from '@app/features/ledger/generic-flows/request-keys/request-keys-flow';
import {
  defaultNumberOfKeysToPullFromLedgerDevice,
  useRequestLedgerKeys,
} from '@app/features/ledger/generic-flows/request-keys/use-request-ledger-keys';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import {
  connectLedgerBitcoinApp,
  getBitcoinAppVersion,
  isBitcoinAppOpen,
} from '@app/features/ledger/utils/bitcoin-ledger-utils';
import { useActionCancellableByUser } from '@app/features/ledger/utils/stacks-ledger-utils';
import { bitcoinKeysSlice } from '@app/store/ledger/bitcoin/bitcoin-key.slice';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

function LedgerRequestBitcoinKeys() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const canUserCancelAction = useActionCancellableByUser();
  const ledgerNavigate = useLedgerNavigate();
  const network = useCurrentNetwork();

  const chain = 'bitcoin';

  const { requestKeys, latestDeviceResponse, awaitingDeviceConnection } =
    useRequestLedgerKeys<BitcoinApp>({
      chain,
      connectApp: connectLedgerBitcoinApp(network.chain.bitcoin.bitcoinNetwork),
      getAppVersion: getBitcoinAppVersion,
      isAppOpen: isBitcoinAppOpen({ network: network.chain.bitcoin.bitcoinNetwork }),
      onSuccess() {
        navigate('/', { replace: true });
      },
      async pullKeysFromDevice(app) {
        const { keys } = await pullBitcoinKeysFromLedgerDevice(app)({
          network: bitcoinNetworkModeToCoreNetworkMode(network.chain.bitcoin.bitcoinNetwork),
          onRequestKey(index) {
            if (index <= 4) {
              ledgerNavigate.toDeviceBusyStep(
                `Requesting Bitcoin Native Segwit address (${index + 1}…${defaultNumberOfKeysToPullFromLedgerDevice})`
              );
              return;
            }
            ledgerNavigate.toDeviceBusyStep(
              `Requesting Bitcoin Taproot address (${index - 4}…${defaultNumberOfKeysToPullFromLedgerDevice})`
            );
          },
        });
        dispatch(bitcoinKeysSlice.actions.addKeys(keys));
      },
    });

  const ledgerContextValue: LedgerRequestKeysContext = {
    chain: 'bitcoin',
    pullPublicKeysFromDevice: requestKeys,
    latestDeviceResponse,
    awaitingDeviceConnection,
    outdatedAppVersionWarning: false,
  };

  return (
    <RequestKeysFlow
      context={ledgerContextValue}
      isActionCancellableByUser={!awaitingDeviceConnection && canUserCancelAction}
    />
  );
}

export const requestBitcoinKeysRoutes = ledgerRequestKeysRoutes({
  path: 'bitcoin',
  component: <LedgerRequestBitcoinKeys />,
});
