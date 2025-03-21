#!/usr/bin/env node

/**
 * 脚本工具库
 * 
 * 此文件包含所有脚本共享的工具函数和常量
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const os = require('os');

// 定义简单的颜色函数
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`
};

// 项目根目录
const rootDir = path.resolve(process.cwd());
// 构建输出目录
const buildDir = path.join(rootDir, 'build');
const androidBuildDir = path.join(buildDir, 'android');
const iosBuildDir = path.join(buildDir, 'ios');

// 从app.json获取应用包名
function getAppPackageName() {
  try {
    const appJsonPath = path.join(rootDir, 'app.json');
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    const packageName = appJson.expo?.android?.package;

    if (!packageName) {
      console.log(colors.yellow('未在app.json中找到Android包名，使用默认包名'));
      return 'com.ickeep.rnapp'; // 默认包名
    }

    console.log(colors.blue(`从app.json获取到应用包名: ${packageName}`));
    return packageName;
  } catch (_error) {
    console.log(colors.yellow(`读取app.json失败: ${_error.message}，使用默认包名`));
    return 'com.ickeep.rnapp'; // 默认包名
  }
}

// 尝试查找Android SDK路径
function findAndroidSdkPath() {
  try {
    // 常见的Android SDK路径
    const possiblePaths = [
      process.env.ANDROID_HOME,
      process.env.ANDROID_SDK_ROOT,
      path.join(os.homedir(), 'Library/Android/sdk'), // macOS
      path.join(os.homedir(), 'AppData/Local/Android/sdk'), // Windows
      path.join(os.homedir(), 'Android/Sdk'), // Linux
      '/usr/local/lib/android/sdk', // 某些Linux发行版
      '/opt/android-sdk', // 某些Linux发行版
    ].filter(Boolean); // 过滤掉undefined和null

    for (const sdkPath of possiblePaths) {
      if (fs.existsSync(sdkPath)) {
        console.log(colors.blue(`找到Android SDK路径: ${sdkPath}`));
        return sdkPath;
      }
    }

    // 尝试从命令行获取
    try {
      const sdkmanagerPath = execSync('which sdkmanager', { encoding: 'utf8' }).trim();
      if (sdkmanagerPath) {
        // sdkmanager通常在SDK/cmdline-tools/latest/bin目录下
        const sdkPath = path.resolve(sdkmanagerPath, '../../../..');
        if (fs.existsSync(sdkPath)) {
          console.log(colors.blue(`通过sdkmanager找到Android SDK路径: ${sdkPath}`));
          return sdkPath;
        }
      }
    } catch (_error) {
      // 忽略错误，继续尝试其他方法
    }

    console.log(colors.yellow('未找到Android SDK路径，将使用默认命令'));
    return null;
  } catch (_error) {
    console.log(colors.yellow(`查找Android SDK路径时出错: ${_error.message}`));
    return null;
  }
}

// 构建命令路径
function buildCommand(androidSdkPath, command, subdir = '') {
  if (!androidSdkPath) return command;

  const fullPath = path.join(androidSdkPath, subdir, command);
  return fs.existsSync(fullPath) ? fullPath :
    fs.existsSync(`${fullPath}.exe`) ? `${fullPath}.exe` : command;
}

// 检查Android设备是否连接
function checkAndroidDeviceConnected(adbCommand) {
  try {
    const output = execSync(`"${adbCommand}" devices`, { encoding: 'utf8' });
    // 检查输出中是否有设备连接（排除第一行的"List of devices attached"）
    const lines = output.trim().split('\n');
    if (lines.length <= 1) {
      return false;
    }

    // 检查是否有设备
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.endsWith('offline')) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(colors.red(`检查设备状态失败: ${error.message}`));
    return false;
  }
}

// 启动Android模拟器
function startAndroidEmulator(adbCommand, emulatorCommand, androidSdkPath) {
  console.log(colors.blue('启动Android模拟器...'));
  try {
    // 获取可用的模拟器列表
    const emulatorsOutput = execSync(`"${emulatorCommand}" -list-avds`, { encoding: 'utf8' });
    const emulators = emulatorsOutput.trim().split('\n').filter(Boolean);

    if (emulators.length === 0) {
      console.error(colors.red('未找到Android模拟器，请先创建一个模拟器'));
      console.log(colors.yellow('您可以使用Android Studio创建一个模拟器，或者运行以下命令:'));
      console.log(colors.blue(`  "${path.join(androidSdkPath, 'tools/bin/avdmanager')}" create avd -n test -k "system-images;android-30;google_apis;x86_64"`));
      return false;
    }

    // 使用第一个可用的模拟器
    const emulatorName = emulators[0];
    console.log(colors.blue(`启动模拟器: ${emulatorName}`));

    // 在后台启动模拟器 - 使用spawn而不是exec，并分离进程
    const emulatorCmd = emulatorCommand.replace(/"/g, ''); // 移除可能存在的引号
    const emulatorProcess = spawn(emulatorCmd, [
      '-avd', emulatorName,
      '-no-boot-anim',
      '-no-audio',
      '-no-snapshot-save'
    ], {
      detached: true,
      stdio: 'ignore',
      shell: process.platform === 'win32' // 在Windows上使用shell
    });

    // 分离子进程，让它在后台运行
    emulatorProcess.unref();

    // 等待模拟器启动
    console.log(colors.blue('等待模拟器启动...'));
    let attempts = 0;
    const maxAttempts = 30; // 最多等待30次，每次5秒

    while (attempts < maxAttempts) {
      console.log(colors.blue(`等待模拟器启动中... (${attempts + 1}/${maxAttempts})`));
      execSync('sleep 5');

      if (checkAndroidDeviceConnected(adbCommand)) {
        console.log(colors.green('模拟器已启动'));
        // 等待系统完全启动
        console.log(colors.blue('等待系统启动完成...'));
        execSync('sleep 10');
        return true;
      }

      attempts++;
    }

    console.error(colors.red('模拟器启动超时'));
    return false;
  } catch (error) {
    console.error(colors.red('启动模拟器失败:'), error.message);

    // 提供更详细的错误信息和解决方案
    console.log(colors.yellow('\n可能的解决方案:'));
    console.log(colors.blue('1. 确保已安装Android SDK和模拟器'));
    console.log(colors.blue('2. 设置ANDROID_HOME或ANDROID_SDK_ROOT环境变量指向您的Android SDK路径'));
    console.log(colors.blue('3. 使用Android Studio创建和管理模拟器'));
    console.log(colors.blue('4. 手动启动模拟器，然后重新运行此脚本'));

    if (androidSdkPath) {
      console.log(colors.yellow('\n当前检测到的Android SDK路径:'));
      console.log(colors.blue(`  ${androidSdkPath}`));
      console.log(colors.yellow('模拟器命令路径:'));
      console.log(colors.blue(`  ${emulatorCommand}`));
    }

    return false;
  }
}

// 检查iOS模拟器是否运行
function checkIOSSimulatorRunning() {
  try {
    const output = execSync('xcrun simctl list devices | grep Booted', { encoding: 'utf8' });
    return output.trim().length > 0;
  } catch (_error) {
    return false;
  }
}

// 获取当前运行的iOS模拟器设备ID
function getRunningIOSSimulatorDeviceId() {
  try {
    const output = execSync('xcrun simctl list devices | grep Booted', { encoding: 'utf8' });
    const match = output.match(/\(([^)]+)\)/);
    return match ? match[1] : null;
  } catch (_error) {
    return null;
  }
}

// 启动iOS模拟器
function startIOSSimulator() {
  console.log(colors.blue('启动iOS模拟器...'));
  try {
    // 首先尝试获取可用的模拟器设备
    const devicesOutput = execSync('xcrun simctl list devices available', { encoding: 'utf8' });

    // 尝试找到一个iPhone设备（优先选择iPhone 15）
    let deviceId = null;
    const iphone15Match = devicesOutput.match(/iPhone 15[^(]*\(([^)]+)\)/);
    const iphoneMatch = devicesOutput.match(/iPhone[^(]*\(([^)]+)\)/);

    if (iphone15Match && iphone15Match[1]) {
      deviceId = iphone15Match[1];
      console.log(colors.blue(`找到iPhone 15设备: ${deviceId}`));
    } else if (iphoneMatch && iphoneMatch[1]) {
      deviceId = iphoneMatch[1];
      console.log(colors.blue(`找到iPhone设备: ${deviceId}`));
    }

    if (deviceId) {
      // 使用设备ID启动模拟器
      console.log(colors.blue(`启动设备ID: ${deviceId}`));
      execSync(`xcrun simctl boot ${deviceId}`, { stdio: 'inherit' });

      // 打开模拟器应用
      execSync('open -a Simulator', { stdio: 'inherit' });

      // 等待模拟器启动
      console.log(colors.blue('等待模拟器启动...'));
      execSync('sleep 10');
      return true;
    } else {
      // 如果没有找到特定设备，尝试直接打开模拟器
      console.log(colors.yellow('未找到特定设备，尝试直接打开模拟器...'));
      execSync('open -a Simulator', { stdio: 'inherit' });
      execSync('sleep 10');

      // 再次检查是否有设备启动
      if (checkIOSSimulatorRunning()) {
        return true;
      } else {
        console.error(colors.red('无法自动启动模拟器设备'));
        return false;
      }
    }
  } catch (error) {
    console.error(colors.red('启动模拟器失败:'), error.message);
    return false;
  }
}

// 安装应用到Android设备
function installAppToAndroid(apkPath, adbCommand, appPackageName) {
  try {
    console.log(colors.blue('安装APK到设备...'));
    execSync(`"${adbCommand}" install -r "${apkPath}"`, {
      stdio: 'inherit'
    });
    console.log(colors.green('APK安装成功!'));

    // 启动应用
    console.log(colors.blue('启动应用...'));
    execSync(`"${adbCommand}" shell monkey -p ${appPackageName} -c android.intent.category.LAUNCHER 1`, {
      stdio: 'inherit'
    });

    return true;
  } catch (error) {
    console.error(colors.red('安装APK失败:'), error.message);
    console.log(colors.yellow('您可以稍后手动安装APK文件'));
    return false;
  }
}

// 安装应用到iOS模拟器
function installAppToIOSSimulator(appPath) {
  try {
    console.log(colors.blue('安装应用到iOS模拟器...'));

    // 获取当前运行的设备ID
    const deviceId = getRunningIOSSimulatorDeviceId();

    if (deviceId) {
      console.log(colors.blue(`使用设备ID安装: ${deviceId}`));
      execSync(`xcrun simctl install ${deviceId} "${appPath}"`, {
        stdio: 'inherit'
      });
    } else {
      console.log(colors.blue('使用booted参数安装到当前运行的模拟器'));
      execSync(`xcrun simctl install booted "${appPath}"`, {
        stdio: 'inherit'
      });
    }

    console.log(colors.green('应用安装成功!'));
    return true;
  } catch (error) {
    console.error(colors.red('安装应用失败:'), error.message);
    return false;
  }
}

// 查找Android构建目录中的APK文件
function findAndroidApkFile() {
  try {
    if (!fs.existsSync(androidBuildDir)) {
      throw new Error(`${androidBuildDir} 目录不存在，请先构建应用`);
    }

    const buildFiles = fs.readdirSync(androidBuildDir);

    if (buildFiles.length === 0) {
      throw new Error(`${androidBuildDir} 目录为空，请先构建应用`);
    }

    console.log(colors.blue(`build/android目录内容: ${buildFiles.join(', ')}`));

    // 查找APK文件
    const apkFiles = buildFiles.filter(file => file.endsWith('.apk'));

    if (apkFiles.length === 0) {
      throw new Error(`未找到APK文件，请先构建应用`);
    }

    // 使用最新的APK文件
    const latestApkFile = apkFiles.sort((a, b) => {
      return fs.statSync(path.join(androidBuildDir, b)).mtime.getTime() -
        fs.statSync(path.join(androidBuildDir, a)).mtime.getTime();
    })[0];

    console.log(colors.green(`找到APK文件: ${latestApkFile}`));
    return path.join(androidBuildDir, latestApkFile);
  } catch (_error) {
    console.error(colors.red('查找APK文件失败:'), _error.message);
    return null;
  }
}

// 查找iOS构建目录中的.app文件
function findIOSAppFile() {
  try {
    if (!fs.existsSync(iosBuildDir)) {
      throw new Error(`${iosBuildDir} 目录不存在，请先构建应用`);
    }

    const buildFiles = fs.readdirSync(iosBuildDir);

    if (buildFiles.length === 0) {
      throw new Error(`${iosBuildDir} 目录为空，请先构建应用`);
    }

    // 查找.app文件
    const appFiles = buildFiles.filter(file => file.endsWith('.app'));

    if (appFiles.length === 0) {
      throw new Error(`未找到.app文件，请先构建应用`);
    }

    const appFile = appFiles[0];
    console.log(colors.green(`找到应用文件: ${appFile}`));
    return path.join(iosBuildDir, appFile);
  } catch (_error) {
    console.error(colors.red('查找应用文件失败:'), _error.message);
    return null;
  }
}

// 清理Android构建目录
function cleanAndroidBuildDir() {
  console.log(colors.blue('清理旧的构建文件...'));
  // 删除旧的 APK 和 AAB 文件
  const oldApkFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.apk') || file.endsWith('.aab'));

  if (oldApkFiles.length > 0) {
    console.log(colors.blue(`找到 ${oldApkFiles.length} 个旧的构建文件，正在删除...`));
    oldApkFiles.forEach(file => {
      const filePath = path.join(rootDir, file);
      fs.unlinkSync(filePath);
      console.log(colors.blue(`已删除: ${file}`));
    });
  }

  // 确保build/android目录存在并清空
  if (!fs.existsSync(buildDir)) {
    console.log(colors.blue('创建build目录...'));
    fs.mkdirSync(buildDir, { recursive: true });
  }

  if (!fs.existsSync(androidBuildDir)) {
    console.log(colors.blue('创建build/android目录...'));
    fs.mkdirSync(androidBuildDir, { recursive: true });
  } else {
    console.log(colors.blue('清空build/android目录...'));
    execSync(`rm -rf "${androidBuildDir}/*"`, {
      stdio: 'inherit',
      cwd: rootDir
    });
  }
}

// 清理iOS构建目录
function cleanIOSBuildDir() {
  console.log(colors.blue('清理旧的构建文件...'));
  // 删除旧的 tar.gz 文件
  const oldTarFiles = fs.readdirSync(rootDir)
    .filter(file => file.startsWith('build-') && file.endsWith('.tar.gz'));

  if (oldTarFiles.length > 0) {
    console.log(colors.blue(`找到 ${oldTarFiles.length} 个旧的构建文件，正在删除...`));
    oldTarFiles.forEach(file => {
      const filePath = path.join(rootDir, file);
      fs.unlinkSync(filePath);
      console.log(colors.blue(`已删除: ${file}`));
    });
  }

  // 确保build/ios目录存在并清空
  if (!fs.existsSync(buildDir)) {
    console.log(colors.blue('创建build目录...'));
    fs.mkdirSync(buildDir, { recursive: true });
  }

  if (!fs.existsSync(iosBuildDir)) {
    console.log(colors.blue('创建build/ios目录...'));
    fs.mkdirSync(iosBuildDir, { recursive: true });
  } else {
    console.log(colors.blue('清空build/ios目录...'));
    execSync(`rm -rf "${iosBuildDir}/*"`, {
      stdio: 'inherit',
      cwd: rootDir
    });
  }
}

// 检查EAS CLI是否安装并确保用户已登录
function checkEASCliAndLogin() {
  try {
    execSync('eas --version', { stdio: 'pipe' });
    console.log(colors.blue('EAS CLI 已安装'));
  } catch (_error) {
    console.log(colors.yellow('EAS CLI 未安装或不在PATH中，尝试安装...'));
    execSync('npm install -g eas-cli', { stdio: 'inherit' });
  }

  // 确保用户已登录
  try {
    const whoamiOutput = execSync('eas whoami', { stdio: 'pipe', encoding: 'utf8' });
    console.log(colors.blue(`已登录EAS账号: ${whoamiOutput.trim()}`));
  } catch (_error) {
    console.log(colors.yellow('未登录EAS账号，请先登录...'));
    execSync('eas login', { stdio: 'inherit' });
  }
}

module.exports = {
  colors,
  rootDir,
  buildDir,
  androidBuildDir,
  iosBuildDir,
  getAppPackageName,
  findAndroidSdkPath,
  buildCommand,
  checkAndroidDeviceConnected,
  startAndroidEmulator,
  checkIOSSimulatorRunning,
  getRunningIOSSimulatorDeviceId,
  startIOSSimulator,
  installAppToAndroid,
  installAppToIOSSimulator,
  findAndroidApkFile,
  findIOSAppFile,
  cleanAndroidBuildDir,
  cleanIOSBuildDir,
  checkEASCliAndLogin
}; 