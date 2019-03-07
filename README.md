# Evergarden

代号Evergarden，朝着我们的理想前进！

[![Maintainability](https://api.codeclimate.com/v1/badges/581645e6b693fe4db519/maintainability)](https://codeclimate.com/github/dangoyears/evergarden-backend/maintainability)

## 配置

1. 安装依赖 `npm install`
2. 运行
    - 生产环境 `npm start`
    - 开发环境 `npm run dev`

## API

- `/list`
  - 例子 `/list?title=三国演义&sync=1`
  - 必选参数 `title`
  - 可选参数 `sync`
- `/book`
  - 例子 `/book?url=http://product.dangdang.com/102772.html`
  - 必选参数 `url`
