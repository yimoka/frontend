import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { PageContent } from '@/layout/page-content';
import { WithFooterLayout } from '@/layout/with-footer';

import { Oauth2LoginPage } from './login';

export const Oauth2Router = () => (
  <WithFooterLayout >
    <PageContent>
      <Routes>
        <Route path="login" element={<Oauth2LoginPage />} />
      </Routes>
    </PageContent>
  </WithFooterLayout>
);
