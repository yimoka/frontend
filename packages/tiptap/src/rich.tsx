import React from 'react';

export const RichEditor = (props: RichEditorProps) => {
  const { value } = props;
  console.log(value);
  return <div>RichEditor</div>;
};


export type RichEditorProps = {
  value: string;
}
