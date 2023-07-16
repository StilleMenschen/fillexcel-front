/*
import { uploadFile } from "./fill-rule-service.ts";
import { message } from "../../store/feedback.ts";
import { useUser } from "../../store/account.ts";

export interface EditProps {
    id?: number | null;
    openEdit: boolean;
    setOpenEdit: CallableFunction;
    handleQuery: CallableFunction;
}

const numberRegexp = new RegExp("/^[0-9]+$/g");

function FillRuleEdit(props: EditProps) {
    const { username } = useUser();
    const editForm = useRef<HTMLFormElement>(null);
    const inputFile = useRef<HTMLInputElement>(null);
    const [filename, setFilename] = useState<string | null>("");
    const fileId = useRef<string | null>(null);
    const handleClose = (_: unknown, reason: string) => {
        if (reason === "backdropClick") return;
        props.setOpenEdit(false);
        props.handleQuery();
    };

    const handelFileChange = () => {
        const files = inputFile.current?.files;
        if (files && files.length > 0) {
            setFilename(files[0].name);
        }
    };

    const onSubmit = () => {
        const form = editForm.current as HTMLFormElement;
        const formData = new FormData(form);
        const remark = formData.get("remark") as string;
        const startLine = formData.get("startLine") as string;
        const lineNumber = formData.get("lineNumber") as string;
        if (!startLine || !numberRegexp.test(startLine)) {
            message.error("行数必须为正整数");
            return;
        }
        if (!lineNumber || !numberRegexp.test(lineNumber)) {
            message.error("行数必须为正整数");
            return;
        }
        message.info(remark);
    };

    const onFileUpload = () => {
        const files = inputFile.current?.files;
        if (files && files.length > 0) {
            uploadFile(username, files[0])
                .then(({ data }) => {
                    fileId.current = data.fileId;
                    message.success(`上传文件成功: ${data.fileId}`);
                    onSubmit();
                })
                .catch(() => {
                    message.error("上传文件失败");
                });
        } else {
            message.error("请先选择Excel文件！");
        }
    };

    return (
        <Dialog open={props.openEdit} onClose={handleClose}>
            <DialogTitle>
                <Typography>新增填充规则</Typography>
                <IconButton
                    aria-label="close"
                    onClick={(e) => handleClose(e, "cancel")}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8
                    }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent
                sx={{
                    "& .MuiTextField-root, & .MuiGrid-root": {
                        marginTop: 1
                    }
                }}>
                <form ref={editForm}>
                    <TextField required name="remark" label="备注" fullWidth variant="standard" />
                    <TextField required name="startLine" label="起始行（整数）" fullWidth variant="standard" />
                    <TextField required name="lineNumber" label="填入行数（整数）" fullWidth variant="standard" />
                </form>
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-end" spacing={1}>
                    <Grid item>
                        <TextField sx={{ width: "26rem" }} value={filename} name="filename" variant="standard" />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="secondary" component="label">
                            选择文件
                            <input ref={inputFile} onChange={handelFileChange} required type="file" accept=".xlsx" hidden />
                        </Button>
                    </Grid>
                </Grid>
                <FormHelperText>仅支持.xlsx格式的Excel文件</FormHelperText>
            </DialogContent>
            <DialogActions>
                <Button onClick={(e) => handleClose(e, "cancel")}>取消</Button>
                <Button variant="contained" onClick={onFileUpload}>
                    确定
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FillRuleEdit;
*/
