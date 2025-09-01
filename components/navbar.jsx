"use client"

import Link from 'next/link';
import Image from 'next/image';
import { logo, sun } from '@public/assets/icons';
import { useState } from 'react';
import { navlinks } from '@constants';
import { useAuth } from '../context/AuthContext';


const Icon = ({styles, name, imgUrl, isActive, disabled, handleClick }) => (
    <div className= {`w-[30px] h-[30px] rounded-[10px] ${isActive && isActive === name && 'bg-[#322543dc]'} flex 
    justify-center items-center ${!disabled && 'cursor-pointer'} ${styles} `} onClick={handleClick}>
        {!isActive ? (
            <Image src={imgUrl} alt="logo" width={35} height={35} className='object-contain'/>
        ) : ( 
            <Image src={imgUrl} alt='logo' width={35} height={35} className={`object-contain 
                ${isActive !== name && 'grayscale'}`} />
        )}

    </div>
)

const Nav = () => {

    const [isActive, setIsActive] = useState('home');
    const { user } = useAuth();
    
    return (
      <div className="flex justify-between items-center flex-row sticky bottom-3 w-64 m-auto"> 
        {/* <Link href="/">
            <Icon styles="w-[40px] h-[40px] bg-[#2c2f32]" imgUrl={logo} />
        
        </Link> */}

        <div className='flex-1 flex flex-row justify-between
        items-center bg-[#322543bd] rounded-[15px] w-auto
        py-3 px-6'>
            <div className='flex flex-row justify-center items-center
            gap-6 p-1'>
                {navlinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.link}
                        >
                            <Icon
                                {...link} 
                                isActive={isActive} 
                                handleClick={() => {
                                    if (!link.disabled) {
                                        setIsActive(link.name);
                                    }
                                }} 
                            />
                        </Link>
                    ))}
                
                {/* Auth Link */}
                <Link href={user ? '/profile' : '/auth'}>
                    <div className={`w-[30px] h-[30px] rounded-[10px] ${isActive === 'auth' && 'bg-[#322543dc]'} flex 
                    justify-center items-center cursor-pointer`} 
                    onClick={() => setIsActive('auth')}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </Link>
            </div>
        </div>
      </div>
    )
  }
  
  export default Nav;