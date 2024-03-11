import { forwardRef, useMemo } from 'react';

import { Box, HTMLStyledProps, styled } from 'leather-styles/jsx';

import { BRANCH_NAME, COMMIT_SHA } from '@shared/environment';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { useIsLatestPullRequestBuild } from '@app/query/common/outdated-pr/outdated-pr.query';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

interface AppVersionLabelProps extends HTMLStyledProps<'span'> {
  isLatestVersion: boolean;
}
const AppVersionLabel = forwardRef<HTMLSpanElement, AppVersionLabelProps>(
  ({ children, isLatestVersion, ...props }: AppVersionLabelProps, ref) => (
    <Box bg="ink.background-secondary" px="20px" py="space.01">
      <styled.span
        textStyle="label.03"
        ref={ref}
        color="ink.text-subdued"
        textDecoration={isLatestVersion ? 'none' : 'line-through'}
        textWrap="nowrap"
        {...props}
      >
        {children}
      </styled.span>
    </Box>
  )
);

export function AppVersion() {
  const { pullRequestLink, isLatestBuild } = useIsLatestPullRequestBuild();

  const version = useMemo(() => {
    switch (process.env.WALLET_ENVIRONMENT) {
      case 'development':
        return BRANCH_NAME;
      case 'feature':
        return `${BRANCH_NAME}#${COMMIT_SHA?.slice(0, 8)}`;
      default:
        return `v${VERSION}`;
    }
  }, []);

  if (!isLatestBuild && process.env.WALLET_ENVIRONMENT === 'feature') {
    return (
      <BasicTooltip label="Outdated PR build, download the latest version">
        <AppVersionLabel
          isLatestVersion={false}
          cursor="pointer"
          onClick={() => openInNewTab(pullRequestLink ?? '')}
        >
          {version}
        </AppVersionLabel>
      </BasicTooltip>
    );
  }

  return <AppVersionLabel isLatestVersion>{version}</AppVersionLabel>;
}
