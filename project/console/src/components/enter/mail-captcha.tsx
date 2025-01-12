import { observer } from '@formily/react';
import { useInitStore } from '@yimoka/react';
import { Input, Modal, Space, Typography } from 'antd';
import React, { useEffect } from 'react';

import { getImageCaptcha, getMailCaptcha } from '@/pages/user/api';

import { ImageCaptcha } from './captcha-image';

export interface MailCaptchaProps {
  mailPrefix?: string;
  mail: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const MailCaptcha = observer((props: MailCaptchaProps) => {
  const { mail, value, mailPrefix, onChange } = props;
  const { values, setValues, fetch } = useInitStore({
    defaultValues: {
      mail,
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
    setValues({ mail });
  }, [mailPrefix, mail, setValues]);

  const { captchaCode, needCaptcha } = values;

  const getCode = () => {
    fetch();
  };

  return (
    <>
      <Input
        value={value}
        onChange={e => onChange?.(e.target.value)}
        addonAfter={<Typography.Link onClick={getCode} disabled={!mail || mail?.length < 5} >获取验证码</Typography.Link>}
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
