---
category:
  - docker
tag:
  - docker
---

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

> [!IMPORTANT]
> 在更新版本的 Docker Desktop 中已经提供了一种方便的迁移方式：
>
> Settings > Resources > Advanced > Disk image location
>
> 此处的方式已过时

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

<!--
```json
{
  "registry-mirrors": [
    "https://b4ca720bc4b042c39c56db42a0dbdf35.mirror.swr.myhuaweicloud.com",
    "https://dhub.kubesre.xyz",
    "https://docker.1panel.live",
    "https://docker.1panelproxy.com",
    "https://docker.anyhub.us.kg",
    "https://docker.awsl9527.cn",
    "https://docker.kejilion.pro",
    "https://docker.m.daocloud.io",
    "https://docker.nastool.de",
    "https://docker.rainbond.cc",
    "https://docker.udayun.com",
    "https://docker.unsee.tech",
    "https://dockerhub.icu",
    "https://dockerhub.jobcher.com",
    "https://dockerpull.org",
    "https://hub.crdz.gq",
    "https://hub.geekery.cn",
    "https://hub.littlediary.cn",
    "https://hub.rat.dev",
    "https://hub.xdark.top",
    "https://mwadcdd3.mirror.aliyuncs.com",
    "https://noohub.ru",
    "https://registry.dockermirror.com"
  ]
}
```
-->
