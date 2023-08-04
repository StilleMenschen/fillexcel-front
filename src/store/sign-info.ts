import { SignInfo } from "./define.ts";
import { useSyncExternalStore } from "react";
import { setAuthorization } from "../http";

/**
 * 登录状态相关的信息
 */
let signInfo: SignInfo = {
    prefix: "Bearer ",
    token: localStorage.getItem("authorization"),
    logged: true
};

let listeners: Array<CallableFunction> = [];

/**
 * 收集依赖
 * @param listener 从组件收集过来的依赖（无参数的回调函数）用于通知组件重新渲染
 */
const subscribe = (listener: CallableFunction) => {
    listeners = [...listeners, listener];
    return () => {
        listeners = listeners.filter((l) => l !== listener);
    };
};

const snapshot = () => {
    return signInfo;
};

/**
 * 通知组件重新渲染
 */
const emitChange = () => {
    for (const listener of listeners) {
        listener();
    }
};

export const getAuthorization = () => {
    if (signInfo.token) {
        // 拼接上 JWT 的前缀
        return signInfo.prefix + signInfo.token;
    } else {
        return null;
    }
};

export const setLogin = (token: string) => {
    signInfo = {
        ...signInfo,
        logged: true,
        token: token
    };
    setAuthorization(signInfo.prefix + token);
    // 缓存到客户端
    localStorage.setItem("authorization", token);
    emitChange();
};

/**
 * 退出登录
 */
export const setLogout = () => {
    if (!signInfo.logged) return;
    signInfo = {
        ...signInfo,
        logged: false,
        token: null
    };
    localStorage.removeItem("authorization");
    emitChange();
};

/**
 * 外部管理的登录状态，注意导出的状态必须是引用可变的，如果导出的是不可变引用的数据，
 * React 不会触发组件重新渲染
 */
export function useSignInfo() {
    return useSyncExternalStore(subscribe, snapshot);
}
