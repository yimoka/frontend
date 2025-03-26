import { Field } from '@formily/core';
import { observer, useField } from '@formily/react';
import { Spin } from '@yimoka/antd';
import { useInitStore } from '@yimoka/react';
import { Input, Modal, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import { getImageCaptcha, getMailCaptcha } from '@/pages/user/api';

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
    api: getMailCaptcha,
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
        addonAfter={
          <Typography.Link
            disabled={loading || !mail || !!field?.getState().errors?.length || countdown > 0}
            onClick={getCode}
          >
            {loading && <Spin size="small" />}
            {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
          </Typography.Link>
        }
        value={value}
        onChange={e => onChange?.(e.target.value)}
      />
      <Modal
        maskClosable={false}
        okButtonProps={{ disabled: captchaCode.length < 4 }}
        open={needCaptcha}
        title="请输入图形验证码"
        width={300}
        onCancel={() => setValues({ needCaptcha: false })}
        onOk={getCode}
      >
        <Space>
          <Input
            value={captchaCode}
            onChange={e => setValues({ captchaCode: e.target.value })}
            onPressEnter={() => captchaCode.length === 4 && getCode()}
          />
          <ImageCaptcha api={getImageCaptcha} onChange={v => setValues({ captchaID: v })} />
        </Space>
      </Modal>
    </>
  );
});
