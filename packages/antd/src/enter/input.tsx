import { useAdditionalNode } from '@yimoka/react';
import { Input as AntInput, InputProps } from 'antd';
import { PasswordProps, SearchProps, TextAreaProps } from 'antd/lib/input';
import React from 'react';

import { handleAllowClear } from '../tools/icon';

type IOnChange<T = HTMLInputElement> = (value: string, e: React.ChangeEvent<T>) => void;

const InputFC = (props: Omit<InputProps, 'onChange'> & { onChange?: IOnChange }) => {
  const { onChange, prefix, suffix, addonBefore, addonAfter, allowClear, ...rest } = props;

  const curPrefix = useAdditionalNode('prefix', prefix);
  const curSuffix = useAdditionalNode('suffix', suffix);
  const curAddonBefore = useAdditionalNode('addonBefore', addonBefore);
  const curAddonAfter = useAdditionalNode('addonAfter', addonAfter);

  return (
    <AntInput
      {...rest}
      allowClear={handleAllowClear(allowClear)}
      prefix={curPrefix}
      suffix={curSuffix}
      addonBefore={curAddonBefore}
      addonAfter={curAddonAfter}
      onChange={e => onChange?.(e.target.value, e)}
    />);
};

const TextArea = (props: Omit<TextAreaProps, 'onChange'> & { onChange?: IOnChange<HTMLTextAreaElement> }) => {
  const { onChange, allowClear, ...rest } = props;

  return (
    <AntInput.TextArea
      {...rest}
      allowClear={handleAllowClear(allowClear)}
      onChange={e => onChange?.(e.target.value, e)}
    />);
};

const Password = (props: Omit<PasswordProps, 'onChange'> & { onChange?: IOnChange }) => {
  const { onChange, prefix, suffix, addonBefore, addonAfter, allowClear, ...rest } = props;

  const curPrefix = useAdditionalNode('prefix', prefix);
  const curSuffix = useAdditionalNode('suffix', suffix);
  const curAddonBefore = useAdditionalNode('addonBefore', addonBefore);
  const curAddonAfter = useAdditionalNode('addonAfter', addonAfter);

  return (
    <AntInput.Password
      {...rest}
      prefix={curPrefix}
      suffix={curSuffix}
      addonBefore={curAddonBefore}
      addonAfter={curAddonAfter}
      allowClear={handleAllowClear(allowClear)}
      onChange={e => onChange?.(e.target.value, e)}
    />);
};

const Search = (props: Omit<SearchProps, 'onChange'> & { onChange?: IOnChange }) => {
  const { onChange, prefix, suffix, addonBefore, addonAfter, enterButton, allowClear, ...rest } = props;

  const curPrefix = useAdditionalNode('prefix', prefix);
  const curSuffix = useAdditionalNode('suffix', suffix);
  const curAddonBefore = useAdditionalNode('addonBefore', addonBefore);
  const curAddonAfter = useAdditionalNode('addonAfter', addonAfter);
  const curEnterButton = useAdditionalNode('enterButton', enterButton);

  return (
    <AntInput.Search
      {...rest}
      prefix={curPrefix}
      suffix={curSuffix}
      addonBefore={curAddonBefore}
      addonAfter={curAddonAfter}
      enterButton={curEnterButton}
      allowClear={handleAllowClear(allowClear)}
      onChange={e => onChange?.(e.target.value, e)}
    />);
};


export const Input = Object.assign(InputFC, {
  TextArea,
  Password,
  Search,
  Group: AntInput.Group,
  OTP: AntInput.OTP,
});
