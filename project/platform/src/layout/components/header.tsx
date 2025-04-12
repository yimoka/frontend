import { observer } from '@formily/react';
import { Avatar, Dropdown, Icon, Link, Menu, Space, Typography, ConfigProvider, Layout, theme, MenuProps } from '@yimoka/antd';
import { useInitStore, useLocation, useNavigate, useRoot } from '@yimoka/react';
import { isBlank } from '@yimoka/shared';
import { omit } from 'lodash-es';
import React, { useMemo } from 'react';
const { useToken } = theme;

export const Header = observer(() => {
  const { token } = useToken();

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: { itemBg: token.colorBgContainer },
          Layout: { headerBg: token.colorBgContainer },
        },
      }}
    >
      <Layout.Header style={{ zIndex: 9, boxShadow: `0 1px 6px ${token.colorBorder}` }} title='标题' >
        <Space>
          <Link to='/'>
            {/* <img style={{ width: 50 }} src={`${img}logo.png`} /> */}
            <Typography.Text strong style={{ marginLeft: 5, fontSize: 18, color: '#0056d3' }}  >平台</Typography.Text>
          </Link>
          <HeaderMenu />
        </Space>
        <User />
      </Layout.Header>
    </ConfigProvider>
  );
});


const HeaderMenu = observer(() => {
  const root = useRoot();
  const { pathname } = useLocation();
  const menus = root.menus?.map(item => omit(item, ['children'])) as MenuProps['items'];
  const activeKey = useMemo(() => `/${pathname.split('/')[1]}`, [pathname]);

  if (isBlank(menus)) {
    return null;
  }
  return <Menu activeKey={activeKey}
    items={menus}
    mode="horizontal"
    style={{ margin: 0 }} />;
});


const User = observer(() => {
  const { user = {} } = useRoot();
  const { actualName, avatar, name, phone, mail } = user;
  const showName = [actualName, name, phone, mail].find(item => !isBlank(item));
  const nav = useNavigate();

  const { fetch } = useInitStore({
    api: { url: '/user/logout', method: 'POST' },
    afterAtFetch: {
      notify: true,
      successRun: () => nav('/user/login'),
    },
  });

  if (isBlank(user)) {
    return null;
  }

  const logout = () => {
    fetch();
  };

  const items = [
    { label: <Link to="/my">个人中心</Link>, key: 'my' },
    { label: <Typography.Text onClick={logout}>退出</Typography.Text>, key: 'out' },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, right: 20 }}>
      <Dropdown menu={{ items }}>
        <Avatar alt={showName} icon={<Icon name='UserOutlined' />} src={avatar ? avatar : undefined} />
      </Dropdown>
    </div>
  );
});
