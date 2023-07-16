import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

function TableEmpty() {
    return (
        <>
            <Avatar
                sx={{ margin: "1rem auto 0.36rem", width: 64, height: 64, filter: "opacity(0.36)" }}
                alt="empty"
                src="/vite.svg"
            />
            <Typography>数据为空</Typography>
        </>
    );
}

export default TableEmpty;
