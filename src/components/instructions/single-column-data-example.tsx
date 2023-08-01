import { Link } from "react-router-dom";
import { useRef } from "react";

function getRandomTwoDecimal(min: number, max: number) {
    // 生成0到1之间的随机小数
    let random = Math.random();
    // 将随机小数映射到指定范围
    let result = random * (max - min) + min;
    // 保留两位小数
    return result.toFixed(2);
}

function getCurrentDateTime(idx: number) {
    const now = new Date();
    const year = now.getFullYear();
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const day = ("0" + now.getDate()).slice(-2);
    const hour = ("0" + now.getHours()).slice(-2);
    const minute = ("0" + now.getMinutes()).slice(-2);
    const second = ("0" + now.getSeconds()).slice(-2);

    return `${year}${month}${day}-${hour}${minute}${second}-0${idx}`;
}

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
            <p>以下是一个简单的单例数据填入</p>
            <p>设置固定的字符串“你好”填入列A，设置范围随机数填入列B，设置日期时间文本填入列D</p>
            <button className="button" type="button" onClick={start}>
                开始演示
            </button>
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
