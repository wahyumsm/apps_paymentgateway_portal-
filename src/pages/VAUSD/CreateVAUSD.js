import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import $ from 'jquery'

function CreateVAUSD() {

    const [isVAUSD, setIsVAUSD] = useState("create")

    function pindahHalaman(param) {
        if (param === "create") {
            settlementManualTabs(100)
            // resetButtonHandle("eMoney")
        } else if (param === "update") {
            settlementManualTabs(101)
            // resetButtonHandle("eMoney")
        } else if (param === "riwayat") {
            settlementManualTabs(102)
            // resetButtonHandle("VA")
        }
    }

    function settlementManualTabs(isTabs){
        setIsVAUSD(isTabs)
        if (isTabs === 101) {
            $('#createTab').removeClass('menu-detail-akun-hr-active')
            $('#createSpan').removeClass('menu-detail-akun-span-active')
            $('#updateTab').addClass('menu-detail-akun-hr-active')
            $('#updateSpan').addClass('menu-detail-akun-span-active')
            $('#riwayatTab').removeClass('menu-detail-akun-hr-active')
            $('#riwayatSpan').removeClass('menu-detail-akun-span-active')
        } else if (isTabs === 102) {
            $('#createTab').removeClass('menu-detail-akun-hr-active')
            $('#createSpan').removeClass('menu-detail-akun-span-active')
            $('#riwayatTab').addClass('menu-detail-akun-hr-active')
            $('#riwayatSpan').addClass('menu-detail-akun-span-active')
            $('#updateTab').removeClass('menu-detail-akun-hr-active')
            $('#updateSpan').removeClass('menu-detail-akun-span-active')
        } else if (isTabs === 100) {
            $('#updateTab').removeClass('menu-detail-akun-hr-active')
            $('#updateSpan').removeClass('menu-detail-akun-span-active')
            $('#createTab').addClass('menu-detail-akun-hr-active')
            $('#createSpan').addClass('menu-detail-akun-span-active')
            $('#riwayatTab').removeClass('menu-detail-akun-hr-active')
            $('#riwayatSpan').removeClass('menu-detail-akun-span-active')
        }
    }

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;VA USD  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Buat VA USD</span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Virtual Account USD</h2>
            </div>
            <div className='base-content mt-3 pb-4'>
                <div className='detail-akun-menu' style={{display: 'flex', height: 33}}>
                    <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => pindahHalaman("create")} id="createTab">
                        <span className='menu-detail-akun-span menu-detail-akun-span-active' id="createSpan">Buat VA Baru</span>
                    </div>
                    <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => pindahHalaman("update")} id="updateTab">
                        <span className='menu-detail-akun-span' id="updateSpan">Update VA</span>
                    </div>
                    <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => pindahHalaman("riwayat")} id="riwayatTab">
                        <span className='menu-detail-akun-span' id="riwayatSpan">Riwayat VA</span>
                    </div>
                </div>
                <hr className='hr-style mb-4' style={{marginTop: -2}}/>
                <span className='font-weight-bold mt-3 mb-4' style={{fontWeight: 700}}>Buat VA</span>
            </div>
        </div>
    )
}

export default CreateVAUSD