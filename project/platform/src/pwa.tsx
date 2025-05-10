import { Modal } from '@yimoka/antd';
import React, { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

// 进入页面的时间
const enterDate = new Date().getTime();
// 更新时间间隔 1 小时
const updateInterval = 60 * 60 * 1000;
// 更新时间
let updateDate = new Date().getTime();
// 是否检查更新，当用户忽略更新后不再检查
let isCheckUpdate = true;

let worker: ServiceWorkerRegistration | undefined;

const handleUpdate = () => {
  if (worker?.waiting) {
    worker?.waiting?.postMessage({ type: 'SKIP_WAITING' });
    setTimeout(() => {
      globalThis.location.reload();
    }, 100);
    return true;
  }
  return false;
};

// 检查更新;
const checkUpdate = () => {
  if (worker) {
    const now = new Date().getTime();
    if (isCheckUpdate && now - updateDate > updateInterval) {
      updateDate = now;
      worker?.update?.();
    }
  }
};

setInterval(() => {
  checkUpdate();
}, updateInterval);

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    checkUpdate();
  }
});

export const Pwa = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    registerSW({
      onNeedRefresh() {
        // 如果跟用户进入页面时间间隔小于 2 秒，刚打开页面，不提示直接更新
        if (new Date().getTime() - enterDate < 2000) {
          let num = 0;
          // onNeedRefresh 是 registration 可能为空，所以需要轮询等待 registration 注册成功
          const id = setInterval(() => {
            num += 1;
            if (handleUpdate() || num > 100) {
              clearInterval(id);
            }
          }, 100);
          return;
        }
        isCheckUpdate = false;
        setOpen(true);
      },

      onRegistered: (registration) => {
        if (registration) {
          worker = registration;
        }
      },

      onRegisteredSW: (_swUrl, registration) => {
        if (registration) {
          worker = registration;
        }
      },

      onRegisterError: (error) => {
        console.error('Error during service worker registration:', error);
      },
    });
  }, []);

  if (open) {
    return (
      <Modal
        destroyOnHidden
        cancelText="下一次"
        maskClosable={false}
        okText="马上更新"
        open={open}
        title="更新"
        trigger={false}
        zIndex={9999}
        onCancel={() => {
          isCheckUpdate = true;
          // 更新时间
          updateDate = new Date().getTime();
          setOpen(false);
        }}
        onOk={() => handleUpdate()}
      >
        <p>发现新版本，是否刷新页面更新？如不更新, 下次打开将自动更新。</p>
      </Modal>
    );
  }
  return null;
};
