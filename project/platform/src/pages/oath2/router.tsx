import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { PageContent } from '@/layout/page-content';
import { WithFooterLayout } from '@/layout/with-footer';

import { Oauth2ConsentPage } from './consent';
import { Oauth2LoginPage } from './login';

export const Oauth2Router = () => (
  <WithFooterLayout>
    <PageContent>
      <Routes>
        <Route element={<Oauth2LoginPage />} path="login" />
        <Route element={<Oauth2ConsentPage />} path="consent" />
      </Routes>
    </PageContent>
  </WithFooterLayout>
);
