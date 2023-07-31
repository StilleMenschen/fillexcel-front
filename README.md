# fillexcel-front

## 介绍

Excel 填充前端

可通过规则配置如何将指定方法生成的或自定义数据写入到一个已上传的 Excel 文件中

## 依赖

- React
- React Router DOM
- Axios
- Ant Design
- Immer

安装依赖

```bash
yarn install
```

## 运行本地开发服务

运行以下命令等待片刻后访问`http://localhost:5173`

```bash
yarn dev
```

## 打包文件

```bash
yarn build
```

## 其它说明

加入了`@vitejs/plugin-legacy`参与打包以兼容旧的浏览器，但只会在不支持`ES module`的浏览器上运行