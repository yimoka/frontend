import { components as antdComponents } from '@yimoka/antd';
import { IConfigComponents, components as reactComponents } from '@yimoka/react';

import { ImageCaptcha } from './enter/captcha-image';
import { MailCaptcha } from './enter/mail-captcha';
import { SelectIcon } from './enter/select-icon';
import { EntityBatchAddModal } from './entity/entity-batch-add-modal';
import { JSONEditor } from './lazy/monaco-editor';
export const components: IConfigComponents = {
  ...reactComponents,
  ...antdComponents,
  // lazy
  JSONEditor,

  // entity
  EntityBatchAddModal,

  ImageCaptcha,
  MailCaptcha,
  SelectIcon,
};
