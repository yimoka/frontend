import { Spin } from '@yimoka/antd';
import { EntityResponse, observer, useInitStore } from '@yimoka/react';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Oauth2ConsentPage = observer(() => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const store = useInitStore({
    api: { url: '/base/iam/portal/oauth/acceptConsent', method: 'POST' },
    // 暂时写死 后续再写页面让用户选择
    defaultValues: { challenge: params.get('consent_challenge'), scope: ['openid'], remember: true },
    afterAtFetch: {
      successRun: (res) => {
        window.location.href = res.data.redirect;
      },
    },
  });

  useEffect(() => {
    store.setValuesFromRoute(search);
    store.fetch();
  }, [search, store]);

  return <EntityResponse skeleton={false} store={store}><Spin spinning={true} tip="同意授权中……" /></EntityResponse>;
});
