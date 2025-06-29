在使用 `TargetFrameworks` 的项目中遇到 `CS9057` 的解决方法
`global.json` 文件中添加如下内容：

```json
{
  "sdk": {
    "rollForward": "latestMajor"
  }
}
```
