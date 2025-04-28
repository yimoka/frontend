

import { IEntityConfig } from '@yimoka/store';

import { getCreateTimeField, getUpdateTimeField } from '@/fields/date';
import { IDField } from '@/fields/id';
import { getNameField } from '@/fields/name';
import { getRemarkField } from '@/fields/remark';

export const privateRoleConfig: IEntityConfig = {
  name: '角色',
  basePath: '/system/access/role',
  breadcrumb: [
    { label: '首页', path: '/' },
    { label: '系统管理', path: '/system' },
    { label: '权限管理', path: '/system/access' },
  ],
  options: {},
  defaultFormValues: { name: '', showName: '', remark: '' },
  defaultQueryValues: { page: 1, pageSize: 20, sortOrder: [], id: undefined, name: undefined, showName: undefined, createTime: undefined, updateTime: undefined, remark: undefined, creatorByStaff: undefined, updaterByStaff: undefined, idNot: undefined, idIn: [], idNotIn: [], nameLike: undefined, showNameLike: undefined, createTimeGte: undefined, createTimeLte: undefined, updateTimeGte: undefined, updateTimeLte: undefined, remarkLike: undefined, creatorByStaffNot: undefined, creatorByStaffIn: [], creatorByStaffNotIn: [], updaterByStaffNot: undefined, updaterByStaffIn: [], updaterByStaffNotIn: [] },
  fieldsConfig: {
    id: IDField,
    name: getNameField({ required: true }),
    nameLike: getNameField(),
    showName: getNameField({ required: true, title: '显示名称' }),
    showNameLike: getNameField({ title: '显示名称' }),
    createTime: getCreateTimeField(),
    updateTime: getUpdateTimeField(),
    remark: getRemarkField(),
    remarkLike: getRemarkField({ 'x-component': 'Input' }),
  },
  api: {
    add: { url: '/base/iam/portal/privateRole/add', method: 'POST' },
    batchAdd: { url: '/base/iam/portal/privateRole/batchAdd', method: 'POST' },
    edit: { url: '/base/iam/portal/privateRole/edit', method: 'POST' },
    batchEdit: { url: '/base/iam/portal/privateRole/batchEdit', method: 'POST' },
    detail: { url: '/base/iam/portal/privateRole/detail' },
    multi: { url: '/base/iam/portal/privateRole/multi' },
    del: { url: '/base/iam/portal/privateRole/del', method: 'POST' },
    delOne: { url: '/base/iam/portal/privateRole/delOne', method: 'POST' },
    queryOne: { url: '/base/iam/portal/privateRole/queryOne', method: 'POST' },
    query: { url: '/base/iam/portal/privateRole/query', method: 'POST' },
    list: { url: '/base/iam/portal/privateRole/list', method: 'POST' },
    count: { url: '/base/iam/portal/privateRole/count', method: 'POST' },
    all: { url: '/base/iam/portal/privateRole/all', method: 'GET' },

    getPermissions: { url: '/base/iam/portal/role/permission' },
    updatePermissions: { url: '/base/iam/portal/role/permission/update', method: 'POST' },

    getStaffs: { url: '/base/iam/portal/role/staff' },
    delStaffs: { url: '/base/iam/portal/role/staff/del', method: 'POST' },
    addStaffs: { url: '/base/iam/portal/role/staff/add', method: 'POST' },
    // 角色树 包含系统角色和私有角色
    tenantRoleTree: { url: '/base/iam/portal/role/mergedTree' },
  },
};


// export const privateRoleDictConfig: IDictConfigItem<Record<string, any>> = {
//   field: 'privateRoleIDs',
//   isApiOptionsToMap: true,
//   toMapKeys: { value: 'id', label: 'name' },
//   api: privateRoleConfig.api.all,
// };

// export const privateRoleIDField: IFieldConfig = {
//   title: '私有角色',
//   type: 'string',
//   'x-decorator': 'FormItem',
//   'x-component': 'Select',
//   'x-component-props': {
//     apiType: 'search',
//     searchConfig: { request: { label: 'nameLike' } },
//     labelAPI: true,
//     api: privateRoleConfig.api.query,
//     // api: privateRoleConfig.api.all,
//     showSearch: true,
//     keys: { value: 'id', label: 'name' },
//     optionFilterProp: 'label',
//     placeholder: '请输入私有角色名称搜索',
//   },
//   column: {
//     width: 130,
//     schema: {
//       'x-component': 'Link',
//       'x-component-props': {
//         to: `{{"${privateRoleConfig.basePath}/detail?id=" + encodeURIComponent($record.privateRoleID) }}`,
//       },
//     },
//   },
// };

// export const getPrivateRoleIDField = (config: IFieldConfig = {}) => merge({}, privateRoleIDField, config);

// export const getPrivateRoleIDsField = (config: IFieldConfig = {}) => merge(
//   {},
//   privateRoleIDField,
//   {
//     type: 'array',
//     'x-component-props': { mode: 'multiple' },
//     column: {
//       schema: {
//         'x-component': 'KeyToVal',
//         'x-component-props': {
//           options: '{{curStore.dict.privateRoleIDs}}',
//         },
//       },
//     },
//     desc: {
//       schema: {
//         type: 'array',
//         'x-component': 'KeyToVal',
//         'x-component-props': {
//           options: '{{curStore.dict.privateRoleIDs}}',
//         },
//       },
//     },
//   },
//   config,
// );

