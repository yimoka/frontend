# React Native 应用开发指南

这是一个使用 [Expo](https://expo.dev) 创建的 React Native 项目，基于 [`create-expo-app`](https://www.npmjs.com/package/create-expo-app)。

## 快速开始

1. 安装依赖

   ```bash
   pnpm install
   ```

2. 启动应用

   ```bash
   pnpm start
   ```

在输出中，您将找到在以下环境中打开应用的选项：

- [开发构建](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android 模拟器](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS 模拟器](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)，一个用于尝试 Expo 应用开发的沙盒环境

您可以通过编辑 **app** 目录中的文件开始开发。此项目使用[基于文件的路由](https://docs.expo.dev/router/introduction)。

## 开发模式与热重载

为了在开发过程中使用热重载功能，请按照以下步骤操作：

### iOS 开发

1. 构建支持热重载的 iOS 开发客户端并安装到模拟器：

   ```bash
   pnpm run build:ios:dev
   ```

   此命令会：
   - 清理旧的构建文件和目录
   - 构建 iOS 开发客户端
   - 将应用解压到项目根目录的 `build` 文件夹
   - 安装应用到 iOS 模拟器
   - 打开模拟器
   - 提示您如何启动开发服务器

2. 启动开发服务器：

   ```bash
   pnpm start
   ```

3. 在模拟器中，确保热重载功能已启用：
   - 按下 `Command + D` 打开开发者菜单
   - 选择 "Enable Fast Refresh"

### Android 开发

#### 前提条件

在构建 Android 应用之前，请确保您已经：

1. 安装了 [Android Studio](https://developer.android.com/studio)
2. 配置了 Android SDK（通过 Android Studio 或手动安装）
3. 设置了环境变量：
   - `ANDROID_HOME` 或 `ANDROID_SDK_ROOT` 指向您的 Android SDK 路径
   - 将 Android SDK 的 `platform-tools` 和 `emulator` 目录添加到系统 PATH 中

如果您使用的是 macOS，典型的 Android SDK 路径是 `~/Library/Android/sdk`。您可以在 `~/.zshrc` 或 `~/.bash_profile` 中添加以下内容：

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
```

#### 构建和运行

1. 构建支持热重载的 Android 开发客户端并安装到模拟器：

   ```bash
   pnpm run build:android:dev
   ```

   此命令会：
   - 清理旧的构建文件和目录
   - 构建 Android 开发客户端
   - 将 APK 文件复制到项目根目录的 `build` 文件夹
   - 尝试启动 Android 模拟器（如果未运行）
   - 安装应用到 Android 模拟器或连接的设备
   - 提示您如何启动开发服务器

2. 启动开发服务器：

   ```bash
   pnpm start
   ```

3. 在模拟器中，确保热重载功能已启用：
   - 按下 `Ctrl + M` 或摇晃设备打开开发者菜单
   - 选择 "Enable Fast Refresh"

现在，当您修改代码时，更改将自动应用到应用中，无需手动重新加载。

## 生产环境构建

### iOS 生产环境构建

#### 本地构建

要在本地构建 iOS 生产版本，请运行：

```bash
pnpm run build:ios:prod:local
```

此命令会：
- 清理旧的构建文件和目录
- 构建 iOS 生产版应用
- 将应用复制到项目根目录的 `build/ios` 文件夹

#### EAS 云构建

要使用 Expo Application Services (EAS) 进行云构建，请运行：

```bash
pnpm run build:ios:prod
```

此命令会：
- 检查 EAS CLI 是否已安装并登录
- 使用 EAS 构建 iOS 生产版应用
- 提供构建完成后的下载链接

### Android 生产环境构建

#### 本地构建

要在本地构建 Android 生产版本，请运行：

```bash
pnpm run build:android:prod:local
```

此命令会：
- 清理旧的构建文件和目录
- 构建 Android 生产版 APK
- 将 APK 文件复制到项目根目录的 `build/android` 文件夹

#### EAS 云构建

要使用 Expo Application Services (EAS) 进行云构建，请运行：

```bash
pnpm run build:android:prod
```

此命令会：
- 检查 EAS CLI 是否已安装并登录
- 使用 EAS 构建 Android 生产版应用
- 提供构建完成后的下载链接

## 安装应用到设备

### 安装到 iOS 设备或模拟器

要将已构建的 iOS 应用安装到模拟器，请运行：

```bash
pnpm run install:ios
```

此命令会：
- 检查 iOS 模拟器是否正在运行，如果没有则尝试启动
- 查找构建目录中的 .app 文件
- 安装应用到 iOS 模拟器

### 安装到 Android 设备或模拟器

要将已构建的 Android 应用安装到设备或模拟器，请运行：

```bash
pnpm run install:android
```

此命令会：
- 检查 Android 设备是否已连接，如果没有则尝试启动模拟器
- 查找构建目录中的 .apk 文件
- 安装应用到 Android 设备或模拟器

## 清理构建文件

如果您需要手动清理所有构建文件，可以运行：

```bash
pnpm run clean
```

此命令会删除 `build` 目录、所有 `build-*.tar.gz` 文件和 `.apk` 文件。

## 重置项目

当您准备好开始一个新项目时，运行：

```bash
pnpm run reset-project
```

此命令会将初始代码移动到 **app-example** 目录，并创建一个空白的 **app** 目录，您可以在其中开始开发。您可以选择是否保留原始代码作为参考。

## 了解更多

要了解更多关于使用 Expo 开发项目的信息，请查看以下资源：

- [Expo 文档](https://docs.expo.dev/)：学习基础知识，或通过我们的[指南](https://docs.expo.dev/guides)深入了解高级主题。
- [Learn Expo 教程](https://docs.expo.dev/tutorial/introduction/)：按照分步教程创建一个可在 Android、iOS 和 Web 上运行的项目。

## 加入社区

加入我们的开发者社区，创建通用应用：

- [GitHub 上的 Expo](https://github.com/expo/expo)：查看我们的开源平台并做出贡献。
- [Discord 社区](https://chat.expo.dev)：与 Expo 用户聊天并提问。
