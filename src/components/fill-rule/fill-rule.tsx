import { useEffect, useState } from "react";
import { PaginationProps, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useUser } from "../../store/account.ts";
import { getRequirementList, Requirement } from "./fill-rule-service.ts";

// interface QueryFormValues {
//     remark: FormDataEntryValue | null;
//     original_filename: FormDataEntryValue | null;
// }

const columns: ColumnsType<Requirement> = [
    {
        title: "备注",
        dataIndex: "remark",
        key: "remark"
    },
    {
        title: "文件名",
        dataIndex: "original_filename",
        key: "original_filename"
    },
    {
        title: "起始行",
        dataIndex: "start_line",
        key: "start_line"
    },
    {
        title: "填充行数",
        dataIndex: "line_number",
        key: "line_number"
    },
    {
        title: "更新于",
        dataIndex: "updated_at",
        key: "updated_at"
    }
];

const showTotal: PaginationProps["showTotal"] = (total) => `总计 ${total}`;

function FillRule() {
    // 查询
    const { username } = useUser();
    // const [query, setQuery] = useState({ remark: "", original_filename: "" } as QueryFormValues);
    // 新增/编辑
    // const [openEdit, setOpenEdit] = useState(false);
    // 表格组件分页
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [totalElement, setTotalElement] = useState(0);
    const [requirementList, setRequirementList] = useState([] as Array<Requirement>);

    useEffect(() => {
        getRequirementList({ username }, pageNumber, pageSize)
            .then(({ data }) => {
                setRequirementList(data.data);
                setTotalElement(data.page.total);
            })
            .catch(() => null);
    }, [username, pageNumber, pageSize]);

    const onChange: PaginationProps["onChange"] = (number, size) => {
        // 如果分页数有变
        if (pageSize !== size) {
            setPageSize(size);
            setPageNumber(1);
        } else {
            setPageNumber(number);
        }
    };

    return (
        <>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={requirementList}
                pagination={{
                    current: pageNumber,
                    pageSize: pageSize,
                    pageSizeOptions: [8, 16],
                    showSizeChanger: true,
                    total: totalElement,
                    showTotal: showTotal,
                    onChange: onChange
                }}
            />
        </>
    );
}

export default FillRule;
