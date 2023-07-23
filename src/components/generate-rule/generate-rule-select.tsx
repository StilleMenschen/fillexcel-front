import { Select } from "antd";
import { useEffect, useState } from "react";
import { GenerateRule, getGenerateRuleList } from "./generate-rule-service.ts";
import { BaseOptionType } from "rc-select/lib/Select";

export interface GenerateRuleSelectProp {
    onLoad: (data: GenerateRuleMap) => void;
    value: number | null;
    onChange: (value: number) => void;
}

export interface GenerateRuleMap {
    [key: number]: GenerateRule;
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

    useEffect(() => {
        getGenerateRuleList(1, 16)
            .then(({ data }) => {
                setGenerateRuleList(data.data);
                props.onLoad(initGenerateRuleMap(data.data));
            })
            .catch(() => null);
    }, []);

    return (
        <Select<number, BaseOptionType>
            value={props.value}
            onChange={(id) => {
                props.onChange(id);
            }}
            options={generateRuleList.map((gr) => ({
                label: gr.description,
                value: gr.id
            }))}
        />
    );
}

export default GenerateRuleSelect;
