import { Schema, SchemaKey } from '@formily/json-schema';
import { RecordScope, ExpressionScope, useFieldSchema } from '@formily/react';
import { IAny, isVacuous } from '@yimoka/shared';
import React, { useMemo } from 'react';

import { IRecordIndexFn } from '../../hooks/record-index-fn';
import { getSchemaNameByFieldSchema } from '../../tools/schema-items';

import { SchemaItemRecursion } from './schema-item-recursion';

export const SchemaItemRender = (props: { value: IAny, record: IAny, schema: Schema, name?: SchemaKey, getRecordIndex?: IRecordIndexFn, componentName?: string }) => {
  const { value, record, schema, getRecordIndex, componentName, name } = props;
  const index = getRecordIndex?.(record);
  const fieldSchema = useFieldSchema();
  const curName = useMemo(() => {
    if (name) {
      return name;
    }
    const schemaName = getSchemaNameByFieldSchema(schema, fieldSchema);
    if (!isVacuous(schemaName)) {
      return `${index}.${schemaName}`;
    }
    // 如果找不到相对的 schemaName 并且 schema 是 void,如果不添加 name 会导致同一个数组项的所有 key 都是同一个 会导致渲染的结果都是每一个, 以支持正确渲染
    // 这里只是一种兼容方式 正常是建议在 item 里声明 type 为非 void 来获取相对的值
    if (schema.type === 'void') {
      return `${index}.${schema.name}`;
    }
    // 如果不转为字符串 0 会出现问题
    return `${index}`;
  }, [name, index, schema, fieldSchema]);

  return (
    <RecordScope getIndex={() => index ?? 0} getRecord={() => record} >
      <ExpressionScope value={{ $value: value }}>
        <SchemaItemRecursion componentName={componentName} name={curName} schema={schema} />
      </ExpressionScope>
    </RecordScope>
  );
};
