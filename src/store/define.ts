// 登录信息
export interface SignInfo {
    prefix: string;
    token: string | null;
    logged: boolean;
}

// 用户信息
export interface User {
    id: number;
    username: string;
    email: string;
    date_joined: string;
}

export const DATA_TYPE = new Map<string, string>([
    ["string", "字符串"],
    ["number", "数值"],
    ["boolean", "布尔值"],
    ["dict", "字典"]
]);
