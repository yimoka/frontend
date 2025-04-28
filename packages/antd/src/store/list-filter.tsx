import { observer } from '@formily/react';
import { useStore } from '@yimoka/react';
import { Button, ButtonProps, Col, ColProps, Flex, Space, theme } from 'antd';
import React from 'react';

import { useLocaleComponent } from '../hooks/use-locale';

import { StoreForm, StoreFormProps } from './form';
import { Submit } from './submit';

const { useToken } = theme;

export const ListFilter = observer((props: ListFilterProps) => {
  const { labelAttached = true, isReset = true, store, queryProps, resetProps, actionCol, col, children, row = true, ...rest } = props;
  const curStore = useStore(store);
  const token = useToken();
  const locale = useLocaleComponent('ListFilter');

  return (
    <StoreForm
      col={{ span: 8, ...col }}
      colon={false}
      labelAttached={labelAttached}
      row={row}
      {...rest}
    >
      {children}
      <Col
        {...col}
        {...actionCol}
        style={{ marginLeft: 'auto', ...actionCol?.style }}>
        <Flex justify='end' style={{ marginBottom: token.token.margin }} >
          <Space>
            <Submit children={locale.query} store={curStore} {...queryProps} />
            {isReset && <Button children={locale.reset} {...resetProps} onClick={curStore?.resetValues} />}
          </Space>
        </Flex>
      </Col>
    </StoreForm >
  );
});

export interface ListFilterProps extends StoreFormProps {
  isReset?: boolean;
  queryProps?: ButtonProps;
  resetProps?: ButtonProps;
  actionCol?: ColProps;
}
