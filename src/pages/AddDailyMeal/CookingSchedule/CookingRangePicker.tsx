import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import { useState } from "react";
type RangeValue = [Dayjs | null, Dayjs | null] | null;
const { RangePicker } = DatePicker;

const CookingRangePicker = ({
  setValue,
  value,
}: {
  setValue: (value: RangeValue) => void;
  value: RangeValue;
}) => {
  const [dates, setDates] = useState<RangeValue>(null);
  const disabledDate = (current: Dayjs) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], "days") >= 12;
    const tooEarly = dates[1] && dates[1].diff(current, "days") >= 12;
    return !!tooEarly || !!tooLate;
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  return (
    <>
      <h4>烹飪區間：</h4>
      <RangePicker
        value={dates || value}
        disabledDate={disabledDate}
        onCalendarChange={(val) => {
          setDates(val);
        }}
        onChange={(val) => {
          setValue(val);
        }}
        onOpenChange={onOpenChange}
        changeOnBlur
        placement={"bottomRight"}
        size={"small"}
      />
    </>
  );
};
export default CookingRangePicker;
