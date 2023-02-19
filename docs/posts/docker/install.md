# Docker Desktop for Windows 安装方法

## 安装

0. 异步任务(#1)：[下载 Docker Desktop for Windows](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe)
1. 打开 “启用或关闭Windows功能” 对话框
2. 启用 “Windows 虚拟机监控程序平台”
3. 启用 “适用于 Linux 的 Windows 子系统”
4. 启用 “虚拟机平台”
5. 等待异步任务(#1)完成 （人话：等docker安装程序下载完）
6. 安装docker
7. 重启计算机

## 迁移

```powershell
# 导出 wsl
wsl --export docker-desktop .\docker-desktop.tar
wsl --export docker-desktop-data .\docker-desktop-data.tar
# 注销旧的 wsl
wsl --unregister docker-desktop
wsl --unregister docker-desktop-data
# 导入新的 wsl
wsl --import docker-desktop .\desktop .\docker-desktop.tar --version 2
wsl --import docker-desktop-data .\data .\docker-desktop-data.tar --version 2
```
