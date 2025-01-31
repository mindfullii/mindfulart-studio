# 数据库连接问题解决记录 - 2024年1月29日

## 问题描述

最初遇到的问题是无法连接到 Supabase 数据库，具体表现为：
- Prisma 报错：无法连接到数据库服务器
- Google 登录后无法正常工作
- Explore 页面无法显示内容

## 解决过程

### 1. 数据库连接配置

最终使用的正确配置：
```
DATABASE_URL=postgresql://postgres:[password]@db.njlqpkmyibsibchyogjz.supabase.co:5432/postgres?ssl=true&sslmode=require
```

关键点：
- 使用端口 5432（直接连接）而不是 6543（pgbouncer）
- 添加 SSL 配置参数
- 保持配置简单稳定

### 2. 重要发现

1. 看似配置问题实际可能是临时的连接问题
2. 系统重启可能解决一些看似复杂的问题
3. 不要过早改动配置，先检查基本问题

### 3. 处理步骤

遇到连接问题时的推荐步骤：
1. 检查是否是临时网络问题
2. 尝试重启应用或系统
3. 如果问题持续，再考虑检查配置

### 4. 模型关系修复

1. 确保 User、Account 和 Session 模型之间的关系正确
2. 添加 ExploreArtwork 模型的相关作品关联
3. 正确配置了 relatedTo 和 relatedFrom 关系

## 结论

1. 数据库连接问题可能有多个原因：
   - 网络连接问题
   - 配置问题
   - 服务器可用性

2. 解决方案应该从简单到复杂：
   - 先尝试重启
   - 检查网络连接
   - 最后才考虑修改配置

3. 保持配置的简单性和一致性很重要

## 注意事项

1. 保存这个配置作为参考
2. 遇到问题时先尝试最简单的解决方案
3. 不要急于修改已经工作的配置

## 相关代码片段

### schema.prisma 中的关键模型定义

```prisma
model User {
  id            String          @id @default(cuid())
  accounts      Account[]
  sessions      Session[]
  // ... 其他字段
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  // ... 其他字段
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  // ... 其他字段
}

model ExploreArtwork {
  // ... 其他字段
  relatedTo        ExploreArtwork[] @relation("RelatedArtworks")
  relatedFrom      ExploreArtwork[] @relation("RelatedArtworks")
}
``` 