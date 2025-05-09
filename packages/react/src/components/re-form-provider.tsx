import { Form, createForm } from '@formily/core';
import { observer, useFieldSchema, FormProvider, RecordScope } from '@formily/react';
import { IAnyObject } from '@yimoka/shared';
import { ListStore } from '@yimoka/store';
import React, { useMemo, PropsWithChildren } from 'react';

import { useSchemaField } from '../context/schema-field';
import { useStore } from '../hooks/store';

export const ReFormProvider = observer((props: ReFormProviderProps) => {
  const { values } = props;
  const fieldSchema = useFieldSchema();
  // 值更新时，重新创建 form 强制重新渲染整体
  const model = useMemo<Form>(() => createForm({ values: { values } }), [values]);

  // 值更新,在 items 中 引用 scope 的值 仍然无法触发渲染 如表格 'x-hidden': '{{$record.switch}}' 其中 items 使用 RecursionField 渲染
  // const [model] = useState<Form>(() => createForm({ values: { values } }));
  // useEffect(() => {
  //   model.setValues({ values });
  // }, [values, model]);
  const type = Array.isArray(model.values.values) ? 'array' : typeof model.values;

  const curSchema = useMemo(() => {
    // 必须使用 toJSON 否则 scope 会丢失
    const { 'x-decorator': decorator, 'x-decorator-props': decoratorProps, properties, ...args } = fieldSchema?.toJSON() ?? {};
    if (decorator === 'ReFormProvider' || decorator === 'ReFormByListData') {
      return { type: 'object', properties: { values: { ...args, properties, type } } };
    }
    return { type: 'object', properties: { values: { type: 'void', properties } } };
  }, [fieldSchema, type]);

  const SchemaField = useSchemaField();

  return (
    <FormProvider form={model}>
      <RecordScope getRecord={() => model.values}>
        {SchemaField && <SchemaField schema={curSchema} />}
        {/* 不渲染其子组件 */}
        {/* {children} */}
      </RecordScope>
    </FormProvider>
  );
});

export type ReFormProviderProps = PropsWithChildren<{
  values?: IAnyObject;
}>

export const ReFormByListData = observer((props: ReFormByListDataProps) => {
  const { store, ...rest } = props;
  const curStore = useStore(store) as ListStore;
  return <ReFormProvider  {...rest} values={curStore?.listData ?? []} />;
});

export type ReFormByListDataProps = PropsWithChildren<{
  store?: ListStore;
}>
