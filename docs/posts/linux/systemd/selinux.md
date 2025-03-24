(TBD)

## 自定义服务无法启动

自定义服务无法启动，在 `systemctl status <service>` 中查看时，提示以下信息

```plain
Unable to locate executable '/path/to/executable': Permission denied
```

### 诊断问题

临时关闭 SELinux 查看效果。
如果恢复正常，则问题出自 SELinux。

```bash
setenforce 0
```

### 解决问题

恢复 SELinux 安全上下文

```bash
restorecon -v /path/to/executable
```
