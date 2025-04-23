import { useLayout } from './useLayout';

export const usePrefix = (after = '') => useLayout()?.prefixCls + after;
