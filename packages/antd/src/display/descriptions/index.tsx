import { useFieldSchema } from '@formily/react';
import { getPropsByItemSchema, isItemSchemaRecursion, RenderAny, SchemaItemRecursion, schemaItemsReduce, useComponentData } from '@yimoka/react';
import { IAny, normalizeToArray } from '@yimoka/shared';
import { IStore } from '@yimoka/store';
import { Descriptions as AntDescriptions, DescriptionsProps } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { get } from 'lodash-es';
import React, { useMemo } from 'react';

const propsMap = { label: 'title' };

export const Descriptions = (props: DescriptionsProps & { value?: IAny, data?: IAny, dataKey?: string, store?: IStore }) => {
  const { items, value, data, dataKey, store, ...rest } = props;
  const fieldSchema = useFieldSchema();
  const curData = useComponentData([data, value], dataKey, store);

  const { items: fieldItems } = fieldSchema ?? {};

  const schemaItems = useMemo(() => {
    const arr: DescriptionsItemType[] = [];
    if (!fieldItems) {
      return arr;
    }
    normalizeToArray(curData).forEach((itemData, index) => {
      const itemSchema = Array.isArray(fieldItems) ? (fieldItems[index] ?? fieldItems[0]) : fieldItems;

      const itemArr = schemaItemsReduce(fieldSchema, (itemSchema, key, _index) => {
        const itemComponentName = 'Item';
        const itemProps = getPropsByItemSchema(itemSchema, itemComponentName, propsMap);
        if (isItemSchemaRecursion(itemSchema, itemComponentName)) {
          itemProps.children = <SchemaItemRecursion schema={itemSchema} componentName={itemComponentName} name={key} />;
        } else if (typeof itemProps.children === 'undefined' && curData) {
          itemProps.children = <RenderAny value={get(curData, key)} />;
        }
        return itemProps;
      });
      if (itemArr) {
        arr.push(...itemArr);
      }
    });

    return arr;
  }, [curData, fieldItems, fieldSchema]);

  const curItems = useMemo(() => [...(schemaItems ?? []), ...(items ?? [])], [items, schemaItems]);

  return (
    <AntDescriptions {...rest} items={curItems} />
  );
};
