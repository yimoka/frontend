import { useFieldSchema } from '@formily/react';
import { getFieldSplitter } from '@yimoka/store';
import { useMemo } from 'react';

import { useStore } from './store';

export const useSplitter = (splitter?: string) => {
  const field = useFieldSchema();
  const store = useStore();

  return useMemo(() => {
    if (splitter) {
      return splitter;
    }
    if (field) {
      const { name } = field;
      if (field['x-splitter']) {
        return field['x-splitter'];
      }
      if (store && name) {
        return getFieldSplitter(name, store);
      }
    }
    return ',';
  }, [field, store, splitter]);
};

