import React from 'react'
import iconInfo from '../assets/icon/info_icon.svg'

const SubAccountComponent = () => {
  return (
    <div className='base-content'>
        <div className='text-center'>
            <img src={iconInfo} alt="icon info" />
            <div className='my-3' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20 }}>Anda belum menambahkan rekening Sub Account</div>
            <div className='pb-4' style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#848484" }}>Silahkan hubungi admin untuk menambahkan Sub Account pada agen anda</div>
        </div>
    </div>
  )
}

export default SubAccountComponent