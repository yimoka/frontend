/* eslint-disable react-refresh/only-export-components */
import { IAny, IAnyObject } from '@yimoka/shared';
import { IStoreResponse, INotifier, IAPIExecutor } from '@yimoka/store';
import { ComponentType, createContext, ReactNode, useContext } from 'react';

const ConfigContext = createContext<IConfig | null>(null);

export const ConfigProvider = ConfigContext.Provider;

export const ConfigConsumer = ConfigContext.Consumer;

export const useConfig = () => useContext(ConfigContext);

export const useReport = () => {
  const config = useConfig();
  return config?.report;
};

export const useNotifier = () => {
  const config = useConfig();
  return config?.notifier;
};

export const useAPIExecutor = () => {
  const config = useConfig();
  return config?.apiExecutor;
};

export const useLocation = () => {
  const config = useConfig();
  return config?.useLocation?.();
};

export const useNavigate = () => {
  const config = useConfig();
  return config?.useNavigate;
};

export const useRouteParams = () => {
  const config = useConfig();
  return config?.useRouteParams?.();
};

export const useComponents = () => {
  const config = useConfig();
  return config?.components;
};

// 通过 Context 传递配置信息
// 为了可用于 web 小程序 native 等多端，不直接依赖 react-router
// 将报告、通知、API 执行器和路由等配置信息通过 Context 传递
export interface IConfig {
  report?: IReport;
  notifier: INotifier;
  apiExecutor: IAPIExecutor;
  useLocation?: IUseLocation;
  useNavigate?: IUseNavigate;
  useRouteParams?: IUseRouteParams;
  components?: IConfigComponents;
}

export type IUseRouteParams<T extends string | Record<string, string | undefined> = string> = () => Readonly<[T] extends [string] ? Params<T> : Partial<T>>;

export type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined;
};

export type IUseLocation<T = IAny> = () => {
  pathname: string;
  search: string;
  hash: string;
  state: T;
  key: string;
}

export interface IUseNavigate {
  (to: string | Partial<Path>, options?: NavigateOptions): void;
  (delta: number): void;
}

export interface NavigateOptions {
  replace?: boolean;
  state?: IAny;
  preventScrollReset?: boolean;
  relative?: 'route' | 'path';
  unstable_flushSync?: boolean;
  unstable_viewTransition?: boolean;
}

export interface Path {
  pathname: string;
  search: string;
  hash: string;
}

type ILevel = 'info' | 'warn' | 'error';

type IReport = (info: IAnyObject | Error | unknown, level: ILevel) => void;

export type LoadingComponent = ComponentType<{ loading?: boolean, children?: ReactNode } & IAnyObject>;

export type ErrorComponent = ComponentType<ErrorProps>;

export type SkeletonComponent = ComponentType<{ loading?: boolean, children?: ReactNode } & IAnyObject>;

export type IConfigComponents = {
  Loading: LoadingComponent,
  ErrorContent: ErrorComponent,
  Skeleton: SkeletonComponent,
  [key: string]: ComponentType<IAny>
};

export interface ErrorProps {
  isReturnIndex?: boolean
  loading?: boolean;
  response: IStoreResponse;
  onAgain?: () => IAny | Promise<IAny>;
  icon?: string
  children?: ReactNode
  [key: string]: IAny
}