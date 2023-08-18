import React, { useState, useEffect } from 'react'
import { contractABI, contractAddress } from '@/lib/constants'
import { ethers, JsonRpcProvider } from 'ethers'


export const TransactionContext = React.createContext(null)
let eth = null

if (typeof window !== 'undefined') {
    eth = window.ethereum

    
}

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(eth) // ethers v5.7.2 and below
    // const provider = new ethers.BrowserProvider(eth); // ethers v6.0.0 and above
    console.log('provider', provider)

    const signer = provider.getSigner()
    console.log('signer', signer)

    console.log(contractAddress)
    console.log(contractABI)
    console.log(signer)

    const transactionContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
    )

    console.log('qweqwe here')

    return transactionContract
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        addressTo: '',
        amount: ''
    })

    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    const connectWallet = async (metamask = eth) => {
        try {
            if (!metamask) {
                return alert('Please install metamask')
            }
            const accounts = await metamask.request({method: 'eth_requestAccounts'})
            setCurrentAccount(accounts[0])
        } catch(error) {
            console.log(error)
            throw new Error('No ethereum object')
        }
    }

    const checkIfWalletIsConnected = async (metamask = eth) => {
        try {
            if (!metamask) {
                return alert('Please install metamask')
            }

            const accounts = await metamask.request({ method: 'eth_requestAccounts' })

            if (accounts.length) {  
                setCurrentAccount(accounts[0])
                console.log('Wallet is already connected')
            }
        } catch(error) {
            console.log(error)
        }
    }

    const sendTransaction = async (metamask=eth, connectedAccount=currentAccount) => {
        try {
            if (!metamask) return alert('Please install metamask')
            const { addressTo, amount } = formData
            const transactionContract = getEthereumContract()
            const parsedAmount = ethers.utils.parseEther(amount)

            await metamask.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        from: connectedAccount,
                        to: addressTo,
                        gas: '0x7EF40', // 52000 GWEI
                        value: parsedAmount._hex
                    }
                ]
            })

            const transactionHash = await transactionContract.publishTransaction(
                addressTo,
                parsedAmount,
                `Transferring ETH ${parsedAmount} to ${addressTo}`,
                `TRANSFER`
            )

            setIsLoading(true)

            await transactionHash.wait()

            // await saveTransaction(
            //     transactionHash.hash,
            //     amount,
            //     connectedAccount,
            //     addressTo
            // )

            setIsLoading(false)
        } catch(error) {
            console.log(error)
        }
    }

    const handleChange = (e, name) => {
        setFormData(prevState => ({ ...prevState, [name]: e.target.value }))
    }

    return (
        <TransactionContext.Provider
            value={{
                currentAccount,
                connectWallet,
                sendTransaction,
                handleChange,
                formData
            }}
        >   
            { children }
        </TransactionContext.Provider>
    )
}

