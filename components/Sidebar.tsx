'use client'
import React from "react";
import Link from "next/link";
import Logo from "./Sidebar/Logo";

import { usePathname } from "next/navigation";
import { Collapse } from 'antd';
import {BugOutlined, FolderOutlined, BranchesOutlined, SlidersOutlined, FileOutlined, AreaChartOutlined, ShopOutlined,
    LineChartOutlined, ProjectOutlined, DatabaseOutlined, DashboardOutlined, ProfileOutlined} from "@ant-design/icons";


interface NavItemProps {
    href: string;
    iconClass: string;
    label: string;
    size?: string;
}

const getIconComponent = (iconClass : string) => {
    switch (iconClass) {
        case 'BugOutlined':
            return <BugOutlined />;
        case 'FolderOutlined':
            return <FolderOutlined />;
        case 'BranchesOutlined':
            return <BranchesOutlined />;
        case 'SlidersOutlined':
            return <SlidersOutlined />;
        case 'FileOutlined':
            return <FileOutlined />;
        case 'ShopOutlined':
            return <ShopOutlined />;
        case 'ProjectOutlined':
            return <ProjectOutlined />;
        case 'DatabaseOutlined':
            return <DatabaseOutlined />;
        case 'DashboardOutlined':
            return <DashboardOutlined />;
        case 'ProfileOutlined':
            return <ProfileOutlined />;
        // Add other cases as needed
        default:
            return null;
    }
};

const NavItem = ({ href, iconClass, label, size='text-xs'} : NavItemProps) => {
    const pathname = usePathname();
    const iconComponent = getIconComponent(iconClass);
    const isActive = href === '/' ? pathname === href : pathname.startsWith(href);

    return (
        <li className="items-center">
            <Link
                href={href}
                className={
                    "text-xs uppercase py-3 font-bold block " +
                    (isActive ? "text-teal-500 hover:text-teal-400" : "text-teal-50 hover:text-teal-200")
                }
            >
                {iconComponent && (
                    <span className={`${iconComponent.props.className} mr-2 ` + size +
                        (isActive ? "opacity-75" : "text-teal-300")}>
            {iconComponent}
          </span>
                )}
                {label}
            </Link>
        </li>
    );
};

function Explorer() {
    return (
        <ul className="md:flex-col md:min-w-full flex flex-col list-none">
            <NavItem href="/vulnerabilities" iconClass="BugOutlined" label="Vulnerabilities" />
            <NavItem href="/repositories" iconClass="FolderOutlined" label="Repositories" />
            <NavItem href="/commits" iconClass="BranchesOutlined" label="Commits" />
            <NavItem href="/configurations" iconClass="SlidersOutlined" label="Configurations" />
            <NavItem href="/vendors" iconClass="ShopOutlined" label="Vendors" />
            <NavItem href="/products" iconClass="ProjectOutlined" label="Products" />
            <NavItem href="/files" iconClass="FileOutlined" label="Files" />
        </ul>
    );
}


export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const [hasMounted, setHasMounted] = React.useState(false);

  // Hooks
  React.useEffect(() => {
    setHasMounted(true);
  }, [])

  // Render
  if (!hasMounted) return null;

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap
                      md:overflow-hidden shadow-xl bg-teal-950 flex flex-wrap items-center justify-between relative
                      md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center
                        justify-between w-full mx-auto">
          {/* Brand */}
          <Logo/>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-1 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Divider */}
            <hr className="my-2 md:min-w-full" />
            {/* Heading */}

            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                <NavItem href="/" iconClass="DashboardOutlined" label="Dashboard" size='text-sm' />
              <li className="items-center">
                <Collapse ghost className="custom-antd-collapse-header-color"
                          expandIconPosition="start"
                          expandIcon={({isActive}) => isActive ? <AreaChartOutlined className="text-teal-300 mr-2 text-sm" /> : <LineChartOutlined className="text-teal-300 mr-2 text-sm" /> }>
                    <Collapse.Panel key='explorer' header='Explorer'
                                    className="custom-antd-collapse-header-padding text-sm uppercase font-bold
                                    block text-teal-500 hover:text-teal-700">
                        <Explorer />
                    </Collapse.Panel>
                </Collapse>

              </li>
                <NavItem href="/profiler" iconClass="ProfileOutlined" label="Profiler" size='text-sm' />
                <NavItem href="/datasets" iconClass="DatabaseOutlined" label="Datasets" size='text-sm' />
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
          </div>
        </div>
      </nav>
    </>
  );
}
