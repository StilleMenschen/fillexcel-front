import { httpService } from "../../http";
import { AxiosResponse } from "axios";
import { User } from "../../store/define.ts";

export interface TokenResponse {
    access: string;
    refresh: string;
}

export interface BackendResultResponse<T> extends AxiosResponse {
    data: T;
}

export function fetchToken(username: string, password: string): Promise<BackendResultResponse<TokenResponse>> {
    return httpService.post("/auth/token", {
        username,
        password
    });
}

export function getUserInfo(username: string): Promise<BackendResultResponse<User>> {
    return httpService.get(`/user/${username}`);
}
