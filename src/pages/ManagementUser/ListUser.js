import React, { useEffect, useState } from "react";
import { Col, Row, Form, Image } from '@themesberg/react-bootstrap';
import {useHistory} from 'react-router-dom';
import 'chart.js/auto';
import DataTable from 'react-data-table-component';
import { BaseURL, errorCatch, getRole, getToken } from "../../function/helpers";
import axios from "axios";
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import "./ListUser.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEye, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

function ListUser () {

  const history = useHistory();
  const access_token = getToken();
  const [listManageUser, setListManageUser] = useState([])
  const user_role = getRole()
  const [inputHandle, setInputHandle] = useState({
    idTransaksi: "",
    namaAgen: "",
    status: "",
  })
  const [pending, setPending] = useState(true)

  function detailUserHandler(muserId) {
    history.push(`/updateuser/${muserId}`)
  }

  function menuAccessHandler(muserId) {
    history.push(`/menuaccess/${muserId}`)
  }

  async function getListManageUser() {
    try {
      const auth = "Bearer " + getToken()
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const listManageUser = await axios.post("/Account/ListUser", { data: "" }, { headers: headers })
      console.log(listManageUser, "ini data user")
      if (listManageUser.status === 200 && listManageUser.data.response_code === 200) {
        listManageUser.data.response_data = listManageUser.data.response_data.map((obj, id) => ({ ...obj, number: id + 1, icon: <div className="d-flex justify-content-center align-items-center"><FontAwesomeIcon icon={faEye} className="me-2" style={{cursor: "pointer"}} onClick={() => menuAccessHandler(obj.muser_id)} /><FontAwesomeIcon icon={faPencilAlt} className="mx-2" style={{cursor: "pointer"}} onClick={() => detailUserHandler(obj.muser_id)} /></div> }));
        setListManageUser(listManageUser.data.response_data)
        setPending(false)
      }
    } catch (error) {
      console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  useEffect(() => {
    if (!access_token) {
      history.push('/login');
    }
    if (user_role == 102) {
      history.push('/404');
    }
    getListManageUser()
  }, [access_token, user_role])

  const columnManageUser = [
    {
        name: 'No',
        selector: row => row.number,
        width: "67px",
        sortable: true,
    },
    {
        name: 'Role',
        selector: row => row.role_desc,
    },
    {
        name: 'Email',
        selector: row => row.email,
    },
    {
        name: 'Nama',
        selector: row => row.name,
        sortable: true
    },
    {
        name: 'Online Status',
        selector: row => row.status === true ? "Online" : "Offline",
    },
    {
        name: 'Status',
        selector: row => row.is_active === true ? "Aktif" : "Tidak Aktif",
        sortable: true,
    },
    {
        name: 'Access',
        selector: row => row.total_access,
        width: "150px",
        sortable: true,
    },
    {
        name: 'Action',
        selector: row => row.icon,
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

  const CustomLoader = () => (
    <div style={{ padding: '24px' }}>
      <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
      <div>Loading...</div>
    </div>
  );

    const tambahPartner = () => {
        history.push("/adduser")
    }

  return (
    <>
      <div className="main-content" style={{padding: "37px 27px 37px 27px"}}>
        <div className="head-title">
          <h2 className="h4 mt-5">Management User</h2>
        </div>
        <button className="my-3" onClick={() => tambahPartner()} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 201, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Tambah Data
        </button>
        <div className='base-content'>
            <span className='mb-4' style={{fontWeight: 600}}>Data User</span>
            <Row className='mt-4'>
                <Col className="font-weight-bold mb-3" xs={12}>Search By</Col>
                <Col xs={6}>
                    <Form.Select name="statusDanaMasuk" className='input-text-user' style={{ display: "inline" }} >
                        <option defaultValue value={1}>Nama</option>
                        <option value={2}>Email</option>
                    </Form.Select>
                </Col>
                <Col xs={6}>
                    <input name="namaAgen" type='text' className='input-text-user' placeholder='Cari'/>
                </Col>
            </Row>
            <Row className='mt-4'>
                <Col className="font-weight-bold mb-3" xs={12}>Tampilkan Per</Col>
                <Col xs={6}>
                    <Form.Select name="statusDanaMasuk" className='input-text-user' style={{ display: "inline" }} >
                        <option defaultValue value={1}>10</option>
                        <option value={2}>20</option>
                        <option value={3}>50</option>
                        <option value={4}>100</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row className='mt-4'>
                <Col xs={3}>
                    <Row>
                        <Col xs={6}>
                            <button className="btn-ez-on">
                              Cari
                            </button>
                        </Col>
                        {/* <Col xs={6}>
                            <button className={(dateRange.length !== 0 || dateRange.length !== 0 && inputHandle.idTransaksi.length !== 0 || dateRange.length !== 0 && inputHandle.status.length !== 0 || dateRange.length !== 0 && inputHandle.namaAgen.length !== 0) ? "btn-ez-on" : "btn-ez"} disabled={dateRange.length === 0 || dateRange.length === 0 && inputHandle.idTransaksi.length === 0 || dateRange.length === 0 && inputHandle.status.length === 0 || dateRange.length === 0 && inputHandle.namaAgen.length === 0}>
                              Atur Ulang
                            </button>
                        </Col> */}
                    </Row>
                </Col>
            </Row>
            <br/>
            <div className="div-table">
                <DataTable
                    columns={columnManageUser}
                    data={listManageUser}
                    customStyles={customStyles}
                    pagination
                    highlightOnHover
                    progressPending={pending}
                    progressComponent={<CustomLoader />}
                />
            </div>
        </div>
      </div>
    </>
  );
};

export default ListUser
