import { IConfigComponents } from '@yimoka/react';

import { Button } from './base/button';
import { FloatButton } from './base/float-button';
import { Icon } from './base/icon';
import { Typography, Text, Title, Paragraph } from './base/typography';

import { Avatar } from './display/avatar';
import { Badge } from './display/badge';
import { Calendar } from './display/calendar';
import { Card } from './display/card';
import { Carousel } from './display/carousel';
import { Collapse } from './display/collapse';
import { DateText } from './display/date-text';
import { Descriptions } from './display/descriptions';
import { Empty } from './display/empty';
import { HTMLContent } from './display/html-content';
import { Image } from './display/image';
import { Link } from './display/link';
import { List } from './display/list';
import { Popover } from './display/popover';
import { QRCode } from './display/qr-code';
import { Segmented } from './display/segmented';
import { Countdown, Statistic } from './display/statistic';
import { Table } from './display/table';
import { Tabs } from './display/tabs';
import { Tag } from './display/tag';
import { Timeline } from './display/timeline';
import { Tooltip } from './display/tooltip';
import { Tour } from './display/tour';
import { Tree } from './display/tree';
import { ValueLabel } from './display/value-label';

import { AutoComplete } from './enter/auto-complete';
import { Cascader } from './enter/cascader';
import { Checkbox, CheckboxGroup } from './enter/checkbox';
import { ColorPicker } from './enter/color-picker';
import { DatePicker } from './enter/date-picker';
import { DateRangePicker } from './enter/date-range-picker';
import { Form } from './enter/form';
import { FormItem } from './enter/form-item';
import { Input } from './enter/input';
import { InputNumber } from './enter/input-number';
import { Mentions } from './enter/mentions';
import { Radio, RadioGroup } from './enter/radio';
import { Rate } from './enter/rate';
import { Search } from './enter/search';
import { SearchSelect } from './enter/search-select';
import { Select } from './enter/select';
import { Slider } from './enter/slider';
import { Switch } from './enter/switch';
import { TimePicker } from './enter/time-picker';
import { TimeRangePicker } from './enter/time-range-picker';
import { Transfer } from './enter/transfer';
import { TreeSelect } from './enter/tree-select';

import { Upload } from './enter/upload';
import { UploadS3 } from './enter/upload-s3';
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
import { Affix } from './other/affix';
import { App } from './other/app';
import { PageHeader } from './page/page-header';
import { StoreForm } from './store/form';
import { ListFilter } from './store/list-filter';
import { RecordDel } from './store/record-del';
import { RecordOperation } from './store/record-operation';
import { Reset } from './store/reset';
import { Submit } from './store/submit';
import { StoreTable } from './store/table';

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
  Collapse,
  DateText,
  Descriptions,
  Empty,
  HTMLContent,
  Image,
  Link,
  List,
  Popover,
  QRCode,
  Segmented,
  Statistic,
  Countdown,
  Table,
  Tabs,
  Tag,
  CheckableTag: Tag.CheckableTag,
  Timeline,
  Tooltip,
  Tour,
  Tree,
  ValueLabel,

  // entity
  AutoComplete,
  Cascader,
  Checkbox,
  CheckboxGroup,
  ColorPicker,
  DatePicker,
  DateRangePicker,
  Form,
  FormItem,
  InputNumber,
  Input,
  Mentions,
  Radio,
  RadioGroup,
  Rate,
  Search,
  SearchSelect,
  Select,
  Slider,
  Switch,
  TimePicker,
  TimeRangePicker,
  Transfer,
  TreeSelect,
  Upload,
  UploadS3,

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

  // other
  App,
  Affix,

  // page
  PageHeader,

  // store
  StoreForm,
  StoreTable,
  ListFilter,
  RecordOperation,
  RecordDel,
  Reset,
  Submit,
};
