import { Collapse, CollapseProps } from "antd";
import SingleColumnDataExample from "./single-column-data-example.tsx";

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items: CollapseProps["items"] = [
    {
        key: "1",
        label: "简单填入的值",
        children: <SingleColumnDataExample />
    },
    {
        key: "2",
        label: "自定义数据集填入的值",
        children: <p>{text}</p>
    },
    {
        key: "3",
        label: "有关联数据填入的值",
        children: <p>{text}</p>
    }
];

function Examples() {
    return <Collapse className="instructions" accordion items={items} defaultActiveKey={["1"]} />;
}

export default Examples;
