import { ResultResponse, httpService } from "../../http";

export interface DataSet {
    id: number;
    username: string;
    description: string;
    data_type: string;
    created_at: string;
    updated_at: string;
}

export function getDataSetList(
    username: string,
    description: string,
    page: number,
    size: number
): Promise<ResultResponse<Array<DataSet>>> {
    return httpService.get("/fills/dataSet", { params: { username, description, page, size } });
}
