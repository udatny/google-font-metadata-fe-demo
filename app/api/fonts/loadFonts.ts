'use server'

import {APIv2, APIv2Hybrid} from "google-font-metadata";

export async function loadFonts() {
    return APIv2Hybrid;
}
