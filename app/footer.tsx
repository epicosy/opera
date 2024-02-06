import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="block py-4 mt-auto relative md:ml-48 bg-gray-100 -z-10">
        <div className="container mx-auto px-4">
          <hr className="mb-4 border-b-1 border-gray-200" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4">
              <div className="text-sm text-gray-500 font-semibold py-1 text-center md:text-left">
                Copyright © {new Date().getFullYear()}{" "}
                <Link
                  href="https://www.creative-tim.com?ref=nnjs-footer-admin"
                  className="text-blue-gray-500 hover:text-gray-700 text-sm font-semibold py-1"
                >
                  Opera
                </Link>
              </div>
            </div>
            <div className="w-full md:w-8/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                <li>
                  <Link
                    href="https://www.creative-tim.com?ref=nnjs-footer-admin"
                    className="text-gray-600 hover:text-gray-800 text-sm font-semibold block py-1 px-3"
                  >
                    Opera
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.creative-tim.com/presentation?ref=nnjs-footer-admin"
                    className="text-gray-600 hover:text-gray-800 text-sm font-semibold block py-1 px-3"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="http://blog.creative-tim.com?ref=nnjs-footer-admin"
                    className="text-gray-600 hover:text-gray-800 text-sm font-semibold block py-1 px-3"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/creativetimofficial/notus-nextjs/blob/main/LICENSE.md?ref=nnjs-footer-admin"
                    className="text-gray-600 hover:text-gray-800 text-sm font-semibold block py-1 px-3"
                  >
                    MIT License
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
