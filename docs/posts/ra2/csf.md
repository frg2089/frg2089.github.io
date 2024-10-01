---
category:
  - .Net
  - RA2
tag:
  - .Net
  - C#
  - RA2
---

# 适用于RA2的CSF文件格式

## 什么是CSF文件？

CSF是存储游戏所需要的所有字符串资源的文件。

## 它的结构是什么样子的？

根据现有的资料[^modenc]描述，它分为两部分，文件头和主体部分。

[^modenc]: ModEnc

### 文件头

CSF的文件头的长度是固定的，它有24个字节大小。

| offset |   type   | 描述                                         |
| :----: | :------: | -------------------------------------------- |
|  0x00  | uint8[4] | 文件的标识符，它永远是 ` FSC` 。             |
|  0x04  |  uint32  | CSF文件的版本。通常情况下，它应该始终为`3`。 |
|  0x08  |  uint32  | 标签数量。文件中包含的所有的标签的总数。     |
|  0x0C  |  uint32  | 字符串数量。一般情况下，它应该与标签数相同。 |
|  0x10  |  uint32  | 保留。始终为`0`。                            |
|  0x14  |  uint32  | 使用的语言。这是一个枚举。                   |

#### 语言

|     |              |
| :-: | :----------: |
|  0  | 英语（美国） |
|  1  | 英语（英国） |
|  2  |     德语     |
|  3  |     法语     |
|  4  |   西班牙语   |
|  5  |   意大利语   |
|  6  |     日语     |
|  7  | Jabberwockie |
|  8  |     韩语     |
|  9  |     中文     |

### 主体

CSF文件的主体由若干个标签构成

通常情况下，字符串标签由一个标签头和若干字符串主体构成。

标签头
字符串主体
...

#### 标签头（Label Header）

| offset |   type   | 描述                                    |
| :----: | :------: | --------------------------------------- |
|  0x00  | uint8[4] | 标签的标识符，它永远是 ` LBL` 。        |
|  0x04  |  uint32  | 字符串数量。一般情况下，它应该为 `1` 。 |
|  0x08  |  uint32  | 标签名的长度。                          |
|  0x0C  | uint8[]  | 标签名字符串。字符串不以`\0`结尾。      |

> [!WARNING]
> 虽然标签名中允许存在空格(0x20)，但我不建议你这样做。

#### 字符串值（Value）

| offset |   type   | 描述                                          |
| :----: | :------: | --------------------------------------------- |
|  0x00  | uint8[4] | 字符串值的标识符，它应该为` RTS` 或 `WRTS` 。 |
|  0x04  |  uint32  | 字符串值长度。                                |
|  0x0C  | uint16[] | 字符串值字符串。字符串不以`\0`结尾。          |

> [!TIP]
> 字符串值是经过特殊处理过的UTF-16(LE)编码的。

> [!WARNING]
> 当字符串值的标识符为`WRTS`时，表示这个字符串包含额外内容。

:::details 关于解码

通常情况下，您只需要按位取反即可。

以C#为例

:::code-tabs

@tab CSharp unsafe

```csharp
unsafe void Decode(void* data, int dataSize)
{
    for (int i = 0; i < dataSize; i++)
        data[i] = ~data[i];
}
```

@tab CSharp (.Net 7.0 +) Linq

```csharp
// using System.Linq;
TInteger[] Decode<TInteger>(TInteger[] data)
    where TInteger: IBinaryInteger<TInteger>
    => data.Select(i => ~i).ToArray();

string Decode(string data) => new string(Decode(data.ToCharArray()));
```

@tab C++

```cpp
int ValueDataLength = ValueLength << 1;
for(int i = 0; i < ValueDataLength; ++i) {
  ValueData[i] = ~ValueData[i];
}
```

:::

##### 额外值（Extra）

| offset |  type   | 描述                               |
| :----: | :-----: | ---------------------------------- |
|  0x00  | uint32  | 额外值长度。                       |
|  0x04  | uint8[] | 额外值字符串。字符串不以`\0`结尾。 |

## 参考链接

- [CSF File Format | ModEnc](http://modenc.renegadeprojects.com/CSF_File_Format)
- [[翻译] CSF 文件格式 | miRoox Blog](https://miroox.github.io/blog/2016/12/CSFFileFormat/)
