import Image from "next/image";
import FontSelector from "@/components/FontSelector";
import {loadFonts} from "@/app/api/fonts/loadFonts";


export default async function Home() {

    const allFonts = await loadFonts()
    console.log("Number of fonts:", Object.keys(allFonts).length);

    return (
    <div>
      <FontSelector allFonts={allFonts}></FontSelector>
    </div>
  );
}
