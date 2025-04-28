import { isVacuous } from '@yimoka/shared';
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
    const { bindRoute, routeTrigger, runNow } = options;
    if (bindRoute) {
      const oldValues = cloneDeep(values);
      setValuesFromRoute(search, params, resetMissingValues);
      const hasChanged = !isEqual(oldValues, store.values) || routeTrigger === 'any';
      const first = isFirst.current;
      isFirst.current = false;

      const getRunNow = () => {
        if (runNow === 'always') {
          return true;
        }
        if (runNow === 'whenRequired') {
          let isBool = true;
          if (form) {
            const { fields } = form;
            if (fields) {
              for (const field of Object.values(fields)) {
                if ('required' in field && field.required && isVacuous(field.value)) {
                  isBool = false;
                  break;
                }
              }
            }
          }
          return isBool;
        }
        return false;
      };

      if ((hasChanged && (!first || getRunNow())) || (!hasChanged && (first && getRunNow()))) {
        form.submit().then(() => fetch());
      }
    }
  }, [search, params, store, resetMissingValues]);

  return null;
};
