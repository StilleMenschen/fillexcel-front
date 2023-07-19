import { MouseEvent } from "react";
import { Space, Card } from "antd";
import { message } from "../../store/feedback";

export default function Instructions() {
    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        message.info("更多...");
    };

    return (
        <Space size="middle" wrap>
            <Card
                title="Default size card"
                extra={
                    <a href="#" onClick={(e) => handleClick(e)}>
                        More
                    </a>
                }
                style={{ width: "32rem" }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
            </Card>
            <Card size="small"
                title="Small size card"
                extra={
                    <a href="#" onClick={(e) => handleClick(e)}>
                        More
                    </a>
                }
                style={{ width: "32rem" }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
            </Card>
        </Space>
    );
}
