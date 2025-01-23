"use client"
import React, { useState } from 'react';
import type { DatePickerProps, TimePickerProps } from 'antd';
import { DatePicker, Select, Space, TimePicker } from 'antd';
import dayjs from 'dayjs';
const { Option } = Select;

export type PickerType = 'time' | 'date';


interface SwitchablePickerProps {
  onChange: (value: any) => void,
  type: PickerType,
  setType: (type: PickerType) => void,
  value: any,
}

const PickerWithType = ({
  type,
  onChange,
  value,
  id
}: {
  type: PickerType;
  onChange: TimePickerProps['onChange'] | DatePickerProps['onChange'];
  value: any;
  id: string
}) => {
  if (type === 'time') return <TimePicker onChange={onChange} value={value} id={id}/>;
  if (type === 'date') return <DatePicker onChange={onChange} value={value} minDate={dayjs()} id={id}/>;
  
};




const SwitchablePicker = ({onChange, setType, type, value}: SwitchablePickerProps) => {

  

  return (
    <div className="flex flex-col gap-2">
       <label 
            htmlFor="duration" 
            className="block sm:text-xs text-[10px] font-black text-black"
          >
            Duration
          </label>
    <Space>
         
      <Select value={type} onChange={setType}>
        <Option value="date">Date</Option>  
        <Option value="time">Time</Option>    
      </Select>
      <PickerWithType type={type} onChange={(value) => onChange(value)} value={value} id='duration'/>
       
    </Space>
     </div>
  );
};

export default SwitchablePicker;