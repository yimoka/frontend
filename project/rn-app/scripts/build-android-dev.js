#!/usr/bin/env node

/**
 * Android开发版构建脚本
 * 用于构建Android开发版应用并可选择安装到设备
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// 导入工具库
const {
  colors,
  rootDir,
  androidBuildDir,
  getAppPackageName,
  findAndroidSdkPath,
  checkAndroidDeviceConnected,
  startAndroidEmulator,
  installAppToAndroid,
  cleanAndroidBuildDir
} = require('./utils');

// 主函数
try {
  console.log(colors.blue('===== Android开发版构建脚本 ====='));

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

  // 清理旧的构建文件
  cleanAndroidBuildDir();

  // 构建开发版APK
  console.log(colors.blue('开始构建Android开发版APK...'));
  execSync('eas build --platform android --profile development --local --non-interactive', {
    stdio: 'inherit',
    cwd: rootDir
  });

  // 查找构建的APK文件
  console.log(colors.blue('查找构建的APK文件...'));
  // 文件在根目录   build-****.apk
  const apkFiles = fs.readdirSync(rootDir)
    .filter(file => file.startsWith('build-') && file.endsWith('.apk'));

  if (apkFiles.length === 0) {
    throw new Error('未找到构建生成的APK文件，构建可能失败');
  }

  const apkPath = path.join(rootDir, apkFiles[0]);

  if (!fs.existsSync(apkPath)) {
    throw new Error(`未找到构建的APK文件: ${apkPath}`);
  }

  // 复制APK到build目录
  console.log(colors.blue(`复制APK到${androidBuildDir}目录...`));
  const buildApkPath = path.join(androidBuildDir, `${appPackageName}-dev.apk`);
  fs.copyFileSync(apkPath, buildApkPath);
  console.log(colors.green(`APK已复制到: ${buildApkPath}`));

  // 询问是否安装到设备
  console.log('\n');
  console.log(colors.blue('是否要安装到Android设备? (y/n)'));

  readline.question('', (answer) => {
    readline.close();
    const shouldInstall = answer.trim().toLowerCase() === 'y';

    if (shouldInstall) {
      // 检查设备是否连接
      if (!checkAndroidDeviceConnected(adbCommand)) {
        console.log(colors.yellow('未检测到Android设备，尝试启动模拟器...'));
        if (!startAndroidEmulator(adbCommand, emulatorCommand, androidSdkPath)) {
          console.log(colors.red('无法启动Android模拟器，跳过安装步骤'));
          showFinalMessage(buildApkPath);
          return;
        }
      }

      // 安装APK
      installAppToAndroid(buildApkPath, adbCommand, appPackageName);
    }

    showFinalMessage(buildApkPath);
  });

} catch (error) {
  console.error(colors.red('构建过程中出错:'), error.message);
  process.exit(1);
}

// 显示最终信息
function showFinalMessage(apkPath) {
  console.log('\n');
  console.log(colors.green('✅ Android开发客户端构建成功!'));
  console.log('\n');
  console.log(colors.blue('构建文件位置:'));
  console.log(colors.yellow(`  ${apkPath}`));
  console.log('\n');
  console.log(colors.blue('现在您可以:'));
  console.log(colors.blue('1. 启动开发服务器:'));
  console.log(colors.yellow('   npm start'));
  console.log(colors.blue('2. 手动安装APK (如果尚未安装):'));
  console.log(colors.yellow(`   adb install -r "${apkPath}"`));
} 