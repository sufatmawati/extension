import { useCallback } from 'react';

import { UserSelectedTheme, getThemeLabel } from '@app/common/theme-provider';
import { DropdownMenu } from '@app/ui/components/dropdown-menu/dropdown-menu';
import { Flag } from '@app/ui/components/flag/flag';
import { CheckmarkIcon } from '@app/ui/components/icons/checkmark-icon';
import { PlaceholderIcon } from '@app/ui/components/icons/placeholder-icon';

interface ThemeListItemProps {
  theme: UserSelectedTheme;
  onThemeSelected(theme: UserSelectedTheme): void;
  isActive: boolean;
}
export function ThemeListItem({ theme, onThemeSelected, isActive }: ThemeListItemProps) {
  const themeLabel = getThemeLabel(theme);
  const onThemeItemSelect = useCallback(() => {
    onThemeSelected(theme);
  }, [onThemeSelected, theme]);

  return (
    <DropdownMenu.Item key={themeLabel} onClick={isActive ? undefined : onThemeItemSelect}>
      <Flag img={<PlaceholderIcon />} textStyle="label.02">
        {themeLabel}
      </Flag>
      {isActive && <CheckmarkIcon />}
    </DropdownMenu.Item>
  );
}
