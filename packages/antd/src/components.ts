import { IConfigComponents } from '@yimoka/react';

import { AutoComplete, TreeSelect } from 'antd';

import { Button } from './base/button';
import { FloatButton } from './base/float-button';
import { Icon } from './base/icon';
import { Typography, Text, Title, Paragraph } from './base/typography';

import { Avatar } from './display/avatar';
import { Badge } from './display/badge';
import { Calendar } from './display/calendar';
import { Card } from './display/card';
import { Carousel } from './display/carousel';
import { Descriptions } from './display/descriptions';
import { Empty } from './display/empty';
import { Link } from './display/link';
import { Table } from './display/table';

import { Tag } from './display/tag';
import { Tree } from './display/tree';
import { Input } from './enter/input';

import { InputNumber } from './enter/input-number';
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
import { Dropdown } from './nav/dropdown';
import { Menu } from './nav/menu';
import { Pagination } from './nav/pagination';
import { Steps } from './nav/steps';
import { PageHeader } from './page/page-header';
import { FormItem, StoreForm } from './store/form';
import { RecordDel } from './store/record-del';
import { RecordOperation } from './store/record-operation';
import { Reset } from './store/reset';
import { Submit } from './store/submit';

export const components: IConfigComponents = {
  // 用于系统配置的基础组件
  Loading,
  ErrorContent,
  Skeleton,

  // base
  Button,
  FloatButton,
  BackTop: FloatButton.BackTop,
  Icon,
  Typography,
  Text,
  Title,
  Paragraph,

  // display
  Avatar,
  Badge,
  Calendar,
  Card,
  Carousel,
  Descriptions,
  Empty,
  Table,
  Link,
  Tag,
  CheckableTag: Tag.CheckableTag,

  Tree,

  // entity
  AutoComplete,
  InputNumber,
  Input,
  TreeSelect,

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
  Dropdown,
  Menu,
  Pagination,
  Steps,

  // page
  PageHeader,

  // store
  StoreForm,
  FormItem,
  RecordOperation,
  RecordDel,
  Reset,
  Submit,
};
