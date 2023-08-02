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

export function existsUsername(username: string): Promise<boolean> {
    return httpService.head("/users", { params: { username } }).then((response) => {
        const isExists = response.headers["user-exists"] || response.headers["USER-EXISTS"];
        return Promise.resolve(isExists == "TRUE");
    });
}

export function createUser(username: string, password: string): Promise<AxiosResponse> {
    return httpService.post("/users", {
        username,
        password
    });
}
