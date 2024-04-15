import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";

const CookingDatePicker = ({
  setCookingDate,
}: {
  setCookingDate: (pickDate: Date | undefined) => void;
}) => {
  const pickCookingDate: DatePickerProps["onChange"] = (date) => {
    if (date !== null) {
      const pickDate: Date = date?.toDate();
      setCookingDate(pickDate);
    }
  };

  return (
    <>
      <h4>烹煮日期：</h4>
      <Space direction="vertical">
        <DatePicker onChange={pickCookingDate} size={"small"} />
      </Space>
    </>
  );
};
export default CookingDatePicker;
