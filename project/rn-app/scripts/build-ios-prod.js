#!/usr/bin/env node

/**
 * 构建iOS生产客户端脚本
 * 
 * 此脚本执行以下操作：
 * 1. 清理旧的构建文件
 * 2. 使用EAS构建iOS生产客户端
 * 3. 将构建的tar.gz文件解压到项目根目录的build/ios文件夹
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 导入工具库
const utils = require('./utils');
const {
  colors,
  rootDir,
  iosBuildDir,
  cleanIOSBuildDir,
  checkEASCliAndLogin
} = utils;

// 清理旧的构建文件
cleanIOSBuildDir();

// 检查EAS CLI是否安装并确保用户已登录
checkEASCliAndLogin();

try {
  // 步骤1: 构建iOS生产客户端
  console.log(colors.blue('开始构建iOS生产客户端...'));

  // 使用EAS构建
  try {
    execSync('eas build --platform ios --profile production --local --non-interactive', {
      stdio: 'inherit',
      cwd: rootDir
    });
    console.log(colors.green('iOS构建成功!'));
  } catch (error) {
    console.error(colors.red('iOS构建失败:'), error.message);
    throw new Error(`构建失败: ${error.message}`);
  }

  // 步骤2: 查找最新的tar.gz文件
  console.log(colors.blue('查找构建文件...'));
  const files = fs.readdirSync(rootDir);
  const tarFiles = files.filter(file => file.startsWith('build-') && file.endsWith('.tar.gz'));

  if (tarFiles.length === 0) {
    throw new Error('未找到构建文件，构建可能失败');
  }

  // 按修改时间排序，获取最新的文件
  const latestTarFile = tarFiles.sort((a, b) => {
    return fs.statSync(path.join(rootDir, b)).mtime.getTime() -
      fs.statSync(path.join(rootDir, a)).mtime.getTime();
  })[0];

  const tarFilePath = path.join(rootDir, latestTarFile);

  // 步骤3: 解压文件到build/ios目录
  console.log(colors.blue(`解压 ${latestTarFile} 到build/ios目录...`));

  execSync(`tar -xzf "${tarFilePath}" -C "${iosBuildDir}"`, {
    stdio: 'inherit',
    cwd: rootDir
  });

  // 复制tar.gz文件到build/ios目录（备份）
  const buildTarPath = path.join(iosBuildDir, latestTarFile);
  fs.copyFileSync(tarFilePath, buildTarPath);
  console.log(colors.blue(`已复制原始tar.gz文件到: ${buildTarPath}`));

  // 列出解压后的文件
  console.log(colors.blue('解压后的文件:'));
  const extractedFiles = fs.readdirSync(iosBuildDir);
  extractedFiles.forEach(file => {
    if (file !== latestTarFile) { // 排除刚复制的tar.gz文件
      console.log(colors.blue(`  - ${file}`));
    }
  });

  // 步骤4: 提示用户生产IPA的位置和用途
  console.log('\n');
  console.log(colors.green('✅ iOS生产客户端构建成功!'));
  console.log('\n');
  console.log(colors.blue('构建文件已解压到:'));
  console.log(colors.yellow(`  ${iosBuildDir}`));
  console.log('\n');
  console.log(colors.blue('关于iOS构建文件:'));
  console.log(colors.blue('- 可通过App Store Connect上传到App Store'));
  console.log(colors.blue('- 可通过TestFlight分发给测试人员'));
  console.log(colors.blue('- 可通过企业分发渠道分发给内部用户'));
  console.log('\n');
  console.log(colors.blue('您可以:'));
  console.log(colors.blue('- 使用Application Loader或Transporter上传到App Store Connect'));
  console.log(colors.blue('- 通过TestFlight分发给测试人员'));
  console.log(colors.blue('- 通过企业分发渠道分发给用户'));
  console.log('\n');

} catch (error) {
  console.error(colors.red('构建过程中出错:'), error.message);

  // 提供更详细的错误信息和可能的解决方案
  console.log('\n');
  console.log(colors.yellow('可能的解决方案:'));
  console.log(colors.blue('1. 检查网络连接，确保可以访问EAS服务'));
  console.log(colors.blue('2. 确保已登录到Expo账号 (运行 expo login)'));
  console.log(colors.blue('3. 检查eas.json配置是否正确'));
  console.log(colors.blue('4. 确保已配置正确的iOS证书和配置文件'));
  console.log(colors.blue('5. 尝试更新EAS CLI (npm install -g eas-cli)'));
  console.log(colors.blue('6. 检查项目依赖是否完整 (运行 npm install 或 yarn)'));
  console.log('\n');

  process.exit(1);
} 