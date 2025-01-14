import React, { useEffect, useState } from 'react'
import { Col, Row, Form, Modal, Button, InputGroup } from '@themesberg/react-bootstrap';
import { Link, useHistory, useParams } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import { BaseURL, convertFormatNumber, errorCatch, getRole, getToken, language, RouteTo, setUserSession } from '../../function/helpers';
import axios from 'axios';
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import alertIcon from "../../assets/icon/alert_icon.svg";
import { eng } from '../../components/Language';

function EditAgen() {

    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
    const { agenId } = useParams()
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [showModalBatalEdit, setShowModalBatalEdit] = useState(false)
    const [showModalNonAktifAgen, setShowModalNonAktifAgen] = useState(false)
    const [showModalAktifAgen, setShowModalAktifAgen] = useState(false)
    const [edit, setEdit] = useState(false)

    const [inputHandle, setInputHandle] = useState({
        id:agenId,
        namaAgen: "",
        emailAgen: "",
        phoneNumber: "",
        bankName: 1,
        akunBank: "",
        rekeningOwner: "",
        active: false,
        nominal: 0
    })

    const [inputDataSubAcc, setInputDataSubAcc] = useState({
        bankNameSubAcc: "",
        akunBankSubAcc: "",
        rekeningOwnerSubAcc: ""
    })

    function handleChange(e) {
        if (e.target.name === "active") {
            setInputHandle({
                ...inputHandle,
                [e.target.name] : !inputHandle.active
            })
        } else {
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function getDetailAgen(agenId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"agen_id":"${agenId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const detailAgen = await axios.post(BaseURL + "/Agen/EditAgen", { data: dataParams }, { headers: headers })
            if (detailAgen.status === 200 && detailAgen.data.response_code === 200 && detailAgen.data.response_new_token.length === 0) {
                if (detailAgen.data.response_data.status === true) {
                    detailAgen.data.response_data = {
                        ...detailAgen.data.response_data,
                        isActive: "Aktif"
                    }
                } else {
                    detailAgen.data.response_data = {
                        ...detailAgen.data.response_data,
                        isActive: "Tidak Aktif"
                    }
                }
                const dataDetail = detailAgen.data.response_data
                setInputHandle({namaAgen: dataDetail.agen_name, emailAgen: dataDetail.agen_email, phoneNumber: dataDetail.agen_mobile, akunBank:dataDetail.agen_bank_number, rekeningOwner: dataDetail.agen_bank_name, active: dataDetail.status, nominal: dataDetail.nominal_topup})
                setInputDataSubAcc({bankNameSubAcc: dataDetail.subaccount_bank_name, akunBankSubAcc: dataDetail.subaccount_acc_number, rekeningOwnerSubAcc: dataDetail.subaccount_acc_name})
                // setDetailAgen(detailAgen.data.response_data)
            } else if (detailAgen.status === 200 && detailAgen.data.response_code === 200 && detailAgen.data.response_new_token.length !== 0) {
                setUserSession(detailAgen.data.response_new_token)
                if (detailAgen.data.response_data.status === true) {
                    detailAgen.data.response_data = {
                        ...detailAgen.data.response_data,
                        isActive: "Aktif"
                    }
                } else {
                    detailAgen.data.response_data = {
                        ...detailAgen.data.response_data,
                        isActive: "Tidak Aktif"
                    }
                }
                const dataDetail = detailAgen.data.response_data
                setInputHandle({namaAgen: dataDetail.agen_name, emailAgen: dataDetail.agen_email, phoneNumber: dataDetail.agen_mobile, akunBank:dataDetail.agen_bank_number, rekeningOwner: dataDetail.agen_bank_name, active: dataDetail.status, nominal: dataDetail.nominal_topup})
                setInputDataSubAcc({bankNameSubAcc: dataDetail.subaccount_bank_name, akunBankSubAcc: dataDetail.subaccount_acc_number, rekeningOwnerSubAcc: dataDetail.subaccount_acc_name})
                // setDetailAgen(detailAgen.data.response_data)
            }
        } catch (error) {
            // console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    async function updateDetailAgen(id, namaAgen, emailAgen, phoneNumber, bankName, akunBank, rekeningOwner, active, nominal) {
        try {
            const auth = "Bearer " + getToken()
            // const dataParams = encryptData(`{"agen_id":"${id}", "agen_name":"${namaAgen}", "agen_email":"${emailAgen}", "agen_mobile":"${phoneNumber}", "agen_bank_id":"${bankName}", "agen_bank_number":"${akunBank}", "agen_bank_name":"${rekeningOwner}", "status":"${active}", "nominal":${nominal}}`)
            const dataParams = encryptData(`{"agen_id":"${id}", "agen_name":"${namaAgen}", "agen_email":"${emailAgen}", "agen_mobile":"${phoneNumber}", "agen_bank_id":"${bankName}", "agen_bank_number":"${akunBank}", "agen_bank_name":"${rekeningOwner}", "status":"${active}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const editAgen = await axios.post(BaseURL + "/Agen/UpdateAgen", { data: dataParams }, { headers: headers })
            if (editAgen.status === 200 && editAgen.data.response_code === 200 && editAgen.data.response_new_token.length === 0) {
                setShowModalEdit(true)
            } else if (editAgen.status === 200 && editAgen.data.response_code === 200 && editAgen.data.response_new_token.length !== 0) {
                setUserSession(editAgen.data.response_new_token)
                setShowModalEdit(true)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    const goDetail = () => {
        updateDetailAgen(agenId, inputHandle.namaAgen, inputHandle.emailAgen, inputHandle.phoneNumber, inputHandle.bankName, inputHandle.akunBank, inputHandle.rekeningOwner, inputHandle.active, inputHandle.nominal)
        // RouteTo("/daftaragen")
        history.push("/daftaragen")
        setShowModalEdit(false)
    }

    const batalEdit = () => {
        setShowModalBatalEdit(false)
        // RouteTo("/daftaragen")
        history.push("/daftaragen")
    }

    const goBack = () => {
        window.history.back();
    };

    const stayEdit = () => {
        setShowModalBatalEdit(false)
    }

    function toDashboard() {
        history.push("/");
    }

    function toLaporan() {
        history.push("/laporan");
    }

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        getDetailAgen(agenId)
    }, [access_token, agenId])

    return (
        <>
            <div className='main-content mt-5' style={{ padding: "37px 27px" }}>
                <span className='breadcrumbs-span'>{user_role === "102" ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}>{language === null ? eng.laporan : language.laporan}</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}>Beranda</span> }  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;<Link to={"/daftaragen"}>{language === null ? eng.daftarAgen : language.daftarAgen}</Link> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp; {language === null ? eng.detailAgen : language.detailAgen}</span>
                <div className="head-title">
                    <div className="mt-4 mb-4" style={{ fontFamily: "Exo" }}>{language === null ? eng.detailAgen : language.detailAgen}</div>
                    {/* <h5 style={{ fontFamily: "Exo" }}>Detail Agen</h5> */}
                </div>
                <div className='base-content' style={{ width:"100%", padding: 50 }}>
                    <div>
                        <Row className='mb-4'>
                            <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    {language === null ? eng.status : language.status}
                                </span>
                            </Col>
                            <Col xs={2}>
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label={(inputHandle.active === true) ? (language === null ? eng.aktif : language.aktif) : (language === null ? eng.tidakAktif : language.tidakAktif)}
                                    checked={(inputHandle.active)}
                                    name="active"
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    {language === null ? eng.idAgen : language.idAgen}
                                </span>
                            </Col>
                            <Col xs={9}>
                                <Form.Control
                                    name='id'
                                    value={inputHandle.id}
                                    type='text'
                                    disabled
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                    />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    {language === null ? eng.namaAgen : language.namaAgen}
                                </span>
                            </Col>
                            <Col xs={9}>
                                <Form.Control
                                    name='namaAgen'
                                    value={inputHandle.namaAgen}
                                    type='text'
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    {language === null ? eng.emailAgen : language.emailAgen}
                                </span>
                            </Col>
                            <Col xs={9}>
                                <Form.Control
                                    name='emailAgen'
                                    value={inputHandle.emailAgen}
                                    type='text'
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    {language === null ? eng.noHpAgen : language.noHpAgen}
                                </span>
                            </Col>
                            <Col xs={9}>
                                <Form.Control
                                    name='phoneNumber'
                                    value={inputHandle.phoneNumber}
                                    type='number'
                                    onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    {language === null ? eng.namaBank : language.namaBank}
                                </span>
                            </Col>
                            <Col xs={9}>
                                <Form.Control
                                    value={inputHandle.bankName && "BCA (Bank Central Asia)"}
                                    placeholder="BCA (Bank Central Asia)"
                                    type='text'
                                    disabled
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    {language === null ? eng.noRek : language.noRek}
                                </span>
                            </Col>
                            <Col xs={9}>
                                <Form.Control
                                    name='akunBank'
                                    value={inputHandle.akunBank}
                                    type='number'
                                    onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    {language === null ? eng.namaPemilikRek : language.namaPemilikRek}
                                </span>
                            </Col>
                            <Col xs={9}>
                                <Form.Control
                                    name='rekeningOwner'
                                    value={inputHandle.rekeningOwner}
                                    type='text'
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        {/* <Row className='mt-2'>
                            <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    Nominal Top up
                                </span>
                            </Col>
                            <Col xs={9}>
                                {edit ?
                                    <Form.Control
                                        name='nominal'
                                        value={inputHandle.nominal}
                                        type='number'
                                        onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                                        style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                        onChange={handleChange}
                                        onBlur={() => setEdit(!edit)}
                                    /> :
                                    <Form.Control
                                        name='nominal'
                                        value={convertFormatNumber(inputHandle.nominal)}
                                        type='text'
                                        style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                        onFocus={() => setEdit(!edit)}
                                        // readOnly
                                    />
                                }
                            </Col>
                        </Row> */}
                    </div>
                </div>
                <div className="head-title">
                    <div className="mt-4 mb-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}> {language === null ? eng.rekSubAkun : language.rekSubAkun}</div>
                </div>
                {
                    inputDataSubAcc.akunBankSubAcc !== null ?
                    (
                        <div className='base-content' style={{ width:"100%", padding: 50 }}>
                            <div>
                                <Row className='mb-4'>
                                    <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                                        <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                            {language === null ? eng.namaBank : language.namaBank}
                                        </span>
                                    </Col>
                                    <Col xs={9}>
                                        <Form.Control
                                            value={inputDataSubAcc.bankNameSubAcc && "Bank Danamon"}
                                            placeholder="Bank Danamon"
                                            type='text'
                                            disabled
                                            style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                        />
                                    </Col>
                                </Row>
                                <Row className='mb-4'>
                                    <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                                        <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                            {language === null ? eng.noRek : language.noRek}
                                        </span>
                                    </Col>
                                    <Col xs={9}>
                                        <Form.Control
                                            name='akunBank'
                                            value={inputDataSubAcc.akunBankSubAcc}
                                            type='text'
                                            disabled
                                            style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                                        <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                            {language === null ? eng.namaPemilikRek : language.namaPemilikRek}
                                        </span>
                                    </Col>
                                    <Col xs={9}>
                                        <Form.Control
                                            name='rekeningOwner'
                                            value={inputDataSubAcc.rekeningOwnerSubAcc}
                                            type='text'
                                            disabled
                                            style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                width:"100%",
                                fontSize: "14px",
                                background: "rgba(255, 214, 0, 0.16)",
                                borderRadius: "4px",
                                fontStyle: "italic",
                                padding: "12px",
                                gap: 10,
                            }}
                            className="text-start my-1"
                        >
                            <span className="mx-2">
                                <img src={alertIcon} alt="alert" />
                            </span>
                                {language === null ? eng.silahkanHubungiAdmin : language.silahkanHubungiAdmin}
                        </div>
                    )
                }
                <div className='mb-5 mt-4 ' style={{ display: "flex", justifyContent: "end"}}>
                    <button onClick={() => setShowModalBatalEdit(true)} className='mx-2' style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", gap: 8, width: 136, height: 45, background: "#FFFFFF", color:"#888888", border: "0.6px solid #EBEBEB", borderRadius: 6 }}>
                        {language === null ? eng.batal : language.batal}
                    </button>
                    <button onClick={() => setShowModalEdit(true)} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", gap: 8, width: 136, height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                        {language === null ? eng.simpan : language.simpan}
                    </button>
                </div>
                <Modal
                    size="lg"
                    centered
                    show={showModalEdit}
                    onHide={() => setShowModalEdit(false)}
                    style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                >
                    <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                            <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }} className="text-center">{language === null ? eng.menyimpanDataPerubahan : language.menyimpanDataPerubahan}</p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                            <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }} className="text-center">{language === null ? eng.perubahanDataBaru : language.perubahanDataBaru}</p>
                        </div>
                        <p>

                        </p>
                        <div className="d-flex justify-content-center mb-3">
                            <Button onClick={goBack} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB" }} className="mx-2">{language === null ? eng.tidak : language.tidak}</Button>
                            <Button onClick={goDetail} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>{language === null ? eng.ya : language.ya}</Button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal
                    size="lg"
                    centered
                    show={showModalBatalEdit}
                    onHide={() => setShowModalBatalEdit(false)}
                    style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                >
                    <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                            <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }} className="text-center">{language === null ? eng.membatalkanPerubahanDataPartner : language.membatalkanPerubahanDataPartner}</p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                            <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }} className="text-center">{language === null ? eng.dataKembaliKondisiSemula : language.dataKembaliKondisiSemula}</p>
                        </div>
                        <p>

                        </p>
                        <div className="d-flex justify-content-center mb-3">
                            <Button onClick={stayEdit} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB" }} className="mx-2">{language === null ? eng.tidak : language.tidak}</Button>
                            <Button onClick={batalEdit} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>{language === null ? eng.ya : language.ya}</Button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal
                    size="lg"
                    centered
                    show={showModalNonAktifAgen}
                    onHide={() => setShowModalNonAktifAgen(false)}
                    style={{ borderRadius: 8 }}
                >
                    <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                            <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }} className="text-center">{language === null ? eng.menonaktifkanAgen : language.menonaktifkanAgen}</p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                            <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }} className="text-center">{language === null ? eng.transaksiAgenTidakTersimpan : language.transaksiAgenTidakTersimpan}</p>
                        </div>
                        <p>

                        </p>
                        <div className="d-flex justify-content-center mb-3">
                            <Button style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;" }} className="mx-2">{language === null ? eng.tidak : language.tidak}</Button>
                            <Button style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>{language === null ? eng.ya : language.ya}</Button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal
                    size="lg"
                    centered
                    show={showModalAktifAgen}
                    onHide={() => setShowModalAktifAgen(false)}
                    style={{ borderRadius: 8 }}
                >
                    <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                            <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }} className="text-center">{language === null ? eng.aktifkanAgen : language.aktifkanAgen}</p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                            <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }} className="text-center">{language === null ? eng.transaksiAgenTersimpan : language.transaksiAgenTersimpan}</p>
                        </div>
                        <p>

                        </p>
                        <div className="d-flex justify-content-center mb-3">
                            <Button style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;" }} className="mx-2">{language === null ? eng.tidak : language.tidak}</Button>
                            <Button style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>{language === null ? eng.ya : language.ya}</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>

        </>
    )
}

export default EditAgen