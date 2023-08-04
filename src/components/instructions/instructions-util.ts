/**
 * 随机范围数值
 * @param min 最小值（包含）
 * @param max 最大值（不包含）
 */
export function getRandomTwoDecimal(min: number, max: number) {
    // 生成0到1之间的随机小数
    const random = Math.random();
    // 将随机小数映射到指定范围
    const result = random * (max - min) + min;
    // 保留两位小数
    return result.toFixed(2);
}

/**
 * 当前日期时间组成的字符串
 * @param idx 追加的序号
 */
export function getCurrentDateTime(idx: number) {
    if (!idx) idx = 1;
    const now = new Date();
    const year = now.getFullYear();
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const day = ("0" + now.getDate()).slice(-2);
    const hour = ("0" + now.getHours()).slice(-2);
    const minute = ("0" + now.getMinutes()).slice(-2);
    const second = ("0" + now.getSeconds()).slice(-2);

    return `${year}${month}${day}-${hour}${minute}${second}-0${idx}`;
}
