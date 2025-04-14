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
