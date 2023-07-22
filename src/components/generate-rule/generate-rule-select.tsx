import { Select } from "antd";
import { useCallback, useMemo, useRef, useState } from "react";
import { GenerateRule, getGenerateRuleList } from "./generate-rule-service.ts";
import { BaseOptionType } from "rc-select/lib/Select";

export interface GenerateRuleSelectProp {
    onChange: (value: GenerateRule) => void;
}

export interface GenerateRuleMap {
    [key: string]: GenerateRule;
}

const initGenerateRuleMap = (data: Array<GenerateRule>) => {
    const ruleMap: GenerateRuleMap = {};
    data.forEach((gr) => {
        ruleMap[gr.id] = gr;
    });
    return ruleMap;
};

function GenerateRuleSelect(props: GenerateRuleSelectProp) {
    const [generateRuleList, setGenerateRuleList] = useState<Array<GenerateRule>>([]);
    const ruleMap = useRef<GenerateRuleMap>({});

    const queryGenerateRule = useCallback(() => {
        getGenerateRuleList(1, 16)
            .then(({ data }) => {
                setGenerateRuleList(data.data);
                setTimeout(() => {
                    ruleMap.current = initGenerateRuleMap(data.data);
                }, 0);
            })
            .catch(() => null);
    }, [setGenerateRuleList]);

    useMemo(() => {
        queryGenerateRule();
    }, [queryGenerateRule]);

    return (
        <Select<number, BaseOptionType>
            onChange={(id) => {
                props.onChange(ruleMap.current[id]);
            }}
            options={generateRuleList.map((gr) => ({
                value: gr.id,
                label: gr.description
            }))}
        />
    );
}

export default GenerateRuleSelect;
