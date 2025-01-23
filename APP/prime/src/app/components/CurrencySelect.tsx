"use client";
import { useCurrencyInfo } from "@/app/hooks/useCurrencyInfo";
import Image from "next/image";
import Select from "react-select";
import {useMemo} from "react"
import {NATIVE_TOKEN} from "../contracts/constant"

export type CurrencySelectValue = {
  symbol: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  address: string;
};

interface CurrencySelectProps {
  value: CurrencySelectValue | undefined;
  onChange: (selectedOptions: CurrencySelectValue | null) => void;
}


export default function CurrencySelect({value, onChange}: CurrencySelectProps) {
  const { isLoading, error, currency } = useCurrencyInfo();

  const formattedCurrency = useMemo(() => {
    return currency.map(item => 
      item.address === "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0" 
        ? { ...item, address: NATIVE_TOKEN } 
        : item
    );
  }, [currency]);



  return (
    <div className="">
      <Select
      required
        placeholder="Currency"
        isClearable
        isLoading={isLoading}
        options={formattedCurrency}
        value={value}
       onChange={onChange}
        formatOptionLabel={(option) => (
          <div className="flex flex-row items-center gap-3 z-60">
            <Image src={option.image.thumb} alt={option.symbol} width={24} height={24} />
            <div>
              {option.symbol.toUpperCase()}
            </div>
          </div>
        )}
        classNames={{
          control: () => "p-2 border-2 border-gray-300",
          input: () => "text-md",
          option: () => "text-md",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary25: "#ffe4e4",
            primary: "black",
          }
        })}
      />
    </div>
  );
}
