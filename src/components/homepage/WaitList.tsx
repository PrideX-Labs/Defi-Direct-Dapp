import React from 'react'

function WaitList() {
  return (
    <div className='flex flex-col items-center justify-center py-10 border border-purple-500 rounded-full mx-24'>
        <h1 className='text-5xl font-bold'>Join the waitlist</h1>
        <p className='text-xl'>We are developing the next generation of Defi wallet</p>
        <div className='flex mt-10'>
        <input type="email" placeholder='enter your mail' className=' text-black rounded-l-full pl-4 border-0'/>
        <button type='submit' className='bg-purple-500 rounded-r-full px-6 py-4 font-bold'>Join</button>
        </div>
    </div>
  )
}

export default WaitList