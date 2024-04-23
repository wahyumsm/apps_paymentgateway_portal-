import React, { useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import fotoIcon from "../../../assets/icon/foto_icon.svg";
import { useHistory } from 'react-router-dom';
import $ from 'jquery'
import uploadIcon from "../../../assets/icon/upload_icon.svg"

const PengaturanKasir = () => {
    const history = useHistory()
    const [isPengaturanKasir, setIsPengaturanKasir] = useState("daftarKasir")
    function pengaturanKasirTabs(isTabs){
        if(isTabs === "daftarKasir"){
            setIsPengaturanKasir(isTabs)
            $('#daftarKasir').addClass('menu-detail-akun-hr-active')
            $('#daftarKasirspan').addClass('menu-detail-akun-span-active')
            $('#daftarTerminal').removeClass('menu-detail-akun-hr-active')
            $('#daftarTerminalspan').removeClass('menu-detail-akun-span-active')
        } else {
            setIsPengaturanKasir(isTabs)
            $('#daftarKasir').removeClass('menu-detail-akun-hr-active')
            $('#daftarKasirspan').removeClass('menu-detail-akun-span-active')
            $('#daftarTerminal').addClass('menu-detail-akun-hr-active')
            $('#daftarTerminalspan').addClass('menu-detail-akun-span-active')
        }
    }
    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Pengaturan Kasir</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar {isPengaturanKasir === "daftarKasir" ? "Kasir" : "Terminal"}</span></span>
            <div className="head-title"> 
                <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Pengaturan Kasir</h2>
            </div>
            <div className='detail-akun-menu mt-4' style={{display: 'flex', height: 33}}>
                <div className='detail-akun-tabs menu-detail-akun-hr-active' id="daftarKasir" onClick={() => pengaturanKasirTabs("daftarKasir")}>
                    <span className='menu-detail-akun-span menu-detail-akun-span-active' id="daftarKasirspan">Daftar Kasir</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} id="daftarTerminal" onClick={() => pengaturanKasirTabs("daftarTerminal")}>
                    <span className='menu-detail-akun-span' id="daftarTerminalspan">Daftar Terminal</span>
                </div>
            </div>
            <hr className='hr-style' style={{marginTop: -2}}/>
            {
                isPengaturanKasir === "daftarKasir" ? (
                    <div className='d-flex justify-content-center align-items-center flex-column mt-5'>
                        <img src={fotoIcon} alt="fotoIcon" />
                        <div className='mt-3' style={{ fontFamily: "Exo", color: "#393939", fontSize: 18, fontWeight: 700 }}>Belum Ada Data Kasir</div>
                        <div className='mt-3' style={{ fontFamily: "Nunito", color: "#848484", fontSize: 14 }}>Semua data kasir yang ditambahkan akan tampil disini</div>
                        <button 
                            className='btn-next-active mt-3'
                            style={{ width: 450, height: 44 }}
                            onClick={() => history.push('/tambah-manual-kasir')}
                        >
                            Tambah Manual
                        </button>
                        <button className="mt-4" style={{ color: "#077E86", fontFamily: "Exo", fontSize: 14, fontWeight: 700, alignItems: "center",  gap: 8, width: 450, height: 44, border: "1px solid var(--contoh-secondary-40-warna-utama, #077E86)", borderRadius: 4 }}>
                            <img
                                src={uploadIcon}
                                // onClick={() => editInTableHandler(row.number)}
                                style={{ cursor: "pointer" }}
                                alt="icon edit"
                            /> Upload dokumen
                        </button>
                    </div>
                ) : (
                    <div className='d-flex justify-content-center align-items-center flex-column mt-5'>
                        <img src={fotoIcon} alt="fotoIcon" />
                        <div className='mt-3' style={{ fontFamily: "Exo", color: "#393939", fontSize: 18, fontWeight: 700 }}>Belum Ada Data Terminal</div>
                        <div className='mt-3' style={{ fontFamily: "Nunito", color: "#848484", fontSize: 14 }}>Semua data terminal yang ditambahkan akan tampil disini</div>
                        <button 
                            className='btn-next-active mt-3'
                            style={{ width: 450, height: 44 }}
                            onClick={() => history.push('/tambah-manual-terminal')}
                        >
                            Tambah Manual
                        </button>
                        <button className="mt-4" style={{ color: "#077E86", fontFamily: "Exo", fontSize: 14, fontWeight: 700, alignItems: "center",  gap: 8, width: 450, height: 44, border: "1px solid var(--contoh-secondary-40-warna-utama, #077E86)", borderRadius: 4 }}>
                            <img
                                src={uploadIcon}
                                // onClick={() => editInTableHandler(row.number)}
                                style={{ cursor: "pointer" }}
                                alt="icon edit"
                            /> Upload dokumen
                        </button>
                    </div>
                )
            }
        </div>
    )
}

export default PengaturanKasir