import { QRCode as AntQRCode, GetProps } from 'antd';

export const QRCode = AntQRCode;

export type QRCodeProps = GetProps<typeof AntQRCode>
