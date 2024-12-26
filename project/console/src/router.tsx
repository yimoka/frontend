import { Route, Routes } from 'react-router-dom';

import { IndexPage } from '@/pages';
export const RootRouter = () => (
  <Routes>
    <Route path="/" element={<IndexPage />} />
  </Routes>
);
