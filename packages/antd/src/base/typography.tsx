import { withChildrenFallback } from '@yimoka/react';
import { Typography as AntTypography } from 'antd';

const TypographyFn = withChildrenFallback(AntTypography);

const { Text: AntText, Title: AntTitle, Paragraph: AntParagraph } = AntTypography;

export const Text = withChildrenFallback(AntText);
export const Title = withChildrenFallback(AntTitle);
export const Paragraph = withChildrenFallback(AntParagraph);

export const Typography = Object.assign(TypographyFn, {
  Text: withChildrenFallback(AntText),
  Title: withChildrenFallback(AntTitle),
  Paragraph: withChildrenFallback(AntParagraph),
});
