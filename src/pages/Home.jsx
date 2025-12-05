import React from 'react'
import Forms from '../components/forms'

const Home = () => {
  return (
    <div className=' indie-flower-regular flex justify-evenly max-lg:flex-col max-lg:items-center p-10 max-lg:p-5 max-md:p-2'>
      <div className='flex flex-col w-1/2 max-lg:items-center'>

        <h1 className=' text-zinc-700 text-9xl max-lg:text-6xl max-lg:text-center max-md:text-5xl max-sm:text-5xl  mt-20 mb-10'>
          Think Space
        </h1>
        <p className='text-6xl max-lg:text-lg tracking-wides leading-tight max-lg:text-center font-thin text-zinc-400'>A space to brainstorm freely and unleash your creativity</p>
      </div>
      <Forms className={"w-1/2"} />
    </div>
  )
}


export default Home