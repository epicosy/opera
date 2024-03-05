'use client';

import React, { useState, useMemo } from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Logo from "../components/Sidebar/Logo";
import Link from 'next/link';
import "../styles/globals.css"

import {
    DashboardOutlined,
    AreaChartOutlined,
    ProfileOutlined,
    DatabaseOutlined,
} from '@ant-design/icons';

import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import {usePathname} from "next/navigation";


const { Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number] & {
    icon?: React.ReactNode;
    href?: string;
    label: React.ReactNode;
};

const items: MenuItem[] = [
    {
        key: '1',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        href: '/',
    },
    {
        key: '2',
        icon: <AreaChartOutlined />,
        label: 'Explorer',
        href: '/explorer',
    },
    {
        key: '3',
        icon: <ProfileOutlined />,
        label: 'Profiler',
        href: '/profiler',
    },
    {
        key: '4',
        icon: <DatabaseOutlined />,
        label: 'Datasets',
        href: '/datasets',
    },
];

export default function RootLayout({children}: { children: React.ReactNode;}) {
    const [collapsed, setCollapsed] = useState(true);
    const pathname = usePathname();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Define the selected key based on the current route
    const selectedKey = useMemo(() => {
        const selectedItem = items.find(item => item.href === pathname);
        return selectedItem?.key?.toString() ?? '1'; // Default to '1' if no match found
    }, [pathname]);

    return (
        <html lang="en">
            <body>
                <AntdRegistry>
                    <Layout style={{ minHeight: '100vh' }}>
                        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                            <Logo/>
                            <div className="pt-2" />
                            <Menu theme="dark" defaultSelectedKeys={[selectedKey]} mode="inline">
                                {items.map((item) => (
                                    item && (
                                        <Menu.Item key={item.key} icon={item.icon}>
                                            <Link href={item.href ? item.href : '#'}>
                                                {item.label}
                                            </Link>
                                        </Menu.Item>
                                    )
                                ))}
                            </Menu>
                        </Sider>
                        <div className="w-full h-full"
                            style={{
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            {children}
                            <Footer style={{ textAlign: 'center' }}>
                                Opera © {new Date().getFullYear()}
                            </Footer>
                        </div>
                    </Layout>
                </AntdRegistry>
            </body>
        </html>
        );
};
