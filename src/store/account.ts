import { User } from "./define.ts";
import { useSyncExternalStore } from "react";
import { getUserInfo } from "../components/login/login-service.ts";
import { setLogout } from "./sign-info.ts";
import { message } from "antd";

let user: User = {
    id: -1,
    username: "Anonymous",
    email: "",
    date_joined: ""
};

let username = localStorage.getItem("username");

let listeners: Array<CallableFunction> = [];

const subscribe = (listener: CallableFunction) => {
    listeners = [...listeners, listener];
    return () => {
        listeners = listeners.filter((l) => l !== listener);
    };
};

const snapshot = () => {
    return user;
};

const emitChange = () => {
    for (const listener of listeners) {
        listener();
    }
};

export const fetchUser = (name: string | null) => {
    username = name || username;
    if (username) {
        getUserInfo(username)
            .then(({ data }) => {
                setUser(data);
            })
            .catch(() => null);
    } else {
        message.warning("登录失效，请重新登录");
        setLogout();
    }
};

export const setUser = (data: User) => {
    user = { ...data };
    username = data.username;
    localStorage.setItem("username", username);
    emitChange();
};

/**
 * 外部管理的用户数据状态，注意导出的状态必须是引用可变的，如果导出的是不可变引用的数据，
 * React 不会触发组件重新渲染
 */
export function useUser() {
    return useSyncExternalStore(subscribe, snapshot);
}
