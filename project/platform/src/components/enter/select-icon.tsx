import * as AntdIcons from '@ant-design/icons';
import { AutoComplete, Icon, Space, AutoCompleteProps } from '@yimoka/antd';
import { observer } from '@yimoka/react';
import { IAny } from '@yimoka/shared';
import React from 'react';

const { IconProvider, ...args } = AntdIcons;
const options = Object.keys(args).filter(key => /^[A-Z]+/.test(key))
  .map((key: IAny) => ({ label: <Space><Icon name={key} />{key}</Space>, value: key }));

export const SelectIcon = observer((props: AutoCompleteProps) => <AutoComplete allowClear
  filterOption
  options={options}
  {...props} />);
