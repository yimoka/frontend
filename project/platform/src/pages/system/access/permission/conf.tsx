
import { IAnyObject } from '@yimoka/shared';
import { IEntityConfig } from '@yimoka/store';

import { getBoolField } from '@/fields/bool';
import { getRemarkField } from '@/fields/remark';

export const permissionConfig: IEntityConfig = {
  name: '权限',
  basePath: '/system/access/permission',
  breadcrumb: [
    { label: '首页', path: '/' },
    { label: '系统管理', path: '/system' },
    { label: '权限管理', path: '/system/access' },
  ],
  options: {},
  defaultValues: { parentID: '', name: '', path: '', remark: '', sort: 0, icon: '', isMenu: true, isPage: true, isAPI: false },
  fieldsConfig: {
    // id: IDField,
    // updateTime: getDateField({ title: '更新时间' }),
    // createTime: getDateField({ title: '创建时间' }),
    parentID: {
      title: '父级',
      'x-decorator': 'FormItem',
      'x-component': 'TreeSelect',
      'x-component-props': {
        showSearch: true,
        allowClear: true,
        treeDefaultExpandAll: true,
        treeData: '{{$store.dict.parentID}}',
        fieldNames: { label: 'name', value: 'id' },
        filterTreeNode: (val: string, node: IAnyObject) => {
          const { name } = node;
          return name?.toLowerCase()?.indexOf(val?.toLowerCase()) > -1;
        },
      },
    },
    name: {
      title: '名称',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    path: {
      title: '路径',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    icon: {
      title: '图标',
      'x-decorator': 'FormItem',
      'x-component': 'SelectIcon',
    },
    sort: {
      title: '排序',
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber',
    },
    remark: getRemarkField(),
    isMenu: getBoolField({ title: '是否菜单' }),
    isPage: getBoolField({ title: '是否页面' }),
    isAPI: getBoolField({ title: '是否接口' }),
  },
  api: {
    add: { url: '/base/iam/manage/permission/add', method: 'POST' },
    batchAdd: { url: '/base/iam/manage/permission/batchAdd', method: 'POST' },
    delOne: {
      url: '/base/iam/manage/permission/delOne',
      method: 'POST',
    },
    del: {
      url: '/base/iam/manage/permission/del',
      method: 'POST',
    },
    edit: {
      url: '/base/iam/manage/permission/edit',
      method: 'POST',
    },
    detail: {
      url: '/base/iam/manage/permission/detail',
    },
    queryOne: {
      url: '/base/iam/manage/permission/queryOne',
      method: 'POST',
    },
    query: {
      url: '/base/iam/manage/permission/query',
      method: 'POST',
    },
    list: {
      url: '/base/iam/manage/permission/list',
      method: 'POST',
    },
    all: {
      url: '/base/iam/manage/permission/all',
      method: 'GET',
    },
    count: {
      url: '/base/iam/manage/permission/count',
      method: 'POST',
    },

    tree: {
      url: '/base/iam/manage/permission/tree',
    },
  },
};

