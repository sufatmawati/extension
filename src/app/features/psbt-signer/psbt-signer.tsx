import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { getPsbtTxInputs, getPsbtTxOutputs } from '@shared/crypto/bitcoin/bitcoin.utils';
import { RouteUrls } from '@shared/route-urls';
import { closeWindow, isError } from '@shared/utils';

import { SignPsbtArgs } from '@app/common/psbt/requests';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { PopupCard } from '@app/ui/components/containers/popup/popup-card';

import * as PSBT from './components';
import { useParsedPsbt } from './hooks/use-parsed-psbt';
import { usePsbtSigner } from './hooks/use-psbt-signer';
import { PsbtSignerContext, PsbtSignerProvider } from './psbt-signer.context';

interface PsbtSignerProps {
  indexesToSign?: number[];
  isBroadcasting?: boolean;
  name?: string;
  origin: string;
  onCancel(): void;
  onSignPsbt({ addressNativeSegwitTotal, addressTaprootTotal, fee, inputs }: SignPsbtArgs): void;
  psbtHex: string;
}
export function PsbtSigner(props: PsbtSignerProps) {
  const { indexesToSign, isBroadcasting, name, origin, onCancel, onSignPsbt, psbtHex } = props;
  const navigate = useNavigate();
  const { address: addressNativeSegwit } = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { address: addressTaproot } = useCurrentAccountTaprootIndexZeroSigner();
  const { getRawPsbt, getPsbtAsTransaction } = usePsbtSigner();

  useOnOriginTabClose(() => closeWindow());

  const psbtRaw = useMemo(() => {
    try {
      return getRawPsbt(psbtHex);
    } catch (e) {
      navigate(RouteUrls.RequestError, {
        state: { message: isError(e) ? e.message : '', title: 'Failed request' },
      });
      return;
    }
  }, [getRawPsbt, navigate, psbtHex]);

  const psbtTx = useMemo(() => getPsbtAsTransaction(psbtHex), [getPsbtAsTransaction, psbtHex]);
  const psbtTxInputs = useMemo(() => getPsbtTxInputs(psbtTx), [psbtTx]);
  const psbtTxOutputs = useMemo(() => getPsbtTxOutputs(psbtTx), [psbtTx]);

  const {
    accountInscriptionsBeingTransferred,
    accountInscriptionsBeingReceived,
    addressNativeSegwitTotal,
    addressTaprootTotal,
    fee,
    isPsbtMutable,
    psbtInputs,
    psbtOutputs,
    shouldDefaultToAdvancedView,
  } = useParsedPsbt({
    inputs: psbtTxInputs,
    indexesToSign,
    outputs: psbtTxOutputs,
  });

  const psbtSignerContext: PsbtSignerContext = {
    accountInscriptionsBeingTransferred,
    accountInscriptionsBeingReceived,
    addressNativeSegwit,
    addressTaproot,
    addressNativeSegwitTotal,
    addressTaprootTotal,
    fee,
    isPsbtMutable,
    psbtInputs,
    psbtOutputs,
    shouldDefaultToAdvancedView,
  };

  if (shouldDefaultToAdvancedView && psbtRaw) return <PSBT.PsbtRequestRaw psbt={psbtRaw} />;

  return (
    <PsbtSignerProvider value={psbtSignerContext}>
      <PopupCard>
        <PSBT.PsbtRequestHeader name={name} origin={origin} />
        <PSBT.PsbtRequestDetailsLayout>
          {isPsbtMutable ? <PSBT.PsbtRequestSighashWarningLabel origin={origin} /> : null}
          <PSBT.PsbtRequestDetailsHeader />
          <PSBT.PsbtInputsOutputsTotals />
          <PSBT.PsbtInputsAndOutputs />
          {psbtRaw ? <PSBT.PsbtRequestRaw psbt={psbtRaw} /> : null}
          <PSBT.PsbtRequestFee fee={fee} />
        </PSBT.PsbtRequestDetailsLayout>
      </PopupCard>
      <PSBT.PsbtRequestActions
        isLoading={isBroadcasting}
        onCancel={onCancel}
        onSignPsbt={() =>
          onSignPsbt({ addressNativeSegwitTotal, addressTaprootTotal, fee, inputs: psbtTxInputs })
        }
      />
    </PsbtSignerProvider>
  );
}
