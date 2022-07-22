import React, { useEffect, useState } from 'react'
import '../../components/css/global.css'
import DataTable from 'react-data-table-component';
import { Col, Row, Form} from '@themesberg/react-bootstrap';
import {Link, useHistory} from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { BaseURL, errorCatch, getRole, getToken, RouteTo, setUserSession } from '../../function/helpers';
import axios from 'axios';
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"

function DaftarPartner() {

    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
    const [listPartner, setListPartner] = useState([])

    function tambahPartner() {
        // RouteTo("/tambahpartner")
        history.push("/tambahpartner")
    }

    async function listDataPartner (url) {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const listDataPartner = await axios.post(BaseURL + url, { data: "" }, { headers: headers })
            // console.log(listDataPartner, 'ini data user ');
            if (listDataPartner.data.response_code === 200 && listDataPartner.status === 200 && listDataPartner.data.response_new_token.length === 0) {
                listDataPartner.data.response_data = listDataPartner.data.response_data.map((obj, id) => ({ ...obj, id: id + 1, status: (obj.status === true) ? obj.status = "Aktif" : obj.status = "Tidak Aktif" }));
                setListPartner(listDataPartner.data.response_data)
            } else {
                setUserSession(listDataPartner.data.response_new_token)
                listDataPartner.data.response_data = listDataPartner.data.response_data.map((obj, id) => ({ ...obj, id: id + 1, status: (obj.status === true) ? obj.status = "Aktif" : obj.status = "Tidak Aktif" }));
                setListPartner(listDataPartner.data.response_data)
            }
            
        } catch (error) {
            console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(()=>{
        if (!access_token) {
            history.push("/login")
        }
        if (user_role === 102) {
            history.push('/404');
        }
        listDataPartner('/Partner/ListPartner')
    },[access_token, user_role])

    function detailPartnerHandler(partnerId) {
        // RouteTo(`/detailpartner/${partnerId}`)
        history.push(`/detailpartner/${partnerId}`)
    }

    const columns = [
        {
            name: 'No',
            selector: row => row.id,
            width: '67px'
        },
        {
            name: 'ID Partner',
            selector: row => row.partner_id,
            sortable: true,
            cell: (row) => <Link style={{textDecoration: "underline", color: "#077E86"}} onClick={() => detailPartnerHandler(row.partner_id)}>{row.partner_id}</Link>
        },
        {
            name: 'Nama Perusahaan',
            selector: row => row.nama_perusahaan,
            sortable: true
        },
        {
            name: 'Email Perusahaan',
            selector: row => row.email_perusahaan ? row.email_perusahaan : <><div>-</div></>,
            sortable: true
        },
        {
            name: 'No. Telepon',
            selector: row => row.no_telepon ? row.no_telepon : <><div>-</div></>,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => row.status === "Aktif" ? <div className='active-status-badge'>Aktif</div> : <div className='inactive-status-badge'>Tidak Aktif</div>,
            width: "200px",
            sortable: true
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                paddingRight: 'none'
                
            },
        },
    };

  return (
    <div className='main-content mt-5' style={{padding: "37px 27px 37px 27px"}}>
        <span className='breadcrumbs-span'>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Daftar Partner</span>
        <div className="head-title">
            <h2 className="h4 mt-4 mb-5">Daftar Partner</h2>
        </div>
        <div style={{ display: "flex", justifyContent: "end", marginTop: -88, paddingBottom: 24 }}>
            <button onClick={() => tambahPartner()} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 201, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Tambah Partner
            </button>
        </div>
        <div className='base-content'>   
            {/* <div className='search-bar mb-5'>
                <Row>
                    <Col xs={3} style={{width: '18%'}}>
                        <span className='h5'>
                            Cari Data Partner :
                        </span>
                    </Col>
                    <Col xs={2}>
                        <Form.Control
                            placeholder="Recipient's username"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            style={{marginTop: '-10px'}}
                            />
                    </Col>
                </Row>
            </div> */}
            <div className="div-table">
                <DataTable
                    columns={columns}
                    data={listPartner}
                    customStyles={customStyles}
                    noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                    pagination
                    highlightOnHover
                />
            </div>
        </div>
    </div>
  )
}

export default DaftarPartner