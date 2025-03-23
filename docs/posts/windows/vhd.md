(TBD)

## 自动挂载虚拟硬盘文件

使用注册表

`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\AutoAttachVirtualDisks\{GUID}`
|名称|类型|描述|
|:-:|:-:|-|
|Path|REG_SZ|虚拟硬盘文件路径

> [!tip]
> GUID 可以通过以下命令获取
>
> ```powershell
> (Get-VHD -Path <虚拟硬盘文件>).DiskIdentifier
> ```

> [!note]
> 与此注册表项相关的内容少之又少，尚不明确
