

import { IAnyObject } from '@yimoka/shared';

import { httpGet, httpPost } from '@/http';
import { getUserToken } from '@/token';

export const getSassHeaders = () => ({ 'x-md-global-tenantID': '1000', Authorization: getUserToken() });

export const getImageCaptcha = () => httpGet('/admin/user-tenant/bff/captcha/image', { headers: getSassHeaders() });

export const getMailCaptcha = (values: IAnyObject) => httpPost('/admin/user-tenant/bff/captcha/mail', values, { headers: getSassHeaders() });

export const loginMail = (values: { mail: string, code: string }) => httpPost('/admin/user-tenant/bff/login/mail', values, { headers: getSassHeaders() });

export const getUserInfo = () => httpGet('/admin/user-tenant/bff/my/info', { headers: getSassHeaders() });

export const getTenantStaffs = () => httpGet('/admin/tenant/bff/staff/userBind', { headers: getSassHeaders() });

export const LoginByUser = (values: { staffID: string, tenantID: string }) => httpPost('/admin/tenant/bff/loginByUser', values, { headers: getSassHeaders() });


// export const addTenantJoin = (values: any) => httpPost('/admin/tenant/bff/tenant/join/add', values, { headers: getSassHeaders() });
// export const editTenantJoin = (values: any) => httpPost('/admin/tenant/bff/tenant/join/edit', values, { headers: getSassHeaders() });
// export const detailTenantJoin = (values: any) => httpPost('/admin/tenant/bff/tenant/join/detail', values, { headers: getSassHeaders() });
// export const delOneTenantJoin = (values: any) => httpPost('/admin/tenant/bff/tenant/join/delOne', values, { headers: getSassHeaders() });
// export const listTenantJoin = (values: any) => httpPost('/admin/tenant/bff/tenant/join/list', values, { headers: getSassHeaders() });
