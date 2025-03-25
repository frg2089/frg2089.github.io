# 由 SELinux 引发的问题

在启用了 SELinux 的情况下，使用 Nginx 时可能会遇到一些问题。

## 反向代理不能正常工作

在查看 Nginx 日志时发现了以下错误时，可以尝试使用此方案。

```bash
tail -10f /var/log/nginx/error.log
```

```log
failed (13: Permission denied) while connecting to upstream
```

### 解决方案

SELinux 是基于最小权限原则默认拦截了 Nginx 的请求，通过此命令以允许 Nginx 主动访问网络：

```bash
sudo setsebool -P httpd_can_network_connect=1
```

## 静态资源无法访问

SELinux 默认限制了 web 服务器能够访问的目录，若是在 Nginx 中指向了默认不允许访问的目录则需要通过以下方式给予授权。

### 验证方法（临时解决方案）

1. 修改文件或目录的 SELinux 标签（递归处理目录）

   ```bash
   sudo chcon -R -t httpd_sys_content_t <目标目录>
   ```

2. 验证标签是否生效
   ```bash
   ls -Z <目标目录下的文件>
   ```
   输出应显示 context 为：system_u:object_r:httpd_sys_content_t:s0

### 解决方案

1. 编辑文件 `/etc/selinux/targeted/contexts/files/file_contexts.local`
   ```bash
   sudo nano /etc/selinux/targeted/contexts/files/file_contexts.local
   ```
2. 在文件末尾添加以下内容
   ```plain
   <目标目录>(/.*)?    system_u:object_r:httpd_sys_content_t:s0
   ```
3. 重载 SELinux 策略
   ```bash
   sudo restorecon -Rv <目标目录>
   ```
4. 验证标签是否生效
   ```bash
   ls -Z <目标目录下的文件>
   ```
   输出应显示 context 为：system_u:object_r:httpd_sys_content_t:s0
