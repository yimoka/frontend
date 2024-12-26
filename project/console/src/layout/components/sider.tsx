import { observer } from '@formily/react';
import { useRoot } from '@yimoka/react';
import { SiderProps as TSiderProps, MenuProps, Menu, Layout } from 'antd';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export interface SiderProps extends TSiderProps {
  menus?: MenuProps['items']
}

export const Sider = observer(({ menus, ...args }: SiderProps) => {
  const root = useRoot();
  const { pathname } = useLocation();
  const curMenus = useMemo(() => {
    if (menus) {
      return menus;
    }
    return root?.menus?.find(item => item.key?.length > 1 && pathname.startsWith(item.key))?.children ?? [];
  }, [menus, pathname, root?.menus]);

  const selectedKeys = useMemo(() => {
    const keys: string[] = [];
    let temp = pathname;
    pathname.split('/').filter(path => path)
      .forEach((path) => {
        temp = `${temp}/${path}`;
        keys.push(temp);
      });
    return keys;
  }, [pathname]);

  return (
    <Layout.Sider collapsible theme='light'  {...args}  >
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={selectedKeys}
        style={{ borderInlineEnd: 'none' }}
        items={curMenus}
        theme={args.theme}
      />
    </Layout.Sider>
  );
});

