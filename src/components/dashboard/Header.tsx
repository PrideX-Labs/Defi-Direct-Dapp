"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useWallet } from "@/context/WalletContext"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Bell, MenuIcon, ChevronDown, Settings, LogOut, ExternalLink, Copy, Check } from "lucide-react"

const Header: React.FC<{
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setIsMobileMenuOpen }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { connectedAddress, disconnectWallet, walletIcon, walletName } = useWallet()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getPageTitle = () => {
    if (pathname?.includes("transaction")) return "Transactions"
    if (pathname?.includes("settings")) return "Settings"
    return (
      <span className="inline-flex items-center">
        Welcome <span className=" animate-bounce inline-block">👋</span>
      </span>
    )
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleLogout = async () => {
    try {
      await disconnectWallet()
      toast.success("Logged out successfully")
      router.push("/")
      setIsDropdownOpen(false)
    } catch (error) {
      toast.error("Error during logout")
      console.error("Logout error:", error)
    }
  }

  const handleSettingsClick = () => {
    router.push("/settings")
    setIsDropdownOpen(false)
  }

  const copyAddress = () => {
    if (!connectedAddress) return
    navigator.clipboard.writeText(connectedAddress)
    setCopied(true)
    toast.success("Address copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
    setIsDropdownOpen(false)
  }

  const viewOnExplorer = () => {
    // Implement your explorer logic here
    setIsDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative flex justify-center bg-[#0A0014] items-center w-full">
      <div className="px-4 sm:px-6 lg:px-10 py-3 lg:py-4 w-full max-w-screen-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">{getPageTitle()}</h1>

          <div className="flex items-center">
            <div className="hidden lg:flex items-center space-x-6">
              <button className="relative group">
                <Bell className="text-white h-6 w-6 cursor-pointer hover:text-purple-400 transition-colors" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full"></span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full opacity-30 group-hover:animate-ping"></span>
              </button>

              {connectedAddress ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center bg-gradient-to-r from-[#1A0E2C] to-[#2A1C44] px-4 py-2 rounded-full space-x-3 cursor-pointer shadow-md hover:from-[#2A1C44] hover:to-[#3A2C54] transition-all duration-300"
                  >
                    <div className="flex flex-col items-end mr-2">
                      <p className="text-white text-sm font-medium">{truncateAddress(connectedAddress)}</p>
                      <p className="text-gray-400 text-xs">{walletName || "Connected Wallet"}</p>
                    </div>
                    <ChevronDown
                      className={`text-purple-400 h-4 w-4 transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center p-0.5 shadow-md border-2 border-purple-500">
                      {walletIcon ? (
                        <img
                          src={walletIcon || "/placeholder.svg"}
                          alt="Wallet"
                          className="w-full h-full rounded-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-purple-600/20 flex items-center justify-center">
                          <Settings className="h-4 w-4 text-purple-500" />
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Custom Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden shadow-lg bg-gradient-to-b from-[#1A0E2C] to-[#2A1C44] z-50 border border-purple-900/20">
                      <div className="p-3 border-b border-purple-900/20">
                        <p className="text-gray-400 text-xs mb-1">Connected Wallet</p>
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm font-medium">{truncateAddress(connectedAddress)}</p>
                          <button
                            onClick={copyAddress}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={viewOnExplorer}
                          className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-white hover:bg-purple-900/20 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 text-purple-400" />
                          <span className="text-sm">View on Explorer</span>
                        </button>
                        <button
                          onClick={handleSettingsClick}
                          className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-white hover:bg-purple-900/20 transition-colors"
                        >
                          <Settings className="h-4 w-4 text-purple-400" />
                          <span className="text-sm">Settings</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-white hover:bg-purple-900/20 transition-colors"
                        >
                          <LogOut className="h-4 w-4 text-purple-400" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <ConnectButton />
              )}
            </div>

            <div className="flex lg:hidden items-center space-x-3">
              {connectedAddress && (
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5 border-2 border-purple-500">
                  {walletIcon ? (
                    <img
                      src={walletIcon || "/placeholder.svg"}
                      alt="Wallet"
                      className="w-full h-full rounded-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-purple-600/20 flex items-center justify-center">
                      <Settings className="h-4 w-4 text-purple-500" />
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="p-2 hover:bg-[#1A0E2C] rounded-lg transition-colors"
              >
                <MenuIcon className="text-white h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  )
}

export default Header
