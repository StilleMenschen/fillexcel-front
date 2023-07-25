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
    filename: string | null,
    page: number,
    size: number
): Promise<ResultResponse<Array<FileRecord>>> {
    return httpService.get("/fills/fileRecord", { params: { username, filename, page, size } });
}

export function downloadFile(id: number) {
    return httpService.get(`/fills/fileRecord/${id}`, { responseType: "blob" });
}

export function deleteFileRecord(id: number) {
    return httpService.delete(`/fills/fileRecord/${id}`);
}
