import { RouteUrls } from '@shared/route-urls';

// getTitleFromUrl is not ideal but a stepping stone solution for now to deprecate useRouteHeader
// TODO
// - test this work with `/` or nested routes or if we need to use match() to be safe
// - investigate having title as a route param

//  FIXME - these titles look a bit off, not sure if we should remove them and add them into the `Page`
// its tricky with the current design as sometimes titles in Page inside layout and sometimes in header. Keeping them to header for now

// TODO 4370 task #3 sort out consistent headers. For now keeping in main header not page
export function getTitleFromUrl(pathname: RouteUrls) {
  if (pathname.match(RouteUrls.SendCryptoAsset)) return 'Send';

  switch (pathname) {
    case RouteUrls.AddNetwork:
      return 'Add a network';
    case RouteUrls.BitcoinContractList:
      return 'Bitcoin Contracts';
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
