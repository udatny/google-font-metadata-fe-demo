"use client";

import {useEffect, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {FontObjectV2} from "google-font-metadata";
import {FixedSizeList} from "react-window";
import {CustomRange} from "@/components/CustomRange";

export default function FontSelector({allFonts}: { allFonts: FontObjectV2 }) {


    const [selectedFont, setSelectedFont] = useState<FontObjectV2[string] | null>(null);
    const [selectedSubset, setSelectedSubset] = useState<string>("all");
    const [selectedWeight, setSelectedWeight] = useState<string>("400");
    const [selectedStyle, setSelectedStyle] = useState<string>("normal");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [demoText, setDemoText] = useState<string>("The quick brown fox jumps over the lazy dog.");
    const [axisValues, setAxisValues] = useState<{ [key: string]: number }>({});
    const [fontCss2Url, setFontCss2Url] = useState<string>("");


    const [selectedPresetCategory, setSelectedPresetCategory] = useState<string>("all");

    // Get distinct subsets for filtering
    const fontArray = Object.values(allFonts);

    const subsets = ["all", ...new Set(fontArray.flatMap((font) => font.subsets))];
    const categories = ["all", ...new Set(fontArray.map((font) => font.category))];

    const googleFontsPreset: { category: string, fonts: string[] }[] = [];

    function generateFontCssUrl(selectedFont: FontObjectV2[string] | null, axisValues: {
        [key: string]: number
    }): string {
        if (!selectedFont) return "";

        const {family, axes} = selectedFont;
        const axisTags = Object.keys(axes);

        if (axisTags.length === 0) {
            return `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}&display=swap`;
        }

        // Sort axis tags: lowercase-first
        const sortedTags = [...axisTags].sort((a, b) => {
            const aIsLower = a[0] >= "a" && a[0] <= "z";
            const bIsLower = b[0] >= "a" && b[0] <= "z";
            if (aIsLower && !bIsLower) return -1;
            if (!aIsLower && bIsLower) return 1;
            return a.localeCompare(b);
        });

        const tagsString = sortedTags.join(",");

        let valuesString = "";
        if (selectedFont.isVariable) {
            valuesString = sortedTags
                .map(tag => {
                    const axis = axes![tag];
                    if (!axis) return ""; // or throw if tag must exist

                    if (tag === "ital") {
                        return axisValues[tag].toString();
                    } else {
                        return `${axis.min}..${axis.max}`;
                    }
                })
                .join(",");
        } else {

            valuesString = sortedTags.map((tag) => axisValues[tag]).join(",");
        }
        return `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:${tagsString}@${valuesString}&display=swap`;
    }


    const presetFontList = new Set(googleFontsPreset.flatMap((preset) => preset.fonts));

    // Filter fonts by selected subset
    const filteredFonts = Object.values(allFonts).filter((font) =>
        (selectedSubset === "all" || font.subsets.includes(selectedSubset)) &&
        (selectedCategory === "all" || font.category === selectedCategory) &&
        (selectedPresetCategory === "all" || presetFontList.has(font.family))
    );


    // Update selected font and reset settings
    const handleFontChange = (family: string) => {
        const font = Object.values(allFonts).find((f) => f.family === family) || null;
        setSelectedFont(font);

    };

    const subsetCounts = Object.values(allFonts).reduce((acc, font) => {
        font.subsets.forEach((subset) => {
            acc[subset] = (acc[subset] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const categoryCounts = Object.values(allFonts).reduce((acc, font) => {
        acc[font.category] = (acc[font.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const handleTagValueChange = (tag: string, value: number) => {
        setAxisValues((prev) => ({
            ...prev,
            [tag]: value,
        }));
    };

    useEffect(() => {
        if (selectedSubset == "arabic") {
            setDemoText("يقفز الثعلب البني السريع فوق الكلب الكسول.\n")
        } else {
            setDemoText("The quick brown fox jumps over the lazy dog.n")

        }
    }, [selectedSubset])

    useEffect(() => {
//        console.log("setting axes:" + JSON.stringify(axisValues))
        let newAxisValues = JSON.parse(JSON.stringify(axisValues))
//        console.log("setting axes:" + newAxisValues)
        // setFontVariationSettings(lastTextItem.id, newAxisValues)
        console.log("new axis values have been set=" + JSON.stringify(axisValues))
        const cssFontUrl = generateFontCssUrl(selectedFont, axisValues)
        setFontCss2Url(cssFontUrl)
    }, [axisValues])

    useEffect(() => {
        console.log("new selected font")
        if (selectedFont) {

            const newDefaultAxisValues = selectedFont.axes
                ? Object.fromEntries(
                    Object.entries(selectedFont.axes).map(([tag, axisDef]) => [tag, parseFloat(axisDef.default)])
                )
                : {};

            setAxisValues(newDefaultAxisValues)

            /*
                        let newAxesDefaultValues = {}
                        setAxisValues((prev) => {
                            console.log("setting new default axis values =" + JSON.stringify(newValues))
                            newAxesDefaultValues = newValues
                            return { ...newValues }; // or { ...prev, ...newValues } if you want to merge with existing
                        });

                        // Ensure a valid weight is selected
                        const validWeight = font.weights.includes(400) ? 400 : font.weights[0] || 400;
                        setSelectedWeight(validWeight);
                        setSelectedStyle("normal");
                        console.log("calling get cssfontUrl with :" + JSON.stringify(newAxesDefaultValues))
                        const cssFontUrl = generateFontCssUrl(font, newAxesDefaultValues)
                        setFontCss2Url(cssFontUrl)

             */
        }

    }, [selectedFont])


    return (
        <div>
            {/* Font Selection */}
            <div>
                <label className="font-semibold text-sm">Select Font:</label>

                {selectedFont?.family}
                <Select onValueChange={handleFontChange} defaultValue={selectedFont?.family}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a font">
                            {selectedFont?.family}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="select-content">
                        <FixedSizeList
                            width={'100%'}
                            height={350}
                            itemCount={filteredFonts.length}
                            itemSize={40}
                            initialScrollOffset={
                                selectedFont
                                    ? filteredFonts.findIndex(f => f.family === selectedFont.family) * 40
                                    : 0
                            }
                        >
                            {({index, style, isScrolling}) => (
                                <SelectItem
                                    value={filteredFonts[index].family}
                                    key={filteredFonts[index].family}
                                    style={{
                                        ...style,
                                    }}
                                >
                                    {filteredFonts[index].family}
                                </SelectItem>
                            )}
                        </FixedSizeList>
                    </SelectContent>
                </Select>

                {selectedFont && (<div>Supports:</div>)

                }
                {selectedFont && selectedFont?.subsets?.map((item, index) => (
                    <span
                        key={"charsupport-" + index}>{item}{index !== selectedFont.subsets.length - 1 ? ", " : ""}</span>
                ))}
            </div>

            {/* Filter by Preset */}
            <div>
                <label className="font-semibold text-sm">Filter by Preset:</label>
                <Select onValueChange={setSelectedPresetCategory} value={selectedPresetCategory}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="All fonts"/>
                    </SelectTrigger>
                    <SelectContent className="select-content">
                        <SelectItem value="all">All fonts</SelectItem>
                        <SelectItem value="preset">Only Preset Fonts</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Subset Filter */}
            <div>
                <label className="font-semibold text-sm">Filter by Subset:</label>
                <Select onValueChange={setSelectedSubset} value={selectedSubset}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="All subsets"/>
                    </SelectTrigger>
                    <SelectContent className="select-content">
                        {subsets.map((subset) => (
                            <SelectItem key={subset} value={subset}>
                                {subset} {subset !== "all" ? `(${subsetCounts[subset]})` : `(${allFonts.length})`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Category Filter */}
            <div>
                <label className="font-semibold text-sm">Filter by Category:</label>
                <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="All categories"/>
                    </SelectTrigger>
                    <SelectContent className="select-content">
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category} {category !== "all" ? `(${categoryCounts[category]})` : `(${allFonts.length})`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedFont?.axes && Object.keys(selectedFont.axes).length > 0 && (
                <div>
                    {Object.entries(selectedFont.axes).map(([tag, axe]) => {
                        const isStaticSingleValue = axe.values && axe.values.length === 1;

                        return (
                            <div key={tag} className="flex flex-col space-y-1">
                                <label className="font-semibold text-sm">
                                    {tag.toUpperCase()} ({axisValues[tag]} {axe.min} {axe.max}):
                                </label>

                                {axe.values?.length && (
                                    <div><CustomRange key={"cr"} allowedValues={axe.values} initialValue={axe.values[0]}   onChange={(value) => handleTagValueChange(tag, value)}></CustomRange>customrange</div>

                                )
                                }

                                {!axe.values?.length && (
                                    <input
                                        type="range"
                                        min={parseFloat(axe.min)}
                                        max={parseFloat(axe.max)}
                                        step={
                                            axe.values
                                                ? Math.min(
                                                    ...axe.values.map((v, i, arr) =>
                                                        i > 0 ? v - arr[i - 1] : v
                                                    )
                                                )
                                                : parseFloat(axe.step) || 1
                                        }
                                        value={axisValues[tag] ?? parseFloat(axe.min)}
                                        onChange={(e) => handleTagValueChange(tag, parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                ) }
                            </div>
                        );
                    })}
                </div>
            )}


            {/* Font Preview */}
            {selectedFont && fontCss2Url && (
                <div>
                    <div>{fontCss2Url}</div>
                    <div className="mt-4 p-4 border rounded-lg shadow-md bg-gray-50">
                        {/* Import correct Google Fonts CSS */}
                        <link rel="stylesheet" href={fontCss2Url}/>

                        <p
                            className="text-3xl"
                            style={{
                                fontFamily: `'${selectedFont.family}', sans-serif`,
                                fontWeight: selectedFont.axes && Object.keys(selectedFont.axes).length > 0
                                    ? undefined // Variable fonts use fontVariationSettings
                                    : Number(selectedWeight) || 400,
                                fontStyle: selectedStyle,
                                ...(selectedFont.axes && Object.keys(selectedFont.axes).length > 0
                                    ? {
                                        fontVariationSettings: Object.entries(axisValues)
                                            .map(([tag, value]) => `"${tag}" ${value}`)
                                            .join(", "),
                                    }
                                    : {}),
                            }}
                        >
                            {demoText}
                        </p>
                    </div>
                </div>
            )}

            {
                selectedFont && (
                    <pre>{JSON.stringify(selectedFont, null, 2)}</pre>
                )
            }

        </div>
    );
}
