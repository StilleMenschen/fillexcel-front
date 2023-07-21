import { Breadcrumb } from "antd";
import { Link, useParams } from "react-router-dom";

function ColumnRuleAdd() {
    const { ruleId } = useParams();

    return (
        <>
            <Breadcrumb
                items={[
                    { title: <Link to="/fillRule">填充规则</Link> },
                    { title: <Link to={`/fillRule/${ruleId}`}>列规则</Link> },
                    { title: "新增" }
                ]}
            />
            <div className="little-space"></div>
            <p>下面是新增的表单</p>
        </>
    );
}

export default ColumnRuleAdd;
