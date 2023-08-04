import { useSyncExternalStore } from "react";

/**
 * 导航，与 UI 框架的导航相关联
 */
let navigationName = "Home";

export const paths = new Map([
    ["Home", "/"],
    ["fillRule", "/fillRule"],
    ["dataSet", "/dataSet"],
    ["fileRecord", "/fileRecord"]
]);

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
    return navigationName;
};

/**
 * 通知组件重新渲染
 */
const emitChange = () => {
    for (const listener of listeners) {
        listener();
    }
};

/**
 * 设置导航
 * @param newName 导航位置
 */
export const setNavBar = (newName: string) => {
    navigationName = newName;
    emitChange();
};

/**
 * 外部管理的导航状态，注意导出的状态必须是引用可变的，如果导出的是不可变引用的数据，
 * React 不会触发组件重新渲染
 */
export function useNavBar() {
    return useSyncExternalStore(subscribe, snapshot);
}
