'use client'
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const [hasMounted, setHasMounted] = React.useState(false);
  const [expand, setExpanded] = React.useState(false);
  const pathname = usePathname();

  // Hooks
  React.useEffect(() => {
    setHasMounted(true);
  }, [])

  // Render
  if (!hasMounted) return null;

  

  return (
      <>
        <nav style={{ backgroundColor: "#DBEAFE"}} className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
          <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
            {/* Toggler */}
            <button
                className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                type="button"
                onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
            >
              <i className="fas fa-bars"></i>
            </button>
            {/* Brand */}
            <Link href="/"
                  className="md:block text-left md:pb-2 text-gray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            >
              Phanes
            </Link>
            {/* Collapse */}
            <div
                className={
                    "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
                    collapseShow
                }
            >
              {/* Collapse header */}
              <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-gray-200">
                <div className="flex flex-wrap">
                  <div className="w-6/12">
                    <Link href="/"
                          className="md:block text-left md:pb-2 text-gray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    >
                      Opera
                    </Link>
                  </div>
                  <div className="w-6/12 flex justify-end">
                    <button
                        type="button"
                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                        onClick={() => setCollapseShow("hidden")}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
              {/* Form */}
              <form className="mt-6 mb-4 md:hidden">
                <div className="mb-3 pt-0">
                  <input
                      type="text"
                      placeholder="Search"
                      className="border-0 px-3 py-2 h-12 border border-solid  border-gray-500 placeholder-gray-300 text-gray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                  />
                </div>
              </form>

              {/* Divider */}
              <hr className="my-4 md:min-w-full" />
              {/* Heading */}

              {/* Navigation */}

              <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                  <Link href="/discovery"
                        className={
                            "text-xs uppercase py-3 font-bold block " +
                            (pathname.indexOf("/discovery") !== -1
                                ? "text-sky-700 hover:text-sky-900"
                                : "text-gray-700 hover:text-gray-500")
                        }
                  >
                    <i
                        className={
                            "fas fa-bug mr-2 text-sm " +
                            (pathname.indexOf("/discovery") !== -1
                                ? "opacity-75"
                                : "text-gray-300")
                        }
                    ></i>{" "}
                    Discovery
                  </Link>
                </li>

                <li className="items-center">
                  <Link href="/analysis"
                        className={
                            "text-xs uppercase py-3 font-bold block " +
                            (pathname.indexOf("/analysis") !== -1
                                ? "text-sky-700 hover:text-sky-900"
                                : "text-gray-700 hover:text-gray-500")
                        }
                  >
                    <i
                        className={
                            "fas fa-bug mr-2 text-sm " +
                            (pathname.indexOf("/analysis") !== -1
                                ? "opacity-75"
                                : "text-gray-300")
                        }
                    ></i>{" "}
                    Analysis
                  </Link>
                </li>

                <li className="items-center">
                  <Link href="/scoring"
                        className={
                            "text-xs uppercase py-3 font-bold block " +
                            (pathname.indexOf("/scoring") !== -1
                                ? "text-sky-700 hover:text-sky-900"
                                : "text-gray-700 hover:text-gray-500")
                        }
                  >
                    <i
                        className={
                            "fas fa-bug mr-2 text-sm " +
                            (pathname.indexOf("/scoring") !== -1
                                ? "opacity-75"
                                : "text-gray-300")
                        }
                    ></i>{" "}
                    Scoring
                  </Link>
                </li>

                <li className="items-center">
                  <Link href="/reporting"
                        className={
                            "text-xs uppercase py-3 font-bold block " +
                            (pathname.indexOf("/reporting") !== -1
                                ? "text-sky-700 hover:text-sky-900"
                                : "text-gray-700 hover:text-gray-500")
                        }
                  >
                    <i
                        className={
                            "fas fa-bug mr-2 text-sm " +
                            (pathname.indexOf("/reporting") !== -1
                                ? "opacity-75"
                                : "text-gray-300")
                        }
                    ></i>{" "}
                    Reporting
                  </Link>
                </li>

                {expand  && (
                  <div>
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
                  <Link href="/" className={ "text-xs uppercase py-3 font-bold block " +
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
                            "fa-doutone fa-folders mr-2 text-sm " +
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
                            "fa-duotone fa-code-commit mr-2 text-sm " +
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
                            "fa-solid fa-sliders mr-2 text-sm " +
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
                <li className="items-center">
                  <Link href="/datasets"
                        className={
                            "text-xs uppercase py-3 font-bold block " +
                            (pathname.indexOf("/datasets") !== -1
                                ? "text-sky-500 hover:text-sky-600"
                                : "text-gray-700 hover:text-gray-500")
                        }
                  >
                    <i
                        className={
                            "fa-sharp fa-solid fa-database mr-2 text-sm " +
                            (pathname.indexOf("/datasets") !== -1
                                ? "opacity-75"
                                : "text-gray-300")
                        }
                    ></i>{" "}
                    Datasets
                  </Link>
                </li>
                <li className="items-center">
                  <Link href="/reports"
                        className={
                            "text-xs uppercase py-3 font-bold block " +
                            (pathname.indexOf("/reports") !== -1
                                ? "text-sky-500 hover:text-sky-600"
                                : "text-gray-700 hover:text-gray-500")
                        }
                  >
                    <i
                        className={
                            "fa-sharp fa-solid fa-database mr-2 text-sm " +
                            (pathname.indexOf("/reports") !== -1
                                ? "opacity-75"
                                : "text-gray-300")
                        }
                    ></i>{" "}
                    Reports
                  </Link>
                </li>
                  </div>
                )}
                
              </ul>

              {/* Divider */}
              <hr className="my-4 md:min-w-full" />
            </div>
          </div>
        </nav>
      </>
  );
}
