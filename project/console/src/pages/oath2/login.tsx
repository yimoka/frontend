import { Spin } from '@yimoka/antd';
import { EntityResponse, observer, useInitStore } from '@yimoka/react';
import React from 'react';
import { useLocation } from 'react-router-dom';

// 构建跳转过来的请求
// https://console.home.ickeep.com/oauth2/auth?client_id=372b719411564344be1d77ab59aad40d&redirect_uri=https://xxxx.app.ickeep.com/oauth2/callback&response_type=code&scope=openid&state=1323213123123

export const Oauth2LoginPage = observer(() => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const store = useInitStore({
    options: { runNow: true },
    api: { url: '/admin/tenant/bff/oauth/acceptLogin', method: 'POST' },
    defaultValues: { challenge: params.get('login_challenge') },
    afterAtFetch: {
      successRun: (res) => {
        window.location.href = res.data.redirect;
      },
    },
  });

  return <EntityResponse skeleton={false} store={store}><Spin spinning={true} tip="授权中……" /></EntityResponse>;
});
