import { components as antdComponents } from '@yimoka/antd';
import { IConfigComponents, components as reactComponents } from '@yimoka/react';

import { ImageCaptcha } from './enter/captcha-image';
import { MailCaptcha } from './enter/mail-captcha';
import { SelectIcon } from './enter/select-icon';
export const components: IConfigComponents = {
  ...reactComponents,
  ...antdComponents,
  ImageCaptcha,
  MailCaptcha,
  SelectIcon,
};
