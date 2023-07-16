import { useSyncExternalStore } from "react";

let navigationName = "Home";

let listeners: Array<CallableFunction> = [];

const subscribe = (listener: CallableFunction) => {
    listeners = [...listeners, listener];
    return () => {
        listeners = listeners.filter((l) => l !== listener);
    };
};

const snapshot = () => {
    return navigationName;
};

const emitChange = () => {
    for (const listener of listeners) {
        listener();
    }
};

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
