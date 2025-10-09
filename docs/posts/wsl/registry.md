---
category:
  - Windows
  - WSL
tag:
  - WSL
  - Registry
date: 2020-07-10
---

# WSL 注册表

```plaintext
HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Lxss\
```

## 值

|         Key         |   类型    | 描述        |
| :-----------------: | :-------: | :---------- |
| DefaultDistribution |  REG_SZ   | 默认发行版  |
|   DefaultVersion    | REG_DWORD | 默认WSL版本 |

## 子项值

|       Key        |   类型    | 描述        |
| :--------------: | :-------: | :---------- |
|     BasePath     |  REG_SZ   | 所在路径    |
|    DefaultUid    | REG_DWORD | 默认用户UID |
| DistributionName |  REG_SZ   | 分发版名    |
|      Flags       | REG_DWORD | ?           |
|      State       | REG_DWORD | ?           |
|     Version      | REG_DWORD | WSL版本     |

- [Stackoverflow](https://stackoverflow.com/questions/61474401/how-to-change-the-default-user-after-import-old-wsl-tar-package)
