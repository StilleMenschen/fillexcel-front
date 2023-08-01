# fillexcel-front

## 介绍

填充二维数组数据到 Excel 中，可以自定义每个单元格列的填充规则，支持的规则如下

- 固定字符串
- 指定范围的随机数
- 日期时间组成的字符串（带有序号）
- 表达式计算
- 拼接多个列的为一个字符串
- 指定的字符串数组
- 指定的对象字典数组

### 表达式计算

可以计算多个数值单元格的数据，如

```
{A} * {B} + {C} - 5
```

### 拼接多个列的为一个字符串

指定一个连接的字符，如以字符“-”按指定的顺序拼接“A,E,C,E”四个单元格的值

### 指定的字符串数组

按顺序循环填入简单的字符串数组，如一组动物名称：蛇、蝎、虎、豹、鹿

### 指定的对象字典数组

按顺序循环填入自定义字典象数组，如一组星球观测数据：

{"mass": 158.54, "radius": 45, "temperature": "135°C"}、
{"mass": 851.21, "radius": 78, "temperature": "-227°C"}、
{"mass": 581, "radius": 42.254, "temperature": "318°C"}

另外，自定义字段属性对象数组还需要配置绑定，如参考上面的定义，
将 mass 绑定到单元格列 A，将 radius 绑定到单元格列 B

> 这只是前端项目，对应的后端为 [fillexcel](https://gitee.com/stillemenschen/fillexcel)

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