// src/app/Wallet.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useConnect, useAccount, useSignMessage, useDisconnect } from 'wagmi'
import { SiweMessage } from 'siwe'

export default function Wallet() {
  const { connect, connectors } = useConnect()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { signMessage } = useSignMessage()
  const [domain, setDomain] = useState('')
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomain(window.location.host)
      setOrigin(window.location.origin)
    }
  }, [])

  const createSiweMessage = (address, statement) => {
    const message = new SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: '1',
      chainId: 1,
    })
    return message.prepareMessage()
  }

  const handleConnect = async (connector) => {
    await connect({ connector })
  }

  const handleSignIn = async () => {
    const message = createSiweMessage(address, 'Sign in with Ethereum to the app.')
    const signature = await signMessage({ message })
    console.log('Signature:', signature)
  }

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected as {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
          <button onClick={handleSignIn}>Sign-in with Ethereum</button>
        </div>
      ) : (
        <div>
          {connectors.map((connector) => (
            <button key={connector.id} onClick={() => handleConnect(connector)}>
              Connect with {connector.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
