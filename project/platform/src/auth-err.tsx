import { observer, useNavigate } from '@yimoka/react';
import { IHTTPCode } from '@yimoka/shared';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';

import { setAuthErr, useAuthErr } from '@/root';

const LoginModal = (props: { onSuccess: () => void }) => {
  const { onSuccess } = props;
  console.log('onSuccess', onSuccess);

  return (
    <Modal open title="登录" footer={null}>

    </Modal>
  );
};

const ChangePasswordModal = (props: { onSuccess: () => void }) => {
  console.log('ChangePasswordModal', props);

  return <div>change password</div>;
};

export const HandleAuthErr = observer(() => {
  const errData = useAuthErr();
  const [model, setModel] = useState<'login' | 'changePassword' | null>(null);
  const nav = useNavigate();
  // eslint-disable-next-line complexity
  useEffect(() => {
    if (errData) {
      const { code, processing, metadata, url } = errData;
      if (code === IHTTPCode.unauthorized || code === IHTTPCode.forbidden) {
        if (!processing) {
          // 当 url 为默认获取用户信息时，跳转到登录页，否则弹窗进行完成登录，以避免用户表单信息丢失
          const isModal = url === '/base/iam/portal/staff/info';
          setAuthErr({ ...errData, processing: true });
          const { href, origin } = window.location;
          const redirect = encodeURIComponent(href.replace(origin, ''));
          if (code === IHTTPCode.unauthorized) {
            if (isModal) {
              setModel('login');
            } else {
              nav(`/staff/login?redirect=${redirect}`, { replace: true });
            }
          } else if (code === IHTTPCode.forbidden) {
            if (metadata?.isChangePassword) {
              if (isModal) {
                setModel('changePassword');
              } else {
                nav(`/staff/password/change?redirect=${redirect}`, { replace: true });
              }
            }
          }
        }
      }
    }
  }, [errData, nav]);

  if (model === 'login') {
    return <LoginModal onSuccess={() => setModel(null)} />;
  }

  if (model === 'changePassword') {
    return <ChangePasswordModal onSuccess={() => setModel(null)} />;
  }

  return null;
});


