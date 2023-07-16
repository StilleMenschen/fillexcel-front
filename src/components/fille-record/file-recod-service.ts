import { ResultResponse, httpService } from "../../http";

export interface FileRecordItem {
    id: number;
    requirement_id: number;
    username: string;
    file_id: string;
    filename: string;
    created_at: string;
}

export function getFileRecordList(username: string | null): Promise<ResultResponse<Array<FileRecordItem>>> {
    return httpService.get("/fills/fileRecord", { params: { username } });
}
