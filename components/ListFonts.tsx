'use client'
import { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { FixedSizeList } from 'react-window'
import {FontObjectV2} from "google-font-metadata";

export default function FontsList({
                                      fontsList,
                                      onFontChange,
                                  }: {
    fontsList: FontObjectV2[string][]
    onFontChange: (family: string) => void
}) {
    const [value, setValue] = useState('')

    const onChange = (v: string) => {
        setValue(v)
        onFontChange(v)
    }

    return (
        <div className="p-16 space-y-8">
            <div>
                <h1 className="text-green-700">With Virtualization</h1>
                <Select onValueChange={onChange} defaultValue={value}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                        <FixedSizeList
                            width={'100%'}
                            height={350}
                            itemCount={fontsList.length}
                            itemSize={40}
                        >
                            {({ index, style, isScrolling }) => (
                                <SelectItem
                                    value={fontsList[index].family}
                                    key={fontsList[index].family}
                                    style={{
                                        ...style,
                                    }}
                                >
                                    {fontsList[index].family}
                                </SelectItem>
                            )}
                        </FixedSizeList>
                    </SelectContent>
                </Select>
            </div>

        </div>
    )
}
