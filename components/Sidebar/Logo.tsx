"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";


const Logo = () => {
    //update the size of the logo when the size of the screen changes
    const [width, setWidth] = useState(0);

    const updateWidth = () => {
        const newWidth = window.innerWidth;
        setWidth(newWidth);
    };

    useEffect(() => {
        window.addEventListener("resize", updateWidth);
        updateWidth();
    }, []);

    // change between the logo and the button when the user scrolls
    const [showButton, setShowButton] = useState(false);

    const changeNavButton = () => {
        if (window.scrollY >= 400 && window.innerWidth < 768) {
            setShowButton(true);
        } else {
            setShowButton(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", changeNavButton);
    }, []);

    return (
        <>
            <Link href="/" style={{ display: showButton ? "none" : "block" }}>
                <Image src="/images/opera_logo_transparent.png" alt="Logo" width={100} height={100}
                       className="col-span-2 max-h-14 w-full object-contain lg:col-span-1" />
            </Link>
        </>
    );
};

export default Logo;