import React from "react";

function DropDown({ data, label, value, onChange }) {
  function renderClassOptions() {
    data = [
      {
        value: label,
        displayName: label,
      },
      ...data,
    ];
    let options = data?.map((d) => {
      return (
        <option key={d.value} value={d.value}>
          {d.displayName}
        </option>
      );
    });

    return options;
  }

  return (
    <div className="flex flex-col w-full max-w-xs mx-auto">
      <select
        id="select"
        value={value}
        placeholder="..."
        onChange={onChange}
        className="px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
      >
        {renderClassOptions()}
      </select>
    </div>
  );
}

export default DropDown;
