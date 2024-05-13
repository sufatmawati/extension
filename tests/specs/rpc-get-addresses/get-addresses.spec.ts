import type { BrowserContext, Page } from '@playwright/test';
import { TEST_PASSWORD } from '@tests/mocks/constants';
import { makeLedgerTestAccountWalletState } from '@tests/page-object-models/onboarding.page';

import type { SupportedBlockchains } from '@shared/constants';

import { test } from '../../fixtures/fixtures';

function softwareBeforeEach() {
  return () =>
    test.beforeEach(
      async ({ extensionId, onboardingPage }) =>
        await onboardingPage.signInWithTestAccount(extensionId)
    );
}

function ledgerBeforeEach(state: object) {
  return () =>
    test.beforeEach(
      async ({ extensionId, onboardingPage }) =>
        await onboardingPage.signInWithLedgerAccount(extensionId, state)
    );
}

function getExpectedResponseForKeys(keys: SupportedBlockchains[]) {
  const bitcoinKeys = [
    {
      symbol: 'BTC',
      type: 'p2wpkh',
      address: 'bc1q530dz4h80kwlzywlhx2qn0k6vdtftd93c499yq',
      publicKey: '030347be500a8b2707a00e7576c0c527a247cddc6e8363ee51147b8e43b590baa9',
      derivationPath: "m/84'/0'/0'/0/0",
    },
    {
      symbol: 'BTC',
      type: 'p2tr',
      address: 'bc1putuzj9lyfcm8fef9jpy85nmh33cxuq9u6wyuk536t9kemdk37yjqmkc0pg',
      publicKey: '0347b913aed4ee088b6fea3e9537836a1c8f1b72111cf010af5589d93f3a433f02',
      tweakedPublicKey: '47b913aed4ee088b6fea3e9537836a1c8f1b72111cf010af5589d93f3a433f02',
      derivationPath: "m/86'/0'/0'/0/0",
    },
  ];
  const stacksKeys = [{ symbol: 'STX', address: 'SPS8CKF63P16J28AYF7PXW9E5AACH0NZNTEFWSFE' }];
  return {
    jsonrpc: '2.0',
    result: {
      addresses: [
        ...(keys.includes('bitcoin') ? bitcoinKeys : []),
        ...(keys.includes('stacks') ? stacksKeys : []),
      ],
    },
  };
}

async function interceptRequestPopup(context: BrowserContext) {
  return context.waitForEvent('page');
}

async function initiateGetAddresses(page: Page) {
  return page.evaluate(async () => (window as any).LeatherProvider?.request('getAddresses'));
}

async function clickConnectLeatherButton(popup: Page) {
  const button = popup.getByText('Connect Leather');
  await test.expect(button).toBeVisible();
  await button.click();
}

test.describe('Rpc: GetAddresses', () => {
  test.beforeEach(
    async ({ extensionId, globalPage }) => await globalPage.setupAndUseApiCalls(extensionId)
  );

  const specs = {
    softwareWallet: {
      beforeEach: softwareBeforeEach(),
      expectedResult: getExpectedResponseForKeys(['bitcoin', 'stacks']),
    },
    ledgerWithBitcoinAndStacksKey: {
      beforeEach: ledgerBeforeEach(makeLedgerTestAccountWalletState(['bitcoin', 'stacks'])),
      expectedResult: getExpectedResponseForKeys(['bitcoin', 'stacks']),
    },
    ledgerWithStacksKeysOnly: {
      beforeEach: ledgerBeforeEach(makeLedgerTestAccountWalletState(['stacks'])),
      expectedResult: getExpectedResponseForKeys(['stacks']),
    },
    ledgerWithBitcoinKeysOnly: {
      beforeEach: ledgerBeforeEach(makeLedgerTestAccountWalletState(['bitcoin'])),
      expectedResult: getExpectedResponseForKeys(['bitcoin']),
    },
  } as const;

  for (const [walletPreset, { beforeEach, expectedResult }] of Object.entries(specs)) {
    test.describe(`${walletPreset} `, () => {
      beforeEach();

      test('the promise resolves with addresses successfully', async ({ page, context }) => {
        await page.goto('localhost:3000');
        const getAddressesPromise = initiateGetAddresses(page);

        const popup = await interceptRequestPopup(context);
        await clickConnectLeatherButton(popup);

        const result = await getAddressesPromise;
        if (!result) throw new Error('Expected result');
        const { id, ...payloadWithoutId } = result;

        test.expect(payloadWithoutId).toEqual(expectedResult);
      });

      test('the promise rejects when user closes popup window', async ({ page, context }) => {
        await page.goto('localhost:3000');
        const getAddressesPromise = initiateGetAddresses(page);
        const popup = await interceptRequestPopup(context);
        await popup.close();
        await test.expect(getAddressesPromise).rejects.toThrow();
      });

      if (walletPreset === 'softwareWallet') {
        test('it redirects back to get addresses flow when wallet is locked', async ({
          homePage,
          page,
          context,
        }) => {
          await homePage.lock();
          await page.goto('localhost:3000');
          const getAddressesPromise = initiateGetAddresses(page);
          const popup = await interceptRequestPopup(context);
          await popup.getByRole('textbox').fill(TEST_PASSWORD);
          await popup.getByRole('button', { name: 'Continue' }).click();
          await test.expect(popup.getByText('Connect Leather')).toBeVisible();
          await clickConnectLeatherButton(popup);
          await test.expect(getAddressesPromise).resolves.toMatchObject(expectedResult);
        });
      }
    });
  }
});
