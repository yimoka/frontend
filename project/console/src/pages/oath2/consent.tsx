import { Spin } from '@yimoka/antd';
import { EntityResponse, observer, useInitStore } from '@yimoka/react';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Oauth2ConsentPage = observer(() => {
  const { search } = useLocation();
  const store = useInitStore({
    api: { url: '/admin/tenant/bff/oauth/acceptConsent', method: 'POST' },
    // 暂时写死 后续再写页面让用户选择
    defaultValues: { challenge: '', scope: ['openid'], remember: true },
  });

  useEffect(() => {
    store.setValuesFromRoute(search);
    store.fetch();
  }, [search, store]);

  return <EntityResponse store={store} skeleton={false}><Spin spinning={true} tip="同意授权中……" /></EntityResponse>;
});
