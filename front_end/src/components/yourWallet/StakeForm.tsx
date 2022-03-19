import { formatUnits } from "@ethersproject/units";
import { Button, Input,CircularProgress, Snackbar} from "@material-ui/core";
import { useEthers,useTokenBalance,useNotifications } from "@usedapp/core";
import Alert from '@material-ui/lab/Alert'
import React, { useEffect, useState } from "react";
import { Token } from "../Main";
import {useStateTokens} from '../hooks/useStakeTokens'
import {utils} from 'ethers'
import { useUnstakeTokens } from "../hooks/unstakeTokens";
import { useTransferTokens } from "../hooks/useTransferTokens";

export interface StakeFormProps{
    token: Token
}

export const StakeForm = ({token} : StakeFormProps) => {
    const {address: tokenAddress, name} = token
    const {account} = useEthers()
    const tokenBalance = useTokenBalance(tokenAddress, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const {notifications} = useNotifications()

    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const [amountTransfer, setAmountTransfer] =  useState<number | string | Array<number | string>>(0)
    const [addressTo, setAddressTo] = useState<string>("0")


    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
    }

    const {approveAndStake, state: approveAndStakeErc20State} = useStateTokens(tokenAddress)

    const handleStakeSubmit = () => {
        const amoutAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amoutAsWei.toString())
    }

    const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] = useState(false)
    const [showStakeTokenSuccess, setShowStakeTokenSucess] = useState(false)
    const [showTransferTokenSuccess, setShowTransferTokenSuccess] = useState(false)
    const [showUnstakeTokenSuccess, setShowUnstakeTokenSuccess] = useState(false)

    useEffect(() => {
        if (notifications.filter(
            (notification) => 
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Approve ERC20 transfer").length > 0)
            {
                setShowErc20ApprovalSuccess(true)
                setShowStakeTokenSucess(false)
                setShowUnstakeTokenSuccess(false)
            }
        if (notifications.filter(
            (notification) => 
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Stake Tokens").length > 0)
            {
                setShowErc20ApprovalSuccess(false)
                setShowStakeTokenSucess(true)
            }
        if (notifications.filter(
            (notification) => 
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Approve ERC20 transfer tokens to").length > 0)
            {
                setShowErc20ApprovalSuccess(false)
                setShowTransferTokenSuccess(true)
            }
        if (notifications.filter(
            (notification) => 
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Unstake Tokens").length > 0)
            {   
                setShowErc20ApprovalSuccess(false)
                setShowUnstakeTokenSuccess(true)
            }
        }, [notifications, showErc20ApprovalSuccess, setShowStakeTokenSucess,setShowUnstakeTokenSuccess,setShowTransferTokenSuccess])

    
    const handleCloseSnack = () => {
        setShowErc20ApprovalSuccess(false)
        setShowStakeTokenSucess(false)
        setShowTransferTokenSuccess(false)
        setShowUnstakeTokenSuccess(false)
    }
    const {approveAndUnStake, state: approveAndUnstakeErc20State} = useUnstakeTokens(tokenAddress)
    //const 
    const {approveAndTransfer, state: approveAndTransferErc20State} = useTransferTokens(tokenAddress)
    const handleUnstakeSubmit = () => {
        return approveAndUnStake(tokenAddress)
    }

    const isMining = approveAndStakeErc20State.status === "Mining" ||
                     approveAndUnstakeErc20State.status === "Mining" ||
                     approveAndTransferErc20State.status === "Mining"


    const handleTransferSubmit = () =>{
        const amoutAsWei = utils.parseEther(amountTransfer.toString())
        approveAndTransfer(addressTo,amoutAsWei.toString())
    }
    const buttonStyle = {
        marginLeft: '15px',
    }

    const handleOnChangeAddressTo = (event: React.ChangeEvent<HTMLInputElement>) =>{
        const newAddress = event.target.value
        setAddressTo(newAddress)
    }

    const handleOnChangeAmountTransfer = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmountTransfer(newAmount)
    }
    


    return (
        <>  
        <div>
            <Input placeholder="Amount" onChange={handleOnChange}/>
            <Button variant="contained" 
                    color="primary"
                    style={buttonStyle} 
                    size="medium" disabled={isMining}
                    onClick={()=> handleStakeSubmit()}>
            {
            isMining ? <CircularProgress size={26}/> : "STAKE"
            }</Button>
        </div>
        <div>
        {/*unstake tokens*/}
            <Button variant="contained" 
                    color="primary" 
                    size="medium" 
                    disabled={isMining} 
                    onClick={()=> handleUnstakeSubmit()}>
                    {
                isMining ? <CircularProgress size={26}/> : "UNSTAKE"
            }</Button>
        </div>
        {/*transfer tokens approveAndTransfer*/}
        <div>
            <Input placeholder="Address To" style={{width: '400px'}} onChange={handleOnChangeAddressTo}/>
            <Input style={{marginLeft: '10px',width: '80px'}} placeholder="Amount" onChange={handleOnChangeAmountTransfer}/>
            <Button variant="contained" 
                    color="primary" 
                    style={{marginLeft: '10px'}} 
                    size="medium" 
                    disabled={isMining} 
                    onClick={()=> handleTransferSubmit()}>
                    {
                isMining ? <CircularProgress size={26}/> : "TRANSFER"
            }</Button>
        </div>
        <Snackbar 
            open={showErc20ApprovalSuccess}
            autoHideDuration={5000}
            onClose={handleCloseSnack}>
            <Alert onClose={handleCloseSnack} severity="success">
                ERC-20 token transfer approved! Now approve the 2nd transaction.    
            </Alert>
        </Snackbar>
        <Snackbar 
            open={showStakeTokenSuccess}
            autoHideDuration={5000}
            onClose={handleCloseSnack}>
            <Alert onClose={handleCloseSnack} severity="success">
                Tokens Staked!   
            </Alert>
        </Snackbar>  
        <Snackbar 
            open={showTransferTokenSuccess}
            autoHideDuration={5000}
            onClose={handleCloseSnack}>
            <Alert onClose={handleCloseSnack} severity="success">
                Tokens Transfered !  
            </Alert>
        </Snackbar>  
        <Snackbar 
            open={showUnstakeTokenSuccess}
            autoHideDuration={5000}
            onClose={handleCloseSnack}>
            <Alert onClose={handleCloseSnack} severity="success">
                Tokens Unstaked ! 
            </Alert>
        </Snackbar>  
        </>
    )
}