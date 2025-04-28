import { withValueFallback } from '@yimoka/react';
import React from 'react';

export const HTMLContent = withValueFallback((props: { value: string } & React.HTMLAttributes<HTMLDivElement>) => {
  const { value, ...rest } = props;
  return <div {...rest} dangerouslySetInnerHTML={{ __html: value }} />;
});
