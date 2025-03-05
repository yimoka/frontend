import { observer } from '@formily/react';
import { Button, Card, Content, Divider, Empty, Link, Space, Spin, Text, Title } from '@yimoka/antd';
import { EntityResponse, useInitStore, useLocation } from '@yimoka/react';
import { IAny } from '@yimoka/shared';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { setTenantID } from '@/local';

import { setStaff } from '@/root';
import { setStaffToken } from '@/token';

import { getTenantStaffs, getUserInfo, LoginByUser } from './api';

// eslint-disable-next-line complexity
export const UserTenant = observer(() => {
  const nav = useNavigate();
  const { search } = useLocation();
  const userStore = useInitStore({ api: getUserInfo, options: { runNow: true } });
  const staffsStore = useInitStore({ api: getTenantStaffs, options: { runNow: true } });
  const user = userStore?.response?.data?.user;
  const name = [user?.name, user?.actualName, user?.phone, user?.mail].find(item => item);

  // 进入租户
  const enterTenant = useInitStore({
    api: LoginByUser,
    defaultValues: { staffID: '', tenantID: '' },
    afterAtFetch: {
      resetValues: false,
      successRun: (res) => {
        setTenantID(enterTenant.values.tenantID);
        setStaffToken(res.data.token);
        setStaff(res.data.staff);
        // 获取路径参数 redirect
        const redirect = new URLSearchParams(search).get('redirect') ?? '/';
        // 如果 包含 host 并且 host 与当前 host 不一致，则不跳转
        if (redirect.includes('://') && new URL(redirect).host !== window.location.host) {
          nav('/');
        } else {
          nav(redirect);
        }
      },
    },
  });

  const actions = (
    <Space>
      <Link to="/user/tenant/join/add">
        <Button type="primary" >创建租户</Button>
      </Link>
      <Link to="/user/tenant/join">
        <Button type='link'>我的申请</Button>
      </Link>
    </Space>
  );

  return (
    <Content>
      <EntityResponse store={staffsStore}>
        <Title level={3}>欢迎您: {name} </Title>
        <Text>请选择你要登录的租户:</Text>
        <Divider />
        <Spin spinning={enterTenant.loading}>
          <Space style={{ display: 'flex' }} direction="vertical">
            {staffsStore?.response?.data?.map?.((item: IAny) => (
              <Card
                key={item.id}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  enterTenant.setValues({ staffID: item.id, tenantID: item.tenant.id });
                  enterTenant.fetch();
                }}>
                <Card.Meta
                  title={[item?.name, item?.actualName, item?.phone, item?.mail].find(item => item)}
                  description={<>
                    账号 ID: {item.id}<br />
                    租户 ID: {item.tenant.id}<br />
                    租户名称: {item.tenant.company}
                  </>} />
              </Card>
            ))}
          </Space>
        </Spin>


        {staffsStore.response?.data?.length < 1 ? (
          <Empty description="您还没绑定租户员工">
            {actions}
          </Empty>
        ) : (
          <>
            <Divider />
            {actions}
          </>
        )}
      </EntityResponse>
    </Content>
  );
});
