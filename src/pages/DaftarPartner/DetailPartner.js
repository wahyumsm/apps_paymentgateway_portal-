import React, {useEffect, useRef, useState, useCallback} from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Col, Form, Row, Image} from '@themesberg/react-bootstrap';
import $ from 'jquery'
import axios from 'axios';
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, RouteTo, setUserSession } from '../../function/helpers';
import { useHistory, useParams } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import encryptData from '../../function/encryptData';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import edit from '../../assets/icon/edit_icon.svg';
import deleted from '../../assets/icon/delete_icon.svg'

function DetailPartner() {

    const [isDetailAkun, setIsDetailAkun] = useState(true);
    const history = useHistory()
    const user_role = getRole()
    const access_token = getToken()
    const { partnerId } = useParams()
    const [listAgen, setListAgen] = useState([])
    const [detailPartner, setDetailPartner] = useState([])
    const [payment, setPayment] = useState([])
    const [fiturType, setFiturType] = useState({})
    const [expanded, setExpanded] = useState(false)
    const myRef = useRef(null)

    const showCheckboxes = () => {
        if (!expanded) {
          setExpanded(true);
        } else {
          setExpanded(false);
        }
    };

    let atasFitur = 0
    let bawahFitur = 0
    let equalFitur = 0

    if(fiturType.length % 2 === 1) {
        atasFitur = Math.ceil(fiturType.length / 2)
        bawahFitur = fiturType.length - atasFitur
    } else {
        equalFitur = fiturType.length / 2
    }

    function dataAtasFitur(params1) {
        let dataFitur = []
        for (let i = 0; i < params1; i++) {
            dataFitur.push(fiturType[i])
        }
        return dataFitur
    }

    function dataBawahFitur(params2) {
        let dataFitur = []
        for (let i = params2 + 1; i < fiturType.length; i++) {
            dataFitur.push(fiturType[i])
        }
        return dataFitur
    }

    function dataAtasEqualFitur(params1) {
        let dataFitur = []
        for (let i = 0; i < params1; i++) {
            dataFitur.push(fiturType[i])
        }
        return dataFitur
    }

    function dataBawahEqualFitur(params2) {
        let dataFitur = []
        for (let i = params2; i < fiturType.length; i++) {
            dataFitur.push(fiturType[i])
        }
        return dataFitur
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function getDetailPartner(partnerId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"partner_id":"${partnerId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const detailPartner = await axios.post("/Partner/EditPartner", { data: dataParams }, { headers: headers })
            // console.log(detailPartner, 'ini detail partner');
            if (detailPartner.status === 200 && detailPartner.data.response_code === 200 && detailPartner.data.response_new_token.length === 0) {
                detailPartner.data.response_data.payment_method = detailPartner.data.response_data.payment_method.map((obj, id) => ({...obj, number : id + 1, icon: <div className="d-flex justify-content-center align-items-center"><img src={edit} /><img src={deleted} className="ms-2" /></div>}))
                setDetailPartner(detailPartner.data.response_data)
                setPayment(detailPartner.data.response_data.payment_method)
            } else if (detailPartner.status === 200 && detailPartner.data.response_code === 200 && detailPartner.data.response_new_token.length !== 0) {
                setUserSession(detailPartner.data.response_new_token)
                detailPartner.data.response_data.payment_method = detailPartner.data.response_data.payment_method.map((obj, id) => ({...obj, number : id + 1, icon: <div className="d-flex justify-content-center align-items-center"><img src={edit} /><img src={deleted} className="ms-2" /></div>}))
                setDetailPartner(detailPartner.data.response_data)
                setPayment(detailPartner.data.response_data.payment_method)
            }
        } catch (error) {
            // console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    } 

    const columns = [
        {
          name: 'No',
          selector: row => row.number,
          ignoreRowClick: true,
          button: true,
        },
        {
          name: 'ID Agen',
          selector: row => row.agen_id,
          sortable: true,
        },
        {
          name: 'Nama Agen',
          selector: row => row.agen_name,
          sortable: true,
          width: "120px"
        },
        {
          name: 'Email',
          selector: row => row.agen_email,
          sortable: true,
        },
        {
          name: 'No Hp',
          selector: row => row.agen_mobile,
          sortable: true,
        },
        {
          name: 'No Rekening',
          selector: row => row.no_rekening,
          sortable: true,
          width: "150px"
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.nama_pemilik_rekening,
            sortable: true,
            width: "240px"
        },
        {
          name: 'Kode Unik',
          selector: row => row.agen_unique_code !== null ? row.agen_unique_code : "-",
          width: "132px",
          sortable: true
        },
        {
          name: 'Status',
          selector: row => row.status === true ? <div className='active-status-badge'>Aktif</div> : <div className='inactive-status-badge'>Tidak Aktif</div>,
          width: "90px",
          style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 12px", margin: "6px 0px", width: "50%", borderRadius: 4 },
          
        }
    ]

    async function getDataAgen(partnerId) {
        try {
          const auth = "Bearer " + getToken()
          const dataParams = encryptData(`{"partner_id":"${partnerId}"}`)
          const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
          }
          const listAgen = await axios.post("/Partner/GetListAgen", { data: dataParams }, { headers: headers })
        //   console.log(listAgen, 'ini data agen');
          if (listAgen.status === 200 && listAgen.data.response_code === 200 && listAgen.data.response_new_token.length === 0) {
            listAgen.data.response_data = listAgen.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
            setListAgen(listAgen.data.response_data)
          } else if (listAgen.status === 200 && listAgen.data.response_code === 200 && listAgen.data.response_new_token.length !== 0) {
            setUserSession(listAgen.data.response_new_token)
            listAgen.data.response_data = listAgen.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
            setListAgen(listAgen.data.response_data)
          }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    async function getTypeFitur() {
        try {
          const auth = "Bearer " + getToken()
          const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
          }
          const listFitur = await axios.post("/Partner/GetFitur", { data: "" }, { headers: headers })
        //   console.log(listFitur, 'ini data list fitur');
          if (listFitur.status === 200 && listFitur.data.response_code === 200 && listFitur.data.response_new_token.length === 0) {
            setFiturType(listFitur.data.response_data)
          } else if (listFitur.status === 200 && listFitur.data.response_code === 200 && listFitur.data.response_new_token.length !== 0) {
            setUserSession(listFitur.data.response_new_token)
            setFiturType(listFitur.data.response_data)
          }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        if (user_role === "102") {
            history.push('/404');
        }
        getDetailPartner(partnerId)
        getDataAgen(partnerId)
        getTypeFitur()
    }, [access_token, user_role, partnerId])

    const columnPayment = [
        {
            name: 'No',
            selector: row => row.number,
            width: '67px'
        },
        {
            name: 'Metode Pembayaran',
            selector: row => row.mpaytype_name.join(", "),
            width: "200px"
        },
        {
            name: 'Fitur',
            selector: row => row.fitur_name
        },
        {
            name: 'Fee',
            selector: row => row.fee,
        },
        {
            name: 'Settlement Fee',
            selector: row => row.fee_settle,
            width: "150px"
        },        
        {
            name: 'Aksi',
            selector: row => row.icon,
            width: "130px"
        }
    ]

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
            <div>Loading...</div>
        </div>
    );

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px'
            },
        },
    };

    function detailAgenHandler(agenId) {
        // RouteTo(`/detailagen/${agenId}`)
        history.push(`/detailagen/${agenId}`)
      }

    function editPartner(partnerId) {
        // RouteTo(`/editpartner/${partnerId}`)
        history.push(`/editpartner/${partnerId}`)
    }


    function detailAkunTabs(isTabs){
        setIsDetailAkun(isTabs)
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
        <div className='container-content mt-5'>
            {isDetailAkun ? <span className='breadcrumbs-span'>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Daftar Partner &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;Detail Partner</span>
            : <span className='breadcrumbs-span'>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Daftar Partner &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;Daftar Agen</span>}
            <div className='detail-akun-menu mt-5' style={{display: 'flex', height: 33}}>
                <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => detailAkunTabs(true)} id="detailakuntab">
                    <span className='menu-detail-akun-span menu-detail-akun-span-active' id="detailakunspan">Profil Partner</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => detailAkunTabs(false)} id="konfigurasitab">
                    <span className='menu-detail-akun-span' id="konfigurasispan">Daftar Agen</span>
                </div>
            </div>
            {
                isDetailAkun ? 
                <>
                <div className='detail-akun-section'>        
                    <hr className='hr-style' style={{marginTop: -2}}/>
                    <br/>
                    <span className='head-title'>Profil Perusahaan</span>
                    <br/>
                    <br/>
                    <div className='base-content'>
                        <table style={{width: '100%', marginLeft: 'unset'}} className="table-form">
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td style={{width: 200}}>Status</td>
                                    <td><Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label={(detailPartner.mpartner_is_active === true) ? "Aktif" : "Tidak Aktif"}
                                        checked={(detailPartner.mpartner_is_active === true) ? true : false}
                                    /></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>ID Partner</td>
                                    <td><input type='text'className='input-text-ez' value={detailPartner.mpartner_id} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>Nama Perusahaan</td>
                                    <td><input type='text'className='input-text-ez' value={detailPartner.mpartner_name} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>Email Perusahaan</td>
                                    <td><input type='text'className='input-text-ez' value={detailPartner.mpartner_email} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>Nomor Telepon</td>
                                    <td><input type='text'className='input-text-ez' value={detailPartner.mpartner_telp} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>Alamat</td>
                                    <td><input type='text'className='input-text-ez' value={detailPartner.mpartner_address} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                            </tbody>
                        </table>
                    </div>
                    <br/>
                    <span className='head-title'>Detail NPWP</span>
                    <br/>
                    <br/>
                    <div className='base-content'>
                        <table style={{width: '100%', marginLeft: 'unset'}} className="table-form">
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td style={{width: 200}}>No NPWP</td>
                                    <td><input type='text'className='input-text-ez' value={detailPartner.mpartner_npwp !== null ? detailPartner.mpartner_npwp : "-"} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>Nama NPWP</td>
                                    <td><input type='text'className='input-text-ez' value={detailPartner.mpartner_npwp_name !== null ? detailPartner.mpartner_npwp_name : "-"} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                            </tbody>
                        </table>
                    </div>
                    <br/>
                    <span className='head-title'>Profil Direktur Perusahaan</span>
                    <br/>
                    <br/>
                    <div className='base-content'>
                        <table style={{width: '100%', marginLeft: 'unset'}} className="table-form">
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td style={{width: 200}}>Nama Direktur</td>
                                    <td><input type='text'className='input-text-ez' value={detailPartner.mpartner_direktur} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>No Hp Direktur</td>
                                    <td><input type='text'className='input-text-ez' value={detailPartner.mpartner_direktur_telp} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                            </tbody>
                        </table>
                    </div>
                    <br/>
                    <span className='head-title'>Rekening</span>
                    <br/>
                    <br/>
                    <div className='base-content'>
                        <table style={{width: '100%', marginLeft: 'unset'}} className="table-form">
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td style={{width: 200}}>Nama Bank</td>
                                    <td><input type='text'className='input-text-ez' value={detailPartner.mbank_name} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>No. Rekening</td>
                                    <td><input type='text'className='input-text-ez' value={detailPartner.mpartnerdtl_account_number} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>Nama Pemilik Rekening</td>
                                    <td><input type='text'className='input-text-ez' value={detailPartner.mpartnerdtl_account_name} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                            </tbody>
                        </table>
                    </div>
                </div>
                <br/>
                    <span className='head-title'>Biaya</span>
                    <br/>
                    <br/>
                    <div className='base-content'>
                        <table style={{width: '100%', marginLeft: 'unset'}} className="table-form mb-5">
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td style={{width: 200}}>Fee<span style={{color: "red"}}>*</span></td>
                                    <td><input type='text'className='input-text-ez' value={convertToRupiah(0)} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>Settlement Fee<span style={{color: "red"}}>*</span></td>
                                    <td><input type='text'className='input-text-ez' value={convertToRupiah(0)} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                            </tbody>
                        </table>
                        <Row className="mt-4">
                            <Col xs={3} style={{paddingLeft: 20}}>
                                Fitur<span style={{color: "red"}}>*</span>
                            </Col>
                            <Col className="ms-2">
                                {equalFitur === 0 ? (
                                    <>
                                        <Row>
                                            {dataAtasFitur(atasFitur).map((item) => {
                                                return (
                                                    <Col  key={item.fitur_id} xs={2}>
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" type="radio" id="inlineCheckbox1" name={item.fitur_name} disabled />
                                                            <label className="form-check-label" style={{fontWeight: 400, fontSize: "14px"}} for="inlineCheckbox1">{item.fitur_name}</label>
                                                        </div>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                        <Row>                                            
                                            {dataBawahFitur(bawahFitur).map((item) => {
                                                return (
                                                    <Col key={item.fitur_id} xs={2}>
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" type="radio" id="inlineCheckbox1" name={item.fitur_name} disabled />
                                                            <label className="form-check-label" style={{fontWeight: 400, fontSize: "14px"}} for="inlineCheckbox1">{item.fitur_name}</label>
                                                        </div>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </>
                                ) : (
                                    <>
                                        <Row>
                                            {dataAtasEqualFitur(equalFitur).map((item) => {
                                                return (
                                                    <Col key={item.fitur_id} xs={2}>
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" type="radio" id="inlineCheckbox1" name={item.fitur_name} disabled/>
                                                            <label className="form-check-label" style={{fontWeight: 400, fontSize: "14px"}} for="inlineCheckbox1">{item.fitur_name}</label>
                                                        </div>
                                                    </Col>
                                                )
                                            })}                                            
                                        </Row>
                                        <Row>
                                            {dataBawahEqualFitur(equalFitur).map((item) => {
                                                return (
                                                    <Col  key={item.fitur_id} xs={2}>
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" type="radio" id="inlineCheckbox1" name={item.fitur_name} disabled/>
                                                            <label className="form-check-label" style={{fontWeight: 400, fontSize: "14px"}} for="inlineCheckbox1">{item.fitur_name}</label>
                                                        </div>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </>
                                )}
                            </Col>
                        </Row>
                        {expanded ?
                            <div className='my-4' style={{display: "flex", justifyContent: "end", alignItems: "center", padding: "unset"}}>
                                <button style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", gap: 8, width: 300, height: 48, color: "#077E86", background: "unset", border: "unset"}} onClick={showCheckboxes}>
                                    Sembunyikan tabel skema biaya <FontAwesomeIcon icon={faChevronUp} className="mx-2" />
                                </button>
                            </div> :
                            <div className='my-4 mb-4' style={{display: "flex", justifyContent: "end", alignItems: "center", padding: "unset"}} >
                                <button style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", gap: 8, width: 300, height: 48, color: "#077E86", background: "unset", border: "unset"}} onClick={showCheckboxes}>
                                    Lihat tabel skema lainnya <FontAwesomeIcon icon={faChevronDown} className="mx-2" />
                                </button>
                            </div>                                            
                        }
                        {expanded && 
                            <div className="div-table pb-4" ref={myRef}>
                                <DataTable
                                    columns={columnPayment}
                                    data={payment}
                                    customStyles={customStyles}
                                    // progressPending={pendingSettlement}
                                    progressComponent={<CustomLoader />}
                                    // dense
                                    // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                                    // pagination
                                />
                            </div>
                        }
                    </div>
                    <div className='mb-5 mt-3' style={{ display: "flex", justifyContent: "end"}}>
                    <button onClick={() => editPartner(partnerId)} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", padding: "12px 24px", gap: 8, width: 136, height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                        Edit
                    </button>
                </div>
                </> : 
                <> 
                    <hr className='hr-style' style={{marginTop: -2}}/>
                    <div className='base-content mt-5 mb-5'>   
                        <div className='search-bar mb-5'>
                            <Row>
                                <Col xs={3} >
                                    <span className='h5'>
                                        Cari Data Agen :
                                    </span>
                                </Col>
                                <Col xs={6}>
                                    <Form.Control
                                        placeholder="Masukkan Nama Agen"
                                        aria-label="Masukkan Nama Agen"
                                        aria-describedby="basic-addon2"
                                        style={{marginTop: '-10px'}}
                                        />
                                </Col>
                            </Row>
                        </div>
                        {
                        listAgen.length === 0 ?
                        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 20, alignItems: "center" }}>There are no records to display</div> :
                        <div className="div-table">
                            <DataTable
                            columns={columns}
                            data={listAgen}
                            customStyles={customStyles}
                            noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                            pagination
                            highlightOnHover
                            onRowClicked={(listAgen) => {
                                detailAgenHandler(listAgen.agen_id)
                            }}
                            />
                        </div>
                        }
                    </div>
                </>
            }            
        </div>
    )
}

export default DetailPartner