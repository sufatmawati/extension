import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { PsbtSelectors } from '@tests/selectors/requests.selectors';

import { getPsbtTxInputs, getPsbtTxOutputs } from '@shared/crypto/bitcoin/bitcoin.utils';
import { RouteUrls } from '@shared/route-urls';
import { closeWindow, isError } from '@shared/utils';

import { SignPsbtArgs } from '@app/common/psbt/requests';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { Button } from '@app/ui/components/button/button';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { Card } from '@app/ui/layout/card/card';
import { CardContent } from '@app/ui/layout/card/card-content';

import * as Psbt from './components';
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

  if (shouldDefaultToAdvancedView && psbtRaw) return <Psbt.PsbtRequestRaw psbt={psbtRaw} />;

  return (
    <PsbtSignerProvider value={psbtSignerContext}>
      <Card
        footer={
          <Footer flexDirection="row">
            <Button flexGrow={1} onClick={onCancel} variant="outline">
              Cancel
            </Button>
            <Button
              flexGrow={1}
              aria-busy={isBroadcasting}
              onClick={() =>
                onSignPsbt({
                  addressNativeSegwitTotal,
                  addressTaprootTotal,
                  fee,
                  inputs: psbtTxInputs,
                })
              }
            >
              Confirm
            </Button>
          </Footer>
        }
      >
        <CardContent dataTestId={PsbtSelectors.PsbtSignerCard} maxWidth="popupWidth">
          <Psbt.PsbtRequestHeader name={name} origin={origin} />
          <Psbt.PsbtRequestDetailsLayout>
            {isPsbtMutable ? <Psbt.PsbtRequestSighashWarningLabel origin={origin} /> : null}
            <Psbt.PsbtRequestDetailsHeader />
            <Psbt.PsbtInputsOutputsTotals />
            <Psbt.PsbtInputsAndOutputs />
            {psbtRaw ? <Psbt.PsbtRequestRaw psbt={psbtRaw} /> : null}
            <Psbt.PsbtRequestFee fee={fee} />
          </Psbt.PsbtRequestDetailsLayout>
        </CardContent>
      </Card>
    </PsbtSignerProvider>
  );
}
