import type { ReactNode } from 'react';

import { Flex, Stack, styled } from 'leather-styles/jsx';

/* 


    This layout to replace two-column layout + add new single page layour for set-password

     Make a new story - page that accepts variant of 2 column / ` column and also possibly the welcome layout

        - then can add visual regression fot that
*/

interface CardProps {
  action: ReactNode;
  children: ReactNode;
  title: string;
  text: string;
}

export function Card({ action, children, title, text }: CardProps) {
  return (
    <Flex direction="column">
      <Stack gap="space.05" px="space.05">
        <styled.h2 textStyle="heading.03">{title}</styled.h2>
        <styled.p textStyle="label.02">{text}</styled.p>
        {children}
      </Stack>
      {action}
    </Flex>
  );
}
