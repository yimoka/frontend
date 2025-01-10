import { IConfigComponents } from '@yimoka/react';
import { Skeleton, Tag } from 'antd';

import { Descriptions } from './display/descriptions';
import { Table } from './display/table';

import { ErrorContent } from './feedback/error-content';
import { Loading } from './feedback/loading';

export const components: IConfigComponents = {
  // 用于系统配置的基础组件
  Loading,
  ErrorContent,
  Skeleton,

  Tag,

  // display
  Descriptions,
  Table,
};
