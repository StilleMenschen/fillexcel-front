import { ResultResponse, httpService } from "../../http";

interface DataSet {
    id: number;
    username: string;
    description: string;
    data_type: string;
    created_at: string;
    updated_at: string;
}

export function getDataSetList(username: string, page: number, size: number): Promise<ResultResponse<Array<DataSet>>> {
    return httpService.get("/fills/dataSet", { params: { username, page, size } });
}
