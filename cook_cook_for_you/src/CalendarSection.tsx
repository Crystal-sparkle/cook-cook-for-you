import type { CalendarProps } from "antd";
import { Calendar, Tag } from "antd";
import type { Dayjs } from "dayjs";
import React from "react";

const getListData = (value: Dayjs) => {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
      ];
      break;
    case 10:
      listData = [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
        { type: "error", content: "This is error event." },
      ];
      break;
    case 15:
      listData = [
        { type: "warning", content: "This is warning event" },
        { type: "success", content: "This is very long usual event......" },
        { type: "error", content: "This is error event 1." },
        { type: "error", content: "This is error event 2." },
        { type: "error", content: "This is error event 3." },
        { type: "error", content: "This is error event 4." },
      ];
      break;
    default:
  }
  return listData || [];
};

const CalendarSection: React.FC = () => {
  const preventDefault = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    console.log("Clicked! But prevent default.");
  };
  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <>
        <ul className="events">
          {listData.map((item) => (
            <li key={item.content}>
              <Tag closeIcon onClose={preventDefault}>
                {item.content}
              </Tag>
            </li>
          ))}
        </ul>
      </>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return <Calendar cellRender={cellRender} />;
};

export default CalendarSection;
