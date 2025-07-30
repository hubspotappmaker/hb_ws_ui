"use client";

import { useEffect } from "react";
import { clarity } from "react-microsoft-clarity";

export default function Clarity() {
    useEffect(() => {
        clarity.init("sjv13v9f0e");
    }, []);
    return null;
}
