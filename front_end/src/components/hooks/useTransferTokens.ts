import {useContractFunction, useEthers} from '@usedapp/core'
import TokenFarm from '../../chain-info/contracts/TokenFarm.json'
import ERC20 from '../../chain-info/contracts/MockERC20.json'
import networkMapping from '../../chain-info/deployments/map.json'
import {constants, utils} from 'ethers'
import {Contract} from '@ethersproject/contracts'
import { useState, useEffect } from 'react'
// address _senderAddress = tokenAddress,
//address _receiverAddress,
//uint256 _amount
export const useTransferTokens = (tokenAddress: string) => {
    
    const {chainId} = useEthers()
    const {abi} = TokenFarm
    const  tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    

    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)
    const [receiverAddress, setReceiverAddress] = useState("0")
    const [amount, setAmount] = useState("0")


    const {send: approveErc20Send, state: approveAndTransferErc20State} = 
    useContractFunction(erc20Contract, "transfer", 
        {transactionName: "Approve ERC20 transfer",
        })

    
    const approveAndTransfer = (receiverAddress: string, amount: string) => {
        setReceiverAddress(receiverAddress)
        setAmount(amount)
        return approveErc20Send(receiverAddress,amount)
    }


    return {approveAndTransfer, state: approveAndTransferErc20State}
}