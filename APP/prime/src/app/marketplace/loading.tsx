
"use client"

import {PuffLoader} from 'react-spinners'

  
export default function Loading() {
    return (
            <div className='h-[70vh] flex flex-col justify-center items-center'>
        <PuffLoader size={100} color='red'
        />
      
    </div>
    )
  }

