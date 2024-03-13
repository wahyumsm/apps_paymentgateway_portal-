import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import peroranganQris from '../../assets/icon/perorangan-qris.svg'
import badanUsahaQris from '../../assets/icon/badanusaha-qris.svg'
import tidakBerbadanHukumQris from '../../assets/icon/tidakberbadanhukum-qris.svg'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";

const PilihJenisUsaha = (props) => {
    const history = useHistory()
    const [tabJenisUsaha, setTabJenisUsaha] = useState("")

    function buttonColor (param) {
        setTabJenisUsaha(param)
    }

    function nextPage (tabUsaha) {
        if (tabUsaha === "perorangan") {
            history.push(`/form-info-pemilik-perorangan`)
        } else if (tabUsaha === "badanUsaha") {
            history.push(`/form-info-pemilik-badan-usaha`)
        } else {
            history.push(`/form-tidak-berbadan-hukum`)
        }
    }

    useEffect(() => {
        
    }, [])
    

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }} onClick={() => history.push('/')}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }} onClick={() => history.push('/daftar-merchant-qris')}>Daftar Merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah Merchant</span></span>
            <div className=''>
                <div className='text-jenis-usaha py-4'>Pilih Jenis Usaha</div>
                <div className={tabJenisUsaha === "perorangan" ? 'card-when-click mb-3' : 'card-jenis-usaha mb-3'} onClick={() => buttonColor("perorangan")} id='usahaPerorangan'>
                    <img src={peroranganQris} alt='qris' />
                    <div className='text-start'>
                        <div className='card-text-title'>Perorangan</div>
                        <div className='card-text-subtitle'>Untuk individual yang ingin melakukan atau mengelola usaha yang dijalankan</div>
                    </div>
                </div>
                <div className={tabJenisUsaha === "badanUsaha" ? 'card-when-click mb-3' : 'card-jenis-usaha mb-3'} onClick={() => buttonColor("badanUsaha")} id='badanUsaha'>
                    <img src={badanUsahaQris} alt='qris' />
                    <div className='text-start'>
                        <div className='card-text-title'>Badan Usaha</div>
                        <div className='card-text-subtitle'>Untuk perusahaan dengan izin usaha yang ingin melakukan atau mengelola usaha yang dijalankan</div>
                    </div>
                </div>
                <div className={tabJenisUsaha === "tidakBerbadanHukum" ? 'card-when-click mb-3' : 'card-jenis-usaha mb-3'} onClick={() => buttonColor("tidakBerbadanHukum")} id='tidakBerbadanHukum'>
                    <img src={tidakBerbadanHukumQris} alt='qris' />
                    <div className='text-start'>
                        <div className='card-text-title'>Tidak Berbadan Hukum</div>
                        <div className='card-text-subtitle'>Untuk perusahaan dengan izin usaha yang belum memiliki dokumen legalitas. <br/> Pastikan sebuah brand yang dimiliki sudah memiliki surat izin usaha (E-KTP/NPWP, SK Kementerian Kehakiman, NIB perusahaan, dan Akta pendirian).</div>
                    </div>
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                    <button onClick={() => nextPage(tabJenisUsaha)} className={tabJenisUsaha.length === 0 ? "btn-confirm-disable" : "btn-confirm-enable"} disabled={tabJenisUsaha.length === 0} style={{ width: "100%"}}>Konfirmasi</button>
                </div>
            </div>
        </div>
    )
}

export default PilihJenisUsaha