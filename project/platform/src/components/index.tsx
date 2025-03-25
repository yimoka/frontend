import { components as antdComponents } from '@yimoka/antd';
import { IConfigComponents, components as reactComponents } from '@yimoka/react';

import { MailCaptcha } from './enter/mail-captcha';

export const components: IConfigComponents = {
  ...reactComponents,
  ...antdComponents,
  MailCaptcha,
};
