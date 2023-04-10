'use client';
import React, {FC, ReactNode} from "react";

import PageChange from "../PageChange/PageChange";

const TableHeader: FC<{children: ReactNode}> = ({children}) => {
  return (
    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0
    whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
    {children}
  </th>
)
}

const TableCell: FC<{children: ReactNode}> = ({children}) => {
  return (
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
        {children}
      </td>
  )
}

export default function CardFilterPaginationTable({headers, rows, currentPage, setPage, pagination}) {

  return (
    <>

      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
        <PageChange currentPage={currentPage} setPage={setPage} pagination={pagination} />

        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                {headers.map((header) => (
                    <TableHeader>{header}</TableHeader>
                ))}
              </tr>
            </thead>
            <tbody>
            {rows.map((row ) => (
                <tr>
                    {row.map((cell) => (
                        <TableCell>{cell?.toString()}</TableCell>
                    ))}
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
