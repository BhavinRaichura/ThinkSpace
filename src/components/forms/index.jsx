import React from 'react'
import CreateRoomForm from './CreateRoomForm'

const Forms = () => {
  return (
    <div className='my-20 max-20 max-lg:my-10 max-md:mx-5'>
      <div className='flex justify-center items-center  max-md:flex-col gap-10'>    
          <CreateRoomForm />
      </div>
    </div>
  )
}

export default Forms