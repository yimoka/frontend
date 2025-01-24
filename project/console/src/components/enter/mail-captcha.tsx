import { Field } from '@formily/core';
import { observer, useField } from '@formily/react';
import { useInitStore } from '@yimoka/react';
import { Input, Modal, Space, Typography } from 'antd';
import React, { useEffect } from 'react';

import { getImageCaptcha, getMailCaptcha } from '@/pages/user/api';

import { ImageCaptcha } from './captcha-image';

export interface MailCaptchaProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const MailCaptcha = observer((props: MailCaptchaProps) => {
  const { value, onChange } = props;
  const field = useField<Field>();

  const { values, setValues, fetch } = useInitStore({
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
      successRun: (_, store) => store.setFieldValue('needCaptcha', false),
    },
  });

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
        addonAfter={<Typography.Link onClick={getCode} disabled={!mail || !!field?.getState().errors?.length} >获取验证码</Typography.Link>}
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
          <ImageCaptcha api={getImageCaptcha} onChange={v => setValues({ captchaID: v })} />
        </Space>
      </Modal>
    </>
  );
});
