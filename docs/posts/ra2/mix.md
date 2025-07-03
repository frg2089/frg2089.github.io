---
category:
  - .Net
  - RA2
tag:
  - .Net
  - C#
  - RA2
---

# 适用于RA2的 MIX 文件格式

## 什么是MIX文件？

MIX文件是存储游戏所使用的文件文件包。

## 它的结构是什么样子的？

根据现有的资料[^xcc]描述，它分为两部分，文件头和主体部分。

[^xcc]: [XCC](https://xhp.xwis.net/documents/MIX_Format.html)

### 文件头

MIX 文件有两种变体，没有魔术代码。

| offset |  type  | 描述                                |
| :----: | :----: | ----------------------------------- |
|  0x00  | uint32 | 标记 表示这个文件是否有加密或校验和 |
|  0x04  | uint16 | 文件数量                            |
|  0x06  | uint32 | 文件主体大小                        |

### Entry

| offset |  type  | 描述     |
| :----: | :----: | -------- |
|  0x00  | uint32 | 文件ID   |
|  0x04  | uint32 | 偏移位置 |
|  0x08  | uint32 | 文件大小 |

## Westwood Studio Key 计算

当 标记 & `0x00020000` == 0x00020000 时，mix内容是被加密的。

文件主体是使用 Blowfish 算法加密的，密钥长度 56 字节。

Blowfish 密钥保存在文件头中，从 0x04 开始，读 80 个字节。

这 80 个字节是两个 RSA 私钥加密的块。

用这个参数解密：
模数 `AihRvNoIbTn85FZRYNZRcT+i6KpU+maCsEqr3Q5q+LDB5tH7Tz2qQ38V` (base64)
指数 `0x10001`

...

不想写了 直接贴代码

```csharp
using System.Buffers;
using System.Buffers.Text;
using System.Diagnostics;
using System.Numerics;

public static class WSKey
{
    private static readonly Lazy<BigInteger> Modulus = new(() => ToBigInteger("AihRvNoIbTn85FZRYNZRcT+i6KpU+maCsEqr3Q5q+LDB5tH7Tz2qQ38V"u8));
    private static readonly Lazy<BigInteger> PublicKeyExponent = new(() => 0x10001u);
    private static readonly Lazy<BigInteger> PrivateKeyExponent = new(() => ToBigInteger("AigKVje8mROcR8QixnxUEF5b29Curkq01DNDWCdOG99XBqH79OaCiTCB"u8));

    private static BigInteger ToBigInteger(ReadOnlySpan<byte> base64)
    {
        var len = Base64.GetMaxDecodedFromUtf8Length(base64.Length);
        Span<byte> data = stackalloc byte[len];
        var status = Base64.DecodeFromUtf8(base64, data, out _, out len);
        Debug.Assert(status is OperationStatus.Done);
        data = data[..len];

        int index = 0;

        if (data[index++] != 0x02)
            throw new FormatException("Expected INTEGER");

        int length = ReadAsn1Length(data, ref index);
        return new(data.Slice(index, length), isBigEndian: true, isUnsigned: true);
    }

    private static int ReadAsn1Length(ReadOnlySpan<byte> data, ref int index)
    {
        byte b = data[index++];
        if ((b & 0x80) == 0) return b;

        int lenBytes = b & 0x7F;
        int length = 0;
        for (int i = 0; i < lenBytes; i++)
            length = (length << 8) | data[index++];
        return length;
    }

    public static void Decrypt(ReadOnlySpan<byte> encrypted, Span<byte> output)
    {
        Debug.Assert(encrypted.Length is 80);
        Debug.Assert(output.Length is 56);

        var modulus = Modulus.Value;
        var exponent = PublicKeyExponent.Value;

        BigInteger cipher1 = new(encrypted[..40], isUnsigned: true, isBigEndian: false);
        BigInteger cipher2 = new(encrypted[40..], isUnsigned: true, isBigEndian: false);

        var plain1 = BigInteger.ModPow(cipher1, exponent, modulus);
        var plain2 = BigInteger.ModPow(cipher2, exponent, modulus);

        plain1.TryWriteBytes(output, out int written1, isUnsigned: true, isBigEndian: false);
        plain2.TryWriteBytes(output[written1..], out int written2, isUnsigned: true, isBigEndian: false);
        Debug.Assert(written1 + written2 is 56);
    }

    public static void Encrypt(ReadOnlySpan<byte> input, Span<byte> encrypted)
    {
        Debug.Assert(input.Length == 56);
        Debug.Assert(encrypted.Length == 80);

        var modulus = Modulus.Value;
        var exponent = PrivateKeyExponent.Value;

        var split = modulus.GetByteCount() - 1;

        BigInteger part1 = new(input[..split], isUnsigned: true, isBigEndian: true);
        BigInteger part2 = new(input[split..], isUnsigned: true, isBigEndian: true);

        BigInteger cipher1 = BigInteger.ModPow(part1, exponent, modulus);
        BigInteger cipher2 = BigInteger.ModPow(part2, exponent, modulus);

        cipher1.TryWriteBytes(encrypted, out int written1, isUnsigned: true, isBigEndian: false);
        cipher2.TryWriteBytes(encrypted[written1..], out int written2, isUnsigned: true, isBigEndian: false);
        Debug.Assert(written1 + written2 is 80);
    }
}
```

## 引用

[【翻译】MIX 文件格式](https://miroox.github.io/blog/2017/03/MIXFormat)
