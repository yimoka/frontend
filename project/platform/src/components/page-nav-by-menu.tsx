import { observer } from '@formily/react';
import { Card, Col, Icon, Link, Row } from '@yimoka/antd';
import { useRoot } from '@yimoka/react';
import { IAny, isBlank } from '@yimoka/shared';
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
const { Meta } = Card;

export const PageNavByMenu = observer(() => {
  const { menus } = useRoot();
  const { pathname } = useLocation();

  const curMenus = useMemo(() => {
    if (pathname === '/') {
      return menus?.filter(item => item.key !== '' && item.key !== '/');
    }
    let useChildren: IAny[] = [];
    const getChildren = (arr: IAny[]): boolean => arr?.find((item) => {
      const { key, children } = item;
      if (key === pathname) {
        useChildren = children;
        return true;
      }
      return getChildren(children);
    });
    getChildren(menus ?? []);
    return useChildren;
  }, [menus, pathname]);

  if (isBlank(curMenus)) {
    return null;
  }
  return <Row gutter={[16, 16]} style={{ padding: 30 }}>{
    curMenus?.map?.((item) => {
      const { key, icon, title, desc } = item;
      return (
        <Col key={key}
lg={8}
md={8}
sm={12}
span={6}
xl={6}
xs={24}
xxl={4}>
          <Link to={key}>
            <Card hoverable style={{ width: 200 }}  >
              <Meta description={desc} title={<>{typeof icon === 'string' ? <Icon value={icon} /> : icon} {title}</>} />
            </Card>
          </Link>
        </Col>
      );
    })
  }</Row>;
});
