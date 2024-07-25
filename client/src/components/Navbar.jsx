import React from 'react'

const Navbar = () => {
    return (
        <nav className="bg-transparent">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="./images/logo.svg" className="h-8" alt="Flowbite Logo" />
                    <span className="self-center text-4xl whitespace-nowrap text-black">Noty<b className='text-green-600'>Sorty</b></span>
                </a>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <button 
                        type="button" 
                        className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold text-md rounded-xl px-6 py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transition-all ease-in-out"
                        onClick={() => window.location.href = '/auth'}
                    >
                        Get started
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar