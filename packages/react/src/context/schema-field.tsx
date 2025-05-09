import { createSchemaField } from '@formily/react';
import { createContext, useContext } from 'react';

// 类型 获取 createSchemaField() 的返回值
const SchemaFieldContext = createContext<ReturnType<typeof createSchemaField> | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSchemaField = () => useContext(SchemaFieldContext);

export const SchemaFieldProvider = SchemaFieldContext.Provider;

export const SchemaFieldConsumer = SchemaFieldContext.Consumer;
