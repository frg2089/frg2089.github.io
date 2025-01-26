---
category:
  - .Net
tag:
  - .Net
  - MSBuild
---

# 使 AppHost 支持从其他路径加载程序集

> [!tip]
> 在继续前，希望您具备一些基本的 MSBuild 相关知识，
> 因为本文不会解释 MSBuild 基本知识。

## 什么是 AppHost

[参见此文](./MultiAppHost.md#什么是-apphost)

## 实现

通过分析 .Net SDK 的代码可知， AppHost 是由一个叫做 \_CreateAppHost 的 Target 创建的。
Target \_CreateAppHost 会在通常是 obj 文件夹下创建一个名为 apphost[.exe] 的文件。
Target \_ComputeNETCoreBuildOutputFiles 会负责将 apphost[.exe] 移动至输出文件夹。

只需要替换掉原有的 \_CreateAppHost 就可以实现从其他路径加载程序集了。

根据研究，将 Task CreateAppHost 的属性 AppBinaryName 换掉即可

```xml
<Project>
  <Target Name="_CreateAppHost_Hack" AfterTargets="_CreateAppHost">
    <CreateAppHost AppHostSourcePath="$(AppHostSourcePath)"
                   AppHostDestinationPath="$(AppHostIntermediatePath)"
                   AppBinaryName="<PathTo>\$(AssemblyName)$(TargetExt)"
                   IntermediateAssembly="@(IntermediateAssembly->'%(FullPath)')"
                   WindowsGraphicalUserInterface="$(_UseWindowsGraphicalUserInterface)"
                   Retries="$(CopyRetryCount)"
                   RetryDelayMilliseconds="$(CopyRetryDelayMilliseconds)"
                   EnableMacOSCodeSign="$(_EnableMacOSCodeSign)"
                   />
  </Target>
</Project>
```
