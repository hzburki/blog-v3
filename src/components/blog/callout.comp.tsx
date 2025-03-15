import React from "react";

interface CalloutProps {
  type: "danger" | "success" | "info";
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({ type, children }) => {
  const getClassName = () => {
    switch (type) {
      case "danger":
        return "bg-red-100 border-red-500 text-red-700";
      case "success":
        return "bg-green-100 border-green-500 text-green-700";
      case "info":
      default:
        return "bg-blue-100 border-blue-500 text-blue-700";
    }
  };

  return (
    <div
      className={`my-4 flex flex-row rounded-md border-l-4 p-4 shadow-sm ${getClassName()}`}
    >
      <span className="flex items-center pr-4">
        {type === "info" ? "ℹ️" : type === "success" ? "✅" : "⛔"}
      </span>
      {children}
    </div>
  );
};
