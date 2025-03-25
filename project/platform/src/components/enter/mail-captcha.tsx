import { Field } from '@formily/core';
import { observer, useField } from '@formily/react';
import { Spin } from '@yimoka/antd';
import { useInitStore } from '@yimoka/react';
import { Input, Modal, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import { ImageCaptcha } from './captcha-image';

export interface MailCaptchaProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const MailCaptcha = observer((props: MailCaptchaProps) => {
  const { value, onChange } = props;
  const field = useField<Field>();
  const [countdown, setCountdown] = useState(0);

  const { values, setValues, fetch, loading } = useInitStore({
    defaultValues: {
      mail: value,
      needCaptcha: false,
      captchaID: '',
      captchaCode: '',
    },
    options: { filterBlankAtRun: true },
    api: { url: '/base/iam/portal/captcha/mail' },
    afterAtFetch: {
      notify: true,
      failRun: (res, store) => res.metadata?.needCaptcha && store.setFieldValue('needCaptcha', true),
      successRun: (_, store) => {
        store.setFieldValue('needCaptcha', false);
        setCountdown(60);
      },
    },
  });

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  useEffect(() => {
    setValues({ mail: value });
  }, [setValues, value]);

  const { mail, captchaCode, needCaptcha } = values;

  const getCode = () => {
    fetch();
  };

  return (
    <>
      <Input
        value={value}
        onChange={e => onChange?.(e.target.value)}
        addonAfter={
          <Typography.Link
            onClick={getCode}
            disabled={loading || !mail || !!field?.getState().errors?.length || countdown > 0}
          >
            {loading && <Spin size="small" />}
            {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
          </Typography.Link>
        }
      />
      <Modal
        maskClosable={false}
        title="请输入图形验证码"
        width={300}
        open={needCaptcha}
        okButtonProps={{ disabled: captchaCode.length < 4 }}
        onOk={getCode}
        onCancel={() => setValues({ needCaptcha: false })}
      >
        <Space>
          <Input
            value={captchaCode}
            onPressEnter={() => captchaCode.length === 4 && getCode()}
            onChange={e => setValues({ captchaCode: e.target.value })}
          />
          <ImageCaptcha api={{ url: '/base/iam/portal/captcha/image' }} onChange={v => setValues({ captchaID: v })} />
        </Space>
      </Modal>
    </>
  );
});
