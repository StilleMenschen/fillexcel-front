// 提示框样式
export enum SeverityEnum {
    SUCCESS = "success",
    INFO = "info",
    WARNING = "warning",
    ERROR = "error"
}

// 提示框消息
export interface Message {
    open: boolean;
    severity: SeverityEnum;
    message: string;
}

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
