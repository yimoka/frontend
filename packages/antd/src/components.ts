import { IConfigComponents } from '@yimoka/react';
import { Skeleton, Tag } from 'antd';

import { Button } from './base/button';
import { Icon } from './base/icon';
import { Descriptions } from './display/descriptions';
import { Table } from './display/table';

import { Input } from './enter/input';
import { Alert } from './feedback/alert';
import { Drawer } from './feedback/drawer';
import { ErrorContent } from './feedback/error-content';
import { Loading } from './feedback/loading';
import { Space } from './layout/space';

export const components: IConfigComponents = {
  // 用于系统配置的基础组件
  Loading,
  ErrorContent,
  Skeleton,

  // base
  Button,
  Icon,

  Tag,

  // display
  Descriptions,
  Table,

  // entity
  Input,

  // feedback
  Alert,
  Drawer,

  // layout
  Space,
};
