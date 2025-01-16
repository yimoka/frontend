import { observer } from '@formily/react';

import { IStoreAPI } from '@yimoka/store';

import React, { ReactNode } from 'react';

import { FetchDataConfig, useFetchData } from '../hooks/fetch-data';

import { EntityResponse } from './entity/response';

export const FetchData = observer((props: FetchDataConfig & { api: IStoreAPI, children?: ReactNode }) => {
  const { api, children, ...rest } = props;
  const [loading, , res] = useFetchData(api, rest);

  return <EntityResponse loading={loading} response={res} store={false} >{children}</EntityResponse>;
});
