import {useEthers} from '@usedapp/core'
import {Button, makeStyles,Snackbar} from '@material-ui/core'
import detectEthereumProvider from '@metamask/detect-provider';
import { useState } from 'react';
import Alert from '@material-ui/lab/Alert'

const useStyles = makeStyles((theme) => ({
  container:{
    padding: theme.spacing(4),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1)
  }
}))


export const Header = () => {
    const classes = useStyles()
    const {account, activateBrowserWallet, deactivate} = useEthers()
    const isConnected = account !== undefined
    const [isActivatingWallet, setIsActivatingWallet] = useState<boolean>(false)
    const [isMetamaskUninstalled,setIsMetamaskUninstalled] = useState<boolean>(false)
    const activateWallet = async () => {
        setIsActivatingWallet(true)
        const provider = await detectEthereumProvider();
        if (!provider) {
            setIsMetamaskUninstalled(true)
            setTimeout(openMetaMaskInstallPage,3500)
            
        }
        activateBrowserWallet()
        setIsActivatingWallet(false)
    }

    const handleCloseSnack = () => {
        setIsMetamaskUninstalled(false)
    }

    const openMetaMaskInstallPage = () =>{
        window.open("https://metamask.io/download/")
    }
    return (
        <div className={classes.container}>
            <div>
                {isConnected ? (
                    <Button color="primary" variant="contained" onClick={deactivate}>
                        Disconnect
                    </Button>
                ) : (
                    <Button color="primary" variant="contained" disabled={isActivatingWallet? true : false} onClick={() => activateWallet()}>
                        Connect
                    </Button>
                )
                }
            </div>
            <Snackbar 
            open={isMetamaskUninstalled}
            autoHideDuration={5000}
            onClose={handleCloseSnack}>
            <Alert onClose={handleCloseSnack} severity="error">
                Please install metamask...
            </Alert>
            </Snackbar>  
        </div>
    )
}