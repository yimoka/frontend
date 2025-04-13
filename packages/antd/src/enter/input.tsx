import { useAdditionalNode } from '@yimoka/react';
import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import { PasswordProps as AntPasswordProps, SearchProps as AntSearchProps, TextAreaProps as AntTextAreaProps } from 'antd/lib/input';
import React from 'react';

import { handleAllowClear } from '../tools/icon';

type IOnChange<T = HTMLInputElement> = (value: string, e: React.ChangeEvent<T>) => void;

export type InputProps = Omit<AntInputProps, 'onChange'> & { onChange?: IOnChange }

const InputFC = (props: InputProps) => {
  const { onChange, prefix, suffix, addonBefore, addonAfter, allowClear, ...rest } = props;

  const curPrefix = useAdditionalNode('prefix', prefix);
  const curSuffix = useAdditionalNode('suffix', suffix);
  const curAddonBefore = useAdditionalNode('addonBefore', addonBefore);
  const curAddonAfter = useAdditionalNode('addonAfter', addonAfter);

  return (
    <AntInput
      {...rest}
      addonAfter={curAddonAfter}
      addonBefore={curAddonBefore}
      allowClear={handleAllowClear(allowClear)}
      prefix={curPrefix}
      suffix={curSuffix}
      onChange={e => onChange?.(e.target.value, e)}
    />);
};

export type TextAreaProps = Omit<AntTextAreaProps, 'onChange'> & { onChange?: IOnChange<HTMLTextAreaElement> }

const TextArea = (props: TextAreaProps) => {
  const { onChange, allowClear, ...rest } = props;

  return (
    <AntInput.TextArea
      {...rest}
      allowClear={handleAllowClear(allowClear)}
      onChange={e => onChange?.(e.target.value, e)}
    />);
};

export type PasswordProps = Omit<AntPasswordProps, 'onChange'> & { onChange?: IOnChange }

const Password = (props: PasswordProps) => {
  const { onChange, prefix, suffix, addonBefore, addonAfter, allowClear, ...rest } = props;

  const curPrefix = useAdditionalNode('prefix', prefix);
  const curSuffix = useAdditionalNode('suffix', suffix);
  const curAddonBefore = useAdditionalNode('addonBefore', addonBefore);
  const curAddonAfter = useAdditionalNode('addonAfter', addonAfter);

  return (
    <AntInput.Password
      {...rest}
      addonAfter={curAddonAfter}
      addonBefore={curAddonBefore}
      allowClear={handleAllowClear(allowClear)}
      prefix={curPrefix}
      suffix={curSuffix}
      onChange={e => onChange?.(e.target.value, e)}
    />);
};

export type SearchProps = Omit<AntSearchProps, 'onChange'> & { onChange?: IOnChange }

const Search = (props: SearchProps) => {
  const { onChange, prefix, suffix, addonBefore, addonAfter, enterButton, allowClear, ...rest } = props;

  const curPrefix = useAdditionalNode('prefix', prefix);
  const curSuffix = useAdditionalNode('suffix', suffix);
  const curAddonBefore = useAdditionalNode('addonBefore', addonBefore);
  const curAddonAfter = useAdditionalNode('addonAfter', addonAfter);
  const curEnterButton = useAdditionalNode('enterButton', enterButton);

  return (
    <AntInput.Search
      {...rest}
      addonAfter={curAddonAfter}
      addonBefore={curAddonBefore}
      allowClear={handleAllowClear(allowClear)}
      enterButton={curEnterButton}
      prefix={curPrefix}
      suffix={curSuffix}
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
