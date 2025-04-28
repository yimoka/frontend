let IDX = 36;
let HEX = '';
while (IDX > 0) {
  IDX = IDX - 1;
  HEX += IDX.toString(36);
}

export function uid(len?: number): string {
  let str = '';
  let num = len || 11;
  while (num > 0) {
    num = num - 1;
    str += HEX[(Math.random() * 36) | 0];
  }
  return str;
}
