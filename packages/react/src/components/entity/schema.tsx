import { createSchemaField, FormProvider, ISchema, observer, RecordScope } from '@formily/react';
import { IAnyObject, isBlank } from '@yimoka/shared';
import { IFetchListener, IStore } from '@yimoka/store';
import React, { ComponentType, PropsWithChildren, useEffect, useMemo } from 'react';

import { useComponents } from '../../hooks/components';
import { useRoot } from '../../hooks/root';

export const EntitySchema = observer((props: EntitySchemaProps) => {
  const { store, components, scope, schema, children, onError, onSuccess } = props;
  const ctxComponents = useComponents();
  const root = useRoot();
  const { fieldsConfig, form } = store;

  const curSchema = useMemo(() => {
    if (isBlank(fieldsConfig)) {
      return schema;
    }
    const { definitions = {}, ...args } = schema ?? {};
    return { definitions: typeof definitions === 'object' ? { ...fieldsConfig, ...definitions } : fieldsConfig, ...args };
  }, [schema, fieldsConfig]);

  const SchemaField = useMemo(() => createSchemaField({
    components: components ? { ...ctxComponents, ...components } : ctxComponents,
    scope: { $store: store, $root: root, ...scope },
  }), [ctxComponents, components, store, root, scope]);

  useEffect(() => {
    if (onError) {
      store.onFetchError(onError);
    }
    if (onSuccess) {
      store.onFetchSuccess(onSuccess);
    }
    return () => {
      if (onError) {
        store.offFetchError(onError);
      }
      if (onSuccess) {
        store.offFetchSuccess(onSuccess);
      }
    };
  }, [onError, onSuccess, store]);

  return (
    <FormProvider form={form}>
      <RecordScope getRecord={() => store.values}>
        <SchemaField schema={curSchema} >
          {children}
        </SchemaField>
      </RecordScope>
    </FormProvider>
  );
});

export type EntitySchemaProps<V extends object = IAnyObject, R extends object = IAnyObject> = PropsWithChildren<{
  store: IStore<V, R>;
  components?: Record<string, ComponentType<IAnyObject>>;
  scope?: IAnyObject;
  schema?: ISchema;
  onError?: IFetchListener;
  onSuccess?: IFetchListener;
}>
