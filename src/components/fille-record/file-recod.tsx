import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FileRecordItem, getFileRecordList } from "./file-recod-service";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function FileRecordTable() {
    const [username, setUsername] = useState(null as string | null);
    const [rows, setRows] = useState([] as Array<FileRecordItem>);

    const fetchingData = () => {
        getFileRecordList(username)
            .then(({ data }) => {
                setRows(() => data.data);
            })
            .catch(() => null);
    };

    useEffect(() => {
        getFileRecordList(null)
            .then(({ data }) => {
                setRows(() => data.data);
            })
            .catch(() => null);
    }, [setRows]);

    return (
        <>
            <TextField id="standard-basic" label="用户名" variant="standard" onChange={(e) => setUsername(e.target.value)} />
            <Button variant="contained" onClick={fetchingData}>
                查询
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Dessert (100g serving)</TableCell>
                            <TableCell align="right">Calories</TableCell>
                            <TableCell align="right">Fat&nbsp;(g)</TableCell>
                            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                            <TableCell align="right">Protein&nbsp;(g)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    {row.requirement_id}
                                </TableCell>
                                <TableCell align="right">{row.username}</TableCell>
                                <TableCell align="right">{row.file_id}</TableCell>
                                <TableCell align="right">{row.filename}</TableCell>
                                <TableCell align="right">{row.created_at}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default FileRecordTable;
