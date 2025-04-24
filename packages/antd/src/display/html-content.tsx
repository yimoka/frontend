import { withScopeValueFallback } from '@yimoka/react';
import React from 'react';

export const HTMLContent = withScopeValueFallback((props: { value: string } & React.HTMLAttributes<HTMLDivElement>) => {
  const { value, ...rest } = props;
  return <div {...rest} dangerouslySetInnerHTML={{ __html: value }} />;
});
