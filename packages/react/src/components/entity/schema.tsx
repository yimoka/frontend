import { createSchemaField, FormProvider, ISchema, observer, RecordScope } from '@formily/react';
import { IAnyObject, isBlank } from '@yimoka/shared';
import { IStore } from '@yimoka/store';
import { ComponentType, PropsWithChildren, useMemo } from 'react';

import { useComponents } from '../../hooks/components';
import { useRoot } from '../../hooks/root';

export const EntitySchema = observer((props: EntitySchemaProps) => {
  const { store, components, scope, schema, children } = props;
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
    components: { ...ctxComponents, ...components },
    scope: { $store: store, $root: root, ...scope },
  }), [ctxComponents, components, store, root, scope]);

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
  schema: ISchema;
}>
