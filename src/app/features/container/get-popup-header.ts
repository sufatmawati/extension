/**
 * Temporary home for poupup header logic + documentation
 * OLD = we had <PopupHeader stored in state with  useRouteHeader(
 * NEW = we share headers but need to use router logic to determine what to display
 *
 * I figured out the logic by reverse engineering the test-app but this may be incorrect!
 * See comment here -> https://github.com/leather-wallet/extension/issues/4371#issuecomment-1919114939
 *
 */

/**
 * reverse engineering notes:
 * - I checked all the links in the test-app to see what routes they hit and found these routes
 * - It seemed like I would need the URL params but I'm not sure they are used
 * - I chose to not show the settings menu in  any popups as it's unclear where it should be shown
 * 
  TestAPP -> Profile -> Update Profile: to test
     - Route: RouteUrls.SignatureRequest
     - window.location.hash: #/update-profile?origin=http%3A%2F%2Flocalhost%3A3000&tabId=733055377&request=XXX
     - Design Header: Account + total value + PSBT Header (current)
     
  TestAPP -> Signature -> Signature (Mainnet)   
     - Route: RouteUrls.SignatureRequest
     - window.location.hash: #/signature?origin=http%3A%2F%2Flocalhost%3A3000&tabId=733055377&request=XX&messageType=utf8&flow=hiroWalletSignatureRequest&coreApiUrl=https%3A%2F%2Fstacks-node-api.mainnet.stacks.co&networkChainId=1
     - Design Header: Account + right icon
  
  TestAPP -> Bitcoin -> Sign PSBT (Segwit) 
     - Route: RouteUrls.PsbtRequest
     - pathname: '/psbt'
     - window.location.hash: #/psbt?origin=http%3A%2F%2Flocalhost%3A3000&tabId=733055377&request=XXX
     - Design Header: Account + total value . PSBT Header (current)

  TestAPP -> Status smart contract -> Status smart contract:
  TestAPP -> Counter smart contract -> Counter smart contract:
  TestAPP -> Debugger-> Contract call (Allow mode):
  TestAPP -> Debugger-> STX Transfer: 
     - Route: RouteUrls.TransactionRequest
     - pathname: '/transaction'
     - window.location.hash: #/transaction?origin=http%3A%2F%2Flocalhost%3A3000&tabId=733055377&request=XXX&flow=hiroWalletTransactionRequest&coreApiUrl=https%3A%2F%2Fapi.testnet.hiro.so%2F&networkChainId=2147483648
     - Design Header: Logo - approval UX
  
  TestAPP -> Debugger -> RPC Test: 
    - Route: RouteUrls.TransactionRequest
     - pathname: '/get-addresses'
     - window.location.hash: #/get-addresses?origin=http%3A%2F%2Flocalhost%3A3000&tabId=733055377&requestId=a568ff80-47aa-41c2-a4b3-d6bd7ba0b0fb
     - Design Header: No header
 */
import { RouteUrls } from '@shared/route-urls';

export function showAccountInfo(pathname: RouteUrls) {
  return (
    pathname === RouteUrls.TransactionRequest ||
    pathname === RouteUrls.ProfileUpdateRequest ||
    pathname === RouteUrls.PsbtRequest
  );
}
export function getDisplayAddresssBalanceOf(pathname: RouteUrls) {
  /** NOTE:  technical debt to hopefully deprecate soon
   * - previously displayAddresssBalanceOf was set to all in useRouteHeader(<PopupHeader  for:
   *     - <RpcSignBip322Message
   *     - <RpcSendTransferContainer
   *     - <PsbtSigner
   *
   * OLD: in the now deprecated <PopupHeader, it was defaulting to 'stx'
   * NEW:
   * - sometimes we don't want to show a balance so in those cases we return undefined
   * - otherwise we default to 'stx' which with some testing hopefully we can remove
   */
  switch (pathname) {
    case RouteUrls.TransactionRequest:
    case RouteUrls.ProfileUpdateRequest:
    case RouteUrls.PsbtRequest:
      return 'all';
    case RouteUrls.SignatureRequest:
    case RouteUrls.RpcGetAddresses:
      return undefined;
    default:
      return 'stx';
  }
}
//  TODO refactor this thrash
export function isKnownPopup(pathname: RouteUrls) {
  switch (pathname) {
    case RouteUrls.TransactionRequest:
    case RouteUrls.ProfileUpdateRequest:
    case RouteUrls.PsbtRequest:
    case RouteUrls.SignatureRequest:
    case RouteUrls.RpcGetAddresses:
      return true;
    default:
      return false;
  }
}
