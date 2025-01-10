import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { WithSiderLayout } from '@/layout/with-sider';
import { TableDemo } from '@/pages/demo/display/table';

import { DescriptionsDemo } from './display/descriptions';

export const DemoRouter = () => (
  <WithSiderLayout>
    <Routes>
      <Route path="display/table" element={<TableDemo />} />
      <Route path="display/descriptions" element={<DescriptionsDemo />} />
    </Routes>
  </WithSiderLayout>
);
