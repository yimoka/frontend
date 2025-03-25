import { useLocation } from '@yimoka/react';
import React from 'react';

import { WithSiderLayout } from '@/layout/with-sider';

export const AutoPage = () => {
  const { pathname } = useLocation() ?? {};
  return (
    <WithSiderLayout>
      <Page key={pathname} />
    </WithSiderLayout>
  );
};

const Page = () => (
  <div>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
    <h1>auto</h1>
  </div>
);
