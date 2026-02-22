---
category:
  - .Net
tag:
  - .Net
---

> [!IMPORTANT]
> 本章内容由 AI 生成，可靠性未经过验证，欢迎提交 PR 进行修正。

偶尔也得发点文章不至于真让博客长草

# .Net 中的锁

|     .Net 对象名      | 阻塞方式 | Convoys 安全 | 异步支持 | 用途                                                                  |
| :------------------: | :------: | :----------: | :------: | :-------------------------------------------------------------------- |
|     Interlocked      |   原子   |      ✅      |    ❌    | 无锁原子操作（最佳轻量互斥替代）                                      |
|    SemaphoreSlim     |   混合   |      ⚠️      |    ✅    | async 互斥/限流首选                                                   |
|         Lock         |   混合   |      ⚠️      |    ❌    | 现代高性能同步锁                                                      |
|       Monitor        |   混合   |      ❌      |    ❌    | 经典 lock 实现                                                        |
| ReaderWriterLockSlim |   混合   |      ⚠️      |    ❌    | 读多写少场景                                                          |
|       SpinLock       |   自旋   |      ✅      |    ❌    | 极短临界区（专家使用）                                                |
|        Mutex         |   内核   |      ❌      |    ❌    | 跨进程互斥                                                            |
|      Semaphore       |   内核   |      ❌      |    ❌    | 跨进程限流                                                            |
|   ReaderWriterLock   |   内核   |      ❌      |    ❌    | 旧版读写锁（不推荐）                                                  |
| ManualResetEventSlim |   混合   |      ✅      |    ❌    | 线程信号（非互斥）                                                    |
|    CountdownEvent    |   内核   |      ✅      |    ❌    | 汇合（非互斥）                                                        |
|       Barrier        |   内核   |      ✅      |    ❌    | 阶段同步（非互斥）                                                    |
|   EventWaitHandle    |   内核   |      ✅      |    ❌    | 信号原语（非互斥）                                                    |
|    AutoResetEvent    |   内核   |      ✅      |    ❌    | 单线程唤醒（非互斥）                                                  |
|   ManualResetEvent   |   内核   |      ✅      |    ❌    | 广播信号（非互斥）                                                    |
|       Channel        | 异步挂起 |      ✅      |    ✅    | System.Threading.Channels.Channel&lt;T&gt;<br/>数据流模型（避免共享） |
| TaskCompletionSource | 异步完成 |      ✅      |    ✅    | System.Threading.Tasks.TaskCompletionSource<br/>异步通知（非互斥）    |

Convoys 安全:

- ✅ = 基本不会形成典型线程 convoy
- ❌ = 高竞争下容易出现排队放大效应
- ⚠️ = 风险存在但机制有缓解（自旋/优化实现）

## 核心锁机制详解

### 1. Interlocked - 无锁原子操作

`Interlocked` 提供了无需显式锁的原子操作,是性能最好的轻量级同步机制。

```csharp
// 原子递增
int counter = 0;
Interlocked.Increment(ref counter);

// 原子比较并交换
int original = 10;
int newValue = 20;
Interlocked.CompareExchange(ref original, newValue, 10);

// 原子读取（确保获取最新值）
long value = Interlocked.Read(ref longValue);
```

**适用场景**: 简单计数器、状态标志、引用替换等单一变量操作。

---

### 2. SemaphoreSlim - 异步锁首选

.NET 9 引入了新的 `SemaphoreSlim` API,提供了更简洁的异步锁用法:

```csharp
// .NET 9 新语法
await using (await semaphore.EnterAsync())
{
    // 临界区代码
}

// 传统用法
await semaphore.WaitAsync();
try
{
    // 临界区代码
}
finally
{
    semaphore.Release();
}
```

**适用场景**: 异步代码中的互斥访问、连接池限流。

---

### 3. Lock - 现代高性能同步锁

从 .NET 9 开始,可以使用新的 `Lock` 类型替代传统的 `lock` 语句:

```csharp
// .NET 9 新方式
Lock lockObj = new Lock();

lock (lockObj)
{
    // 临界区代码
}

// 配合使用 Lock.EnterScope API
using (lockObj.EnterScope())
{
    // 临界区代码
}
```

相比传统 `Monitor`,新的 `Lock` 类型:

- 性能更好,延迟更低
- 更好的调试体验
- 避免死锁检测开销

**适用场景**: 高频同步操作、高性能多线程场景。

---

