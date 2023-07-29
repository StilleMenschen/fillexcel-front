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

// 数据集列表

export interface DataSetValue {
    id: number;
    data_set_id: number;
    item: string;
    data_type: string;
    created_at: string;
    updated_at: string;
}

export interface AddOrUpdateDataSetValue {
    data_set_id: number;
    item: string;
    data_type: string;
}

// 字典数据集

export interface DataSetDefine {
    id: number;
    data_set_id: number;
    name: string;
    data_type: string;
    created_at: string;
    updated_at: string;
}

export interface AddOrUpdateDataSetDefine {
    data_set_id: number;
    name: string;
    data_type: string;
}

// 数据集

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

export function updateDataSet(id: number, dataSet: AddOrUpdateDataSet): Promise<AxiosResponse<DataSet>> {
    return httpService.put(`/fills/dataSet/${id}`, dataSet);
}

export function deleteDataSet(id: number): Promise<AxiosResponse<unknown>> {
    return httpService.delete(`/fills/dataSet/${id}`);
}

// 数据集列表

export function getDataSetValueList(
    data_set_id: number,
    page: number,
    size: number
): Promise<ResultResponse<Array<DataSetValue>>> {
    return httpService.get("/fills/dataSetValue", { params: { data_set_id, page, size } });
}

export function addDataSetValue(dataSet: AddOrUpdateDataSetValue): Promise<AxiosResponse<DataSetValue>> {
    return httpService.post("/fills/dataSetValue", dataSet);
}

export function updateDataSetValue(id: number, dataSet: AddOrUpdateDataSetValue): Promise<AxiosResponse<DataSetValue>> {
    return httpService.put(`/fills/dataSetValue/${id}`, dataSet);
}

export function deleteDataSetValue(id: number): Promise<AxiosResponse<unknown>> {
    return httpService.delete(`/fills/dataSetValue/${id}`);
}

// 字典数据集定义

export function getDataSetDefineList(
    data_set_id: number,
    page: number,
    size: number
): Promise<ResultResponse<Array<DataSetDefine>>> {
    return httpService.get("/fills/dataSetDefine", { params: { data_set_id, page, size } });
}
