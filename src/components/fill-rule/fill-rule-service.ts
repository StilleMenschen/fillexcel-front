import { httpService, ResultResponse } from "../../http";
import { AxiosResponse } from "axios";

export interface Requirement {
    id: number;
    username: string;
    remark: string | null;
    file_id: string;
    original_filename: string;
    start_line: number;
    line_number: number;
    created_at: string | null;
    updated_at: string | null;
}

export interface AddOrUpdateRequirement {
    username: string;
    remark: string | null;
    file_id: string;
    original_filename: string;
    start_line: number;
    line_number: number;
}

export interface RequirementQueryParams {
    // 用户名
    username: string;
    // 备注
    remark?: string | null;
    // 原文件名
    original_filename?: string | null;
}

export interface FileResult {
    fileId: string;
    createdAt: string;
}

export interface GenerateFileResult {
    fileId: string;
    took: number;
}

/**
 * 填充要求列表
 * @param queryParams
 * @param page
 * @param size
 */
export function getRequirementList(
    queryParams: RequirementQueryParams,
    page: number,
    size: number
): Promise<ResultResponse<Array<Requirement>>> {
    return httpService.get("/fills/requirement", { params: { ...queryParams, page, size } });
}

/**
 * 添加填充要求
 * @param req
 */
export function addRequirement(req: AddOrUpdateRequirement): Promise<AxiosResponse<Requirement>> {
    return httpService.post("/fills/requirement", req);
}

export function getRequirement(id: number): Promise<AxiosResponse<Requirement>> {
    return httpService.get(`/fills/requirement/${id}`);
}

export function updateRequirement(id: number, req: AddOrUpdateRequirement): Promise<AxiosResponse<Requirement>> {
    return httpService.put(`/fills/requirement/${id}`, req);
}

export function deleteRequirement(id: number) {
    return httpService.delete(`/fills/requirement/${id}`);
}

/**
 * 上传填充要求的参考文件，生成的文件基于此文件来填入数据
 * @param username 用户名
 * @param file
 */
export function uploadRequirementFile(username: string, file: File): Promise<AxiosResponse<FileResult>> {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("file", file);
    return httpService.post("/fills/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

/**
 * 按规则生成文件
 * @param id
 */
export function generateFile(id: number): Promise<AxiosResponse<GenerateFileResult>> {
    return httpService.post(`/fills/${id}`);
}
