import { Select } from "antd";
import { BaseOptionType } from "rc-select/lib/Select";
import { useGenerateRuleMap } from "../../store/generate-rule.ts";

export interface GenerateRuleSelectProp {
    value: number | null;
    onChange: (value: number) => void;
}

function GenerateRuleSelect(props: GenerateRuleSelectProp) {
    const { generateRuleList } = useGenerateRuleMap();

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
