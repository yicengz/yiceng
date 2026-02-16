---
title: 数据仓库建设笔记
date: 2026-02-10
summary: 整理一些数据仓库建设中的经验和思考，从分层设计到数据质量管控。
category: 数仓随笔
source: 公众号
pinned: true
tags:
  - 数据工程
  - 数据仓库
---

## 前言

做了几年数据仓库，踩了不少坑，也积累了一些心得。趁着建站的契机，把这些零散的想法整理成文字。

## 分层设计

一个好的数据仓库，分层是基础：

| 层级 | 名称 | 职责 |
|------|------|------|
| ODS | 操作数据层 | 原始数据落地，保持与源系统一致 |
| DWD | 明细数据层 | 数据清洗、标准化、维度关联 |
| DWS | 汇总数据层 | 按主题域汇总，面向分析 |
| ADS | 应用数据层 | 面向具体业务场景 |

每一层都有自己的规范和边界，不能越层调用，不能跳层加工。

## 数据质量

数据质量是数据仓库的生命线。几个关键的检查维度：

- **完整性**：数据是否有缺失
- **一致性**：跨系统的数据是否对得上
- **及时性**：数据是否按时到达
- **准确性**：数据值是否正确

```python
# 一个简单的数据质量检查示例
def check_data_quality(df):
    issues = []

    # 检查空值比例
    null_ratio = df.isnull().sum() / len(df)
    high_null_cols = null_ratio[null_ratio > 0.1]
    if not high_null_cols.empty:
        issues.append(f"高空值列: {list(high_null_cols.index)}")

    # 检查重复
    dup_count = df.duplicated().sum()
    if dup_count > 0:
        issues.append(f"重复行数: {dup_count}")

    return issues
```

## 小结

数据仓库建设不是一蹴而就的事，需要在实践中不断迭代。最重要的是建立规范、保持一致性，让数据真正成为可信赖的资产。
