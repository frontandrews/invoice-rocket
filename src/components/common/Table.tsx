import React from "react";

interface TableProps {
  headers?: string[];
  data: any[];
  renderRow: (item: any) => JSX.Element | JSX.Element[];
  renderActions: (item: any) => any;
  rowClass?: string;
}

export const Table = ({
  headers = [],
  data,
  renderRow,
  renderActions,
}: TableProps) => {
  return (
    <table className="divide-y divide-gray-300">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              {header}
            </th>
          ))}
          <th
            scope="col"
            className="relative text-center py-3.5 pl-3 text-sm font-semibold text-gray-900"
          ></th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {data.map((item, index) => (
          <tr key={index} className="even:bg-neutral-50">
            {renderRow(item)}
            <td>{renderActions(item)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
