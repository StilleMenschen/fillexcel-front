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
