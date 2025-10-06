---
category:
  - WSL
tag:
  - WSL
  - Registry
date: 2020-11-25
---

# 修改小米手机开机Logo界面

**只在Redmi Note 7上测试过**
**使用的系统是MIUI12/MIUI12.5**

## 准备工作

### 准备工具:

- [binwalk](https://github.com/ReFirmLabs/binwalk) 用于分析img镜像, 若不需要分析可忽略
- [Splash.Patcher](https://github.com/frg2089/Splash.Patcher) img镜像修补工具

### 软件运行环境:

- [Python](https://www.python.org/)([binwalk](https://github.com/ReFirmLabs/binwalk)推荐使用python3, 若不使用[binwalk](https://github.com/ReFirmLabs/binwalk)可不配置)
- [.Net](https://dotnet.microsoft.com/)([Splash.Patcher](https://github.com/frg2089/Splash.Patcher)工具运行环境, 程序源代码可移植到任何 .Net 环境上)

### 准备splash.img

根据厂商不同, 这个文件也可能会叫做logo.img

这个文件可以从完整的系统更新包中取得  
也可以直接用dd或nanddump工具取得

### 获取原始图片

使用[binwalk](https://github.com/ReFirmLabs/binwalk)工具获取图片的偏移值  
如果你知道图片的偏移位置的话 这个步骤可以跳过

0. 使用binwalk工具解析splash.img

   ```bash
   binwalk --dd='.*' splash.img
   ```

1. 取出所有bmp文件
   1. 进入"\_splash.img.extracted"目录, 将步骤0中'DESCRIPTION'为'PC bitmap, Windows 3.x format'的'HEXADECIMAL'值相等的文件添加.bmp扩展名

   2. 移除非.bmp扩展名的文件
      ```powershell
      $fs = ls;
      foreach($f in $fs){
          if(-not $f.Extension.Equals(".bmp",[System.StringComparison]::OrdinalIgnoreCase)){
              $f.Delete();
          }
      }
      ```

### 准备替换图片

**注意**: 请确保准备要替换的图片大小与格式与原始图片一致  
bitmap(bmp)图片只要图像大小一致的话文件大小也会一致

[Splash.Patcher](https://github.com/frg2089/Splash.Patcher)程序是修补工具, 不需要替换的图片可以不随镜像放在一起 不会影响修补结果

## 修补文件

0. 将图片和splash.img文件放在同一目录下
1. 在目录下执行工具或将目录作为参数传递

## 写入

把修补后的splash_new.img刷入即可

```cmd
# 重启进入fastboot
adb reboot fastboot
# 刷入新的splash
fastboot flash splash splash_new.img
# 重启进入系统
fastboot reboot
```

---

# 关于[Splash.Patcher](https://github.com/frg2089/Splash.Patcher)

[Splash.Patcher](https://github.com/frg2089/Splash.Patcher)是我想改开机logo但是找不到工具之后自己写出来的...

至于为什么不用[sagit-logo-gen](https://github.com/moonheart/sagit-logo-gen)...是因为...

> 我不会用  
> 我那时候不知道logo.img是什么东西  
> 我没有那种东西  
> 我把用这个工具直接生成的logo_new.img文件刷到splash分区之后就不显示logo了  
> 试图把img刷到logo分区可fastboot工具提示我没有logo分区...  
> 看了下源代码发现我可能要改源代码来编译生成一个适配自己手机的程序...  
> 好麻烦...  
> 不想用...

那只能自己写了嘛...

虽然好像这样更麻烦了

为什么项目仓库名写的是Splash.Patcher但程序叫Splash.Generator?  
那个是我当时创建项目的时候起错名字了...不影响使用的
