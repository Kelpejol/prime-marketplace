"use client"
import {useWindowWidth} from '@react-hook/window-size'
import MyLogo from './MyLogo';
import {useMemo} from "react"

export default function Logo() {
    const width = useWindowWidth();

    const size = useMemo(() => {
         
         if (width >= 768) {
            return "100px"
        }       
        
         else {
            return '80px'
        }                        
    }, [width])

    return (
        <div className=" flex items-start cursor-pointer">
            <div className="flex items-start">
                 <MyLogo 
            width={size} 
            className="flex-shrink-0" // Prevent logo from growing/shrinking
        />
            </div>
        </div>
    )
}