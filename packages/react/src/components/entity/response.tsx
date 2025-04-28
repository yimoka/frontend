/* eslint-disable @typescript-eslint/naming-convention */

import { observer } from '@formily/react';
import { IAnyObject, isVacuous, isSuccess } from '@yimoka/shared';
import { IStore, IStoreResponse } from '@yimoka/store';
import React, { PropsWithChildren, useMemo } from 'react';

import { ISize } from '../../context/config';
import { useComponents } from '../../hooks/components';
import { useStore } from '../../hooks/store';

export type IEntityResponseProps = PropsWithChildren<{
  store?: IStore | false
  skeleton?: IAnyObject | false
  returnIndex?: boolean
  again?: boolean
  load?: IAnyObject | boolean
  size?: ISize
  loading?: boolean
  response?: IStoreResponse
}>

// eslint-disable-next-line complexity
export const EntityResponse = observer((props: IEntityResponseProps) => {
  const { store, children, skeleton, returnIndex, again = true, load = false, size, loading, response } = props;
  const curStore = useStore(store);
  const curLoading = loading ?? curStore?.loading;
  const curResponse = response ?? curStore?.response;

  const components = useComponents();

  const Loading = useMemo(() => (components?.Loading ?? (() => 'loading')), [components?.Loading]);

  const Skeleton = useMemo(() => (components?.Skeleton ?? (() => 'loading')), [components?.Skeleton]);

  const ErrorContent = useMemo(() => (components?.ErrorContent ?? (() => 'error')), [components?.ErrorContent]);

  const curOnAgain = useMemo(() => (again ? curStore?.fetch : undefined), [again, curStore?.fetch]);

  const isSkeleton = useMemo(() => curLoading && isVacuous(curResponse) && skeleton !== false, [curLoading, curResponse, skeleton]);

  const curChildren = useMemo(
    () => (load
      ? <Loading size={size} {...(typeof load === 'object' ? load : {})} loading={curLoading}>{children}</Loading>
      : children)
    , [load, Loading, size, curLoading, children],
  );

  if (isVacuous(curStore) || isSuccess(curResponse)) {
    return curChildren;
  }

  if (isSkeleton) {
    return <Skeleton size={size} {...skeleton} />;
  }

  return (
    <ErrorContent
      loading={curLoading}
      response={curResponse}
      returnIndex={returnIndex}
      size={size}
      onAgain={curOnAgain}
    />
  );
});
