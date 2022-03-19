import * as React from 'react';
import { Token } from '../Main';
import { useEthers, useTokenBalance,useContractFunction } from '@usedapp/core';
import { formatUnits } from '@ethersproject/units'
import {BalanceMsg} from '../BalanceMsg'
import networkMapping from '../../chain-info/deployments/map.json'
import {constants, utils} from 'ethers'
import {Contract} from '@ethersproject/contracts'
import TokenFarm from '../../chain-info/contracts/TokenFarm.json'

export interface WalletBalanceProps {
    token: Token
}
export const WalletBalance = ({token} : WalletBalanceProps) => {
    const {chainId,account} = useEthers()
    const {image, address, name} = token
    const {abi} = TokenFarm

    const tokenBalance = useTokenBalance(address, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)


    const {send: callGet, state: statusGet} = 
    useContractFunction(tokenFarmContract, 
                        "getUserTotalValue", 
                        {transactionName: "Get User Total Value",})
       
    
      
    
    return (
        <BalanceMsg 
            label={`Your un-staked ${name} balance`} 
            amount={formattedTokenBalance}  
            tokenImgSrc={image}
        />
    )
}