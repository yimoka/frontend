import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { IndexPage } from '@/pages';
import { AutoPage } from '@/pages/auto';

import { DemoRouter } from './pages/demo/router';
import { UserRouter } from './pages/user/router';

export const RootRouter = () => (
  <Routes>
    <Route path="/" element={<IndexPage />} />
    <Route path="/demo/*" element={<DemoRouter />} />
    <Route path="/user/*" element={<UserRouter />} />
    <Route path="*" element={<AutoPage />} />
  </Routes>
);
