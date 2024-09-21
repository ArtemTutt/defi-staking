import React, { useEffect } from "react";
import s from "./MyError.module.css";

import { useWeb3 } from '../hooks/useWeb3';

export default function MyError({children}) {    
    return (
        <>
            <div className={s.container}>
                {children}
            </div>
        </>
    )
}