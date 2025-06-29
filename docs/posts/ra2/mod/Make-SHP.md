---
category:
  - SHP
  - Blender
  - RA2
tag:
  - .Net
  - C#
  - RA2
  - SHP
  - Blender
  - Python
---

[SHP 是什么](https://modenc.renegadeprojects.com/SHP)

# 从 3D 模型中生成 SHP

首先准备 DonutArnold 的 Blender 模板[^template]。

然后准备[我的扩展](https://github.com/ShimakazeProject/Shimakaze.Sdk.Shp.Blender)

再准备[我的SHP生成器](https://github.com/ShimakazeProject/Shimakaze.Sdk/tree/HEAD/src/shp/Shimakaze.Sdk.Shp.Maker)

[^template]: [PPM 原始帖](https://ppmforums.com/topic-36965/blender-templates-tdra-ts-ra2/) [Revora 原始帖](https://forums.revora.net/topic/97398-blender-templates-tdra-ts-ra2/)

打开后 `先选择场景`

> 我实在是不想再把扩展的 README 复制一遍了

## Shimakaze.Sdk.Shp.Maker

> ```plain
> Shimakaze.Sdk.Shp.Maker v0.0.1
> Copyright © 2020 - 2025 Shimakaze Project
>
> Shimakaze.Sdk Shp 生成器
>
> Usage:
>   Shimakaze.Sdk.Shp.Maker <input> <palette> <output> [options]
>
> Arguments:
>   <input>    图像列表文件 [required]
>   <palette>  参考的调色板文件 [required]
>   <output>   输出的 SHP(TS) 文件 [required]
>
> Options:
>   -s, --sequence-ini-output  输出的包含 Sequence 的 INI 文件
>   -e, --end-index            调色板结束索引 [default: 240]
>   -q, --quiet                使用安静模式，不提示用户交互 [default: False]
>   -?, -h, --help             Show help and usage information
>   -v, --version              Show version information
> ```

需要准备一分索引文件
格式是这样的

```plain
#pragma base ./
#pragma sequenceName <Sequence的名字>

object <Sequence中的键的名字> <方向> <Path>
...

house <Path>
...

shadow <Path>
...

```

例如

```plain
#pragma base ./
#pragma sequenceName ShimakazeSequence
object Ready 8 out\Ready\object_0000.webp
object Ready 8 out\Ready\object_0001.webp
object Ready 8 out\Ready\object_0002.webp
object Ready 8 out\Ready\object_0003.webp
object Ready 8 out\Ready\object_0004.webp
object Ready 8 out\Ready\object_0005.webp
object Ready 8 out\Ready\object_0006.webp
object Ready 8 out\Ready\object_0007.webp

object Cheer SE out\Cheer\object_0000.webp

house out\Ready\house_0000.webp
house out\Ready\house_0001.webp
house out\Ready\house_0002.webp
house out\Ready\house_0003.webp
house out\Ready\house_0004.webp
house out\Ready\house_0005.webp
house out\Ready\house_0006.webp
house out\Ready\house_0007.webp

house out\Cheer\house_0000.webp

shadow out\Ready\shadow_0000.webp
shadow out\Ready\shadow_0001.webp
shadow out\Ready\shadow_0002.webp
shadow out\Ready\shadow_0003.webp
shadow out\Ready\shadow_0004.webp
shadow out\Ready\shadow_0005.webp
shadow out\Ready\shadow_0006.webp
shadow out\Ready\shadow_0007.webp

shadow out\Cheer\shadow_0000.webp
```

会生成这样的 INI

```ini
; Shimakaze.Sdk.Shp.Maker
[ShimakazeSequence]
Ready=0,1,1
Cheer=8,1,0,SE
```

和对应的 SHP 文件
