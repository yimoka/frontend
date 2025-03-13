#!/usr/bin/env node

/**
 * iOS应用安装脚本
 * 用于将构建好的iOS应用安装到模拟器上
 */

const {
  colors,
  checkIOSSimulatorRunning,
  startIOSSimulator,
  findIOSAppFile,
  installAppToIOSSimulator
} = require('./utils');

// 主函数
async function main() {
  try {
    console.log(colors.blue('===== iOS应用安装脚本 ====='));

    // 查找.app文件
    const appPath = findIOSAppFile();
    if (!appPath) {
      throw new Error('无法找到.app文件，请先构建应用');
    }

    // 检查模拟器是否运行
    if (!checkIOSSimulatorRunning()) {
      console.log(colors.yellow('iOS模拟器未运行，尝试启动...'));
      if (!startIOSSimulator()) {
        throw new Error('无法启动iOS模拟器');
      }
    }

    // 安装应用到模拟器
    if (installAppToIOSSimulator(appPath)) {
      console.log('\n');
      console.log(colors.green('✅ iOS应用安装成功!'));
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