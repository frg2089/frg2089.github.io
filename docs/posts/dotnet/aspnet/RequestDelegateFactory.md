---
category:
  - .Net
  - ASP.Net
tag:
  - .Net
  - ASP.Net
---

# 像 MVC Controller 那样用 Minimal API

我写了一个源生成器，里面有一个至关重要的工具方法：

```csharp
private static global::Microsoft.AspNetCore.Builder.IEndpointConventionBuilder MapMethod
    <[global::System.Diagnostics.CodeAnalysis.DynamicallyAccessedMembers(global::System.Diagnostics.CodeAnalysis.DynamicallyAccessedMemberTypes.PublicMethods)] T>(
    this global::Microsoft.AspNetCore.Routing.IEndpointRouteBuilder endpoints,
    [global::System.Diagnostics.CodeAnalysis.StringSyntaxAttribute("Route")] string pattern,
    string httpMethod,
    string method)
    where T : notnull
{
    var methodInfo = typeof(T).GetMethod(method) ?? throw new InvalidProgramException();

    var request = global::Microsoft.AspNetCore.Http.RequestDelegateFactory.Create(
            methodInfo,
            context => context.RequestServices.GetRequiredService<T>());

    return endpoints
        .MapMethods(pattern, [httpMethod], request.RequestDelegate)
        .WithMetadata(methodInfo)
        .WithMetadata([.. request.EndpointMetadata]);
}
```

这里有一个至关重要的步骤，少了这一步将不会为API端点生成 OpenApi 文档：

```csharp
.WithMetadata(methodInfo)
```

OpenApi 文档是通过 MethodInfo 生成的，所以需要将 MethodInfo 添加到 EndpointMetadata 中。
