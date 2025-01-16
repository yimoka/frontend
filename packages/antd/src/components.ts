import { IConfigComponents } from '@yimoka/react';
import { Tag } from 'antd';

import { Button } from './base/button';
import { Icon } from './base/icon';
import { Descriptions } from './display/descriptions';
import { Link } from './display/link';
import { Table } from './display/table';

import { Input } from './enter/input';

import { Alert } from './feedback/alert';
import { Drawer } from './feedback/drawer';
import { ErrorContent } from './feedback/error-content';
import { Loading } from './feedback/loading';
import { Modal } from './feedback/modal';
import { Popconfirm } from './feedback/popconfirm';
import { Progress } from './feedback/progress';
import { Result } from './feedback/result';
import { Skeleton } from './feedback/skeleton';
import { Spin } from './feedback/spin';
import { Watermark } from './feedback/watermark';

import { Divider } from './layout/divider';
import { Flex } from './layout/flex';
import { Col, Row } from './layout/grid';
import { Content, Footer, Header, Layout, Sider } from './layout/layout';
import { Space } from './layout/space';
import { Splitter } from './layout/splitter';

import { Anchor } from './nav/anchor';
import { Breadcrumb } from './nav/breadcrumb';

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
  Link,

  // entity
  Input,

  // feedback
  Alert,
  Drawer,
  Modal,
  Popconfirm,
  Progress,
  Result,
  Spin,
  Watermark,

  // layout
  Divider,
  Flex,
  Row,
  Col,
  Layout,
  Header,
  Footer,
  Content,
  Sider,
  Space,
  Splitter,

  // nav
  Anchor,
  Breadcrumb,
};
