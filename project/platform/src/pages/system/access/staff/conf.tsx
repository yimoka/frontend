
import { mergeWithArrayOverride } from '@yimoka/shared';
import { IEntityConfig, IFieldConfig } from '@yimoka/store';

import { getAvatarField } from '@/fields/avatar';
import { getBoolField } from '@/fields/bool';
import { getCreateTimeField, getUpdateTimeField } from '@/fields/date';
import { getIDField } from '@/fields/id';
import { getMailField } from '@/fields/mail';
import { getNameField, getRealNameField } from '@/fields/name';
import { getPasswordField } from '@/fields/password';
import { getPhoneField, getPhonePrefixField } from '@/fields/phone';

export const staffConfig: IEntityConfig = {
  name: '人员',
  basePath: '/system/access/staff',
  breadcrumb: [
    { label: '首页', path: '/' },
    { label: '系统管理', path: '/system' },
    { label: '权限管理', path: '/system/access' },
  ],
  options: {},
  defaultFormValues: { name: '', realName: '', avatar: '', isChangePassword: false, phonePrefix: '86', phone: '', mail: '', password: '', switch: true },
  defaultQueryValues: { page: 1, pageSize: 20, sortOrder: [], id: undefined, name: undefined, realName: undefined, avatar: undefined, isChangePassword: undefined, createTime: undefined, updateTime: undefined, phonePrefix: undefined, phone: undefined, mail: undefined, switch: undefined, creatorByStaff: undefined, updaterByStaff: undefined, idNot: undefined, idIn: [], idNotIn: [], nameLike: undefined, nameNotLike: undefined, createTimeGte: undefined, createTimeLte: undefined, updateTimeGte: undefined, updateTimeLte: undefined, phonePrefixNot: undefined, phonePrefixIn: [], phonePrefixNotIn: [], phoneNot: undefined, phoneIn: [], phoneNotIn: [], mailNot: undefined, mailIn: [], mailNotIn: [], creatorByStaffNot: undefined, creatorByStaffIn: [], creatorByStaffNotIn: [], updaterByStaffNot: undefined, updaterByStaffIn: [], updaterByStaffNotIn: [] },

  fieldsConfig: {
    id: getIDField(),
    name: getNameField({ required: true, 'x-column': { width: 130 } }),
    nameLike: getNameField(),
    realName: getRealNameField(),
    avatar: getAvatarField(),
    isChangePassword: getBoolField({ title: '修改密码', 'x-column': { width: 100 } }),
    createTime: getCreateTimeField(),
    updateTime: getUpdateTimeField(),
    phonePrefix: getPhonePrefixField(),
    phone: getPhoneField(),
    mail: getMailField(),
    switch: getBoolField({ title: '开关' }),
    password: getPasswordField(),
  },
  api: {
    list: { url: '/base/iam/portal/staff/list', method: 'POST' },
    add: { url: '/base/iam/portal/staff/add', method: 'POST' },
    batchAdd: { url: '/base/iam/portal/staff/batchAdd', method: 'POST' },
    edit: { url: '/base/iam/portal/staff/edit', method: 'POST' },
    delOne: { url: '/base/iam/portal/staff/delOne', method: 'POST' },
    enableOne: { url: '/base/iam/portal/staff/enableOne', method: 'POST' },
    disableOne: { url: '/base/iam/portal/staff/disableOne', method: 'POST' },
    detail: { url: '/base/iam/portal/staff/detail' },
    query: { url: '/base/iam/portal/staff/query', method: 'POST' },
    queryOne: { url: '/base/iam/portal/staff/queryOne' },
    getRoles: { url: '/base/iam/portal/staff/role' },
    updateRoles: { url: '/base/iam/portal/staff/role/update', method: 'POST' },
    getPermissions: { url: '/base/iam/portal/staff/permission' },
  },
};


export const staffField: IFieldConfig = {
  title: '员工',
  'x-decorator': 'FormItem',
  'x-component': 'SearchSelect',
  'x-component-props': {
    placeholder: '请输入搜索员工',
    api: staffConfig.api?.query,
    toOptionsConf: { keys: { value: 'id', label: 'name' } },
    searchConfig: { request: { label: 'nameLike' } },
  },
};

export const staffsField: IFieldConfig = mergeWithArrayOverride({}, staffField, {
  type: 'array',
  'x-component-props': {
    mode: 'multiple',
  },
});

export const getHasPermissionsTree = (permissionsTree?: ITreeItem[], paths?: string[]) => {
  const permissionsMap = new Map<string, boolean>();
  paths?.forEach?.((item: string) => permissionsMap.set(item, true));
  const getHasTree = (tree?: ITreeItem[]): ITreeItem[] => {
    const newTree = tree?.map((item) => {
      const { path, children } = item;
      const newChildren: ITreeItem[] = getHasTree(children);
      if (permissionsMap.get(path) || newChildren?.length > 0) {
        return { ...item, children: newChildren };
      };
      return null;
    });
    return newTree?.filter(item => item !== null) as ITreeItem[];
  };
  return getHasTree(permissionsTree);
};

export type ITreeItem = {
  key: string;
  id: string
  updateTime: string
  createTime: string
  parentID: string
  name: string
  path: string
  icon: string
  sort: number
  desc: string
  isMenu: string
  isPage: string
  isAPI: string
  children: ITreeItem[];
};
