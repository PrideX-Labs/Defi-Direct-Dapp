import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsContentSkeleton() {
  return (
    <div className="text-white w-full max-w-6xl mx-auto px-4">
      <div className="bg-gradient-to-b from-[#151021] via-[#151021] to-[#160429] rounded-2xl py-6 px-4 sm:px-8 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Wallet Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              {/* Wallet Icon */}
              <Skeleton className="w-24 h-24 rounded-full bg-white/10" />

              <div className="flex flex-col items-center md:items-start">
                {/* Address */}
                <Skeleton className="h-8 w-40 bg-white/10 mb-2" />

                {/* Wallet Name */}
                <Skeleton className="h-6 w-24 bg-white/10 mb-2" />

                {/* View Explorer Button */}
                <Skeleton className="h-9 w-32 bg-white/10 rounded-xl" />
              </div>
            </div>

            {/* Chain Info */}
            <div className="w-full mb-6">
              <Skeleton className="h-7 w-40 bg-white/10 mb-3" />
              <Skeleton className="h-14 w-full bg-white/10 rounded-lg" />
            </div>

            {/* Disconnect Button */}
            <Skeleton className="h-12 w-full md:w-48 bg-purple-600/30 rounded-xl" />
          </div>

          {/* Right Column - Network Switcher */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-7 w-40 bg-white/10" />
              <Skeleton className="h-9 w-32 bg-white/10 rounded-lg" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 h-[350px] bg-[#1A0E2C]/50 rounded-xl p-3">
              {[...Array(9)].map((_, index) => (
                <Skeleton key={index} className="h-12 w-full bg-white/10 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
