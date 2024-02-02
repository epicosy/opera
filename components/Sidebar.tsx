'use client'
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Collapse } from 'antd';
import type { CollapseProps } from 'antd';
import {AreaChartOutlined, LineChartOutlined} from "@ant-design/icons";

function Explorer() {
  const pathname = usePathname();

  return  (
      <ul className="md:flex-col md:min-w-full flex flex-col list-none">
        <li className="items-center">
          <Link href="/vulnerabilities"
                className={
                    "text-xs uppercase py-3 font-bold block " +
                    (pathname.indexOf("/vulnerabilities") !== -1
                        ? "text-sky-500 hover:text-sky-600"
                        : "text-gray-700 hover:text-gray-500")
                }
          >
            <i
                className={
                    "fas fa-bug mr-2 text-sm " +
                    (pathname.indexOf("/vulnerabilities") !== -1
                        ? "opacity-75"
                        : "text-gray-300")
                }
            ></i>{" "}
            Vulnerabilities
          </Link>
        </li>
        <li className="items-center">
          <Link href="/repositories"
                className={
                    "text-xs uppercase py-3 font-bold block " +
                    (pathname.indexOf("/repositories") !== -1
                        ? "text-sky-500 hover:text-sky-600"
                        : "text-gray-700 hover:text-gray-500")
                }
          >
            <i
                className={
                    "fas fa-folders mr-2 text-sm " +
                    (pathname.indexOf("/repositories") !== -1
                        ? "opacity-75"
                        : "text-gray-300")
                }
            ></i>{" "}
            Repositories
          </Link>
        </li>
        <li className="items-center">
          <Link href="/commits"
                className={
                    "text-xs uppercase py-3 font-bold block " +
                    (pathname.indexOf("/commits") !== -1
                        ? "text-sky-500 hover:text-sky-600"
                        : "text-gray-700 hover:text-gray-500")
                }
          >
            <i
                className={
                    "fas fa-code-commit mr-2 text-sm " +
                    (pathname.indexOf("/commits") !== -1
                        ? "opacity-75"
                        : "text-gray-300")
                }
            ></i>{" "}
            Commits
          </Link>
        </li>
        <li className="items-center">
          <Link href="/configurations"
                className={
                    "text-xs uppercase py-3 font-bold block " +
                    (pathname.indexOf("/configurations") !== -1
                        ? "text-sky-500 hover:text-sky-600"
                        : "text-gray-700 hover:text-gray-500")
                }
          >
            <i
                className={
                    "fas fa-sliders mr-2 text-sm " +
                    (pathname.indexOf("/configurations") !== -1
                        ? "opacity-75"
                        : "text-gray-300")
                }
            ></i>{" "}
            Configurations
          </Link>
        </li>
        <li className="items-center">
          <Link href="/vendors"
                className={
                    "text-xs uppercase py-3 font-bold block " +
                    (pathname.indexOf("/vendors") !== -1
                        ? "text-sky-500 hover:text-sky-600"
                        : "text-gray-700 hover:text-gray-500")
                }
          >
            <i
                className={
                    "fa-solid fa-sliders mr-2 text-sm " +
                    (pathname.indexOf("/vendors") !== -1
                        ? "opacity-75"
                        : "text-gray-300")
                }
            ></i>{" "}
            Vendors
          </Link>
        </li>
        <li className="items-center">
          <Link href="/products"
                className={
                    "text-xs uppercase py-3 font-bold block " +
                    (pathname.indexOf("/products") !== -1
                        ? "text-sky-500 hover:text-sky-600"
                        : "text-gray-700 hover:text-gray-500")
                }
          >
            <i
                className={
                    "fa-solid fa-sliders mr-2 text-sm " +
                    (pathname.indexOf("/products") !== -1
                        ? "opacity-75"
                        : "text-gray-300")
                }
            ></i>{" "}
            Products
          </Link>
        </li>
        <li className="items-center">
          <Link href="/files"
                className={
                    "text-xs uppercase py-3 font-bold block " +
                    (pathname.indexOf("/files") !== -1
                        ? "text-sky-500 hover:text-sky-600"
                        : "text-gray-700 hover:text-gray-500")
                }
          >
            <i
                className={
                    "fa-solid fa-file mr-2 text-sm " +
                    (pathname.indexOf("/files") !== -1
                        ? "opacity-75"
                        : "text-gray-300")
                }
            ></i>{" "}
            Files
          </Link>
        </li>
      </ul>
  )
}


const items: CollapseProps['items'] = [
  {
    key: '1',
    label: <p className="" > Explorer </p>,
    children: <Explorer />,
  }
];


export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const [hasMounted, setHasMounted] = React.useState(false);
  const pathname = usePathname();

  // Hooks
  React.useEffect(() => {
    setHasMounted(true);
  }, [])

  // Render
  if (!hasMounted) return null;

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Brand */}
          <Link href="/"
              className="md:block text-left md:pb-2 text-gray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            >
              Opera
          </Link>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}

            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Link href="/" className={ "text-sm uppercase py-3 font-bold block " +
                      (pathname === "/"
                        ? "text-sky-500 hover:text-sky-600"
                        : "text-gray-700 hover:text-gray-500")
                    }>
                    <i
                      className={
                        "fas fa-tv mr-2 text-sm " +
                        (pathname === "/"
                          ? "opacity-75"
                          : "text-gray-300")
                      }
                    ></i>{" "}
                    Dashboard
                </Link>
              </li>
              <li className="items-center">
                <Collapse ghost className="text-sm uppercase font-bold block text-gray-700 hover:text-gray-500"
                          expandIconPosition="left"
                          expandIcon={({isActive}) => isActive ? <AreaChartOutlined className="text-gray-300 mr-2 text-sm" /> : <LineChartOutlined className="text-gray-300 mr-2 text-sm" /> }>
                    <Collapse.Panel key='explorer' header='Explorer' className="px-0">
                        <Explorer />
                    </Collapse.Panel>
                </Collapse>

              </li>
              <li className="items-center">
                <Link href="/datasets"
                      className={
                          "text-sm uppercase py-3 font-bold block " +
                          (pathname.indexOf("/datasets") !== -1
                              ? "text-sky-500 hover:text-sky-600"
                              : "text-gray-700 hover:text-gray-500")
                      }
                >
                  <i
                      className={
                          "fas fa-database mr-2 text-sm " +
                          (pathname.indexOf("/datasets") !== -1
                              ? "opacity-75"
                              : "text-gray-300")
                      }
                  ></i>{" "}
                  Datasets
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
          </div>
        </div>
      </nav>
    </>
  );
}
