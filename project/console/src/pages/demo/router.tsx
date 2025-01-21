import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { WithSiderLayout } from '@/layout/with-sider';
import { TableDemo } from '@/pages/demo/display/table';

import { CalendarDemo } from './display/calendar';
import { CarouselDemo } from './display/carousel';
import { DescriptionsDemo } from './display/descriptions';
import { TagDemo } from './display/tag';
import { DrawerDemo } from './feedback/drawer';
import { ModalDemo } from './feedback/modal';
import { BreadcrumbDemo } from './nav/breadcrumb';
import { RenderArrayDemo } from './render-array';
import { TriggerDemo } from './trigger';

export const DemoRouter = () => (
  <WithSiderLayout>
    <Routes>
      <Route path="trigger" element={<TriggerDemo />} />
      <Route path="render-array" element={<RenderArrayDemo />} />

      <Route path="display/calendar" element={<CalendarDemo />} />
      <Route path="display/descriptions" element={<DescriptionsDemo />} />
      <Route path="display/carousel" element={<CarouselDemo />} />
      <Route path="display/table" element={<TableDemo />} />
      <Route path="display/tag" element={<TagDemo />} />

      <Route path="feedback/drawer" element={<DrawerDemo />} />
      <Route path="feedback/modal" element={<ModalDemo />} />

      <Route path="nav/breadcrumb" element={<BreadcrumbDemo />} />
    </Routes>
  </WithSiderLayout>
);
