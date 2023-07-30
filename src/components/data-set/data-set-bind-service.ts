import { httpService, ResultResponse } from "../../http";
import { AxiosResponse } from "axios";

export interface DataSetBind {
    id: number;
    data_set_id: number;
    column_rule_id: number;
    column_name: string;
    data_name: string;
    created_at: string;
    updated_at: string;
}

export interface AddOrUpdateDataSetBind {
    data_set_id: number;
    column_rule_id: number;
    column_name: string;
    data_name: string;
}

export function getDataSetBindList(
    data_set_id: number,
    column_rule_id: number | null,
    column_name: string | null,
    page: number,
    size: number
): Promise<ResultResponse<Array<DataSetBind>>> {
    return httpService.get("/fills/dataSetBind", { params: { data_set_id, column_rule_id, column_name, page, size } });
}

export function addDataSetBind(dataSetBind: AddOrUpdateDataSetBind): Promise<AxiosResponse> {
    return httpService.post("/fills/dataSetBind", dataSetBind);
}
