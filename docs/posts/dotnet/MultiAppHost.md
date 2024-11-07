---
category:
  - .Net
tag:
  - .Net
  - MSBuild
---

# 一次生成多个 AppHost （半成品）

The MIT License (MIT)

Copyright © 2024 frg2089 <frg2089@outlook.com>

```xml
<Project>
  <PropertyGroup>
    <UseAppHost>false</UseAppHost>
    <UseMultiAppHostRuntimeIdentifiers>
      win-x64;win-x86;
      linux-x64;linux-musl-x64;
      osx-x64;osx-arm64
    </UseMultiAppHostRuntimeIdentifiers>
  </PropertyGroup>

  <Target
    Name="_CreateMultiAppHostRuntimeIdentifier"
    DependsOnTargets="_ChooseAppHost;CoreCompile;"
    AfterTargets="_CreateAppHost"
    Condition="'$(UseAppHost)' != 'true'">
    <ItemGroup>
      <MultiAppHostRuntimeIdentifier Include="$(UseMultiAppHostRuntimeIdentifiers)" />
    </ItemGroup>
  </Target>

  <Target
    Name="_PreCreateAppHosts"
    DependsOnTargets="_CreateMultiAppHostRuntimeIdentifier"
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

  <Target
    Name="_CreateAppHosts"
    DependsOnTargets="_PreCreateAppHosts"
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
