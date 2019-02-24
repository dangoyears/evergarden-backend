# Evergarden

代号Evergarden，朝着我们的理想前进！

## 安装

```sh
npm install
```

## 运行

```sh
npm start
```

开发环境

```sh
npm run dev
```

## API

### 获取书籍信息

- `/book/?title=pro-git`

```js
{
    {
        name: string,                                     // 商品的全名
        imageUrl: string,                    // 商品图片
        [
            appName: string,             // 商品所在的app名称
            logoUrl: string,                 // app的logo
            mall: string，                             // app内具体的店铺名称
            price: number,              // 价格
            url: string                    // 跳转链接（打开第三方应用）
        ],
        detail: string,                 // 商品详情（如果可以爬到的话）
        comments： {                     // 评论数据（可以考虑添加的模块）
            username：string，      // 评论用户的昵称
            text： string，              // 评论内容
            time： string             // 评论时间  
        }
    }
}
```
