import { SignInfo } from "./define.ts";
import { useSyncExternalStore } from "react";
import { setAuthorization } from "../http";

let signInfo: SignInfo = {
    prefix: "Bearer ",
    token: localStorage.getItem("authorization"),
    logged: true
};

let listeners: Array<CallableFunction> = [];

const subscribe = (listener: CallableFunction) => {
    listeners = [...listeners, listener];
    return () => {
        listeners = listeners.filter((l) => l !== listener);
    };
};

const snapshot = () => {
    return signInfo;
};

const emitChange = () => {
    for (const listener of listeners) {
        listener();
    }
};

export const getAuthorization = () => signInfo.prefix + (signInfo.token || "");

export const setLogin = (token: string) => {
    signInfo = {
        ...signInfo,
        logged: true,
        token: token
    };
    setAuthorization(signInfo.prefix + token);
    localStorage.setItem("authorization", token);
    emitChange();
};

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
