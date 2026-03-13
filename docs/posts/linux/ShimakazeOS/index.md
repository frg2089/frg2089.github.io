---
category:
  - Linux
  - Shimakaze OS
tag:
  - Linux
  - Shimakaze OS
---

> [!NOTE]
> 这篇文章是凑数用的 目前没有后续了

# Shimakaze OS 构建

> [!tip]
> 开发平台是 Fedora 43 (wsl)

尝试构建一个 Linux 内核的 .Net 操作系统
大致需要准备如下材料：

|       名称        | 说明                          |
| :---------------: | ----------------------------- |
|       Linux       | 打包了 NTFS 驱动的 Linux 内核 |
|       musl        | C 语言标准库                  |
|      libgcc       | GCC 运行时支持库              |
|     libstdc++     | C++ 标准库                    |
|      libicu       | Unicode 全球化库              |
|       krb5        | Kerberos 认证库               |
|      openssl      | OpenSSL 运行时库              |
|  ca-certificates  | 根证书信任链                  |
|      tzdata       | 时区数据库                    |
| .Net Core Runtime | .Net 运行时                   |
|    PowerShell     | PowerShell                    |

额外还需要准备

- C#(AOT) 的 init 加载程序
- C#(JIT) 的 init 程序
- initramfs

启动流程
Liunux Kernel

- (initramfs) /sbin/init (挂载 rootfs)
- (rootfs) /sbin/init (挂载 vfs, 启动 CoreCLR)
- (rootfs) /bin/dotnet /usr/lib/init/init.dll

## 准备文件系统

```shell
# 安装 Alpine 的包管理工具
dnf install apk-tools

ROOTFS=$(pwd)/rootfs
mkdir -p "$ROOTFS"

# 创建顶层目录
mkdir -p "$ROOTFS/dev" \
         "$ROOTFS/proc" \
         "$ROOTFS/sys" \
         "$ROOTFS/run" \
         "$ROOTFS/tmp" \
         "$ROOTFS/etc" \
         "$ROOTFS/home" \
         "$ROOTFS/root" \
         "$ROOTFS/mnt" \
         "$ROOTFS/media" \
         "$ROOTFS/opt" \
         "$ROOTFS/srv" \
         "$ROOTFS/var"

# 创建 /usr 下的核心目录
mkdir -p "$ROOTFS/usr/bin" \
         "$ROOTFS/usr/sbin" \
         "$ROOTFS/usr/lib" \
         "$ROOTFS/usr/share" \
         "$ROOTFS/usr/include" \
         "$ROOTFS/usr/local"
        #  "$ROOTFS/usr/lib64" \

# 创建 /var 下的标准子目录
mkdir -p "$ROOTFS/var/log" \
         "$ROOTFS/var/cache" \
         "$ROOTFS/var/lib" \
         "$ROOTFS/var/spool" \
         "$ROOTFS/var/tmp"

# 创建 UsrMerge 所需的符号链接 (仅用于构建rootfs时)
ln -sf "$ROOTFS/usr/bin"   "$ROOTFS/bin"
ln -sf "$ROOTFS/usr/sbin"  "$ROOTFS/sbin"
ln -sf "$ROOTFS/usr/lib"   "$ROOTFS/lib"

# 设置权限（tmp 和 run 通常需要特殊权限）
chmod 0755 "$ROOTFS/run"
chmod 1777 "$ROOTFS/tmp"
chmod 1777 "$ROOTFS/var/tmp"

# 挂载虚拟文件系统
mount --bind /dev  "$ROOTFS/dev"
mount --bind /sys  "$ROOTFS/sys"
mount --bind /proc "$ROOTFS/proc"
mount --bind /run  "$ROOTFS/run"

# 创建 Alpine 包管理的配置文件
mkdir -p "$ROOTFS/etc/apk"
echo "https://mirrors.tuna.tsinghua.edu.cn/alpine/v3.22/main" >> "$ROOTFS/etc/apk/repositories"
echo "https://mirrors.tuna.tsinghua.edu.cn/alpine/v3.22/community" >> "$ROOTFS/etc/apk/repositories"

# 安装 powershell
apk --root "$ROOTFS" --initdb --repositories-file "$ROOTFS/etc/apk/repositories" --allow-untrusted add alpine-baselayout-data apk-tools dotnet powershell

# 删除用于构建rootfs时创建的符号链接
rm "$ROOTFS/bin"
rm "$ROOTFS/sbin"
rm "$ROOTFS/lib"

# 创建 UsrMerge 所需的符号链接
ln -sf "/usr/bin"   "$ROOTFS/bin"
ln -sf "/usr/sbin"  "$ROOTFS/sbin"
ln -sf "/usr/lib"   "$ROOTFS/lib"
chroot "$ROOTFS" /bin/pwsh


umount "$ROOTFS/dev"
umount "$ROOTFS/sys"
umount "$ROOTFS/proc"
umount "$ROOTFS/run"
```

