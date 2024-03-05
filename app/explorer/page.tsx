'use client'

import React from "react";
import { Card} from 'antd';
import {
    BugOutlined,
    FolderOutlined,
    BranchesOutlined,
    SlidersOutlined,
    ShopOutlined,
    ProjectOutlined,
    FileOutlined
} from '@ant-design/icons';

const { Meta } = Card;

const options = [
    { href: "/explorer/commits", icon: <BranchesOutlined />, label: "Commits" },
    { href: "/explorer/configurations", icon: <SlidersOutlined />, label: "Configurations" },
    { href: "/explorer/files", icon: <FileOutlined />, label: "Files" },
    { href: "/explorer/products", icon: <ProjectOutlined />, label: "Products" },
    { href: "/explorer/repositories", icon: <FolderOutlined />, label: "Repositories" },
    { href: "/explorer/vendors", icon: <ShopOutlined />, label: "Vendors" },
    { href: "/explorer/vulnerabilities", icon: <BugOutlined />, label: "Vulnerabilities" }
];

export default function Explorer() {
    return (
        <div className="flex flex-wrap mt-4">
            {options.map((option, index) => (
                <div key={index} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-4 px-2">
                    <Card hoverable>
                        <a href={option.href}>
                            <Meta
                                avatar={option.icon}
                                title={option.label}
                            />
                        </a>
                    </Card>
                </div>
            ))}
        </div>
    )
}
