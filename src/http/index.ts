import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getAuthorization, setLogout } from "../store/sign-info.ts";
import { message } from "../store/feedback.ts";

export interface Pager {
    number: number;
    totalPage: number;
    total: number;
    hasPrevious: boolean;
    hasNext: boolean;
}

export interface BackendResult<T> {
    data: T;
    message: string | null;
    page: Pager;
}

export interface ResultResponse<T> extends AxiosResponse {
    data: BackendResult<T>;
}

interface PreRequest extends InternalAxiosRequestConfig {
    headers: AxiosRequestHeaders;
    params?: object;
}

interface Errors {
    request: AxiosRequestConfig | null;
    response: AxiosResponse<BackendResult<object>> | null;
    message: string | null;
}

export const httpService = axios.create({
    baseURL: "/api",
    timeout: 30000
});

export const setAuthorization = (authorization: string) => {
    httpService.defaults.headers.common["Authorization"] = authorization;
};

setAuthorization(getAuthorization());

// 添加请求拦截器
httpService.interceptors.request.use(
    (config: PreRequest) => {
        // 在发送请求之前做些什么
        config.params = { ...config.params, t: Date.now() };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
httpService.interceptors.response.use(
    (response) => {
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        return response;
    },
    (error: Errors) => {
        if (error.response) {
            // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);
            const response = error.response;
            if (response.status) {
                if ([401, 403].indexOf(response.status) !== -1) {
                    setLogout();
                    debugger;
                    if (response.config.url?.indexOf("/auth/token") === -1) {
                        message.warning("登录失效，请重新登录");
                    }
                } else {
                    message.error("后端服务访问异常");
                }
            }
        } else if (error.request) {
            // 请求已经成功发起，但没有收到响应
            // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
            // 而在node.js中是 http.ClientRequest 的实例
            console.error(error.request);
        } else {
            // 发送请求时出了点问题
            console.error("Error", error.message);
        }
        return Promise.reject(error);
    }
);
