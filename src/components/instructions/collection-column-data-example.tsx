import { Link } from "react-router-dom";
import { useRef } from "react";
import { Button } from "antd";

const baseStringList = ["马里亚纳", "百慕大", "直布罗陀"];

const baseObjectList = [
    { name: "亚马逊雨林", area: 5500000, unit: "km²" },
    { name: "刚果雨林", area: 1780000, unit: "km²" },
    { name: "瓦尔迪维亚雨林", area: 248100, unit: "km²" }
];

function fillData(table: HTMLTableElement | null, idx: number) {
    if (!table) return;
    const item = table.rows[idx];
    const obj = baseObjectList[(idx - 1) % 3];
    item.cells[1].innerText = baseStringList[(idx - 1) % 3];
    item.cells[2].innerText = obj.name;
    item.cells[3].innerText = obj.unit;
    item.cells[5].innerText = String(obj.area);
}

function clearTable(table: HTMLTableElement | null, start: number, end: number) {
    if (!table) return;
    for (let i = start; i <= end; i++) {
        const item = table.rows[i];
        for (let j = 0; j < 6; j++) {
            item.cells[j].innerText = "-";
        }
    }
}

function CollectionColumnDataExample() {
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
            <p>以下是一个简单特定数据集填入的例子，点击按钮开始</p>
            <p>创建一个字符串数据集：{JSON.stringify(baseStringList)}</p>
            <p>创建一个字典数据集：{JSON.stringify(baseObjectList)}</p>
            <p>字符串数据填入列B，字典数据的name填入列C，字典数据的unit填入列D，字典数据的area填入列F</p>
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
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
            <Link to="/">返回说明</Link>
        </>
    );
}

export default CollectionColumnDataExample;
