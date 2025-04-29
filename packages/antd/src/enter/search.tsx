import { IOptionsAPI, IOptionsAPISearchConfig, observer, useAPISearch } from '@yimoka/react';
import { IOptionsConfig } from '@yimoka/shared';
import { Spin } from 'antd';
import React, { useState } from 'react';

import { AutoComplete, AutoCompleteProps } from './auto-complete';

export const Search = observer((props: SearchProps) => {
  const { api, searchConfig, optionsConfig, value, options, ...rest } = props;
  const [searchVal, setSearchVal] = useState('');
  const [curOptions, loading] = useAPISearch(searchVal, value, options, api, false, searchConfig, optionsConfig);

  return (
    <AutoComplete
      notFoundContent={loading ? <Spin size="small" /> : undefined}
      {...rest}
      filterOption={false}
      options={curOptions}
      onSearch={setSearchVal}
    />
  );
});

export type SearchProps = Omit<AutoCompleteProps, 'filterOption'> & {
  api?: IOptionsAPI
  searchConfig?: IOptionsAPISearchConfig
  optionsConfig?: IOptionsConfig
}
