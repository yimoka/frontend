
import { observer } from '@formily/react';
import { IAnyObject, isBlank, isSuccess } from '@yimoka/shared';
import { IStore } from '@yimoka/store';
import React, { PropsWithChildren, useMemo } from 'react';

import { ISize } from '../../context/config';
import { useComponents } from '../../hooks/components';
import { useStore } from '../../hooks/store';

export type IEntityResProps = PropsWithChildren<{
  store?: IStore,
  skeleton?: IAnyObject | false
  returnIndex?: boolean
  again?: boolean
  load?: IAnyObject | boolean
  size?: ISize
}>

export const EntityStoreRes = observer((props: IEntityResProps) => {
  const { store, children, skeleton, returnIndex, again = true, load = false, size } = props;
  const curStore = useStore(store);
  const { loading, response, fetch } = curStore;

  const components = useComponents();

  const Loading = useMemo(() => (components?.Loading ?? (() => 'loading')), [components?.Loading]);

  const Skeleton = useMemo(() => (components?.Skeleton ?? (() => 'loading')), [components?.Skeleton]);

  const ErrorContent = useMemo(() => (components?.ErrorContent ?? (() => 'error')), [components?.ErrorContent]);

  const curOnAgain = useMemo(() => (again ? fetch : undefined), [again, fetch]);

  const isSkeleton = useMemo(() => loading && isBlank(response) && skeleton !== false, [loading, response, skeleton]);

  const curChildren = useMemo(
    () => (load
      ? <Loading size={size} {...(typeof load === 'object' ? load : {})} loading={loading}>{children}</Loading>
      : children)
    , [load, Loading, size, loading, children],
  );

  if (isBlank(curStore) || isSuccess(response)) {
    return curChildren;
  }

  if (isSkeleton) {
    return <Skeleton size={size} {...skeleton} />;
  }

  return <ErrorContent size={size} response={response} returnIndex={returnIndex} onAgain={curOnAgain} loading={loading} />;
});
