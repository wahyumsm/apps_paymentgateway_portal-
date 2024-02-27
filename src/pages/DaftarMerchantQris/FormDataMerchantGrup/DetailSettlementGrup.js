import React, { useEffect, useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import { useHistory, useParams } from 'react-router-dom';
import { Col, Row } from '@themesberg/react-bootstrap';
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';

const DetailSettlementGrup = () => {
    const history = useHistory()
    const { profileId, settleGroupId } = useParams()
    const [showModalSimpanData, setShowModalSimpanData] = useState(false)
    const [dataListDetail, setDataListDetail] = useState(false)

    async function getDataListDetail(profileId, settleGroupId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"profile_id": ${profileId}, "settle_group_id": ${settleGroupId}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/OnboardingGetProfileSettlement", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token.length === 0) {
                setDataListDetail(getData.data.response_data.results)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token.length !== 0) {
                setUserSession(getData.data.response_new_token)
                setDataListDetail(getData.data.response_data.results)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        getDataListDetail(profileId, settleGroupId)
    }, [])
    

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span onClick={() => history.push('/')} style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span onClick={() => setShowModalSimpanData(true)} style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span onClick={() => setShowModalSimpanData(true)} style={{ cursor: "pointer" }}>Detail merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Detail settlement</span></span>
            <div className="d-flex justify-content-start align-items-center head-title"> 
                <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Detail settlement</h2>
            </div>
            <div className='base-content mt-4 pb-4'>
                <div className="waktu-bergabung-detail">Waktu bergabung : {dataListDetail?.mqrismerchsettle_crtdt_format === null ? "-" : dataListDetail?.mqrismerchsettle_crtdt_format}</div>
                <div className='d-flex justify-content-start align-items-center mt-3'>
                    <div className="nama-merchant-in-detail" style={{ width: "auto" }}>{dataListDetail?.mmerchant_name === null ? "-" : dataListDetail?.mmerchant_name}</div>
                    <div className='status-in-detail-qris-brand-success ms-3'>{dataListDetail?.mregstatus_name_ind === null ? "-" : dataListDetail?.mregstatus_name_ind}</div>
                </div>
                <hr />
                <div className='title-sub-content-detail-merchant'>Info rekening</div>
                <Row className='mt-3'>
                    <Col xs={6} className='sub-title-detail-merchant'>Nama bank</Col>
                    <Col xs={6} className='sub-title-detail-merchant'>Nomor rekening</Col>
                </Row>
                <Row className='mt-1'>
                    <Col xs={6} className='isi-content-detail-merchant'>{dataListDetail?.mbank_name === null ? "-" : dataListDetail?.mbank_name}</Col>
                    <Col xs={6} className='isi-content-detail-merchant'>{dataListDetail?.mqrismerchsettle_acc_number === null ? "-" : dataListDetail?.mqrismerchsettle_acc_number}</Col>
                </Row>
                <Row className='mt-3'>
                    <Col xs={6} className='sub-title-detail-merchant'>Nama pemilik rekening</Col>
                </Row>
                <Row className='mt-1'>
                    <Col xs={6} className='isi-content-detail-merchant'>{dataListDetail?.mqrismerchsettle_acc_name === null ? "-" : dataListDetail?.mqrismerchsettle_acc_name}</Col>
                </Row>
            </div>
        </div>
    )
}

export default DetailSettlementGrup