---
category:
  - .Net
  - WPF
tag:
  - .Net
  - WPF
  - C#
date: 2025-05-29
---

# WPF 渲染模式设置

解决部分系统中无法正确渲染 WPF 的问题

设置 `HKEY_CURRENT_USER\SOFTWARE\Microsoft\Avalon.Graphics\DisableHWAcceleration` 为 `DWORD` 值为 `1`

## 参考资料

- [图像渲染注册表设置 - Microsoft Learn](https://learn.microsoft.com/dotnet/desktop/wpf/graphics-multimedia/graphics-rendering-registry-settings)
