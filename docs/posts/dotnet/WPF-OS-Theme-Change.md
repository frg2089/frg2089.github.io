---
category:
  - .Net
  - WPF
tag:
  - .Net
  - WPF
  - C#
redirectFrom:
  - /posts/3867e2db.html
---

# WPF 捕获系统主题改变事件

通过注册表方案可以在应用程序启动时获取到系统主题。
但观察那些 UWP 程序，或者一些 Win32 程序，它们能在运行期间动态的根据系统设置切换应用主题！

根据一些参考资料，Windows 会在切换应用主题时向窗口发送一个事件，只要捕获这个事件，就可以做到感知系统色转变了。

## WndProc

窗口事件都在 WndProc[^wndproc] 中处理，所以想要获取窗口事件就需要挂钩子。

在 WPF 中，通过以下方法即可挂载一个 WndProc 钩子

Language Version: C# 12.0

```csharp
// System.Windows.Window window;
System.Windows.Interop.WindowInteropHelper helper = new(window);
if (helper.Handle is 0)
    throw new InvalidOperationException("Could not get window handle.");

System.Windows.Interop.HwndSource
    .FromHwnd(helper.Handle)
    .AddHook(WndProc);

// ...

nint WndProc(nint hwnd, int msg, nint wParam, nint lParam, ref bool handled)
{
    // TODO
}
```

在成功挂上钩子以后，可以通过判断 msg 的值是不是 WM_DWMCOLORIZATIONCOLORCHANGED[^msg] (0x320) 来捕获系统主题改变

```csharp
nint WndProc(nint hwnd, int msg, nint wParam, nint lParam, ref bool handled)
{
    switch (msg)
    {
        case WM_DWMCOLORIZATIONCOLORCHANGED:
            // 在此处处理事件
            return 0;
        default:
            return 0;
    }
}
```

[^wndproc]: [WNDPROC 回调函数](https://learn.microsoft.com/windows/win32/api/winuser/nc-winuser-wndproc)

[^msg]: [WM_DWMCOLORIZATIONCOLORCHANGED 消息](https://learn.microsoft.com/windows/win32/dwm/wm-dwmcolorizationcolorchanged)

## 参考资料

- [Get the active color of Windows 8 automatic color theme - Stack Overflow](https://stackoverflow.com/questions/13660976/get-the-active-color-of-windows-8-automatic-color-theme)
