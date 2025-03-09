import { Spin } from '@yimoka/antd';
import { EntityResponse, observer, useInitStore } from '@yimoka/react';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Oauth2LoginPage = observer(() => {
  const { search } = useLocation();
  const store = useInitStore({
    api: { url: '/admin/tenant/bff/oauth/acceptLogin', method: 'POST' },
  });

  useEffect(() => {
    store.setValuesFromRoute(search);
    store.fetch();
  }, [search, store]);

  return <EntityResponse store={store} skeleton={false}><Spin spinning={true} tip="登录中……" /></EntityResponse>;
});
