import { ButtonProps, SpinProps, Button, theme, Loading } from '@yimoka/antd';
import { observer, useInitStore } from '@yimoka/react';
import { IStoreAPI, IStoreRunNow } from '@yimoka/store';
import React, { HTMLAttributes, useEffect } from 'react';

const { useToken } = theme;

export interface ImageCaptchaProps extends Omit<SpinProps, 'spinning'> {
  runNow?: IStoreRunNow;
  height?: number;
  onChange?: (id: string) => void;
  imgProps?: Omit<HTMLAttributes<HTMLImageElement>, 'src' | 'onClick'>;
  btnProps?: Omit<ButtonProps, 'disabled' | 'onClick'>;
  api?: IStoreAPI;
}

export const ImageCaptcha = observer((props: ImageCaptchaProps) => {
  const token = useToken();
  const { onChange, runNow = 'always', height = token.token.controlHeight, imgProps, api, btnProps, ...args } = props;
  const { loading, response, fetch } = useInitStore({
    options: { runNow },
    defaultValues: {},
    api: api ?? { url: '/base/iam/portal/captcha/image' },
  });

  const { id, image } = response?.data ?? {};

  useEffect(() => {
    onChange?.(id);
  }, [id, onChange]);

  const getImg = () => {
    if (!loading) {
      fetch();
    };
  };

  return (
    <Loading {...args} spinning={loading} >
      {image
        ? <img alt='验证码'
          height={height}
          style={{ position: 'relative', top: 1, display: 'block', cursor: 'pointer' }}
          width="100%"
          {...imgProps}
          src={image}
          onClick={getImg} />
        : <Button ghost
          type="primary"
          {...btnProps}
          disabled={loading}
          onClick={getImg}>
          获取验证码
        </Button>}
    </Loading>
  );
});
