import {useContractFunction, useEthers} from '@usedapp/core'
import TokenFarm from '../../chain-info/contracts/TokenFarm.json'
import ERC20 from '../../chain-info/contracts/MockERC20.json'
import networkMapping from '../../chain-info/deployments/map.json'
import {constants, utils} from 'ethers'
import {Contract} from '@ethersproject/contracts'
import { useState, useEffect } from 'react'

export const useUnstakeTokens = (tokenAddress: string) => {

    const {chainId} = useEthers()
    const {abi} = TokenFarm
    const  tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    

    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)

    const {send: approveErc20Send, state: approveAndUnstakeErc20State} = 
    useContractFunction(erc20Contract, "approve", 
        {transactionName: "Approve ERC20 transfer",
        })

    const approveAndUnStake = (amount: string) => {
        return approveErc20Send(tokenFarmAddress, amount)
    }

    const {send: unStakeSend, state: unStakeState} = 
    useContractFunction(tokenFarmContract, 
                        "unstakeTokens", 
                        {transactionName: "Unstake Tokens",})

    useEffect(() => {
            if(approveAndUnstakeErc20State.status === "Success"){
                unStakeSend(tokenAddress)
            }
        },[approveAndUnstakeErc20State, tokenAddress])

    const [state, setState] = useState(approveAndUnstakeErc20State)

    useEffect(() =>{
        if(approveAndUnstakeErc20State.status === "Success"){
            setState(unStakeState)
        }
        else {
            setState(approveAndUnstakeErc20State)
        }
    }, [approveAndUnstakeErc20State, unStakeState, tokenAddress])

    return {approveAndUnStake, state}
}