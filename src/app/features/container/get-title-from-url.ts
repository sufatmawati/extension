import { RouteUrls } from '@shared/route-urls';

// getTitleFromUrl is not ideal but a stepping stone solution for now to deprecate useRouteHeader
// TODO
// - test this work with `/` or nested routes or if we need to use match() to be safe
// - investigate having title as a route param
export function getTitleFromUrl(pathname: RouteUrls) {
  // console.log(pathname);
  switch (pathname) {
    case RouteUrls.AddNetwork:
      return 'Add a network';
    case RouteUrls.BitcoinContractList:
      return 'Bitcoin Contracts';
    case RouteUrls.SendCryptoAsset:
      return 'Send';
    case RouteUrls.BitcoinContractLockSuccess:
      return 'Locked Bitcoin';
    case RouteUrls.SendBrc20ChooseFee:
      return 'Choose fee';
    // TODO rename these routes so they are consistent - SomethingReview
    case RouteUrls.SendBrc20Confirmation:
    case RouteUrls.SwapReview:
    case RouteUrls.SendBrc20Confirmation:
    case '/send/btc/confirm':
      return 'Review';
    case RouteUrls.Swap:
      return 'Swap';
    // TODO check these summarys as I think the UI is different now and title should be inside card
    case RouteUrls.SentStxTxSummary:
    case RouteUrls.SentBtcTxSummary:
      return 'Sent';
    case RouteUrls.SentBrc20Summary:
      return 'Creating transfer inscription';
    case RouteUrls.SendBrc20Confirmation:
    default:
      return undefined;
  }
}
