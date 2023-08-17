import React, { useState, useEffect } from 'react'

export const TransactionContext = React.createContext(null)
let eth = null

if (typeof window !== 'undefined') {
    eth = window.ethereum
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState()

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

    return (
        <TransactionContext.Provider
            value={{
                currentAccount,
                connectWallet
            }}
        >   
            { children }
        </TransactionContext.Provider>
    )
}
