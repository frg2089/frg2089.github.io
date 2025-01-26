---
category:
  - .Net
  - WPF
tag:
  - .Net
  - WPF
  - C#
date: 2020-06-14
---

# WPF 获取系统主题色

## 系统强调色

系统强调色可通过 DwmGetColorizationColor [^DwmGetColorizationColor] 实现
[^DwmGetColorizationColor]: [DwmGetColorizationColor 函数](https://learn.microsoft.com/windows/win32/api/dwmapi/nf-dwmapi-dwmgetcolorizationcolor)

## 颜色模式

通过访问注册表实现

```cs
if (Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize")?.GetValue("AppsUseLightTheme") is not int or > 0)
{
    // 浅色模式
}
else
{
    // 深色模式
}
```

## 参考资料

- [Registry keys to change personalization settings?](https://superuser.com/questions/1245923/registry-keys-to-change-personalization-settings)
- [How To Enable The Dark Theme In Windows 10](https://www.addictivetips.com/windows-tips/how-to-enable-the-dark-theme-in-windows-10/)
