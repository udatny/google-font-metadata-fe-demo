"use client";

import React, { useState } from "react";
import clsx from "clsx";

type CustomRangeProps = {
    allowedValues: number[];
    initialValue?: number;
    onChange?: (value: number) => void;
};

export const CustomRange: React.FC<CustomRangeProps> = ({
                                                            allowedValues,
                                                            initialValue,
                                                            onChange,
                                                        }) => {
    const initialIndex = initialValue !== undefined
        ? allowedValues.indexOf(initialValue)
        : 0;

    const [index, setIndex] = useState(
        initialIndex >= 0 ? initialIndex : 0
    );

    const currentValue = allowedValues[index];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newIndex = Number(e.target.value);
        setIndex(newIndex);
        onChange?.(allowedValues[newIndex]);
    };

    return (
        <div className="flex flex-col gap-2">
            <input
                type="range"
                min={0}
                max={allowedValues.length - 1}
                step={1}
                value={index}
                onChange={handleChange}
                className={clsx(
                    "w-full appearance-none h-2 rounded",
                    "bg-gray-200 accent-blue-500"
                )}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
                {allowedValues.map((val, i) => (
                    <span key={val} className={clsx(i === index && "text-black font-semibold")}>
            {val}
          </span>
                ))}
            </div>
        </div>
    );
};
