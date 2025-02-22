// import React from 'react'

// function TransactionContent() {
//   const transactions = [
//     { id: 1, name: "James Ovie", bank: "FIRST BANK NIGERIA", amount: "20,000", status: "successful", date: "Dec. 16. 16:20pm" },
//     { id: 2, name: "Patricia Eunice", bank: "UNITED BANK OF AFRICA", amount: "200,000", status: "pending", date: "Dec. 16. 16:20pm" },
//     { id: 3, name: "Leo Joseph", bank: "UNITED BANK OF AFRICA", amount: "200,000", status: "failed", date: "Dec. 16. 16:20pm" },
//     { id: 4, name: "Patricia Eunice", bank: "UNITED BANK OF AFRICA", amount: "200,000", status: "pending", date: "Dec. 16. 16:20pm" },
//     { id: 5, name: "James Ovie", bank: "FIRST BANK NIGERIA", amount: "20,000", status: "successful", date: "Dec. 16. 16:20pm" },
//     { id: 6, name: "Patricia Eunice", bank: "UNITED BANK OF AFRICA", amount: "200,000", status: "pending", date: "Dec. 16. 16:20pm" },
//   ];

//   return (
//     <div className="h-screen text-white px-4">
//       <div className="bg-gradient-to-b from-[#151021] via-[#151021] to-[#2f1256] rounded-t-2xl p-6 h-full flex flex-col">
//         <div className="flex justify-between mb-8">
//           <div className="flex rounded-full bg-[#352f3c] text-white">
//             <button className="bg-purple-600 px-6 py-2 rounded-full">All types</button>
//             <button className="px-4 py-2 ">Successful</button>
//             <button className="px-4 py-2 ">Pending</button>
//             <button className="px-4 py-2">Failed</button>
//           </div>
//           <button className="flex items-center bg-[#352f3c] px-6 py-2 rounded-full">
//             <span className="mr-2">Last 7 days</span>
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//           </button>
//         </div>

//         <div className="divide-y divide-gray-700 overflow-y-auto flex-1">
//           {transactions.map((transaction) => (
//             <div 
//               key={transaction.id}
//               className="flex justify-between items-center p-4"
//             >
//               <div className="flex items-center">
//                 <div className="w-12 h-12 bg-[#2c1053] rounded-full flex items-center justify-center mr-4">
//                   <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="font-medium">{transaction.name}</h3>
//                   <p className="text-sm text-gray-500">{transaction.bank}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className={`text-lg font-medium ${
//                   transaction.status === 'successful' ? 'text-green-500' :
//                   transaction.status === 'pending' ? 'text-yellow-500' :
//                   'text-red-500'
//                 }`}>
//                   NGN{transaction.amount}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)} | {transaction.date}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default TransactionContent

"use client"

import React, { useState } from 'react';

function TransactionContent() {
  const [selectedFilter, setSelectedFilter] = useState('All types');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const transactions = [
    { id: 1, name: "James Ovie", bank: "FIRST BANK NIGERIA", amount: "20,000", status: "successful", date: "Dec. 16. 16:20pm" },
    { id: 2, name: "Patricia Eunice", bank: "UNITED BANK OF AFRICA", amount: "200,000", status: "pending", date: "Dec. 16. 16:20pm" },
    { id: 3, name: "Leo Joseph", bank: "UNITED BANK OF AFRICA", amount: "200,000", status: "failed", date: "Dec. 16. 16:20pm" },
    { id: 4, name: "Patricia Eunice", bank: "UNITED BANK OF AFRICA", amount: "200,000", status: "pending", date: "Dec. 16. 16:20pm" },
    { id: 5, name: "James Ovie", bank: "FIRST BANK NIGERIA", amount: "20,000", status: "successful", date: "Dec. 16. 16:20pm" },
    { id: 6, name: "Patricia Eunice", bank: "UNITED BANK OF AFRICA", amount: "200,000", status: "pending", date: "Dec. 16. 16:20pm" },
  ];

  const filters = ['All types', 'Successful', 'Pending', 'Failed'];

  return (
    <div className="h-screen text-white px-2 sm:px-4">
      <div className="bg-gradient-to-b from-[#151021] via-[#151021] to-[#2f1256] rounded-t-2xl p-3 sm:p-4 lg:p-6 h-full flex flex-col">
        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 sm:mb-8">
          {/* Filter Buttons - Desktop */}
          <div className="hidden sm:flex rounded-full bg-[#352f3c] text-white">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 ${
                  selectedFilter === filter ? 'bg-purple-600 rounded-full' : ''
                } whitespace-nowrap text-sm lg:text-base`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Filter Dropdown - Mobile */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="w-full bg-[#352f3c] px-4 py-2 rounded-full flex justify-between items-center"
            >
              <span>{selectedFilter}</span>
              <svg className={`w-4 h-4 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isFilterDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#352f3c] rounded-lg overflow-hidden z-10">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setSelectedFilter(filter);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-[#453f4c] ${
                      selectedFilter === filter ? 'bg-purple-600' : ''
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Filter */}
          <button className="flex items-center justify-center bg-[#352f3c] px-4 sm:px-6 py-2 rounded-full text-sm lg:text-base whitespace-nowrap">
            <span className="mr-2">Last 7 days</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-gray-700 overflow-y-auto flex-1">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 gap-3 sm:gap-0"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2c1053] rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-sm sm:text-base">{transaction.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{transaction.bank}</p>
                </div>
              </div>
              <div className="text-right ml-14 sm:ml-0">
                <p className={`text-base sm:text-lg font-medium ${
                  transaction.status === 'successful' ? 'text-green-500' :
                  transaction.status === 'pending' ? 'text-yellow-500' :
                  'text-red-500'
                }`}>
                  NGN{transaction.amount}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)} | {transaction.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TransactionContent;