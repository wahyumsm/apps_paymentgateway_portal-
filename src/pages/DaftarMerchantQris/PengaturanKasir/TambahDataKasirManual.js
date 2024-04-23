import React from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import { Col, Row } from '@themesberg/react-bootstrap';
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function TambahDataKasirManual () {
    const history = useHistory()
    const storeId = sessionStorage.getItem('storeId');
    console.log(storeId);

    async function getDataDetailTerminal(page) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"store_id": ""}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const datamerchantGrup = await axios.post(BaseURL + "/QRIS/OnboardingGetListMerchant", { data: dataParams }, { headers: headers })
            // console.log(datamerchantGrup, 'ini user detal funct');
            if (datamerchantGrup.status === 200 && datamerchantGrup.data.response_code === 200 && datamerchantGrup.data.response_new_token.length === 0) {
                
            } else if (datamerchantGrup.status === 200 && datamerchantGrup.data.response_code === 200 && datamerchantGrup.data.response_new_token.length !== 0) {
                setUserSession(datamerchantGrup.data.response_new_token)
                
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }
    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Pengaturan Kasir</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar Kasir</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah Kasir Manual</span></span>
            <div className="head-title"> 
                <h2 className="h5 mt-4" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Tambah Kasir Manual</h2>
            </div>
            <div className='base-content mt-3'>
                <div className="nama-merchant-in-detail">Mayora Bogor</div>
                <Row className='mt-3'>
                    <Col xs={6} className='sub-title-detail-merchant'>Group</Col>
                    <Col xs={6} className='sub-title-detail-merchant'>Brand</Col>
                </Row>
                <Row className='mt-1'>
                    <Col xs={6} className='isi-content-detail-merchant'>PT. Mayora Grup</Col>
                    <Col xs={6} className='isi-content-detail-merchant'>Mayora</Col>
                </Row>
                <Row className='mt-3'>
                    <Col xs={6} className='sub-title-detail-merchant'>Total Kasir Aktif</Col>
                    <Col xs={6} className='sub-title-detail-merchant'>Total Kasir Nonaktif</Col>
                </Row>
                <Row className='mt-1 pb-4'>
                    <Col xs={6} className='isi-content-detail-merchant'>-</Col>
                    <Col xs={6} className='isi-content-detail-merchant'>-</Col>
                </Row>
            </div>
        </div>
    )
}

export default TambahDataKasirManual