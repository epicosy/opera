'use client';
import React, {Dispatch, FC, ReactNode, SetStateAction} from "react";

import PageChange from "../PageChange/PageChange";
import {Pagination} from "../../typings";

const TableHeader: FC<{children: ReactNode}> = ({children}) => {
  return (
    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0
    whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
    {children}
  </th>
)
}


type TableRow = Array<any>;
type TableRows = Array<TableRow>;

interface Props {
  rows: TableRows;
}

const TableBody: React.FC<Props> = ({ rows }) => {
  return (
      <tbody>
      {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-100">
            {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>
                  {cell}
                </TableCell>
            ))}
          </tr>
      ))}
      </tbody>
  );
};


const TableCell: FC<{children: ReactNode}> = ({children}) => {
  return (
      <td className="border-t-0 flex-nowrap w-4 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
        {children}
      </td>
  )
}

interface CardFilterPaginationTableProps {
  headers: (string | React.JSX.Element)[],
  rows: string[][],
  currentPage: number,
  setPage: Dispatch<SetStateAction<number>>,
  pagination: Pagination,
}


export default function CardFilterPaginationTable({headers, rows, currentPage, setPage, pagination} : CardFilterPaginationTableProps) {

  return (
    <>
      <div className="relative flex flex-col min-w-0 max-w-100 break-words w-full mb-6 shadow-lg rounded bg-white">
        <PageChange currentPage={currentPage} setPage={setPage} pagination={pagination} />

        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead className="bg-blueGray-50">
              <tr className="text-blueGray-500 border-blueGray-100">
                {headers.map((header) => (
                    <TableHeader>{header}</TableHeader>
                ))}
              </tr>
            </thead>
            <TableBody rows={rows}/>
          </table>
        </div>
      </div>
    </>
  );
}
