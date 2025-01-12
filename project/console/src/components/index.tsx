import { IConfigComponents } from '@yimoka/react';
import { components as antdComponents } from '@yimoka/antd';

import { MailCaptcha } from './enter/mail-captcha';

export const components: IConfigComponents = {
  ...antdComponents,
  MailCaptcha,
};
