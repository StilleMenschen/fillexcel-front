import { Select } from "antd";
import { useCallback, useMemo, useState } from "react";
import { GenerateRule, getGenerateRuleList } from "./generate-rule-service.ts";
import { BaseOptionType } from "rc-select/lib/Select";

export interface GenerateRuleSelectProp {
    onChange: (value: number, option: BaseOptionType | BaseOptionType[]) => void;
}

function GenerateRuleSelect(props: GenerateRuleSelectProp) {
    const [generateRuleList, setGenerateRuleList] = useState<Array<GenerateRule>>([]);

    const queryGenerateRule = useCallback(() => {
        getGenerateRuleList(1, 16)
            .then(({ data }) => {
                setGenerateRuleList(data.data);
            })
            .catch(() => null);
    }, [setGenerateRuleList]);

    useMemo(() => {
        queryGenerateRule();
    }, [queryGenerateRule]);

    return (
        <Select<number, BaseOptionType>
            onChange={props.onChange}
            options={generateRuleList.map((gr) => ({
                value: gr.id,
                label: gr.description
            }))}
        />
    );
}

export default GenerateRuleSelect;
