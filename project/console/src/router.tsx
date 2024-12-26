import { Route, Routes } from 'react-router-dom';

import { IndexPage } from '@/pages';
import { AutoPage } from '@/pages/auto';
export const RootRouter = () => (
  <Routes>
    <Route path="/" element={<IndexPage />} />
    <Route path="*" element={<AutoPage />} />
  </Routes>
);
