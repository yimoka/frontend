import { useFieldSchema, useForm } from '@formily/react';
import { getPropsByItemSchema, isItemSchemaRecursion, RenderAny, SchemaItemRecursion, schemaItemsReduce } from '@yimoka/react';
import { IAny } from '@yimoka/shared';
import { Descriptions as AntDescriptions, DescriptionsProps } from 'antd';
import { get } from 'lodash-es';
import React, { useMemo } from 'react';

const propsMap = { label: 'title' };

export const Descriptions = (props: DescriptionsProps & { value?: IAny, data?: IAny }) => {
  const { items, value, data, ...rest } = props;
  const fieldSchema = useFieldSchema();
  const form = useForm();
  const curData = value ?? data ?? form.values;

  const schemaItems = useMemo(() => schemaItemsReduce(fieldSchema, (itemSchema, key, _index) => {
    const itemComponentName = 'Item';
    const itemProps = getPropsByItemSchema(itemSchema, itemComponentName, propsMap);
    if (isItemSchemaRecursion(itemSchema, itemComponentName)) {
      itemProps.children = <SchemaItemRecursion schema={itemSchema} componentName={itemComponentName} name={key} />;
    } else if (typeof itemProps.children === 'undefined' && curData) {
      itemProps.children = <RenderAny value={get(curData, key)} />;
    }
    return itemProps;
  }), [curData, fieldSchema]);

  const curItems = useMemo(() => [...(schemaItems ?? []), ...(items ?? [])], [items, schemaItems]);

  return (
    <AntDescriptions {...rest} items={curItems} />
  );
};
