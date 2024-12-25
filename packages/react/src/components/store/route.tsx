import { IStore } from '@yimoka/store';
import { cloneDeep, isEqual } from 'lodash-es';
import { useEffect, useRef } from 'react';

import { useLocation, useRouteParams } from '../../context/config';

export const StoreRoute = (props: { store: IStore, resetMissingValues?: boolean }) => {
  const { store, resetMissingValues = true } = props;
  const isFirst = useRef(true);
  const search = useLocation()?.search;
  const params = useRouteParams();

  useEffect(() => {
    const { options, values, setValuesFromRoute, fetch, form } = store;
    const { bindRoute, routeTrigger, entryRun } = options;
    if (bindRoute) {
      const oldValues = cloneDeep(values);
      setValuesFromRoute(search, params, resetMissingValues);
      const hasChanged = !isEqual(oldValues, store.values) || routeTrigger === 'any';
      const first = isFirst.current;
      isFirst.current = false;
      if ((hasChanged && (!first || entryRun)) || (!hasChanged && (first && entryRun))) {
        form.submit().then(() => fetch());
      }
    }
  }, [search, params, store, resetMissingValues]);

  return null;
};
