import { App as AntApp, GetProps } from 'antd';

export const App = AntApp;

export type AppProps = GetProps<typeof AntApp>
