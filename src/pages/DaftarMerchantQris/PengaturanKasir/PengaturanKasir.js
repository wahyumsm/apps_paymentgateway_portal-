import React from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";

const PengaturanKasir = () => {
    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Pengaturan Kasir</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar Kasir</span></span>
            <div className="head-title"> 
                <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Pengaturan Kasir</h2>
            </div>
            <div className='detail-akun-menu mt-4' style={{display: 'flex', height: 33}}>
                <div className='detail-akun-tabs menu-detail-akun-hr-active' id="merchantGrup" >
                    <span className='menu-detail-akun-span menu-detail-akun-span-active' id="merchantGrupspan">Daftar Kasir</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} id="merchantBrand">
                    <span className='menu-detail-akun-span' id="merchantBrandspan">Daftar Terminal</span>
                </div>
            </div>
            <hr className='hr-style' style={{marginTop: -2}}/>
        </div>
    )
}

export default PengaturanKasir