import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import { useBreadcrumb } from "../../store/breadcrumb";

function ColumnRuleAdd() {
    const breadcrumbMap = useBreadcrumb();

    return (
        <>
            <Breadcrumb
                items={breadcrumbMap.fillRule.map((b) => {
                    if (b.link) return { title: <Link to={b.path}>{b.title}</Link> };
                    else return { title: <span>{b.title}</span> };
                })}
            />
            <div className="little-space"></div>
            <p>下面是新增的表单</p>
        </>
    );
}

export default ColumnRuleAdd;
