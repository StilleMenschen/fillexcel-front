import { AxiosResponse } from "axios";
import { httpService, ResultResponse } from "../../http";

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

// 字典数据集定义

export function getDataSetDefineList(
    data_set_id: number,
    page: number,
    size: number
): Promise<ResultResponse<Array<DataSetDefine>>> {
    return httpService.get("/fills/dataSetDefine", { params: { data_set_id, page, size } });
}

export function addDataSetDefine(dataSetDefines: Array<AddOrUpdateDataSetDefine>): Promise<AxiosResponse> {
    return httpService.post("/fills/dataSetDefine", dataSetDefines);
}
