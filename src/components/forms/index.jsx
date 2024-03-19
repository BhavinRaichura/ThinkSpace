import React from 'react'
import CreateRoomForm from './CreateRoomForm'
import JoinRoomForm from './JoinRoomForm'

const Forms = () => {
  return (
    <div className='my-20 max-20 max-md:mx-10'>
      <div className='flex justify-center items-center  max-md:flex-col gap-10'>    
          <CreateRoomForm />
          <JoinRoomForm />
      </div>
    </div>
  )
}

export default Forms