// components/Table.js
import React from 'react';

const Table = ({ columns, renderRow, data }) => {

  return (
    <div className="relative overflow-x-auto max-w-full">
      <table className="w-full min-w-max border-collapse">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            {columns.map((column) => (
              <th
                key={column.accessor}
                className={`p-4 font-semibold bg-gray-100 sticky top-0 z-10 ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((item) => renderRow(item))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;