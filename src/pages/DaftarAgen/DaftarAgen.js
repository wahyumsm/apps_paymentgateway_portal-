import React from 'react'
import '../../components/css/global.css'
import DataTable from 'react-data-table-component';
import { Col, Row, Button, Dropdown, ButtonGroup, InputGroup, Form} from '@themesberg/react-bootstrap';
import { agenLists } from '../../data/tables';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom';

function DaftarAgen() {

  const history = useHistory()

  function tambahAgen() {
    history.push("/tambahagen")
  }

  const columns = [
    {
      name: 'No',
      selector: row => row.id,
      width: "55px",
    },
    {
      name: 'ID Agen',
      selector: row => row.IDAgen,
      sortable: true,
      width: "120px",
      ignoreRowClick: true,
    },
    {
      name: 'Nama Agen',
      selector: row => row.namaAgen,
      sortable: true,
      width: "181px",
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      width: "215px",
    },
    {
      name: 'No Hp',
      selector: row => row.noHp,
      sortable: true,
      width: "213px",
    },
    {
      name: 'No Rekening',
      selector: row => row.noRekening,
      width: "215px",
      sortable: true
    },
    {
      name: 'Kode Unik',
      selector: row => row.kodeUnik,
      width: "132px",
      sortable: true
    },
    {
      name: 'Status',
      selector: row => row.status,
      width: "100px",
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
  ];

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
        <div className="div-table">
          <DataTable
            columns={columns}
            data={agenLists}
            customStyles={customStyles}
            pagination
          />
        </div>
      </div>
    </div>
  )
}

export default DaftarAgen