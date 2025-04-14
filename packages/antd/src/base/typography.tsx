import { Typography as AntTypography, TypographyProps } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import { TitleProps } from 'antd/es/typography/Title';

export const Typography = AntTypography;

// eslint-disable-next-line react-refresh/only-export-components
export const { Text, Title, Paragraph } = Typography;

export type { TypographyProps, TextProps, TitleProps };
