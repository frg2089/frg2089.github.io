---
category:
  - .Net
tag:
  - .Net
  - MSBuild
---

# 消除附属程序集

附属程序集（又叫卫星程序集）是用于存储应用程序中特定语言或区域性资源的程序集，通常包含翻译后的字符串、图像和其他本地化内容。它们使得应用程序可以轻松支持多语言界面，而无需更改主程序代码。在 .NET 等框架中，附属程序集常按语言文件夹（如 `en-US`、`zh-CN`）组织，与主程序集分离，便于独立更新和维护。

而在一些时候，我们需要只提供一个exe，还能提供多语言的支持（比如安装程序），这种时候就需要消除附属程序集了。

> [!IMPORTANT]
> 我没有经过更多的测试，我只能确保在我的项目中这种方式是可行的，欢迎讨论。
>
> 1. 使用 SDK-Style 项目
> 2. 面向 .NET Framework 4.8
> 3. `global.json` 中的 SDK 版本是 9.0.300

在 SDK-Style 项目中， `*.resx` 文件会自动被添加到 `EmbeddedResource` 项。
而，以 `Resource.resx` 为例，`Resource.*.resx` 会被识别成特定文化（Culture）的资源文件，从而生成特定文化的附属程序集。

如存在 `Resource.zh-Hans.resx`，那么生成 `zh-Hans/***.resources.dll`。

通过观察 `msbuild` 日志，可以注意到[^注意到]一个特殊的项元数据——`WithCulture`，在包含特定文化的时候，此值为`True`

[^注意到]: 发动技能——注意到，我的观察还真是仔细呢（掐腰挺胸.webp）

根据其名称推测，`WithCulture` 的作用是生成特定文化的资源文件。

## 步骤

既然如此，那么，我们只需要将值为 `Resource.zh-Hans.resx` 的 `EmbeddedResource` 项的元数据 `WithCulture` 设置为 `False` 即可消除附属程序集，使其资源打包进 `exe` 中。

```xml
<EmbeddedResource Update="Resource.*.resx" WithCulture="false" />
```

但此时还有一个问题，通过 `ResXFileCodeGenerator` （或 `PublicResXFileCodeGenerator` ）生成出来的代码，默认使用的 `ResourceManager` 类是不会加载在主程序集中的特定文化的资源的。

于是，我开始在 Nuget.Org 上翻找着合适的源生成器，找到了 `Microsoft.CodeAnalysis.ResxSourceGenerator` [^注意到]。

通过观察[^注意到]，它生成的结果是带 partial 修饰的！

这给了我一个机会，抢在初始化 `ResourceManager` 之前塞自己的逻辑进去的机会。

通过编写一个自定义的 `ResourceManager` 实现加载主程序集中的资源

```csharp
internal sealed class SingleFileResourceManager : ResourceManager
{
    private readonly HashSet<CultureInfo> _cultures;
    public SingleFileResourceManager()
    {
        _cultures = Init();
    }

    public SingleFileResourceManager(Type resourceSource) : base(resourceSource)
    {
        _cultures = Init();
    }

    public SingleFileResourceManager(string baseName, Assembly assembly) : base(baseName, assembly)
    {
        _cultures = Init();
    }

    public SingleFileResourceManager(string baseName, Assembly assembly, Type usingResourceSet) : base(baseName, assembly, usingResourceSet)
    {
        _cultures = Init();
    }

    private HashSet<CultureInfo> Init()
    {
        return [.. MainAssembly
            .GetManifestResourceNames()
            .Where(i => i.StartsWith(BaseName) && i.EndsWith(".resources"))
            .Select(i =>
            {
                var name = i.Substring(BaseName.Length , i.Length - BaseName.Length - ".resources".Length );
                if (string.IsNullOrEmpty(name))
                    return CultureInfo.InvariantCulture;

                name = name.Substring(1);

                return CultureInfo.GetCultureInfo(name);
            })];
    }

    protected override ResourceSet InternalGetResourceSet(CultureInfo culture, bool createIfNotExists, bool tryParents)
    {
        Dictionary<CultureInfo, int> levels = new(_cultures.Count);

        foreach (var item in _cultures)
        {
            var current = culture;
            int level = 0;
            while (item.Name != current.Name)
            {
                level++;
                current = current.Parent;
                if (current.Name == CultureInfo.InvariantCulture.Name)
                {
                    level = int.MaxValue;
                    break;
                }
            }

            levels[item] = level;
        }

        int v = int.MaxValue;
        foreach (var item in levels)
        {
            if (item.Value <= v)
            {
                v = item.Value;
                culture = item.Key;
            }
        }

        var name = GetResourceFileName(culture);

        var stream = MainAssembly.GetManifestResourceStream(name);

        return new(stream);
    }
}
```

但此时还是不够，这个源生成器会为 `Resource.zh-Hans.resx` 也生成一个代码，除非它的`WithCulture`元数据被设置为 `True`。

或者 `GenerateSource` 元数据的值为 `False` [^注意到]！

通过翻阅源代码得知 `GenerateSource` 也会影响源生成器是否生成代码。

于是 最终的项目文件变成了这样

```xml
<ItemGroup>
  <EmbeddedResource Update="Resources\Resource.resx" WithCulture="false" EmitFormatMethods="true" Public="true" GenerateSource="true"/>
  <EmbeddedResource Update="Resources\Resource.*.resx" WithCulture="false" GenerateSource="false"/>
  <PackageReference Include="Microsoft.CodeAnalysis.ResxSourceGenerator" Version="5.0.0-1.25277.114">
    <PrivateAssets>all</PrivateAssets>
    <IncludeAssets>runtime; build; native; contentfiles; analyzers</IncludeAssets>
  </PackageReference>
</ItemGroup>
```
