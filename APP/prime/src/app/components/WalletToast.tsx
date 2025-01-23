"use client"
import React from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Wallet } from 'lucide-react'

 export const showToast = () => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-black text-card-foreground shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 text-white w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Wallet className="h-10 w-10 text-white text-primary" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white text-foreground">
                  Connect your wallet
                </p>
                <p className="mt-1 text-sm text-white text-muted-foreground">
                  Please connect your wallet to continue.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: 'bottom-right',
      }
    )
  }
const WalletToast = () => {

  return (
    <>  
      <Toaster />
    </>
  )
}

export default WalletToast

