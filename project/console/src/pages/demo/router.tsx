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
      <Route element={<TriggerDemo />} path="trigger" />
      <Route element={<RenderArrayDemo />} path="render-array" />

      <Route element={<CalendarDemo />} path="display/calendar" />
      <Route element={<DescriptionsDemo />} path="display/descriptions" />
      <Route element={<CarouselDemo />} path="display/carousel" />
      <Route element={<TableDemo />} path="display/table" />
      <Route element={<TagDemo />} path="display/tag" />

      <Route element={<DrawerDemo />} path="feedback/drawer" />
      <Route element={<ModalDemo />} path="feedback/modal" />

      <Route element={<BreadcrumbDemo />} path="nav/breadcrumb" />
    </Routes>
  </WithSiderLayout>
);
