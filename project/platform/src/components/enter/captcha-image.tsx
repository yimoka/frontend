import { observer } from '@formily/react';
import { useInitStore } from '@yimoka/react';
import { IStoreAPI } from '@yimoka/store';
import { ButtonProps, SpinProps, Spin, Button, theme } from 'antd';
import React, { HTMLAttributes, useEffect } from 'react';

const { useToken } = theme;

export interface ImageCaptchaProps extends Omit<SpinProps, 'spinning'> {
  runNow?: boolean;
  height?: number;
  onChange?: (id: string) => void;
  imgProps?: Omit<HTMLAttributes<HTMLImageElement>, 'src' | 'onClick'>;
  btnProps?: Omit<ButtonProps, 'disabled' | 'onClick'>;
  api?: IStoreAPI;
}

export const ImageCaptcha = observer((props: ImageCaptchaProps) => {
  const token = useToken();
  const { onChange, runNow = true, height = token.token.controlHeight, imgProps, api, btnProps, ...args } = props;
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
    <Spin {...args} spinning={loading} >
      {image
        ? <img height={height} width="100%" alt='验证码' style={{ position: 'relative', top: 1, display: 'block', cursor: 'pointer' }} {...imgProps} src={image} onClick={getImg} />
        : <Button type="primary" ghost {...btnProps} disabled={loading} onClick={getImg}>
          获取验证码
        </Button>}
    </Spin>
  );
});
