import React, {useEffect, useState} from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Col, Form, Row } from '@themesberg/react-bootstrap';
import $ from 'jquery'
import axios from 'axios';
import { BaseURL, errorCatch, getRole, getToken, RouteTo, setUserSession } from '../../function/helpers';
import { useHistory, useParams } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import encryptData from '../../function/encryptData';

function EditPartner() {

    const [isDetailAkun, setIsDetailAkun] = useState(true);
    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
    const { partnerId } = useParams()
    const [listAgen, setListAgen] = useState([])
    const [detailPartner, setDetailPartner] = useState([])
    const [inputHandle, setInputHandle] = useState({
        id:partnerId,
        namaPerusahaan: detailPartner.mpartner_name,
        emailPerusahaan: detailPartner.mpartner_email,
        phoneNumber: detailPartner.mpartner_telp,
        alamat: detailPartner.mpartner_address,
        noNpwp: detailPartner.mpartner_npwp,
        namaNpwp: detailPartner.mpartner_npwp_name,
        nama: detailPartner.mpartner_direktur,
        noHp: detailPartner.mpartner_direktur_telp,
        active: detailPartner.mpartner_is_active,
        bankName: 1,
        akunBank: detailPartner.mpartnerdtl_account_number,
        rekeningOwner: detailPartner.mpartnerdtl_account_name,
        fee: 0,
        settlementFee: 0,
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
                // console.log(detailAgen.data.response_data, 'ini detail agen');
                if (detailPartner.data.response_data.mpartner_is_active === true) {
                    detailPartner.data.response_data = {
                        ...detailPartner.data.response_data,
                        isActive: "Aktif"
                    }
                } else {
                    detailPartner.data.response_data = {
                        ...detailPartner.data.response_data,
                        isActive: "Tidak Aktif"
                    }
                }
                setDetailPartner(detailPartner.data.response_data)
            } else if (detailPartner.status === 200 && detailPartner.data.response_code === 200 && detailPartner.data.response_new_token.length !== 0) {
                setUserSession(detailPartner.data.response_new_token)
                if (detailPartner.data.response_data.mpartner_is_active === true) {
                    detailPartner.data.response_data = {
                        ...detailPartner.data.response_data,
                        isActive: "Aktif"
                    }
                } else {
                    detailPartner.data.response_data = {
                        ...detailPartner.data.response_data,
                        isActive: "Tidak Aktif"
                    }
                }
                setDetailPartner(detailPartner.data.response_data)
            }
        } catch (error) {
            console.log(error)
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
        //   cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailAgenHandler(row.agen_id)}>{row.agen_id}</Link>
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
          selector: row => row.agen_unique_code,
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

      async function editDetailPartner(id, namaPerusahaan, emailPerusahaan, phoneNumber, alamat, noNpwp, namaNpwp, nama, noHp, active, akunBank, rekeningOwner, fee, settlementFee) {
        try {
            if (namaPerusahaan === undefined) {
                namaPerusahaan = detailPartner.mpartner_name
            }
            if (emailPerusahaan === undefined) {
                emailPerusahaan = detailPartner.mpartner_email
            }
            if (phoneNumber === undefined) {
                phoneNumber = detailPartner.mpartner_telp
            }
            if (alamat === undefined) {
                alamat = detailPartner.mpartner_address
            }
            if (noNpwp === undefined) {
                noNpwp = detailPartner.mpartner_npwp
            }
            if (namaNpwp === undefined) {
                namaNpwp = detailPartner.mpartner_npwp_name
            }
            if (nama === undefined) {
                nama = detailPartner.mpartner_direktur
            }
            if (noHp === undefined) {
                noHp = detailPartner.mpartner_direktur_telp
            }
            if (active === undefined) {
                active = detailPartner.mpartner_is_active
            }
            if (akunBank === undefined) {
                akunBank = detailPartner.mpartnerdtl_account_number
            }
            if (rekeningOwner === undefined) {
                rekeningOwner = detailPartner.mpartnerdtl_account_name
            }
            if (fee === 0) {
                fee = detailPartner.mpartner_fee
            }
            if (settlementFee === 0) {
                settlementFee = detailPartner.mpartnerdtl_settlement_fee
            }
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"mpartner_id":"${id}", "mpartner_name": "${namaPerusahaan}", "mpartner_email": "${emailPerusahaan}", "mpartner_telp": "${phoneNumber}", "mpartner_address": "${alamat}", "mpartner_npwp": "${noNpwp}", "mpartner_npwp_name": "${namaNpwp}", "mpartner_direktur": "${nama}", "mpartner_direktur_telp": "${noHp}", "mpartner_is_active": ${active}, "bank_account_number": "${akunBank}", "bank_account_name": "${rekeningOwner}", "mpartner_fee": ${fee}, "mpartnerdtl_settlement_fee": ${settlementFee}}`)
            // console.log(dataParams, 'ini data params');
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const editPartner = await axios.post("/Partner/UpdatePartner", { data: dataParams }, { headers: headers })
            // console.log(editPartner, 'ini add partner');
            if(editPartner.status === 200 && editPartner.data.response_code === 200 && editPartner.data.response_new_token.length === 0) {
                // RouteTo('/daftarpartner')
                history.push("/daftarpartner")
                // alert("Edit Data Partner Berhasil Ditambahkan")
            } else if(editPartner.status === 200 && editPartner.data.response_code === 200 && editPartner.data.response_new_token.length !== 0) {
                setUserSession(editPartner.data.response_new_token)
                history.push("/daftarpartner")
            }
            
            alert("Edit Data Partner Berhasil")
        } catch (error) {
            console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function getDataAgen(partnerId) {
        try {
          const auth = "Bearer " + getToken()
          const dataParams = encryptData(`{"partner_id":"${partnerId}"}`)
        //   console.log(dataParams, 'ini data params');
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
            setListAgen(listAgen.data.response_data)
          }
        } catch (error) {
            console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        if (!access_token) {
            // RouteTo('/login')
            history.push('/login');
        }
        if (user_role === 102) {
            history.push('/404');
        }
        getDetailPartner(partnerId)
        getDataAgen(partnerId)
    }, [access_token, user_role, partnerId])

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

    const goBack = () => {
        window.history.back();
    };

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
                                        label={(inputHandle.active === undefined) ? detailPartner.isActive : (inputHandle.active === true) ? "Aktif" : "Tidak Aktif"}
                                        checked={(inputHandle.active === undefined) ? detailPartner.mpartner_is_active : inputHandle.active}
                                        name="active"
                                        onChange={handleChange}
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
                                    <td><input type='text'className='input-text-ez' onChange={handleChange} defaultValue={(detailPartner.mpartner_name)} name="namaPerusahaan" style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>Email Perusahaan</td>
                                    <td><input type='text'className='input-text-ez' onChange={handleChange} defaultValue={(detailPartner.mpartner_email)} name="emailPerusahaan" style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>Nomor Telepon</td>
                                    <td><input type='text'className='input-text-ez' onChange={handleChange} defaultValue={detailPartner.mpartner_telp} name="phoneNumber" style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>Alamat</td>
                                    <td><input type='text'className='input-text-ez' onChange={handleChange} defaultValue={detailPartner.mpartner_address} name="alamat" style={{width: '100%', marginLeft: 'unset'}}/></td>
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
                                    <td><input type='text'className='input-text-ez' onChange={handleChange} defaultValue={detailPartner.mpartner_npwp !== null ? detailPartner.mpartner_npwp : "-"} name="noNpwp" style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>Nama NPWP</td>
                                    <td><input type='text'className='input-text-ez' onChange={handleChange} defaultValue={detailPartner.mpartner_npwp_name !== null ? detailPartner.mpartner_npwp_name : "-"} name="namaNpwp" style={{width: '100%', marginLeft: 'unset'}}/></td>
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
                                    <td><input type='text'className='input-text-ez' onChange={handleChange} defaultValue={detailPartner.mpartner_direktur} name="nama" style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>No Hp Direktur</td>
                                    <td><input type='text'className='input-text-ez' onChange={handleChange} defaultValue={detailPartner.mpartner_direktur_telp} name="noHp" style={{width: '100%', marginLeft: 'unset'}}/></td>
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
                                    <td><input type='text'className='input-text-ez' value={detailPartner.mbank_name} name="bankName" disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>No. Rekening</td>
                                    <td><input type='text'className='input-text-ez' onChange={handleChange} defaultValue={detailPartner.mpartnerdtl_account_number} name="akunBank" style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>Nama Pemilik Rekening</td>
                                    <td><input type='text'className='input-text-ez' onChange={handleChange} defaultValue={detailPartner.mpartnerdtl_account_name} name="rekeningOwner" style={{width: '100%', marginLeft: 'unset'}}/></td>
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
                        <table style={{width: '100%', marginLeft: 'unset'}} className="table-form">
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td style={{width: 200}}>Fee</td>
                                    <td><input type='text'className='input-text-ez' onChange={handleChange} defaultValue={detailPartner.mpartner_fee} name="fee" style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: 200}}>Settlement Fee</td>
                                    <td><input type='text'className='input-text-ez' onChange={handleChange} defaultValue={detailPartner.mpartnerdtl_settlement_fee} name="settlementFee" style={{width: '100%', marginLeft: 'unset'}}/></td>
                                </tr>
                                <br/>
                            </tbody>
                        </table>
                    </div>
                    <div className='mb-5 mt-3' style={{ display: "flex", justifyContent: "end"}}>
                        <button onClick={goBack} className='mx-2' style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", padding: "12px 24px", gap: 8, width: 136, height: 45, background: "#FFFFFF", color:"#888888", border: "0.6px solid #EBEBEB", borderRadius: 6 }}>
                            Batal
                        </button>
                        <button onClick={() => editDetailPartner(inputHandle.id, inputHandle.namaPerusahaan, inputHandle.emailPerusahaan, inputHandle.phoneNumber, inputHandle.alamat, inputHandle.noNpwp, inputHandle.namaNpwp, inputHandle.nama, inputHandle.noHp, inputHandle.active, inputHandle.akunBank, inputHandle.rekeningOwner, inputHandle.fee, inputHandle.settlementFee)} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", padding: "12px 24px", gap: 8, width: 136, height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                            Simpan
                        </button>
                    </div>
                </> : 
                <> 
                    <hr className='hr-style' style={{marginTop: -2}}/>
                    <div className='base-content mt-5 mb-5'>   
                        <div className='search-bar mb-5'>
                            <Row>
                                <Col xs={3} style={{width: '18%'}}>
                                    <span className='h5'>
                                        Cari Data Agen :
                                    </span>
                                </Col>
                                <Col xs={2}>
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
                            // paginationResetDefaultPage={resetPaginationToggle}
                            // subHeader
                            // subHeaderComponent={subHeaderComponentMemo}
                            // selectableRows
                            // persistTableHead
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

export default EditPartner