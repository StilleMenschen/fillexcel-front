import { Link } from "react-router-dom";
import { useRef } from "react";
import { Button } from "antd";

function fillData(table: HTMLTableElement | null, idx: number) {
    if (!table) return;
    const cells = table.rows[idx].cells;
    const [A, B] = [cells[0].innerText, cells[1].innerText];
    const [C, E] = [cells[2].innerText, cells[4].innerText];
    cells[3].innerText = String((Number(A) * (Number(B) + 10)) / 2);
    cells[5].innerText = `${E}-${C}`;
}

function clearTable(table: HTMLTableElement | null, start: number, end: number) {
    if (!table) return;
    for (let i = start; i <= end; i++) {
        const cells = table.rows[i].cells;
        cells[3].innerText = "-";
        cells[5].innerText = "-";
    }
}

const expressions = "{A} * ({B} + 10) / 2";

function RelatedColumnDataExample() {
    const table = useRef<HTMLTableElement>(null);

    function start() {
        clearTable(table.current, 1, 7);
        for (let c = 1; c <= 7; c++) {
            setTimeout(() => {
                fillData(table.current, c);
            }, c * 600);
        }
    }

    return (
        <>
            <p>以下是一个简单关联数据填入的例子，点击按钮开始</p>
            <p>设置一个表达式为“{expressions}”填入列D，设置一个关联拼接“E,C”填入列F</p>
            <Button onClick={start}>开始演示</Button>
            <table className="table" ref={table}>
                <thead>
                    <tr>
                        <th>A</th>
                        <th>B</th>
                        <th>C</th>
                        <th>D</th>
                        <th>E</th>
                        <th>F</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>86</td>
                        <td>6</td>
                        <td>魁北克</td>
                        <td>-</td>
                        <td>加拿大</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>72.36</td>
                        <td>9</td>
                        <td>伦敦</td>
                        <td>-</td>
                        <td>英国</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>153</td>
                        <td>2</td>
                        <td>上海</td>
                        <td>-</td>
                        <td>中国</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>254.20</td>
                        <td>5</td>
                        <td>洛杉矶</td>
                        <td>-</td>
                        <td>美国</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>988.04</td>
                        <td>3</td>
                        <td>悉尼</td>
                        <td>-</td>
                        <td>澳大利亚</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>45</td>
                        <td>1</td>
                        <td>圣彼得堡</td>
                        <td>-</td>
                        <td>俄罗斯</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>66</td>
                        <td>7</td>
                        <td>慕尼黑</td>
                        <td>-</td>
                        <td>德国</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
            <Link to="/">返回说明</Link>
        </>
    );
}

export default RelatedColumnDataExample;
