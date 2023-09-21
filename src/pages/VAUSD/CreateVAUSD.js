import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import $ from 'jquery'
import noteInfo from "../../assets/icon/note_icon_grey_transparent_bg.svg"
import downloadIcon from "../../assets/icon/download_icon.svg"
import refreshIcon from "../../assets/icon/refresh_icon.svg"
import { Col, Row } from '@themesberg/react-bootstrap'
import { convertToRupiah } from '../../function/helpers'

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
                <div className='detail-akun-menu' style={{fontFamily: "Exo", display: 'flex', height: 33}}>
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
                <span className='font-weight-bold mt-3' style={{fontFamily: "Exo", fontWeight: 700}}>Buat VA</span>
                <div className='d-flex justify-content-start align-items-center mt-3 mb-3' style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'normal', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }}>
                    <div className='ms-2'>Virtual Account akan aktif selama <b>30 hari</b> setelah dibuat, dan akan aktif sejak tanggal <b>26/08/2023 - 24/09/2023</b></div>
                </div>
                <div className='my-4'>
                    <div style={{ fontSize: 14, fontWeight: 400, marginBottom: 10 }}>Jumlah data VA baru</div>
                    <input
                        type="number"
                        className="input-text-ez"
                        // onChange={handleChangeMaksTransaksi}
                        value={0}
                        name="dataVA"
                        placeholder={"Rp 0"}
                        style={{ width: "9%", marginLeft: "unset", }}
                        // style={{ width: "100%", marginLeft: "unset", borderColor: alertMaksTransaksi ? "red" : "" }}
                        // onBlur={() => setEditMaksTransaksi(!editMaksTransaksi)}
                        min={0}
                        max={1000}
                        onKeyDown={(evt) => ["e", "E", "+", "-", ","].includes(evt.key) && evt.preventDefault()}
                    />
                    <button 
                        // className={dataFromUpload.length === 0 ? 'btn-noez-transfer' : 'btn-ez-transfer'} //untukcsv
                        className={'btn-ez-transfer'} //untuk excel
                        style={{ width: '18%', marginLeft: 10 }}
                    >
                        Generate Virtual Account
                    </button>
                </div>
                <hr className='hr-style mb-4' style={{marginTop: -2}}/>
                <div className='my-4'>
                    <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Daftar File & VA</div>
                    <Row>
                        <Col>
                            <Row className='d-flex justify-content-start'>
                                <Col xs={3} className="card-information mt-3" style={{border: '1px solid #EBEBEB', height: 'fit-content', padding: '12px 0px 12px 16px'}}>
                                    {/* <Row>
                                        <Col xs={2} style={{ padding: 'unset', marginLeft: 5 }}>
                                            <img src={noteInfo} width="15" height="15" alt="circle_info" />
                                        </Col>
                                        <Col xs={6} style={{ padding: 'unset' }}>
                                            <p className="p-info" style={{ paddingLeft: 5 }}>Total sisa stok VA Tersedia</p>
                                        </Col>
                                        <Col xs={4} style={{ padding: 'unset' }}>
                                            <p style={{ fontFamily: "Exo", fontSize: 25, fontWeight: 700 }}>10</p>
                                        </Col>
                                    </Row> */}
                                    <div className='d-flex'>
                                        <img src={noteInfo} width="20" height="20" alt="circle_info" />
                                        <span className="p-info" style={{ paddingLeft: 7, width: 110 }}>Total sisa stok VA Tersedia: </span>
                                        <span style={{ fontFamily: "Exo", fontSize: 25, fontWeight: 700, paddingRight: 10, marginTop: 5 }}>{convertToRupiah(1000, false)}</span>
                                    </div>
                                </Col>
                                <Col xs={3} className="card-information mt-3 ms-3" style={{border: '1px solid #EBEBEB', height: 'fit-content', padding: '12px 0px 12px 16px'}}>
                                    <div className='d-flex'>
                                        <img src={noteInfo} width="20" height="20" alt="circle_info" />
                                        <span className="p-info" style={{ paddingLeft: 7, width: 110 }}>Total VA Belum Tersedia: </span>
                                        <span style={{ fontFamily: "Exo", fontSize: 25, fontWeight: 700, paddingRight: 10, marginTop: 5 }}>{convertToRupiah(1000, false)}</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row className='d-flex justify-content-end'>
                                <Col xs={3} className="card-information mt-3" style={{border: '1px solid #077E86', height: 44, padding: '8px 24px'}}>
                                    <div className='d-flex'>
                                        <img src={downloadIcon} width="24" height="24" alt="download_icon" />
                                        <span style={{ paddingLeft: 7, fontFamily: 'Exo', fontSize: 18, fontWeight: 700, color: '#077E86' }}>Download File CSV</span>
                                    </div>
                                </Col>
                                <Col xs={3} className="card-information mt-3 ms-3" style={{border: '1px solid #077E86', height: 44, padding: '8px 24px'}}>
                                    <div className='d-flex'>
                                        <img src={refreshIcon} width="24" height="24" alt="refresh_icon" />
                                        <span className="p-info" style={{ paddingLeft: 7, fontFamily: 'Exo', fontSize: 18, fontWeight: 700, color: '#077E86' }}>Perbarui Data</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default CreateVAUSD