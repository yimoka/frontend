import { Spin, SpinProps } from 'antd';

export const Loading = (props: SpinProps & { loading?: boolean }) => {
  const { loading, spinning, ...rest } = props;
  return <Spin {...rest} spinning={spinning ?? loading} />;
};
