import { observer } from '@formily/react';
import { useInitStore } from '@yimoka/react';
import { IStoreAPI } from '@yimoka/store';
import { ButtonProps, SpinProps, Spin, Button } from 'antd';
import React, { HTMLAttributes, useEffect } from 'react';

export interface ImageCaptchaProps extends Omit<SpinProps, 'spinning'> {
  runNow?: boolean;
  height?: number;
  onChange?: (id: string) => void;
  imgProps?: Omit<HTMLAttributes<HTMLImageElement>, 'src' | 'onClick'>;
  btnProps?: Omit<ButtonProps, 'disabled' | 'onClick'>;
  api?: IStoreAPI;
}

export const ImageCaptcha = observer((props: ImageCaptchaProps) => {
  const { onChange, runNow = true, height = 32, imgProps, api, btnProps, ...args } = props;
  const { loading, response: { data: { id, image } = {} }, fetch } = useInitStore({
    options: { runNow },
    defaultValues: {},
    api: api ?? { url: '/admin/tenant/bff/captcha/image' },
  });

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
        ? <img height={height} alt='验证码' style={{ position: 'relative', top: 1, display: 'block', cursor: 'pointer' }} {...imgProps} src={image} onClick={getImg} />
        : <Button type="primary" ghost {...btnProps} disabled={loading} onClick={getImg}>
          获取验证码
        </Button>}
    </Spin>
  );
});
