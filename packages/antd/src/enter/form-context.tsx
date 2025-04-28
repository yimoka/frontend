import { ColProps, RowProps } from 'antd';
import { createContext } from 'react';

// 创建一个 from 的上下文 用来记录布局信息
export const FormLayoutContext = createContext<FormLayoutProps>({});

export interface FormLayoutProps {
  row?: Omit<RowProps, 'children'> | true
  col?: Omit<ColProps, 'children'>
  labelWidth?: number
  // 是否将 label 和 输入框并在一起 通过 space.Compact 组件实现 当为 true 时 labelWidth 无效
  labelAttached?: boolean
}
