import React, { useEffect, useMemo, useState } from "react";
import { Col, Row, Form, Image } from '@themesberg/react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import 'chart.js/auto';
import DataTable from 'react-data-table-component';
import { BaseURL, errorCatch, getRole, getToken, setUserSession } from "../../function/helpers";
import axios from "axios";
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEye, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import FilterManageUser from "../../components/FileManageUser";

function ListUser () {

  const history = useHistory();
  const access_token = getToken();
  const [listManageUser, setListManageUser] = useState([])
  const user_role = getRole()
  const [inputHandle, setInputHandle] = useState({
    status: 1,
  })
  // console.log(inputHandle.status, "numnb");
  const [pending, setPending] = useState(true)
  const [filterText, setFilterText] = React.useState('');
  const filteredItemsName = listManageUser.filter(
      item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
  );

  const filteredItemsEmail = listManageUser.filter(
    item => item.email && item.email.toLowerCase().includes(filterText.toLowerCase()),
  );

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
        if (filterText) {
            setFilterText('');
        }
    };

    function handleChange(e) {
      setInputHandle({
        ...inputHandle,
        [e.target.name]: Number(e.target.value),
      });
    }
    return (
        <Row className="my-4" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Col xs={6}>
            <Form.Select name="status" className='input-text-user ps-3' style={{ display: "inline" }} onChange={(e) => handleChange(e)} >
                <option defaultValue value={1}>Nama</option>
                <option value={2}>Email</option>
            </Form.Select>
          </Col>
          <Col xs={6}>
            <FilterManageUser onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} title="Cari Daftar Partner :" placeholder={inputHandle.status === 1 ? "Masukkan Nama" : "Masukkan Email"} />
          </Col>
        </Row>
    );	}, [filterText, inputHandle]
);

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
      const listManageUser = await axios.post(BaseURL + "/Account/ListUser", { data: "" }, { headers: headers })
      if (listManageUser.status === 200 && listManageUser.data.response_code === 200 && listManageUser.data.response_new_token.length === 0) {
        listManageUser.data.response_data = listManageUser.data.response_data.map((obj, id) => ({ ...obj, number: id + 1, icon: <div className="d-flex justify-content-center align-items-center"><FontAwesomeIcon icon={faEye} className="me-2" style={{cursor: "pointer"}} onClick={() => menuAccessHandler(obj.muser_id)} /><FontAwesomeIcon icon={faPencilAlt} className="mx-2" style={{cursor: "pointer"}} onClick={() => detailUserHandler(obj.muser_id)} /></div> }));
        setListManageUser(listManageUser.data.response_data)
        setPending(false)
      } else if (listManageUser.status === 200 && listManageUser.data.response_code === 200 && listManageUser.data.response_new_token.length !== 0) {
        setUserSession(listManageUser.data.response_new_token)
        listManageUser.data.response_data = listManageUser.data.response_data.map((obj, id) => ({ ...obj, number: id + 1, icon: <div className="d-flex justify-content-center align-items-center"><FontAwesomeIcon icon={faEye} className="me-2" style={{cursor: "pointer"}} onClick={() => menuAccessHandler(obj.muser_id)} /><FontAwesomeIcon icon={faPencilAlt} className="mx-2" style={{cursor: "pointer"}} onClick={() => detailUserHandler(obj.muser_id)} /></div> }));
        setListManageUser(listManageUser.data.response_data)
        setPending(false)
      }
    } catch (error) {
      // console.log(error)
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
        selector: row => row.is_online === true ? "Online" : "Offline",
    },
    {
        name: 'Status',
        selector: row => row.status === true ? "Aktif" : "Tidak Aktif",
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

    const tambahUser = () => {
        history.push("/adduser")
    }

  return (
    <>
      <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
        <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Management User</span>
        <div className="head-title">
          <h2 className="h4 mt-4">Management User</h2>
        </div>
        <button className="my-3" onClick={() => tambahUser()} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 201, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Tambah Data
        </button>
        <div className='base-content'>
            <span className='mb-4' style={{fontWeight: 600}}>Data User</span>
            
            <br/>
            <div className="div-table">
                <DataTable
                    columns={columnManageUser}
                    data={inputHandle.status === 1 ? filteredItemsName : filteredItemsEmail}
                    customStyles={customStyles}
                    pagination
                    highlightOnHover
                    progressPending={pending}
                    progressComponent={<CustomLoader />}
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                    persistTableHead
                />
            </div>
        </div>
      </div>
    </>
  );
};

export default ListUser
