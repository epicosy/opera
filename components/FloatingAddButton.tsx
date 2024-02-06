import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import React from "react";


const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '10vh',
    right: '5vh',
    zIndex: 1000
};


export default function FloatingAddButton({onClick}: {onClick:  React.Dispatch<React.SetStateAction<any>>}) {

    return (
        <Button type="primary" shape="circle" size="large" style={buttonStyle} onClick={onClick}
                className="bg-teal-950 hover:bg-teal-500">
            <PlusOutlined className="text-blueGray-100" style={{fontWeight: 800}} />
        </Button>
    );
}