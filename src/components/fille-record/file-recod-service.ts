import { ResultResponse, httpService } from "../../http";

export interface FileRecord {
    id: number;
    requirement_id: number;
    username: string;
    file_id: string;
    filename: string;
    created_at: string;
}

export function getFileRecordList(
    username: string | null,
    page: number,
    size: number
): Promise<ResultResponse<Array<FileRecord>>> {
    return httpService.get("/fills/fileRecord", { params: { username, page, size } });
}

export function downloadFile(id: number, filename: string) {
    return httpService.get(`/fills/fileRecord/${id}`, { responseType: "blob" }).then((response) => {
        // 创建一个url对象，指向响应数据
        const url = window.URL.createObjectURL(response.data);
        // 创建一个a标签，设置href为url对象，download为文件名称
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        // 触发a标签的点击事件，开始下载文件
        a.click();
        // 释放url对象
        window.URL.revokeObjectURL(url);
        return Promise.resolve();
    });
}
