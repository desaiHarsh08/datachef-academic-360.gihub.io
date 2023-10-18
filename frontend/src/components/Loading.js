import React from 'react'

const Loading = () => {
  return (
    <>
  
    <div id='loading-container' className='absolute bg-slate-300 w-full left-0 top-0 h-1'>
        <div className='loading w-full h-full animate-pulse bg-blue-500 ' id='loading'>
        </div>
    </div>
    </>
  )
}

export default Loading
