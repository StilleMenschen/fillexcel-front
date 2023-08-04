import { AxiosResponse } from "axios";
import { httpService, ResultResponse } from "../../http";

// 数据集
export interface DataSet {
    id: number;
    username: string;
    description: string;
    data_type: string;
    created_at: string;
    updated_at: string;
}

export interface AddOrUpdateDataSet {
    id: number | null;
    username: string;
    description: string;
    data_type: string;
}

/**
 * 数据集
 * @param username 用户名
 * @param description 描述
 * @param data_type 不同的数据集类型（字典、字符串）
 * @param page
 * @param size
 */
export function getDataSetList(
    username: string,
    description: string,
    data_type: string | null,
    page: number,
    size: number
): Promise<ResultResponse<Array<DataSet>>> {
    return httpService.get("/fills/dataSet", { params: { username, description, data_type, page, size } });
}

export function addDataSet(dataSet: AddOrUpdateDataSet): Promise<AxiosResponse<DataSet>> {
    return httpService.post("/fills/dataSet", dataSet);
}

export function getDataSet(id: number): Promise<AxiosResponse<DataSet>> {
    return httpService.get(`/fills/dataSet/${id}`);
}

export function updateDataSet(id: number, dataSet: AddOrUpdateDataSet): Promise<AxiosResponse> {
    return httpService.put(`/fills/dataSet/${id}`, dataSet);
}

export function deleteDataSet(id: number): Promise<AxiosResponse<unknown>> {
    return httpService.delete(`/fills/dataSet/${id}`);
}
