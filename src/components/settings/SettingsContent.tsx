"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/context/WalletContext"
import { useAccount, useSwitchChain, useChainId } from "wagmi"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  cronos,
  cronosTestnet,
  scroll,
  scrollSepolia,
  base,
  sepolia,
  arbitrum,
  polygon,
  bsc,
  avalanche,
  lisk,
  liskSepolia,
  eduChain,
  eduChainTestnet,
} from "wagmi/chains"
import { Copy, ExternalLink, Wallet, ArrowRight, Check } from "lucide-react"
import SettingsContentSkeleton from "@/components/settings/settings-content-skeleton"
import { getChainLogo, getChainColor } from "@/utils/chain-logos"

function SettingsContent() {
  const { connectedAddress, disconnectWallet, walletIcon, walletName } = useWallet()
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const chainId = useChainId()
  const [isConnected, setIsConnected] = useState<boolean>(!!connectedAddress)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showAllNetworks, setShowAllNetworks] = useState(false)
  const [activeTab, setActiveTab] = useState<"popular" | "all" | "testnet">("popular")

  // Include all supported chains from your wagmi config
  const allChains = [eduChain, cronos, scroll, lisk, base, arbitrum, polygon, bsc, avalanche]

  const testnetChains = [cronosTestnet, scrollSepolia, sepolia, liskSepolia, eduChainTestnet]

  // Popular networks to show by default
  const popularNetworks = [eduChain, cronos, base, arbitrum, polygon, bsc]

  // Networks to display based on active tab
  const getDisplayedNetworks = () => {
    switch (activeTab) {
      case "popular":
        return popularNetworks
      case "all":
        return allChains
      case "testnet":
        return testnetChains
      default:
        return popularNetworks
    }
  }

  const truncateAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleDisconnect = () => {
    disconnectWallet()
    setIsConnected(false)
    toast.success("Wallet disconnected")
  }

  const copyAddress = () => {
    if (!connectedAddress) return
    navigator.clipboard.writeText(connectedAddress)
    setCopied(true)
    toast.success("Address copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const viewOnExplorer = () => {
    if (!connectedAddress || !chain) return
    const explorerUrl = chain.blockExplorers?.default?.url
    if (explorerUrl) {
      window.open(`${explorerUrl}/address/${connectedAddress}`, "_blank")
    }
  }

  useEffect(() => {
    if (connectedAddress) {
      setIsConnected(true)
    }

    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [connectedAddress])

  if (loading) {
    return <SettingsContentSkeleton />
  }

  return (
    <div className="text-white w-full max-w-6xl mx-auto px-4">
      {isConnected && connectedAddress && (
        <div className="bg-gradient-to-b from-[#151021] via-[#151021] to-[#160429] rounded-2xl py-6 px-4 sm:px-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Wallet Info */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                {/* Wallet Icon */}
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-1 shadow-md">
                  {walletIcon ? (
                    <img
                      src={walletIcon || "/placeholder.svg"}
                      alt={walletName || "Wallet"}
                      className="w-full h-full rounded-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-purple-600/20 flex items-center justify-center">
                      <Wallet className="w-12 h-12 text-purple-500" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center md:items-start">
                  {/* Clickable Address */}
                  <button
                    onClick={copyAddress}
                    className="group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-[#2A1C44]"
                  >
                    <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                      {truncateAddress(connectedAddress)}
                    </h2>
                    <span className="absolute right-0 opacity-0 group-hover:opacity-100 group-hover:right-2 transition-all duration-200">
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-purple-400" />
                      )}
                    </span>
                  </button>

                  <p className="text-lg text-gray-400 mb-2">{walletName || "Connected Wallet"}</p>

                  {/* Address Actions */}
                  <button
                    onClick={viewOnExplorer}
                    className="flex items-center gap-2 bg-[#2A1C44] hover:bg-[#3A2C54] text-white py-2 px-4 rounded-xl transition-all duration-200 shadow-md text-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Explorer</span>
                  </button>
                </div>
              </div>

              {/* Chain Info */}
              <div className="w-full mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <div className="w-1.5 h-5 bg-purple-600 rounded-full mr-2"></div>
                  Current Network
                </h3>
                <div className="bg-[#1A0E2C] p-4 rounded-xl flex justify-between items-center shadow-md border border-purple-900/20">
                  <div className="flex items-center gap-3">
                    {chain?.id && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: getChainColor(chain.id) + "20" }}
                      >
                        <img
                          src={getChainLogo(chain.id) || "/placeholder.svg"}
                          alt={chain.name}
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "https://cryptologos.cc/logos/ethereum-eth-logo.png"
                          }}
                        />
                      </div>
                    )}
                    <span className="font-medium">{chain?.name || "Unknown Network"}</span>
                  </div>
                  <span className="text-gray-400 text-sm bg-[#2A1C44] px-3 py-1 rounded-full">ID: {chainId}</span>
                </div>
              </div>

              {/* Disconnect Button */}
              <button
                onClick={handleDisconnect}
                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium py-3 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all duration-200 w-full md:w-auto"
              >
                <span>Disconnect Wallet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Column - Network Switcher */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center">
                  <div className="w-1.5 h-5 bg-purple-600 rounded-full mr-2"></div>
                  Switch Network
                </h3>

                {/* Network Tabs */}
                <div className="flex bg-[#1A0E2C] rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab("popular")}
                    className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                      activeTab === "popular" ? "bg-purple-600" : "hover:bg-[#2A1C44]"
                    }`}
                  >
                    Popular
                  </button>
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                      activeTab === "all" ? "bg-purple-600" : "hover:bg-[#2A1C44]"
                    }`}
                  >
                    Mainnet
                  </button>
                  <button
                    onClick={() => setActiveTab("testnet")}
                    className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                      activeTab === "testnet" ? "bg-purple-600" : "hover:bg-[#2A1C44]"
                    }`}
                  >
                    Testnet
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 h-[350px] overflow-y-auto pr-1 bg-[#1A0E2C]/50 rounded-xl p-3">
                {getDisplayedNetworks().map((network) => (
                  <button
                    key={network.id}
                    onClick={() => switchChain({ chainId: network.id })}
                    className={`flex items-center gap-2 p-3 rounded-xl transition-all duration-200 shadow-md ${
                      chainId === network.id
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-[#1A0E2C] hover:bg-[#2A1C44] border border-purple-900/20"
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: getChainColor(network.id) + "20" }}
                    >
                      <img
                        src={getChainLogo(network.id) || "/placeholder.svg"}
                        alt={network.name}
                        className="w-4 h-4 rounded-full"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "https://cryptologos.cc/logos/ethereum-eth-logo.png"
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium truncate">{network.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!isConnected && (
        <div className="bg-gradient-to-b from-[#151021] via-[#151021] to-[#160429] rounded-2xl py-16 px-6 text-center shadow-lg">
          <div className="w-20 h-20 mx-auto bg-[#2A1C44] rounded-full flex items-center justify-center mb-6">
            <Wallet className="w-10 h-10 text-purple-500" />
          </div>
          <h3 className="text-xl font-medium mb-4 text-white">No Wallet Connected</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Connect your wallet to view settings and manage your account.
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium py-3 px-8 rounded-xl shadow-lg transition-all duration-200">
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  )
}

export default SettingsContent
