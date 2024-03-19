import React from 'react'
import Forms from '../components/forms'

const Home = () => {
  return (
    <div>
      <h1 className=' font-bold text-7xl max-lg:text-6xl max-md:text-5xl max-sm:text-5xl text-center mt-20 mb-10'> <span className=' text-indigo-600'>ThinkSpace</span></h1>
      {/*<p className='text-gray-500 font-light text-base text-center px-60 max-lg:px-40 max-md:px-10'>Transform your ideas into reality with our intuitive whiteboard application. Whether you're brainstorming with colleagues, teaching a class, or just doodling for fun, ThinkSpace provides the tools you need for seamless collaboration.</p>*/}
      <Forms/>
    </div>
  )
}


export default Home