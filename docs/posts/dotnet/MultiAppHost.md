---
category:
  - .Net
tag:
  - .Net
  - MSBuild
---

# 在一次生成中生成多个 AppHost

> [!tip]
> 在继续前，希望您具备一些基本的 MSBuild 相关知识，
> 因为本文不会解释 MSBuild 基本知识。

## 什么是 AppHost

想要运行一个 .Net 程序集，除了程序集中需要有一个 Main 方法以外，
还需要一个承载 .Net 程序集的应用程序主机（Application Host 简称 App Host）。
它通常是一个 native 的可执行程序，由 .Net 团队提供，
但也可以[自己创建一个AppHost](https://learn.microsoft.com/dotnet/core/tutorials/netcore-hosting)

AppHost 的主要目的是：

1. 寻找并启动 .Net 运行时
2. 加载程序集
3. 查找并获取指向 Main 方法的函数指针
4. 调用 Main 方法

一般来说 AppHost 是随 .Net SDK 附带的。
但在 .Net SDK 中找不到对应的 AppHost 时，会尝试从 [Nuget.Org](https://www.nuget.org/packages?q=Microsoft.NETCore.App.Host.) 中下载对应的包。

|     RuntimeIdentifier[^rid]     | Nuget 包名                                                 |
| :-----------------------------: | :--------------------------------------------------------- |
|            `win-x86`            | `Microsoft.NETCore.App.Host.win-x86`                       |
|            `win-x64`            | `Microsoft.NETCore.App.Host.win-x64`                       |
| ~~`win-arm`~~[^win-arm-apphost] | ~~`Microsoft.NETCore.App.Host.win-arm`~~[^win-arm-apphost] |
|           `win-arm64`           | `Microsoft.NETCore.App.Host.win-arm64`                     |
|           `linux-x64`           | `Microsoft.NETCore.App.Host.linux-x64`                     |
|           `linux-arm`           | `Microsoft.NETCore.App.Host.linux-arm`                     |
|          `linux-arm64`          | `Microsoft.NETCore.App.Host.linux-arm64`                   |
|        `linux-musl-x64`         | `Microsoft.NETCore.App.Host.linux-musl-x64`                |
|        `linux-musl-arm`         | `Microsoft.NETCore.App.Host.linux-musl-arm`                |
|       `linux-musl-arm64`        | `Microsoft.NETCore.App.Host.linux-musl-arm64`              |
|       `linux-bionic-x64`        | `Microsoft.NETCore.App.Host.linux-bionic-x64`              |
|       `linux-bionic-arm`        | `Microsoft.NETCore.App.Host.linux-bionic-arm`              |
|      `linux-bionic-arm64`       | `Microsoft.NETCore.App.Host.linux-bionic-arm64`            |
|            `osx-x64`            | `Microsoft.NETCore.App.Host.osx-x64`                       |
|           `osx-arm64`           | `Microsoft.NETCore.App.Host.osx-arm64`                     |

[^rid]: [.Net RID 目录](https://learn.microsoft.com/dotnet/core/rid-catalog)

[^win-arm-apphost]: 已不再使用

可以在以下位置找到 AppHost。

```plaintext
<Nuget 包路径>/<.Net 运行时版本号>/runtimes/<rid>/native/apphost[.exe]
```

> [!tip]
> 它可能会在 `<.Net SDK 安装路径>\packs` 中搜索包

而在编译过程中， .Net SDK 会复制一份这个文件到产物目录。

那么，如果我们能让项目在编译时多复制几个 AppHost 呢？

> [!note]
> 直接复制 AppHost 文件是无法启动程序集的，程序集的路径是硬编码在 AppHost 文件中的。
> 详见我的另一篇文章 <还没写呢 占位>

> [!important]
> 对于 TFM 使用了 -windows 的时候可能会出问题。
> 虽然程序集与使用其他 RID 编译出来的 IL 内容一致，
> 但由于在 `runtimeconfig.json` 中依赖了 Windows 桌面运行时框架，
> 而其他平台并没有这个框架，故程序将无法启动。

## 实现

通过分析 .Net SDK 的代码可知， AppHost 的文件系统路径是通过一个叫做 `ResolveAppHosts` 的 MSBuild Task 得到的，原本的生成 AppHost 的逻辑是由一个开关 `UseAppHost` 控制的。

那么我们只需要停用原本的逻辑，再实现一个我们自己的逻辑即可。

```xml
<Project>
  <PropertyGroup>
    <!-- 停用原本的 AppHost 生成逻辑 -->
    <UseAppHost>false</UseAppHost>
  </PropertyGroup>
</Project>
```

我们可能不需要直接生成所有受支持的 AppHost，所以我们可以列一个 RID 列表

```xml
<Project>
  <PropertyGroup>
    <!-- RID 列表 -->
    <UseMultiAppHostRuntimeIdentifiers>
      win-x64;win-x86;win-arm64;
      linux-x64;linux-musl-x64;
      linux-arm64;linux-musl-arm64;
      osx-x64;osx-arm64
    </UseMultiAppHostRuntimeIdentifiers>
  </PropertyGroup>
</Project>
```

由于这是一个属性，我们需要把它转换成项，所以需要写一个 Target

```xml
<Project>
  <Target Name="_ResolveMultiAppHostRuntimeIdentifier" Condition="'$(UseAppHost)' != 'true'">
    <ItemGroup>
      <MultiAppHostRuntimeIdentifier Include="$(UseMultiAppHostRuntimeIdentifiers)" />
    </ItemGroup>
  </Target>
</Project>
```

接下来需要获取 AppHost 的文件系统路径

```xml
<Project>
  <Target
    Name="_ResolveMultiAppHost"
    DependsOnTargets="_ResolveMultiAppHostRuntimeIdentifier"
    Outputs="%(MultiAppHostRuntimeIdentifier.Identity)"
    Condition="'$(UseAppHost)' != 'true'">
    <ResolveAppHosts
      TargetFrameworkIdentifier="$(TargetFrameworkIdentifier)"
      TargetFrameworkVersion="$(_TargetFrameworkVersionWithoutV)"
      TargetingPackRoot="$(NetCoreTargetingPackRoot)"
      AppHostRuntimeIdentifier="%(MultiAppHostRuntimeIdentifier.Identity)"
      OtherRuntimeIdentifiers="$(RuntimeIdentifiers)"
      RuntimeFrameworkVersion="$(RuntimeFrameworkVersion)"
      PackAsToolShimRuntimeIdentifiers="@(_PackAsToolShimRuntimeIdentifiers)"
      DotNetAppHostExecutableNameWithoutExtension="$(_DotNetAppHostExecutableNameWithoutExtension)"
      DotNetSingleFileHostExecutableNameWithoutExtension="$(_DotNetSingleFileHostExecutableNameWithoutExtension)"
      DotNetComHostLibraryNameWithoutExtension="$(_DotNetComHostLibraryNameWithoutExtension)"
      DotNetIjwHostLibraryNameWithoutExtension="$(_DotNetIjwHostLibraryNameWithoutExtension)"
      RuntimeGraphPath="$(RuntimeIdentifierGraphPath)"
      KnownAppHostPacks="@(KnownAppHostPack)"
      NuGetRestoreSupported="$(_NuGetRestoreSupported)"
      EnableAppHostPackDownload="$(EnableAppHostPackDownload)"
      NetCoreTargetingPackRoot="$(NetCoreTargetingPackRoot)">
      <Output TaskParameter="PackagesToDownload" ItemName="_MultiPackageToDownload" />
      <Output TaskParameter="AppHost" ItemName="_MultiAppHostPack" />
    </ResolveAppHosts>

    <PropertyGroup>
      <_AppHostSourcePath>%(_MultiAppHostPack.Path)</_AppHostSourcePath>
    </PropertyGroup>

    <!-- 由于 AppHost 可能是从 Nuget.Org 中现下载的，此时 _MultiAppHostPack.Path 为空，需要特殊处理。 -->
    <PropertyGroup Condition="'$(_AppHostSourcePath)' == ''">
      <_AppHostSourcePath>%(_MultiAppHostPack.NuGetPackageId)</_AppHostSourcePath>
      <_AppHostSourcePath>$(_AppHostSourcePath.ToLower())\%(_MultiAppHostPack.NuGetPackageVersion)\%(_MultiAppHostPack.PathInPackage)</_AppHostSourcePath>
      <_AppHostSourcePath>$(NuGetPackageRoot)\$(_AppHostSourcePath)</_AppHostSourcePath>
    </PropertyGroup>

    <ItemGroup>
      <MultiAppHost Include="@(MultiAppHostRuntimeIdentifier -> '$(IntermediateOutputPath)AppHosts\%(Identity)$([System.IO.Path]::GetExtension($(_AppHostSourcePath)))')">
        <AppHostSourcePath>$(_AppHostSourcePath)</AppHostSourcePath>
        <AppHostRuntimeIdentifier>%(Identity)</AppHostRuntimeIdentifier>
      </MultiAppHost>
    </ItemGroup>
  </Target>
</Project>
```

最后，我们需要处理这些 AppHost ，用实际的程序集路径替换占位符

```xml
<Project>
  <Target
    Name="_CreateMultiAppHost"
    DependsOnTargets="_ResolveMultiAppHost"
    AfterTargets="_CreateAppHost"
    Inputs="@(MultiAppHost -> '%(AppHostSourcePath)')"
    Outputs="@(MultiAppHost -> '%(Identity)')"
  >
    <MakeDir Directories="$(IntermediateOutputPath)AppHosts" />
    <CreateAppHost
      AppHostSourcePath="%(MultiAppHost.AppHostSourcePath)"
      AppHostDestinationPath="%(MultiAppHost.Identity)"
      AppBinaryName="$(AssemblyName)$(TargetExt)"
      IntermediateAssembly="@(IntermediateAssembly->'%(FullPath)')"
      WindowsGraphicalUserInterface="$(_UseWindowsGraphicalUserInterface)"
      Retries="$(CopyRetryCount)"
      RetryDelayMilliseconds="$(CopyRetryDelayMilliseconds)"
      EnableMacOSCodeSign="$(_EnableMacOSCodeSign)"
    />
  </Target>
</Project>
```
