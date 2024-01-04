import React from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import $ from 'jquery'

const DaftarMerchantQris = () => {
    function disbursementTabs(isTabs){
        if(isTabs === "merchantGrup"){
            $('#merchantGrup').addClass('menu-detail-akun-hr-active')
            $('#merchantGrupspan').addClass('menu-detail-akun-span-active')
            $('#merchantBrand').removeClass('menu-detail-akun-hr-active')
            $('#merchantBrandspan').removeClass('menu-detail-akun-span-active')
            $('#merchantOutlet').removeClass('menu-detail-akun-hr-active')
            $('#merchantOutletspan').removeClass('menu-detail-akun-span-active')
        } else if (isTabs === "merchantBrand") {
            $('#merchantGrup').removeClass('menu-detail-akun-hr-active')
            $('#merchantGrupspan').removeClass('menu-detail-akun-span-active')
            $('#merchantBrand').addClass('menu-detail-akun-hr-active')
            $('#merchantBrandspan').addClass('menu-detail-akun-span-active')
            $('#merchantOutlet').removeClass('menu-detail-akun-hr-active')
            $('#merchantOutletspan').removeClass('menu-detail-akun-span-active')
        } else {
            $('#merchantGrup').removeClass('menu-detail-akun-hr-active')
            $('#merchantGrupspan').removeClass('menu-detail-akun-span-active')
            $('#merchantBrand').removeClass('menu-detail-akun-hr-active')
            $('#merchantBrandspan').removeClass('menu-detail-akun-span-active')
            $('#merchantOutlet').addClass('menu-detail-akun-hr-active')
            $('#merchantOutletspan').addClass('menu-detail-akun-span-active')
        }
    }
    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar Merchant</span></span>
            <div className="head-title"> 
                <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Daftar Merchant</h2>
            </div>
            <div className='detail-akun-menu mt-4' style={{display: 'flex', height: 33}}>
                <div className='detail-akun-tabs menu-detail-akun-hr-active' id="merchantGrup" onClick={() => disbursementTabs("merchantGrup")}>
                    <span className='menu-detail-akun-span menu-detail-akun-span-active' id="merchantGrupspan">Merchant grup</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} id="merchantBrand">
                    <span className='menu-detail-akun-span' id="merchantBrandspan">Merchant brand</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} id="merchantOutlet">
                    <span className='menu-detail-akun-span' id="merchantOutletspan">Merchant outlet</span>
                </div>
            </div>
            <hr className='hr-style' style={{marginTop: -2}}/>
            <div className='base-content'>

            </div>
        </div>
    )
}

export default DaftarMerchantQris