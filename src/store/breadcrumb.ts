import { useSyncExternalStore } from "react";

interface BreadcrumbItem {
    path: string;
    title: string;
    link: boolean;
}

interface BreadcrumbMap {
    [key: string]: Array<BreadcrumbItem>;
}

const breadcrumbMap: BreadcrumbMap = {
    fillRule: [],
    dataSet: []
};

let currentLevel = 1;

let listeners: Array<CallableFunction> = [];

const subscribe = (listener: CallableFunction) => {
    listeners = [...listeners, listener];
    return () => {
        listeners = listeners.filter((l) => l !== listener);
    };
};

const snapshot = () => {
    return breadcrumbMap;
};

const emitChange = () => {
    for (const listener of listeners) {
        listener();
    }
};

export const setBreadcrumb = (key: string, level: number, path: string, title: string) => {
    const breadcrumbList = breadcrumbMap[key] || [];
    console.log(`current: ${currentLevel}, next: ${level}`);
    console.dir(breadcrumbList);
    // 如果是第一个路由
    if (level == 1) {
        breadcrumbMap[key] = [
            {
                path,
                title,
                link: false
            }
        ];
        currentLevel = 1;
        return;
    }
    const index = level - 1;
    if (level > currentLevel) {
        breadcrumbList.push({
            path,
            title,
            link: false
        });
        breadcrumbList[index - 1].link = true;
        currentLevel += 1;
    } else if (level <= currentLevel) {
        breadcrumbList.splice(-1 * currentLevel - level);
    } else {
        breadcrumbList[index].link = false;
    }
    emitChange();
};

/**
 * 外部管理的面包屑状态，注意导出的状态必须是引用可变的，如果导出的是不可变引用的数据，
 * React 不会触发组件重新渲染
 */
export function useBreadcrumb() {
    return useSyncExternalStore(subscribe, snapshot);
}
