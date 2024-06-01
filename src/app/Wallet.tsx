'use client'

import React, { useState, useEffect } from 'react'
import { useConnect, useAccount, useSignMessage, useDisconnect } from 'wagmi'
import { SiweMessage } from 'siwe'
import { v4 as uuidv4 } from 'uuid'

export default function Wallet() {
  const { connect, connectors } = useConnect()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { signMessage } = useSignMessage()
  const [domain, setDomain] = useState('')
  const [origin, setOrigin] = useState('')
  const [nonce, setNonce] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomain(window.location.host)
      setOrigin(window.location.origin)
    }
  }, [])

  // 创建SIWE消息的方法
  const createSiweMessage = (address, statement, nonce) => {
    const message = new SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: '1',
      chainId: 1,
      nonce,
    })
    return message.prepareMessage()
  }

  // 处理钱包连接的方法
  const handleConnect = async (connector) => {
    await connect({ connector })
  }

  // 处理以太坊登录的方法
  const handleSignIn = async () => {
    const newNonce = uuidv4()
    setNonce(newNonce)
    const message = createSiweMessage(address, 'Sign in with Ethereum to the app.', newNonce)
    const signature = await signMessage({ message })
    console.log('Signature:', signature)
    console.log('Nonce:', newNonce)
  
    const response = await fetch('/api/verify-siwe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, signature })
    })
  
    const data = await response.json()
    console.log('Verification Response:', data)
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