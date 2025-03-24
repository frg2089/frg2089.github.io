(TBD)

## 网络访问权限

适用场景：Nginx 反向代理无法连接

### 解决方案

```bash
# 允许 Nginx 连接网络
sudo setsebool -P httpd_can_network_connect=1
```

## 文件访问权限

### 验证方法（临时解决方案）

```bash
# 修改文件或目录的 SELinux 标签（递归处理目录）
sudo chcon -R -t httpd_sys_content_t <目标目录>

# 验证标签是否生效
ls -Z <目标目录下的文件>
# 输出应显示 context 为：system_u:object_r:httpd_sys_content_t:s0
```

### 解决方案

1. 编辑文件 `/etc/selinux/targeted/contexts/files/file_contexts.local`
2. 在文件末尾添加以下内容
   ```plain
   <目标目录>(/.*)?    system_u:object_r:httpd_sys_content_t:s0
   ```
3. 重载 SELinux 策略
   ```bash
   sudo restorecon -Rv <目标目录>
   ```
