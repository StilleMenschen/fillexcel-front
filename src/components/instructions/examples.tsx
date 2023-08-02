import { Collapse, CollapseProps } from "antd";
import { useParams } from "react-router-dom";
import SingleColumnDataExample from "./single-column-data-example.tsx";
import CollectionColumnDataExample from "./collection-column-data-example.tsx";
import RelatedColumnDataExample from "./related-column-data-example.tsx";

const items: CollapseProps["items"] = [
    {
        key: "single",
        label: "简单填入的值",
        children: <SingleColumnDataExample />
    },
    {
        key: "collection",
        label: "自定义数据集填入的值",
        children: <CollectionColumnDataExample />
    },
    {
        key: "3",
        label: "有关联数据填入的值",
        children: <RelatedColumnDataExample />
    }
];

function Examples() {
    const { key } = useParams();
    return <Collapse className="instructions" accordion items={items} defaultActiveKey={[key || "1"]} />;
}

export default Examples;
