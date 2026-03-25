# 可视化工具集 🎯

数据结构可视化教学工具，用 Google AI Studio 生成。

## 项目列表

- [顺序表可视化](seq-list/) — 顺序表的插入、删除、查找操作动画演示

## 使用方式

每个文件夹是一个独立的可视化项目，push 到 main 分支后 GitHub Actions 自动 build 并部署到 GitHub Pages。

站点地址：https://nuome6.github.io/visualizations/

## 如何添加新项目

1. 在 Google AI Studio 生成可视化代码
2. 在仓库根目录创建新文件夹（如 `link-list/`）
3. 把代码放进去
4. 在 `.github/workflows/deploy.yml` 的 build 步骤里加上新项目
5. Push 到 main → 自动部署 ✅
6. 更新本 README 的项目列表
