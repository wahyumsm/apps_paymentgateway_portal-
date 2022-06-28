import React, { useEffect, useState } from 'react'
import '../../components/css/global.css'
import DataTable, { memoize } from 'react-data-table-component';
import { Col, Row, Button, Dropdown, ButtonGroup, InputGroup, Form} from '@themesberg/react-bootstrap';
import { agenLists } from '../../data/tables';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory, Link } from 'react-router-dom';
import { BaseURL, getToken } from '../../function/helpers';
import axios from 'axios';

function DaftarAgen() {

  const history = useHistory()
  const [listAgen, setListAgen] = useState([])

  function tambahAgen() {
    history.push("/tambahagen")
  }

  async function getDataAgen() {
    try {
      const auth = "Bearer " + getToken()
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const listAgen = await axios.post(BaseURL + "/Agen/ListAgen", { data: "" }, { headers: headers })
      // console.log(listAgen, 'ini data agen');
      if (listAgen.status === 200 && listAgen.data.response_code === 200) {
        listAgen.data.response_data = listAgen.data.response_data.map((obj, id) => ({ ...obj, id: id + 1, status: (obj.status === true) ? obj.status = "Aktif" : obj.status = "Tidak Aktif" }));
        setListAgen(listAgen.data.response_data)
      }
    } catch (error) {
      console.log(error)
      if (error.response.status === 401) {
        history.push('/sign-in')
      }
    }
  }

  useEffect(() => {
    getDataAgen()
  }, [])
  
  function detailAgenHandler(agenId) {
    history.push({pathname: "/detailagen", state: {agenId: agenId}})
  }

  const columns = [
    {
      name: 'No',
      selector: row => row.id,
      width: "55px",
      ignoreRowClick: true,
      button: true,
    },
    {
      name: 'ID Agen',
      selector: row => row.agen_id,
      sortable: true,
      width: "120px",
      cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailAgenHandler(row.agen_id)}>{row.agen_id}</Link>
      // onRow
    },
    {
      name: 'Nama Agen',
      selector: row => row.agen_name,
      sortable: true,
      width: "181px",
    },
    {
      name: 'Email',
      selector: row => row.agen_email,
      sortable: true,
      width: "215px",
    },
    {
      name: 'No Hp',
      selector: row => row.agen_mobile,
      sortable: true,
      width: "213px",
    },
    {
      name: 'No Rekening',
      selector: row => row.agen_bank_number,
      width: "215px",
      sortable: true
    },
    // {
    //   name: 'Kode Unik',
    //   selector: row => row.agen_unique_code,
    //   width: "132px",
    //   sortable: true
    // },
    {
      name: 'Status',
      selector: row => row.status,
      width: "90px",
      style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 12px", margin: "6px 0px", width: "50%", borderRadius: 4 },
      conditionalCellStyles: [
        {
          when: row => row.status === "Aktif",
          style: { background: "rgba(7, 126, 134, 0.08)" }
        },
        {
          when: row => row.status === "Tidak Aktif",
          style: { background: "#F0F0F0" }
        }
      ],
    }
  ]

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

  return (
    <div className='main-content' style={{ padding: "37px 27px" }}>
      <div className="head-title">
        <h2 className="h4 mt-5 mb-5">Daftar Agen</h2>
      </div>
      <div style={{ display: "flex", justifyContent: "end", marginTop: -88, paddingBottom: 24 }}>
        <button onClick={() => tambahAgen()} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 183, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Tambah Agen
        </button>
      </div>
      <div className='base-content'>   
        <div className='search-bar mb-5'>
          <Row>
            <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
              <span className='h5'>
                Cari Data Agen :
              </span>
            </Col>
            <Col xs={2}>
              <Form.Control
                placeholder="Masukkan Nama Agen"
                type='text'
                // aria-label="Masukkan Nama Agen"
                // aria-describedby="basic-addon2"
                style={{ width: 200, marginTop: '-7px' }}
                />
            </Col>
          </Row>
        </div>
        {
          listAgen.length === 0 ?
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: 20, alignItems: "center" }}>No Data</div> :
          <div className="div-table">
            <DataTable
              columns={columns}
              data={listAgen}
              customStyles={customStyles}
              noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
              pagination
              highlightOnHover
              onRowClicked={(listAgen) => {
                // console.log(listAgen.agen_id, 'ini list agen di clik table');
                detailAgenHandler(listAgen.agen_id)
              }}
            />
          </div>
        }
      </div>
    </div>
  )
}

export default DaftarAgen