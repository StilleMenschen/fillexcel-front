import { ResultResponse, httpService } from "../../http";

export interface FileRecord {
    id: number;
    requirement_id: number;
    username: string;
    file_id: string;
    filename: string;
    created_at: string;
}

/**
 * 文件生成记录列表
 * @param username 用户名（数据隔离）
 * @param filename 文件名
 * @param page
 * @param size
 */
export function getFileRecordList(
    username: string | null,
    filename: string | null,
    page: number,
    size: number
): Promise<ResultResponse<Array<FileRecord>>> {
    return httpService.get("/fills/fileRecord", { params: { username, filename, page, size } });
}

/**
 * 下载已生成的记录文件
 * @param id
 */
export function downloadFile(id: number) {
    return httpService.get(`/fills/fileRecord/${id}`, { responseType: "blob" });
}

/**
 * 删除已生成的记录文件
 * @param id
 */
export function deleteFileRecord(id: number) {
    return httpService.delete(`/fills/fileRecord/${id}`);
}
