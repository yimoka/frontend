import { IConfigComponents } from '@yimoka/react';

import { Button } from './base/button';
import { FloatButton } from './base/float-button';
import { Icon } from './base/icon';
import { Typography, Text, Title, Paragraph } from './base/typography';

import { Avatar } from './display/avatar';
import { Badge } from './display/badge';
import { Calendar } from './display/calendar';
import { Card } from './display/card';
import { Descriptions } from './display/descriptions';
import { Link } from './display/link';
import { Table } from './display/table';

import { Tag } from './display/tag';
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
import { Dropdown } from './nav/dropdown';
import { Menu } from './nav/menu';
import { Pagination } from './nav/pagination';
import { Steps } from './nav/steps';

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
  Descriptions,
  Table,
  Link,
  Tag,
  CheckableTag: Tag.CheckableTag,

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
  Dropdown,
  Menu,
  Pagination,
  Steps,
};
