import { Layout as AntLayout, GetProps, LayoutProps } from 'antd';
export const Layout = AntLayout;

const { Header, Footer, Content, Sider } = Layout;

export type HeaderProps = GetProps<typeof Header>
export type FooterProps = GetProps<typeof Footer>
export type ContentProps = GetProps<typeof Content>
export type SiderProps = GetProps<typeof Sider>

export { Header, Footer, Content, Sider };


export type { LayoutProps };
