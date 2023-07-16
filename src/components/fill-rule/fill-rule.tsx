import { ChangeEvent, useEffect, useRef, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableEmpty from "../empty/table-empty.tsx";
import { getRequirementList, Requirement } from "./fill-rule-service.ts";
import { useUser } from "../../store/account.ts";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import FillRuleEdit from "./fill-rule-edit.tsx";

interface QueryFormValues {
    remark: FormDataEntryValue | null;
    original_filename: FormDataEntryValue | null;
}

function FillRule() {
    // 查询
    const { username } = useUser();
    const [query, setQuery] = useState({ remark: "", original_filename: "" } as QueryFormValues);
    const queryForm = useRef<HTMLFormElement>(null);
    // 新增/编辑
    const [openEdit, setOpenEdit] = useState(false);
    // 表格组件的分页从 0 开始
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(8);
    const [totalElement, setTotalElement] = useState(0);
    const [requirementList, setRequirementList] = useState([] as Array<Requirement>);

    useEffect(() => {
        getRequirementList(
            {
                username,
                ...query
            },
            page + 1,
            perPage
        )
            .then(({ data }) => {
                setRequirementList(data.data);
                setTotalElement(data.page.total);
            })
            .catch(() => null);
    }, [username, query, page, perPage]);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangePerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleQuery = () => {
        const f = queryForm.current as HTMLFormElement;
        const formData = new FormData(f);
        setQuery({
            remark: formData.get("remark"),
            original_filename: formData.get("originalFilename")
        });
        setPage(0);
    };

    const resetQuery = () => {
        queryForm.current?.reset();
    };

    return (
        <>
            <form ref={queryForm}>
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-end" spacing={0.8}>
                    <Grid item>
                        <TextField name="remark" size="small" variant="standard" label="备注" />
                    </Grid>
                    <Grid item>
                        <TextField name="originalFilename" size="small" variant="standard" label="文件名" />
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" onClick={handleQuery}>
                            查询
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" onClick={resetQuery}>
                            重置
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={() => setOpenEdit(true)}>
                            新增
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>备注</TableCell>
                        <TableCell>文件名</TableCell>
                        <TableCell>起始行</TableCell>
                        <TableCell>填入行数</TableCell>
                        <TableCell align="right">创建于</TableCell>
                        <TableCell align="right">更新于</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requirementList.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.remark}</TableCell>
                            <TableCell>{row.original_filename}</TableCell>
                            <TableCell>{row.start_line}</TableCell>
                            <TableCell>{row.line_number}</TableCell>
                            <TableCell align="right" sx={{ width: 140 }}>
                                {row.created_at}
                            </TableCell>
                            <TableCell align="right" sx={{ width: 140 }}>
                                {row.updated_at}
                            </TableCell>
                        </TableRow>
                    ))}
                    {totalElement == 0 && (
                        <TableRow>
                            <TableCell align="center" colSpan={6}>
                                <TableEmpty />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[8, 16]}
                            count={totalElement}
                            rowsPerPage={perPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangePerPage}
                            labelRowsPerPage={null}
                            showFirstButton={true}
                            showLastButton={true}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
            <FillRuleEdit openEdit={openEdit} setOpenEdit={setOpenEdit} handleQuery={handleQuery} />
        </>
    );
}

export default FillRule;
