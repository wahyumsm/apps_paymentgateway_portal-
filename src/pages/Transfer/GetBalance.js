import React from 'react'
import { Link } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Col, Form, Row } from '@themesberg/react-bootstrap'
import { useState } from 'react'
import $ from 'jquery'

const GetBalance = () => {
    const [isGetBalance, setIsGetBalance] = useState(true)

    function balance(isTabs){
        setIsGetBalance(isTabs)
        if(!isTabs){
            $('#detailakuntab').removeClass('menu-detail-akun-hr-active')
            $('#detailakunspan').removeClass('menu-detail-akun-span-active')
            $('#konfigurasitab').addClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').addClass('menu-detail-akun-span-active')
        }else{
            $('#konfigurasitab').removeClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').removeClass('menu-detail-akun-span-active')
            $('#detailakuntab').addClass('menu-detail-akun-hr-active')
            $('#detailakunspan').addClass('menu-detail-akun-span-active')
        }
    }
    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Get Balance & Mutasi</span>

            <div className='detail-akun-menu mt-3' style={{display: 'flex', height: 33}}>
                <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => balance(true)} id="detailakuntab">
                    <span className='menu-detail-akun-span menu-detail-akun-span-active' id="detailakunspan">Get Balance</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => balance(false)} id="konfigurasitab">
                    <span className='menu-detail-akun-span' id="konfigurasispan">Mutasi</span>
                </div>
            </div>
            <hr className='hr-style' style={{marginTop: -2}}/>{}
            <div className='base-content'>
                <Row className='pb-4'>
                    <Col xs={6} className="d-flex justify-content-between align-items-center">
                        <div style={{ width: "25%" }}>Pilih Bank <span style={{ color: "red" }}>*</span></div>
                        <Form.Select name="statusDanaMasuk" className='input-text-ez me-3' style={{ display: "inline" }} >
                            <option defaultChecked disabled value="">Pilih Status</option>
                            <option value={2}>Bank BCA</option>
                            <option value={1}>Bank CIMB Niaga</option>
                            <option value={7}>Bank Danamon</option>
                        </Form.Select>
                        <button
                            className='btn-ez-on'
                            style={{ width: "40%", padding: "0px 15px" }}
                        >
                            Terapkan
                        </button>
                    </Col>
                </Row>
                <div className='d-flex justify-content-start align-items-center'>
                    <div style={{ width: "7rem" }}>Saldo :</div>
                    <strong>Rp.10.000.000,-</strong>
                </div>
                <textarea
                    className='input-text-disburs mt-4'
                    placeholder="Masukkan catatan bila perlu ( Maksimal 25 karakter )"
                    style={{ width: "100%", padding: 10, borderColor: "#E0E0E0"}}
                    name="catatan"
                />
            </div>
        </div>
    )
}

export default GetBalance