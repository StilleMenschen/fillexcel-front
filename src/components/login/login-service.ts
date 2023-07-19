import { httpService } from "../../http";
import { User } from "../../store/define.ts";
import { AxiosResponse } from "axios";

export interface TokenResponse {
    access: string;
    refresh: string;
}

export function fetchToken(username: string, password: string): Promise<AxiosResponse<TokenResponse>> {
    return httpService.post("/auth/token", {
        username,
        password
    });
}

export function getUserInfo(username: string): Promise<AxiosResponse<User>> {
    return httpService.get(`/user/${username}`);
}
