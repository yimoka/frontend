#!/usr/bin/env node

/**
 * iOS开发版构建脚本
 * 用于构建iOS开发版应用并可选择安装到模拟器
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
  iosBuildDir,
  checkIOSSimulatorRunning,
  startIOSSimulator,
  installAppToIOSSimulator,
  cleanIOSBuildDir,
  checkEASCliAndLogin
} = require('./utils');

// 主函数
try {
  console.log(colors.blue('===== iOS开发版构建脚本 ====='));

  // 清理旧的构建文件
  cleanIOSBuildDir();

  // 检查 EAS CLI 是否安装并登录
  checkEASCliAndLogin();

  // 构建开发版应用
  console.log(colors.blue('开始构建iOS开发版应用...'));
  execSync('eas build --platform ios --profile development --local  --non-interactive', {
    stdio: 'inherit',
    cwd: rootDir
  });

  // 查找构建的tar.gz文件
  console.log(colors.blue('查找构建的tar.gz文件...'));
  const tarFiles = fs.readdirSync(rootDir)
    .filter(file => file.startsWith('build-') && file.endsWith('.tar.gz'))
    .sort((a, b) => {
      return fs.statSync(path.join(rootDir, b)).mtime.getTime() -
        fs.statSync(path.join(rootDir, a)).mtime.getTime();
    });

  if (tarFiles.length === 0) {
    throw new Error('未找到构建生成的tar.gz文件，构建可能失败');
  }

  const latestTarFile = tarFiles[0];
  const tarFilePath = path.join(rootDir, latestTarFile);
  console.log(colors.green(`找到构建文件: ${latestTarFile}`));

  // 解压tar.gz文件到临时目录
  console.log(colors.blue('解压构建文件...'));
  const tempDir = path.join(rootDir, 'temp_extract');
  if (fs.existsSync(tempDir)) {
    execSync(`rm -rf "${tempDir}"`, { stdio: 'inherit' });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  execSync(`tar -xzf "${tarFilePath}" -C "${tempDir}"`, { stdio: 'inherit' });

  // 查找解压后的.app文件
  console.log(colors.blue('查找.app文件...'));
  let appFilePath = null;

  function findAppFile(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        if (file.endsWith('.app')) {
          return filePath;
        }
        const found = findAppFile(filePath);
        if (found) return found;
      }
    }
    return null;
  }

  appFilePath = findAppFile(tempDir);

  if (!appFilePath) {
    throw new Error('在解压后的文件中未找到.app文件');
  }

  const appFileName = path.basename(appFilePath);
  console.log(colors.green(`找到应用文件: ${appFileName}`));

  // 复制应用到build目录
  console.log(colors.blue(`复制应用到${iosBuildDir}目录...`));
  const buildAppPath = path.join(iosBuildDir, appFileName);

  // 使用cp -R命令复制目录
  execSync(`cp -R "${appFilePath}" "${buildAppPath}"`, {
    stdio: 'inherit'
  });

  console.log(colors.green(`应用已复制到: ${buildAppPath}`));

  // 清理临时目录
  console.log(colors.blue('清理临时文件...'));
  execSync(`rm -rf "${tempDir}"`, { stdio: 'inherit' });

  // 询问是否安装到模拟器
  console.log('\n');
  console.log(colors.blue('是否要安装到iOS模拟器? (y/n)'));

  readline.question('', (answer) => {
    readline.close();
    const shouldInstall = answer.trim().toLowerCase() === 'y';

    if (shouldInstall) {
      // 检查模拟器是否运行
      if (!checkIOSSimulatorRunning()) {
        console.log(colors.yellow('iOS模拟器未运行，尝试启动...'));
        if (!startIOSSimulator()) {
          console.log(colors.red('无法启动iOS模拟器，跳过安装步骤'));
          showFinalMessage(buildAppPath);
          return;
        }
      }

      // 安装应用到模拟器
      installAppToIOSSimulator(buildAppPath);
    }

    showFinalMessage(buildAppPath);
  });

} catch (error) {
  console.error(colors.red('构建过程中出错:'), error.message);
  process.exit(1);
}

// 显示最终信息
function showFinalMessage(appPath) {
  console.log('\n');
  console.log(colors.green('✅ iOS开发客户端构建成功!'));
  console.log('\n');
  console.log(colors.blue('构建文件位置:'));
  console.log(colors.yellow(`  ${appPath}`));
  console.log('\n');
  console.log(colors.blue('现在您可以:'));
  console.log(colors.blue('1. 启动开发服务器:'));
  console.log(colors.yellow('   npm start'));
  console.log(colors.blue('2. 手动安装应用 (如果尚未安装):'));
  console.log(colors.yellow(`   xcrun simctl install booted "${appPath}"`));
} 