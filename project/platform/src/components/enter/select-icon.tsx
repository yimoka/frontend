import * as AntdIcons from '@ant-design/icons';
import { observer } from '@formily/react';
import { AutoComplete, Icon, Space } from '@yimoka/antd';
import { IAny } from '@yimoka/shared';
import { AutoCompleteProps } from 'antd';
import React from 'react';

const { IconProvider, ...args } = AntdIcons;
const options = Object.keys(args).filter(key => /^[A-Z]+/.test(key))
  .map((key: IAny) => ({ label: <Space><Icon name={key} />{key}</Space>, value: key }));

export const SelectIcon = observer((props: AutoCompleteProps) => <AutoComplete allowClear
filterOption
options={options}
  {...props} />);
