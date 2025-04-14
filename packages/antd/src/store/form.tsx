import { useForm } from '@formily/react';
import { useStore } from '@yimoka/react';
import { IStore, ListStore } from '@yimoka/store';
import React, { } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Form, FormProps } from '../enter/form';

export const StoreForm = (props: StoreFormProps) => {
  const { fields, store, onSubmitCapture, labelWidth, row, col, ...args } = props;
  const curStore = useStore(store);
  const location = useLocation();
  const nav = useNavigate();
  const form = useForm();

  const autoSubmit = (values: never) => {
    onSubmitCapture?.(values);
    form?.submit?.().then(() => {
      const isList = curStore instanceof ListStore;
      if (isList && curStore.isPaginate) {
        curStore.setFieldValue(curStore?.options?.keys?.page, 1);
      }
      curStore?.fetch();
      if (isList && curStore.options.bindRoute) {
        const { pathname, search } = location;
        const valSearch = curStore.genURLSearch();
        if (search !== `?${valSearch}`) {
          nav(`${pathname}?${valSearch}`, { replace: curStore.options.updateRouteType === 'replace' });
        };
      }
    });
  };
  return <Form {...args} onSubmitCapture={autoSubmit} />;
};

export type StoreFormProps = FormProps & { store?: IStore }
