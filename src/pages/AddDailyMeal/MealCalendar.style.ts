import { Calendar, Popover, Tag } from "antd";
import styled from "styled-components";
import { device } from "../../utils/breakpoints";

export const CalerdarWrapper = styled.div`
  margin: 5px;
  border-radius: 5px;
  background-color: #b7dbdf;
  /* height: 794px; */
`;
export const StyledCalendar = styled(Calendar)`
  border-radius: 5px;
  margin: 5px;
  font-size: 14px;
  background-color: #b7dbdf;
  padding: 0;

  .ant-picker-calendar-date {
    padding: 0;
  }
  .ant-picker-cell-inner {
    padding: 0;
  }
`;

export const TagStyle = styled(Tag)`
  font-size: 18px;
  border: none;
  color: #211607;
  margin-bottom: 5px;
  padding: 3px;
  @media ${device.mobile} {
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

export const PopoverStyle = styled(Popover)`
  margin-bottom: 8px;
  @media ${device.mobile} {
    font-size: 14px;
    margin-bottom: 5px;
    padding: 3px;
  }
`;
