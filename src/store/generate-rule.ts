import { useSyncExternalStore } from "react";
import { getGenerateRuleList } from "../components/generate-rule/generate-rule-service.ts";

export interface GenerateRule {
    id: number;
    rule_name: string;
    function_name: string;
    fill_order: number;
    description: string;
    created_at?: string;
    updated_at?: string;
}

export interface GenerateRuleMap {
    [key: number]: GenerateRule;
}

/**
 * 单元格数据的生成规则
 */
let generateRule = {
    generateRuleMap: {} as GenerateRuleMap,
    generateRuleList: [] as Array<GenerateRule>
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
    return generateRule;
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
 * 将列表对象转为一个 ID 映射的 Map
 * @param generateRules 生成规则
 */
const initGenerateRuleMap = (generateRules: Array<GenerateRule>) => {
    const ruleMap: GenerateRuleMap = {};
    generateRules.forEach((gr) => {
        ruleMap[gr.id] = gr;
    });
    return ruleMap;
};

export async function fetchGenerateRule() {
    await getGenerateRuleList(1, 16)
        .then(({ data }) => {
            generateRule = {
                generateRuleList: data.data,
                generateRuleMap: initGenerateRuleMap(data.data)
            };
            emitChange();
        })
        .catch(() => null);
}

/**
 * 外部管理的生成规则，注意导出的状态必须是引用可变的，如果导出的是不可变引用的数据，
 * React 不会触发组件重新渲染
 */
export function useGenerateRuleMap() {
    return useSyncExternalStore(subscribe, snapshot);
}
