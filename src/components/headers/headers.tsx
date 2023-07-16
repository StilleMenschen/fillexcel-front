import { Col, Row } from "antd";
import NavBar from "./nav-bar";
import UserBar from "./user-bar";

function Headers() {
    return (
        <Row  justify="space-between">
            <Col flex="auto">
                <NavBar />
            </Col>
            <Col>
                <UserBar />
            </Col>
        </Row>
    );
}

export default Headers;
