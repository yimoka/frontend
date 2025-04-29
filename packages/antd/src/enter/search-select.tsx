import { IOptionsAPI, IOptionsAPISearchConfig, observer, useAPISearch } from '@yimoka/react';
import { IOptionsConfig } from '@yimoka/shared';

import { Spin } from 'antd';
import React, { useState } from 'react';

import { Select, SelectProps } from './select';

export const SearchSelect = observer((props: SearchSelectProps) => {
  const { api, labelAPI, searchConfig, toOptionsConf, value, options, ...rest } = props;
  const [searchVal, setSearchVal] = useState('');
  const [curOptions, loading] = useAPISearch(searchVal, value, options, api, labelAPI, searchConfig, toOptionsConf);

  return (
    <Select
      notFoundContent={loading ? <Spin size="small" /> : undefined}
      {...rest}
      showSearch
      filterOption={false}
      loading={loading}
      options={curOptions}
      onSearch={setSearchVal}
    />
  );
});

export type SearchSelectProps = Omit<SelectProps, 'showSearch' | 'loading' | 'filterOption'> & {
  api?: IOptionsAPI
  labelAPI?: IOptionsAPI | boolean
  searchConfig?: IOptionsAPISearchConfig
  toOptionsConf?: IOptionsConfig
}
