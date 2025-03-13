#!/usr/bin/env node

/**
 * 构建Android生产客户端脚本
 * 
 * 此脚本执行以下操作：
 * 1. 清理旧的构建文件
 * 2. 使用EAS构建Android生产客户端（支持AAB和APK格式）
 * 3. 将构建的文件移动到项目根目录的build/android文件夹
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// 导入工具库
const utils = require('./utils');
const {
  colors,
  rootDir,
  androidBuildDir,
  cleanAndroidBuildDir,
  checkEASCliAndLogin
} = utils;

// 清理旧的构建文件
cleanAndroidBuildDir();

// 创建readline接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 询问用户选择构建类型
function askBuildType() {
  return new Promise((resolve) => {
    console.log(colors.blue('\n请选择构建类型:'));
    console.log(colors.blue('1. AAB格式 (适用于Google Play发布)'));
    console.log(colors.blue('2. APK格式 (适用于直接安装和测试)'));
    console.log(colors.blue('3. 两种格式都构建'));

    rl.question(colors.yellow('请输入选项 [1-3] (默认: 1): '), (answer) => {
      const option = answer.trim() || '1';

      if (['1', '2', '3'].includes(option)) {
        resolve(option);
      } else {
        console.log(colors.red('无效选项，使用默认选项1 (AAB格式)'));
        resolve('1');
      }
    });
  });
}

// 主函数
async function main() {
  try {
    // 检查EAS CLI是否安装并确保用户已登录
    checkEASCliAndLogin();

    // 询问用户选择构建类型
    const buildType = await askBuildType();

    // 根据用户选择设置构建参数
    let buildProfiles = [];
    if (buildType === '1' || buildType === '3') {
      buildProfiles.push('production'); // AAB格式
    }
    if (buildType === '2' || buildType === '3') {
      buildProfiles.push('production-apk'); // APK格式
    }

    // 关闭readline接口
    rl.close();

    // 执行构建
    for (const profile of buildProfiles) {
      const isApk = profile === 'production-apk';
      console.log(colors.blue(`\n开始构建Android ${isApk ? 'APK' : 'AAB'} 生产客户端...`));

      try {
        console.log(colors.blue(`使用配置文件: ${profile}`));
        execSync(`eas build --platform android --profile ${profile} --local --non-interactive`, {
          stdio: 'inherit',
          cwd: rootDir
        });
        console.log(colors.green(`${isApk ? 'APK' : 'AAB'} 构建成功!`));
      } catch (error) {
        console.error(colors.red(`${isApk ? 'APK' : 'AAB'} 构建失败:`), error.message);

        if (buildProfiles.length > 1) {
          console.log(colors.yellow('继续尝试其他格式的构建...'));
          continue;
        } else {
          throw new Error(`构建失败: ${error.message}`);
        }
      }
    }

    // 查找并移动构建文件
    console.log(colors.blue('\n查找构建文件...'));
    const files = fs.readdirSync(rootDir);
    const buildFiles = files.filter(file => file.endsWith('.apk') || file.endsWith('.aab'));

    if (buildFiles.length === 0) {
      throw new Error('未找到构建文件，构建可能失败');
    }

    // 复制所有构建文件到build/android目录
    buildFiles.forEach(file => {
      const filePath = path.join(rootDir, file);
      const destPath = path.join(androidBuildDir, file);

      console.log(colors.blue(`复制 ${file} 到build/android目录...`));
      fs.copyFileSync(filePath, destPath);
      console.log(colors.green(`文件已复制到: ${destPath}`));
    });

    // 输出成功信息
    console.log('\n');
    console.log(colors.green('✅ Android生产客户端构建成功!'));
    console.log('\n');
    console.log(colors.blue('生产构建文件位置:'));
    buildFiles.forEach(file => {
      console.log(colors.yellow(`  ${path.join(androidBuildDir, file)}`));
    });
    console.log('\n');

    // 根据文件类型提供不同的提示
    const hasAab = buildFiles.some(file => file.endsWith('.aab'));
    const hasApk = buildFiles.some(file => file.endsWith('.apk'));

    if (hasAab) {
      console.log(colors.blue('关于AAB文件:'));
      console.log(colors.blue('- 此格式适用于Google Play商店发布'));
      console.log(colors.blue('- 如需安装到设备进行测试，请使用bundletool工具转换为APK'));
      console.log(colors.blue('- 或使用Google Play的内部测试渠道进行测试'));
      console.log('\n');
    }

    if (hasApk) {
      console.log(colors.blue('关于APK文件:'));
      console.log(colors.blue('- 可直接安装到Android设备进行测试'));
      console.log(colors.blue('- 适用于企业分发或非Google Play渠道'));
      console.log('\n');
    }

    console.log(colors.blue('您可以:'));
    console.log(colors.blue('- 将构建文件上传到应用商店'));
    console.log(colors.blue('- 分发给测试人员进行最终测试'));
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
    console.log(colors.blue('4. 尝试更新EAS CLI (npm install -g eas-cli)'));
    console.log(colors.blue('5. 检查项目依赖是否完整 (运行 npm install 或 yarn)'));
    console.log('\n');

    // 关闭readline接口（如果还未关闭）
    if (rl.listenerCount('line') > 0) {
      rl.close();
    }

    process.exit(1);
  }
}

// 执行主函数
main(); 