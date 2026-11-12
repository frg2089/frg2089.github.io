---
categories:
  - .Net
tags:
  - .Net
  - Windows
  - MSBuild
  - dotnet-tool
---

> [!NOTE]
> 本文由 AI 辅助整理，排查过程及解决方案已在实际环境中验证。由于不同系统环境可能存在差异，相关结论仅供参考。

# 修复 `dotnet tool restore` 报错：文件来自另一台计算机且可能被阻止

在 Windows 上执行 `dotnet tool restore` 时，遇到了一个看起来像是 Mark of the Web（MOTW）导致的问题：

```text
文件 Workspace\ProjectA\dotnet-tools.json 来自另一台计算机，而且可能会被阻止以帮助保护此计算机。
有关详细信息(包括如何解除阻止)，请参阅 https://aka.ms/motw
```

但经过排查，问题并不在常见的 `Zone.Identifier` 数据流上，而是与文件的 **Windows 完整性级别（Integrity Level）** 有关。

## 环境

| 项目       | 环境        |
| ---------- | ----------- |
| 操作系统   | Windows 11  |
| PowerShell | 7.7.0       |
| .NET SDK   | 11.0.100    |
| MSBuild    | 18.12.2     |
| 工作区     | `Workspace` |
| 文件系统   | ReFS        |

项目结构：

```text
Workspace
├── ProjectA
│   └── dotnet-tools.json
└── ProjectB
    └── dotnet-tools.json
```

其中，ProjectA 是出现问题的项目，ProjectB 是能够正常执行 `dotnet tool restore` 的项目。

## 排查过程

### 1. 排除工具清单文件内容问题

首先检查 `dotnet-tools.json` 是否存在内容差异。

ProjectB 使用相同的 .NET SDK，能够正常执行 `dotnet tool restore`。

两个项目的工具清单文件 SHA256 完全相同：

```powershell
(Get-FileHash .\ProjectA\dotnet-tools.json).Hash -eq (Get-FileHash .\ProjectB\dotnet-tools.json).Hash
```

结果：

```text
True
```

因此可以排除 JSON 内容差异导致的问题。

另外，`dotnet-tools.json` 位于项目根目录是合法的，工具清单并不一定需要放在 `.config` 目录中。

### 2. 排除 Zone.Identifier

MOTW 通常通过 NTFS 的备用数据流（Alternate Data Stream，ADS）记录文件来源，其中最常见的是 `Zone.Identifier`。

使用以下命令检查文件的数据流：

```powershell
Get-Item .\ProjectA\dotnet-tools.json -Stream *
```

也可以使用：

```powershell
cmd /c dir /r .\ProjectA\dotnet-tools.json
```

检查结果中没有 `Zone.Identifier`。

尝试解除阻止：

```powershell
Unblock-File -LiteralPath .\ProjectA\dotnet-tools.json
```

问题依然存在。

为了确认 ReFS 是否支持备用数据流，还在 Workspace 中创建了一个测试文件并写入 `Zone.Identifier`，确认该文件系统能够正常创建和读取备用数据流。

因此，不能简单地将问题归因于文件带有 MOTW 标记。

### 3. 交叉验证工具清单路径

为了排除当前工作目录的影响，分别指定两个项目的工具清单进行测试：

```powershell
# 在 ProjectA 目录中，指定 ProjectB 的工具清单
dotnet tool restore --tool-manifest ..\ProjectB\dotnet-tools.json

# 在 ProjectB 目录中，指定 ProjectA 的工具清单
dotnet tool restore --tool-manifest ..\ProjectA\dotnet-tools.json
```

结果：

- ProjectA 使用 ProjectB 的工具清单：成功。
- ProjectB 使用 ProjectA 的工具清单：失败。

这说明问题跟随 ProjectA 的工具清单文件，而不是当前工作目录。

随后又在 ProjectA 中复制工具清单，分别测试新文件和子目录中的副本，仍然出现相同错误。

### 4. 检查 ACL 与完整性级别

接下来检查 ProjectA 目录的 ACL：

```powershell
icacls .\ProjectA
```

发现 ProjectA 目录存在一些特殊的访问控制项：

```text
Everyone:(CI)(DENY)(DC)
S-1-4-21035482-788810181:(OI)(CI)(W,D,DC)
...
Mandatory Label\Low Mandatory Level:(OI)(CI)(NW)
```

其中最值得注意的是：

```text
Mandatory Label\Low Mandatory Level:(OI)(CI)(NW)
```

它表示该目录具有 **低完整性级别（Low Integrity Level）**，并且该标签会继承到子目录和文件。

而正常工作的 ProjectB 目录没有这个完整性级别标记。

Windows 的完整性级别属于强制完整性控制（Mandatory Integrity Control，MIC）机制，与普通的 DACL 权限检查不同。

这也解释了为什么仅检查文件是否存在 `Zone.Identifier`，无法找到问题所在。

## 解决方法

先不要直接修改整个项目目录，建议只对出现问题的工具清单文件进行测试。

在管理员 PowerShell 中执行：

```powershell
icacls .\dotnet-tools.json /setintegritylevel M
```

这里的 `M` 表示 Medium Integrity Level（中完整性级别）。

然后检查修改结果：

```powershell
icacls .\dotnet-tools.json
```

确认文件不再显示：

```text
Mandatory Label\Low Mandatory Level
```

最后重新执行：

```powershell
dotnet tool restore
```

问题得到解决。

### 如果整个项目目录都存在该问题

如果确认整个项目目录都继承了低完整性级别，可以考虑修复目录及其子项：

```powershell
icacls Workspace\ProjectA /setintegritylevel "(OI)(CI)M" /T /C
```

参数说明：

| 参数                 | 含义                 |
| -------------------- | -------------------- |
| `/setintegritylevel` | 设置完整性级别       |
| `M`                  | 中完整性级别         |
| `(OI)`               | 对象继承             |
| `(CI)`               | 容器继承             |
| `/T`                 | 递归处理子目录和文件 |
| `/C`                 | 遇到错误时继续处理   |

**注意：** 递归修改会影响整个目录树中的文件和子目录。执行前应先检查并备份相关安全描述符，确认确实需要修改整个目录，而不是只修复单个文件。

## 总结

这次问题的关键在于：虽然 .NET 报错提示文件来自另一台计算机，并建议检查 MOTW，但实际检查时并没有发现 `Zone.Identifier`。

最终发现，ProjectA 目录及其文件具有低完整性级别，而正常工作的 ProjectB 没有这一标记。将问题文件的完整性级别调整为 Medium 后，`dotnet tool restore` 恢复正常。

排查类似问题时，除了检查文件内容、备用数据流和普通 ACL，也应该留意 Windows 的强制完整性控制（MIC）。

相关命令：

```powershell
# 查看文件的数据流
Get-Item .\dotnet-tools.json -Stream *

# 查看文件 ACL 和完整性标签
icacls .\dotnet-tools.json

# 将文件调整为中完整性级别
icacls .\dotnet-tools.json /setintegritylevel M

# 恢复工具
dotnet tool restore
```
