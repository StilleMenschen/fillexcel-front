import { Link } from "react-router-dom";
import { useRef } from "react";
import { Button } from "antd";
import { getCurrentDateTime, getRandomTwoDecimal } from "./instructions-util.ts";

function fillData(table: HTMLTableElement | null, idx: number) {
    if (!table) return;
    const item = table.rows[idx];
    item.cells[0].innerText = "你好";
    item.cells[1].innerText = getRandomTwoDecimal(1, 100);
    item.cells[3].innerText = getCurrentDateTime(idx);
}

function clearTable(table: HTMLTableElement | null, start: number, end: number) {
    if (!table) return;
    for (let i = start; i <= end; i++) {
        const item = table.rows[i];
        item.cells[0].innerText = "-";
        item.cells[1].innerText = "-";
        item.cells[3].innerText = "-";
    }
}

function SingleColumnDataExample() {
    const table = useRef<HTMLTableElement>(null);

    function start() {
        clearTable(table.current, 1, 5);
        for (let c = 1; c <= 5; c++) {
            setTimeout(() => {
                fillData(table.current, c);
            }, c * 600);
        }
    }

    return (
        <>
            <p>以下是一个简单的单例数据填入，点击按钮开始</p>
            <p>设置固定的字符串“你好”填入列A，设置范围随机数填入列B，设置日期时间文本填入列D</p>
            <Button onClick={start}>开始演示</Button>
            <table className="table" ref={table}>
                <thead>
                    <tr>
                        <th>A</th>
                        <th>B</th>
                        <th>C</th>
                        <th>D</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
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
                    </tr>
                    <tr>
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
                    </tr>
                    <tr>
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

export default SingleColumnDataExample;
