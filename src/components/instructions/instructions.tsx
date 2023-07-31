import { Card, Space } from "antd";
import { Link } from "react-router-dom";
import "./instructions.css";

export default function Instructions() {
    return (
        <Space className="instructions" size="middle" align="start" wrap>
            <Card title="填充规则" extra={<Link to="/fillRule">开始配置</Link>} style={{ width: "32rem" }} hoverable>
                <strong>配置写入数据到 Excel 文件的规则</strong>
                <ul className="list">
                    <li className="list-item">
                        上传一个<code style={{ color: "greenyellow" }}>.xlsx</code>格式的 Excel 文件作为参考
                    </li>
                    <li className="list-item">可为每个单元格列指定一个规则，如列”A“指定填入一个随机的数值</li>
                    <li className="list-item">可配置从第 N 行开始填入 M 行为止</li>
                    <li className="list-item">
                        可配置关联其它填入数值的计算表达式，如计算列”A“和”C“相乘后加42的值：{"{A} * {B} + 42"}
                    </li>
                    <li className="list-item">可配置关联一个自定义的数据集，一组对象或一组字词</li>
                </ul>
            </Card>
            <Card title="数据集" extra={<Link to="/dataSet">定义数据</Link>} style={{ width: "32rem" }} hoverable>
                <strong>自定义填入单元格的数据</strong>
                <ul className="list">
                    <li className="list-item">可配置简单的字词数组（字符串），如一组动物名称：蛇、蝎、虎、豹、鹿</li>
                    <li className="list-item">
                        可配置自定义字段属性对象数组（字典），如一组星球观测数据：
                        <p>{`{"mass": 158.54, "radius": 45, "temperature": "135°C"}`}</p>
                        <p>{`{"mass": 851.21, "radius": 78, "temperature": "-227°C"}`}</p>
                        <p>{`{"mass": 581, "radius": 42.254, "temperature": "318°C"}`}</p>
                    </li>
                </ul>
            </Card>
            <Card title="生成记录" extra={<Link to="/fileRecord">下载文件</Link>} style={{ width: "32rem" }} hoverable>
                <strong>下载已经生成的文件</strong>
                <ul className="list">
                    <li className="list-item">下载异步生成的 Excel 文件</li>
                </ul>
            </Card>
        </Space>
    );
}
