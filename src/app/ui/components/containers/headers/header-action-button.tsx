import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Grid } from 'leather-styles/jsx';

interface HeaderActionButtonProps {
  icon?: React.JSX.Element;
  isWaitingOnPerformedAction?: boolean;
  onAction?(): void;
}
export function HeaderActionButton({
  icon,
  isWaitingOnPerformedAction,
  onAction,
}: HeaderActionButtonProps) {
  return (
    <Grid
      _hover={{
        bg: isWaitingOnPerformedAction ? 'unset' : 'ink.component-background-hover',
        cursor: isWaitingOnPerformedAction ? 'unset' : 'pointer',
      }}
      data-testid={HomePageSelectors.HeaderActionBtn}
      borderRadius="xs"
      color="ink.action-primary-default"
      height="headerContainerHeight"
      onClick={isWaitingOnPerformedAction ? undefined : onAction}
      opacity={isWaitingOnPerformedAction ? '0.3' : 'unset'}
      placeItems="center"
      position="relative"
      transition="transition"
      userSelect="none"
      width="36px"
      zIndex={999}
    >
      {icon}
    </Grid>
  );
}
