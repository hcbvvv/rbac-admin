# 样式规范文档

## 容器样式规范

### 主容器样式
```css
.mainContainer {
  padding: 24px;
  background-color: #f5f5f5;
}
```

### 卡片容器样式
```css
.cardContainer {
  height: calc(100vh - 96px);
  overflow: hidden;
}
```

### 卡片内容区域样式
```css
.cardBody {
  padding: 24px;
  height: calc(100vh - 100px);
  overflow: auto;
}
```

### 左右分栏布局样式
```css
.splitRow {
  height: calc(100vh - 144px);
}
```

### 左侧面板样式
```css
.leftPanel {
  height: 100%;
}
```

### 右侧面板样式
```css
.rightPanel {
  height: 100%;
}
```

### 左侧卡片样式
```css
.leftCard {
  height: calc(100vh - 96px);
  overflow: hidden;
}
```

### 左侧内容区域样式
```css
.leftCardBody {
  padding: 12px;
  height: calc(100vh - 100px);
  overflow: auto;
}
```

### 右侧卡片样式
```css
.rightCard {
  height: calc(100vh - 96px);
  overflow: hidden;
}
```

### 右侧内容区域样式
```css
.rightCardBody {
  padding: 24px;
  height: calc(100vh - 100px);
  overflow: auto;
}
```

## 表格和表单样式规范

### 表格容器样式
```css
.tableContainer {
  padding-bottom: 20px;
}
```

### 表单容器样式
```css
.formContainer {
  padding: 16px 0;
}
```

### 模态框内容区域样式
```css
.modalBody {
  max-height: 600px;
  overflow-y: auto;
}
```

### 标签页内容区域样式
```css
.tabContent {
  padding: 16px 0;
}
```

## 使用说明

1. 所有页面容器应使用统一的 padding 值：24px
2. 卡片高度应使用 `calc(100vh - Npx)` 计算，其中 N 根据页面结构确定
3. 内容区域应使用 `overflow: auto` 而不是 `overflow: scroll`，以避免不必要的滚动条显示
4. 表格容器底部应保留 20px 的 padding，以确保滚动时底部内容可见
5. 表单容器应使用 16px 的上下 padding
6. 模态框内容区域应设置最大高度并启用垂直滚动
7. 标签页内容区域应使用 16px 的上下 padding