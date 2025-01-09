import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { TableDemo } from './display/table';

export const DemoRouter = () => (
  <Routes>
    <Route path="display/table" element={<TableDemo />} />
  </Routes>
);
