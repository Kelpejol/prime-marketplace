"use client"
import { ConnectButton, useSwitchActiveWalletChain } from "thirdweb/react";

import { createWallet } from "thirdweb/wallets";
import {useWindowWidth} from '@react-hook/window-size'
import {client} from "../client"
import { anvil } from "thirdweb/chains";
import { useCallback } from "react";
import  { generatePayload, isLoggedIn, login } from "../actions/login";
import { logout } from "../actions/logout";
import { chain } from "../contracts/constant";
 

interface ConnectWalletProps {
  size: 'primary' | 'secondary' | 'tertiary',
  color: 'primary' | 'secondary' | 'tertiary',
  onClick?: () => void
}

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.trustwallet.app"),
  createWallet("com.coinbase.wallet"),
  createWallet("app.phantom"),
];

export default function ConnectWallet({size, color, onClick}: ConnectWalletProps) {
 const width = useWindowWidth();
  const switchChain = useSwitchActiveWalletChain();


  const handleConnect = useCallback(async() => {
   switchChain(chain);
    onClick && onClick();
   
  }, [onClick, switchChain])
  
  const getButtonWidth = (size : string) => {
    if (width >= 1024) {
      if(size == "secondary") {
       return "160px"}
       else if(size == "primary") {
        return "130px"
       } else {
        return "100%"
       }
      }      
    else if (width >= 768) {
      if(size == "secondary") {
        return "144px"
      }
       else if (size == "primary") {
        return "128px"
       } else {
        return "100%"
       }
      }       
    else { 
      if(size == "secondary") {
     return "96px"
      } 
      else if(size == "primary") {
        return "96px"
      }else {
        return "100%"
      }  
     
  }                          
  };

  
  const getButtonHeight = (size: string) => {
    if (width >= 640) {
      if(size == "secondary") {
      return "48px"
      }
       else if (size == "primary") {
        return "44px"
       } else {
        return "100%"
       }
      } 
      else {  
        if(size == "secondary") {
        return "40px"
        } 
        else if (size == "primary") {
          return "40px"
        }  
        else {
          return "100%"
        }  
    
  }                          
  };

  
  const getFontSize = (size: string) => {
    if (width >= 640){
      if(size == "secondary") {
   return "14px"
      } 
      else if (size == "primary") {
        return "14px"
      } else {
        return "12px"
      }
      
      }
       else {       
    return "12px"
  }                         
  };
  return (
   <ConnectButton
    connectButton={{
    style: {
      color: "black",
      width: getButtonWidth(size),
      height: getButtonHeight(size),
      background: `${color == 'secondary' ? "white" : color == "primary" ? '#f5f5f5' : 'white'}`,
      fontWeight: "600",
      fontSize: getFontSize(size),
      padding: `${size == 'tertiary' && "12px 16px"}0 5px`,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "9px",
      minWidth: "96px",
    },
  }}
    signInButton={{
    style: {
      color: "black",
      width: getButtonWidth(size),
      height: getButtonHeight(size),
      background: `${color == 'secondary' ? "white" : color == "primary" ? '#f5f5f5' : 'white'}`,
      fontWeight: "600",
      fontSize: getFontSize(size),
      padding: `${size == 'tertiary' && "12px 16px"}0 5px`,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "9px",
      minWidth: "96px",
    },
  }}
  client={client}
  wallets={wallets}
   auth={{
    isLoggedIn: async (address) => {
      const authResult = await isLoggedIn(address);
      if (!authResult){
         return false;
      }
          return true;
    },
    doLogin: async (params) => {
      console.log("logging in!");
      await login(params);
    },
    getLoginPayload: async ({ address }) =>
     await generatePayload({ address }),
    doLogout: async () => {
      console.log("logging out!");
      await logout();
    },
  }}
  connectModal={{
    size: "compact",
    title: "Connect wallet",
    showThirdwebBranding: false,
  }}
  detailsButton={{
    style: {
      // width: "100%",
      // borderRadius: `${size == 'tertiary' && '0px'}`,
      fontSize: getFontSize(size),
      // `${size == "tertiary" && "8px"}`,
       borderRadius: "9px",
        width: getButtonWidth(size),
      height: getButtonHeight(size),
      minWidth: "96px",
    },
  }}
   onConnect={ handleConnect}
/>
)}