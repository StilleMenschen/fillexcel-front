import { httpService, ResultResponse } from "../../http";
import { AxiosResponse } from "axios";

export interface Requirement {
    id: number | null;
    username: string;
    remark: string | null;
    file_id: string;
    original_filename: string;
    start_line: number;
    line_number: number;
    created_at: string | null;
    updated_at: string | null;
}

export interface QueryRequirement {
    username: string;
    remark?: FormDataEntryValue | null;
    original_filename?: FormDataEntryValue | null;
}

export interface FileResult {
    fileId: string;
    createdAt: string;
}

export function getRequirementList(
    q: QueryRequirement,
    page: number,
    size: number
): Promise<ResultResponse<Array<Requirement>>> {
    return httpService.get("/fills/requirement", { params: { ...q, page, size } });
}

export function addRequirement(req: Requirement): Promise<ResultResponse<Requirement>> {
    return httpService.post("/fills/requirement", req);
}

export function getRequirement(id: number): Promise<ResultResponse<Array<Requirement>>> {
    return httpService.get(`/fills/requirement/${id}`);
}

export function updateRequirement(id: number, req: Requirement): Promise<ResultResponse<Requirement>> {
    return httpService.put(`/fills/requirement/${id}`, req);
}

export function deleteRequirement(id: number): Promise<unknown> {
    return httpService.delete(`/fills/requirement/${id}`);
}

export function uploadFile(username: string, file: File): Promise<AxiosResponse<FileResult>> {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("file", file);
    return httpService.post("/fills/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}