### 4. Monitor - 经典 lock 实现

传统的 `lock` 语句实际上是 `Monitor` 的语法糖:

```csharp
// lock 语句
private readonly object _lockObj = new object();

lock (_lockObj)
{
    // 临界区代码
}

// 等价于 Monitor
Monitor.Enter(_lockObj);
try
{
    // 临界区代码
}
finally
{
    Monitor.Exit(_lockObj);
}
```

**适用场景**: 通用同步场景。

---

### 5. ReaderWriterLockSlim - 读写分离锁

适用于读多写少的场景,允许多个读者同时访问,但写者独占:

```csharp
private readonly ReaderWriterLockSlim _rwLock = new ReaderWriterLockSlim();

// 读锁（共享）
_rwLock.EnterReadLock();
try
{
    // 读取数据
}
finally
{
    _rwLock.ExitReadLock();
}

// 写锁（独占）
_rwLock.EnterWriteLock();
try
{
    // 修改数据
}
finally
{
    _rwLock.ExitWriteLock();
}
```

**适用场景**: 缓存读取、配置管理等读多写少场景。

---

### 6. SpinLock - 自旋锁

对于极短的临界区,自旋等待可能比线程切换更高效:

```csharp
private SpinLock _spinLock = new SpinLock();

bool lockTaken = false;
try
{
    _spinLock.Enter(ref lockTaken);
    // 临界区代码（必须非常短）
}
finally
{
    if (lockTaken)
        _spinLock.Exit();
}
```

**⚠️ 注意**: 仅在临界区执行时间极短(几十个 CPU 周期)时使用,否则会造成 CPU 浪费。

---

### 7. Channel - 异步消息传递

推荐使用 Channel 替代共享锁,通过消息传递避免共享状态:

```csharp
// 创建 Channel
var channel = Channel.CreateUnbounded<string>();

// 生产者
await channel.Writer.WriteAsync("message");

// 消费者
await foreach (var msg in channel.Reader.ReadAllAsync())
{
    // 处理消息
}
```

**适用场景**: 生产者-消费者模式、异步流水线、避免共享状态。

---

## 选择指南

### 根据场景选择合适的锁

| 场景            | 推荐方案                        |
| --------------- | ------------------------------- |
| 简单计数器/标志 | `Interlocked`                   |
| 异步代码互斥    | `SemaphoreSlim` (.NET 9 新 API) |
| 高频同步操作    | `Lock` (.NET 9+)                |
| 通用同步        | `lock` (Monitor)                |
| 读多写少        | `ReaderWriterLockSlim`          |
| 极短临界区      | `SpinLock` (谨慎使用)           |
| 跨进程同步      | `Mutex` / `Semaphore`           |
| 避免共享状态    | `Channel`                       |

---

## 最佳实践

1. **锁对象应为 `readonly`**: 避免被意外修改

   ```csharp
   private readonly object _lockObj = new object();
   ```

2. **锁粒度要小**: 只保护必要的临界区代码

3. **避免死锁**:
   - 按固定顺序获取多个锁
   - 使用 `Monitor.TryEnter` 设置超时
   - 考虑使用 `Channel` 避免锁

4. **优先考虑无锁方案**:
   - 使用 `Interlocked` 处理简单原子操作
   - 使用 `Channel` 实现消息传递
   - 使用不可变数据结构

5. **异步代码使用异步锁**:

   ```csharp
   // ❌ 错误：在异步代码中使用同步锁
   lock (_lockObj)
   {
       await SomeAsync(); // 会导致死锁风险
   }

   // ✅ 正确：使用异步锁
   await using (await _semaphore.EnterAsync())
   {
       await SomeAsync();
   }
   ```

---

## 性能考虑

- **锁竞争程度**: 低竞争下性能差异不大,高竞争时需要优化
- **临界区长度**: 临界区越短,自旋锁越有优势
- **线程数**: 线程数过多会加剧锁竞争,考虑使用线程池或 async/await
- **上下文切换**: 内核级锁(Mutex/Semaphore)切换成本高,谨慎使用

---

## 总结

.NET 提供了丰富的同步原语,选择合适的锁机制对于多线程程序的性能和正确性至关重要。现代 .NET (尤其是 .NET 9+) 提供了更简洁、高效的 API,推荐优先使用新的 `Lock` 类型和改进的 `SemaphoreSlim` API。同时,尽可能考虑无锁方案和消息传递模式,从根本上避免同步问题。