> [!IMPORTANT]
> PowerShell 依赖 alpine-baselayout-data 这个包
> 通常来说，一个完整的 Alpine 一定会包含这个包，但这里的自定义方式不会安装它。

## 内核编译

```shell
# 安装开发工具及其依赖
sudo dnf install @development-tools git ncurses-devel flex bison openssl openssl-dev gawk bc zstd

# 从清华镜像站获取内核源码
git clone https://mirrors.tuna.tsinghua.edu.cn/git/linux.git
# 进入源码目录
cd linux
# 获取指定版本内核源码
git checkout v6.17

# 获取 Fedora 的内核配置
curl https://gitlab.alpinelinux.org/alpine/aports/-/raw/master/main/linux-lts/virt.x86_64.config -o .config

# 配置内核选项
make nconfig

# 编译内核
make -j$(nproc)

# 创建产物目录
OUT="$PWD/kernel-artifacts"
mkdir -p "$OUT"

# 复制内核镜像 (bzImage)
cp arch/x86/boot/bzImage "$OUT/vmlinuz-$(make kernelrelease)"

# 复制配套文件
cp .config "$OUT/config-$(make kernelrelease)"
cp System.map "$OUT/System.map-$(make kernelrelease)"

# 安装模块到产物目录
make INSTALL_MOD_PATH="$OUT" modules_install
```

## PowerShell Alias

由于非 Windows 平台缺少必要的 Alias，需要手动将这些命令添加到 PowerShell 的 Alias 中。

```powershell
# PowerShell 7.5.4
# src\System.Management.Automation\engine\InitialSessionState.cs

New-Alias -Name "ac" -Value "Add-Content" -Option ReadOnly
New-Alias -Name "clear" -Value "Clear-Host"
New-Alias -Name "compare" -Value "Compare-Object" -Option ReadOnly
New-Alias -Name "cpp" -Value "Copy-ItemProperty" -Option ReadOnly
New-Alias -Name "diff" -Value "Compare-Object" -Option ReadOnly
# New-Alias -Name "gsv" -Value "Get-Service" -Option ReadOnly
New-Alias -Name "sleep" -Value "Start-Sleep" -Option ReadOnly
New-Alias -Name "sort" -Value "Sort-Object" -Option ReadOnly
New-Alias -Name "start" -Value "Start-Process" -Option ReadOnly
# New-Alias -Name "sasv" -Value "Start-Service" -Option ReadOnly
# New-Alias -Name "spsv" -Value "Stop-Service" -Option ReadOnly
New-Alias -Name "tee" -Value "Tee-Object" -Option ReadOnly
New-Alias -Name "write" -Value "Write-Output" -Option ReadOnly
New-Alias -Name "cat" -Value "Get-Content"
New-Alias -Name "cp" -Value "Copy-Item" -Option AllScope
New-Alias -Name "ls" -Value "Get-ChildItem"
New-Alias -Name "man" -Value "help"
New-Alias -Name "mount" -Value "New-PSDrive"
New-Alias -Name "mv" -Value "Move-Item"
New-Alias -Name "ps" -Value "Get-Process"
New-Alias -Name "rm" -Value "Remove-Item"
New-Alias -Name "rmdir" -Value "Remove-Item"
# New-Alias -Name "cnsn" -Value "Connect-PSSession" -Option ReadOnly
# New-Alias -Name "dnsn" -Value "Disconnect-PSSession" -Option ReadOnly
# New-Alias -Name "ogv" -Value "Out-GridView" -Option ReadOnly
# New-Alias -Name "shcm" -Value "Show-Command" -Option ReadOnly
New-Alias -Name "kill" -Value "Stop-Process"
```

> [!tip]
> 由于 PowerShell 的 Clear-Host cmdlet 会调用 clear 程序来清理，我们的系统不存在这东西，所以需要覆盖掉默认的 cmdlet 行为
>
> ```powershell
> function Clear-Host {
>     [CmdletBinding()]
>     param ()
>
>     Write-Host "`e[2J`e[3J`e[H"
> }
> ```
