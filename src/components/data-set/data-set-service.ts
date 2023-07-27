import { AxiosResponse } from "axios";
import { ResultResponse, httpService } from "../../http";

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

export function getDataSetList(
    username: string,
    description: string,
    page: number,
    size: number
): Promise<ResultResponse<Array<DataSet>>> {
    return httpService.get("/fills/dataSet", { params: { username, description, page, size } });
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

export function deleteDataSet(id: number): Promise<AxiosResponse<DataSet>> {
    return httpService.delete(`/fills/dataSet/${id}`);
}
