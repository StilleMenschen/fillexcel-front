import { useCallback, useMemo, useState } from "react";
import { GenerateRuleParameter, getGenerateRuleParameterListByRule } from "./generate-rule-parameter-service.ts";

interface GenerateRuleParameterFormProp {
    ruleId: number;
}
function GenerateRuleParameterForm(props: GenerateRuleParameterFormProp) {
    const [generateRuleParameterList, setGenerateRuleParameterList] = useState<Array<GenerateRuleParameter>>([]);

    const queryGenerateRuleParameter = useCallback(() => {
        if (!props.ruleId) return;
        getGenerateRuleParameterListByRule(props.ruleId, 1, 16)
            .then(({ data }) => {
                setGenerateRuleParameterList(data.data);
            })
            .catch(() => null);
    }, [props, setGenerateRuleParameterList]);

    useMemo(() => {
        queryGenerateRuleParameter();
    }, [queryGenerateRuleParameter]);

    return (
        <>
            {generateRuleParameterList.map((grp) => (
                <p>
                    {grp.id} - {grp.name} - {grp.description}, {grp.data_type}
                </p>
            ))}
        </>
    );
}

export default GenerateRuleParameterForm;
