'use client'

import {Breadcrumb, Layout} from "antd";
import React from "react";
import {usePathname} from "next/navigation";
import Link from 'next/link';

const { Header, Content } = Layout;


export default function ExplorerLayout({children}: { children: React.ReactNode;}) {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(segment => segment);

    // Generate Breadcrumb items dynamically
    const breadcrumbItems = pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const capitalizedSegment = segment.charAt(0).toUpperCase() + segment.slice(1); // Capitalize the segment

        return (
            <Breadcrumb.Item key={segment}>
                <Link href={href}>{capitalizedSegment}</Link>
            </Breadcrumb.Item>
        );
    });

    return (
        <Layout>
            <Header style={{ padding: 0}} />
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    {breadcrumbItems}
                </Breadcrumb>
                <div className="">
                    {children}
                </div>
            </Content>
        </Layout>
    );
}
