import { Avatar, Dropdown, Icon, Link, Menu, Typography, ConfigProvider, Layout, theme, MenuProps, Flex } from '@yimoka/antd';
import { observer, useInitStore, useLocation, useRoot } from '@yimoka/react';
import { isVacuous } from '@yimoka/shared';
import { omit } from 'lodash-es';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
        <Flex align='center'
          gap={token.padding}
          justify='space-between'
          style={{ height: '100%' }}>
          <Link to='/'>
            {/* <img style={{ width: 50 }} src={`${img}logo.png`} /> */}
            <Typography.Text strong style={{ marginLeft: 5, fontSize: 18, color: '#0056d3' }}  >平台</Typography.Text>
          </Link>
          <HeaderMenu />
          <User />
        </Flex>
      </Layout.Header>
    </ConfigProvider>
  );
});


const HeaderMenu = observer(() => {
  const root = useRoot();
  const { pathname } = useLocation();
  const menus = root.menus?.map(item => omit(item, ['children'])) as MenuProps['items'];
  const activeKey = useMemo(() => `/${pathname.split('/')[1]}`, [pathname]);

  if (isVacuous(menus)) {
    return null;
  }
  return (
    <div style={{ flex: 1, flexGrow: 1 }}>
      <Menu
        activeKey={activeKey}
        items={menus}
        mode="horizontal"
        style={{ margin: 0 }} />
    </div>
  );
});


const User = observer(() => {
  const { user = {} } = useRoot();
  const { actualName, avatar, name, phone, mail } = user;
  const showName = [actualName, name, phone, mail].find(item => !isVacuous(item));
  const nav = useNavigate();

  const { fetch } = useInitStore({
    api: { url: '/user/logout', method: 'POST' },
    afterAtFetch: {
      notify: true,
      successRun: () => {
        nav('/user/login');
      },
    },
  });

  if (isVacuous(user)) {
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
