import { RouteUrls } from '@shared/route-urls';

// FIXME - 4370 this isn't really working well as these summary pages often have nested route params
// need to think of  a better way to do this
// try use match() and assess if there will be conflicts

export function getOnClose(pathname: RouteUrls) {
  // console.log(pathname, RouteUrls.Fund);
  switch (pathname) {
    case RouteUrls.SentStxTxSummary:
    case RouteUrls.SentBtcTxSummary:
    case RouteUrls.SentBrc20Summary:
    case RouteUrls.SendBrc20Confirmation:
    case '/send/btc/confirm':
    // return navigate(RouteUrls.Home);
    case RouteUrls.Fund:
      // return navigate(RouteUrls.FundChooseCurrency);
      return true;
    case RouteUrls.Unlock:
      return false;
    default:
      return undefined;
  }
}
