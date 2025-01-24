/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Field, Form as FormCore } from '@formily/core';
import { useFieldSchema, RecursionField, observer, useForm, useField } from '@formily/react';

import { Col, ColProps, FormItemProps as AntFormItemProps, FormProps, Row, Form, GetRef, Tooltip } from 'antd';
import { RowProps } from 'antd/lib';
import { FC, ReactNode, Ref, createContext, forwardRef, isValidElement, useContext, useImperativeHandle, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IStore, ListStore, judgeIsEmpty, useAdditionalNode, useCurStore } from '@/pkg/store';

import { TextProps, Text } from '../out/typography';
import { EditComponentPrivateWp } from '../page/edit/edit-component-private-wp';

// 创建一个 from 的上下文 用来记录布局信息
const FormContext = createContext<FormLayoutProps>({});

const StoreFormC: IStoreForm = forwardRef((props, newRef?: Ref<StoreFormRef>) => {
  const { fields, store, children, onSubmitCapture, labelWidth, row, col, beforeSubmit, forceUpdateUrl, ...args } = props;
  const curStore = useCurStore(store);
  const location = useLocation();
  const nav = useNavigate();
  const form = useForm();
  const ref = useRef<StoreFormRef>(null);


  const autoSubmit = async (values: never) => {
    onSubmitCapture?.(values);
    if (beforeSubmit && curStore) {
      const res = await beforeSubmit(curStore, form);
      if (res === false) {
        return;
      }
      if (res && typeof res === 'string') {
        return;
      }
    }

    form?.submit?.().then(() => {
      const isList = curStore instanceof ListStore;
      if (isList) {
        curStore.setValues({ [curStore.keysConfig.page ?? 'page']: 1 });
      }
      curStore?.runAPI();

      if (isList && curStore.isBindRouter) {
        const { pathname, search } = location;
        let valSearch = curStore.getURLSearch();
        if (forceUpdateUrl) {
          valSearch += `${valSearch ? '&' : ''}__forceUpdateUrlTime=${Date.now()}`;
        }
        if (search !== `?${valSearch}`) {
          nav(`${pathname}?${valSearch}`, { replace: curStore.queryRoutingType === 'replace' });
        };
      }
    });
  };

  // @ts-ignore
  useImperativeHandle(newRef, () => ({
    ...ref.current,
    dispatchSubmit: () => {
      ref?.current?.nativeElement?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    },
  }));


  const el = <><StoreFormFields fields={fields} store={curStore} />{children}</>;

  return (
    <EditComponentPrivateWp>
      <FormContext.Provider value={{ row, col, labelWidth }}>
        <Form {...args} ref={ref} onSubmitCapture={autoSubmit}>
          {judgeIsEmpty(row) ? el : <Row gutter={16} {...(row === true ? {} : row)}>{el}</Row>}
        </Form>
      </FormContext.Provider>
    </EditComponentPrivateWp>
  );
});

export const StoreForm = observer(props => <StoreFormC {...props} />, { forwardRef: true }) as IStoreForm;

export type FormItemProps = AntFormItemProps & Pick<FormLayoutProps, 'col' | 'labelWidth'>;
// eslint-disable-next-line complexity
export const FormItem = observer((props: FormItemProps) => {
  const { required, label, help, validateStatus, extra, col, tooltip, labelWidth, ...args } = props;
  const field = (useField() ?? {}) as Field;
  const curValidateStatus = validateStatus ?? (field.errors?.length > 0 ? 'error' : undefined);
  const curExtra = useAdditionalNode('extra', extra);
  const curHelp = useAdditionalNode('help', help) ?? field.errors?.[0]?.messages?.[0];
  const curLabelText = useAdditionalNode('label', label) ?? field.title;
  const context = useContext(FormContext);
  const curLabelWidth = labelWidth ?? context.labelWidth;

  const curRequired = useMemo(() => ((required ?? field?.required) ? <Text type="danger" style={{ marginRight: 2 }}>*</Text> : null), [required, field?.required]);

  const curTooltip = useMemo(() => {
    if (tooltip) {
      const textProps: TextProps = {
        style: {
          paddingRight: 2,
          paddingLeft: 2,
        },
        type: 'secondary',
      };
      if (typeof tooltip === 'object' && !isValidElement(tooltip)) {
        const { icon, ...rest } = tooltip as any;
        return <Tooltip {...rest} >{icon ? icon : <Text {...textProps}> <QuestionCircleOutlined /></Text>}</Tooltip >;
      }
      return <Tooltip title={tooltip} ><Text {...textProps}><QuestionCircleOutlined /></Text></Tooltip>;
    }
    return null;
  }, [tooltip]);

  const curLabel = useMemo(() => {
    const node = <>{curRequired} {curLabelText}{curTooltip}</>;
    return curLabelWidth ? <div style={{ width: curLabelWidth }}>{node}</div> : node;
  }, [curRequired, curLabelText, curTooltip, curLabelWidth]);

  const fEl = (
    <Form.Item
      {...args}
      // 为了实现高度统一在 label 上实现
      label={curLabel}
      help={curHelp}
      extra={curExtra}
      validateStatus={curValidateStatus}
    />);

  // 或者上下文中的 row
  if (judgeIsEmpty(context.row)) {
    return fEl;
  }
  return <Col {...context.col} {...col} >{fEl}</Col>;
});

const StoreFormFields = observer((props: StoreFormFieldsProps) => {
  const { fields = [] } = props;
  const schema = useFieldSchema();

  if (!(fields?.length > 0)) {
    return null;
  }

  const properties: Record<string, any> = {};

  fields.forEach((field) => {
    if (typeof field === 'string') {
      properties[field] = { $ref: `#/definitions/${field}` };
    } else {
      const { field: f, formItem, ...args } = field;
      properties[f] = { $ref: `#/definitions/${f}`, ...args };
      if (!judgeIsEmpty(formItem)) {
        properties[f]['x-decorator'] = 'FormItem';
        properties[f]['x-decorator-props'] = formItem;
      }
    }
  });

  return <RecursionField schema={{ ...schema, 'x-component': undefined, 'x-decorator': undefined, properties }} />;
});

export interface StoreFormFieldsProps {
  fields?: Array<string | IStoreFormField>
  store?: IStore
}

export interface IStoreFormField {
  field: string,
  'formItem'?: FormItemProps
  [key: string]: any
}
export type StoreFormRef = GetRef<typeof Form> & { dispatchSubmit: () => void }

export type StoreFormProps = Omit<FormProps, 'fields'>
  & StoreFormFieldsProps
  & {
    children?: ReactNode,
    beforeSubmit?: (store: IStore, form?: FormCore) => boolean | string | Promise<boolean | string>
    // 强制更新 url
    forceUpdateUrl?: boolean
  }
  & FormLayoutProps;

export type IStoreForm = FC<React.PropsWithChildren<StoreFormProps> & React.RefAttributes<StoreFormRef>>

export interface FormLayoutProps {
  row?: Omit<RowProps, 'children'> | true
  col?: Omit<ColProps, 'children'>
  labelWidth?: number
}
