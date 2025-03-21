#!/usr/bin/env node

/**
 * Android应用安装脚本
 * 用于将构建好的Android应用安装到设备或模拟器上
 */

const {
  colors,
  getAppPackageName,
  findAndroidSdkPath,
  checkAndroidDeviceConnected,
  startAndroidEmulator,
  findAndroidApkFile,
  installAppToAndroid
} = require('./utils');
const path = require('path');

// 主函数
async function main() {
  try {
    console.log(colors.blue('===== Android应用安装脚本 ====='));

    // 获取应用包名
    const appPackageName = getAppPackageName();
    console.log(colors.blue(`应用包名: ${appPackageName}`));

    // 查找Android SDK路径
    const androidSdkPath = findAndroidSdkPath();
    if (!androidSdkPath) {
      throw new Error('无法找到Android SDK路径，请确保已设置ANDROID_HOME或ANDROID_SDK_ROOT环境变量');
    }
    console.log(colors.blue(`Android SDK路径: ${androidSdkPath}`));

    // 设置adb和模拟器命令路径
    const adbCommand = path.join(androidSdkPath, 'platform-tools/adb');
    const emulatorCommand = path.join(androidSdkPath, 'emulator/emulator');

    // 查找APK文件
    const apkPath = findAndroidApkFile();
    if (!apkPath) {
      throw new Error('无法找到APK文件，请先构建应用');
    }

    // 检查设备是否连接
    if (!checkAndroidDeviceConnected(adbCommand)) {
      console.log(colors.yellow('未检测到Android设备，尝试启动模拟器...'));
      if (!startAndroidEmulator(adbCommand, emulatorCommand, androidSdkPath)) {
        throw new Error('无法启动Android模拟器');
      }
    }

    // 安装APK
    if (installAppToAndroid(apkPath, adbCommand, appPackageName)) {
      console.log('\n');
      console.log(colors.green('✅ Android应用安装并启动成功!'));
      console.log('\n');
      console.log(colors.blue('现在您可以启动开发服务器:'));
      console.log(colors.yellow('  npm start'));
    }

  } catch (error) {
    console.error(colors.red('安装过程中出错:'), error.message);
    process.exit(1);
  }
}

// 执行主函数
main(); 