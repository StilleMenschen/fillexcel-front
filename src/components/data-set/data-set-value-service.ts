import { AxiosResponse } from "axios";
import { httpService, ResultResponse } from "../../http";

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

// 数据集列表

export function getDataSetValueList(
    data_set_id: number,
    page: number,
    size: number
): Promise<ResultResponse<Array<DataSetValue>>> {
    return httpService.get("/fills/dataSetValue", { params: { data_set_id, page, size } });
}

export function addDataSetValue(dataSetValue: AddOrUpdateDataSetValue): Promise<AxiosResponse> {
    return httpService.post("/fills/dataSetValue", dataSetValue);
}

export function getDataSetValue(id: number): Promise<AxiosResponse<DataSetValue>> {
    return httpService.get(`/fills/dataSetValue/${id}`);
}

export function updateDataSetValue(id: number, dataSetValue: AddOrUpdateDataSetValue): Promise<AxiosResponse> {
    return httpService.put(`/fills/dataSetValue/${id}`, dataSetValue);
}

export function deleteDataSetValue(id: number): Promise<AxiosResponse<unknown>> {
    return httpService.delete(`/fills/dataSetValue/${id}`);
}
