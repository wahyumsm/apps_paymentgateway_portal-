import React, { useEffect, useState } from 'react'
import '../../components/css/global.css'
import DataTable, { FilterComponent } from 'react-data-table-component';
import { Col, Row, Button, Dropdown, ButtonGroup, InputGroup, Form} from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory, Link } from 'react-router-dom';
import { BaseURL, errorCatch, getToken } from '../../function/helpers';
import axios from 'axios';

function DaftarAgen() {

  const history = useHistory()
  const access_token = getToken()
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
      const listAgen = await axios.post("/Agen/ListAgen", { data: "" }, { headers: headers })
      // console.log(listAgen, 'ini data agen');
      if (listAgen.status === 200 && listAgen.data.response_code === 200) {
        listAgen.data.response_data = listAgen.data.response_data.map((obj, id) => ({ ...obj, id: id + 1, status: (obj.status === true) ? obj.status = "Aktif" : obj.status = "Tidak Aktif" }));
        setListAgen(listAgen.data.response_data)
      }
    } catch (error) {
      console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }
  
  function detailAgenHandler(agenId) {
    history.push(`/detailagen/${agenId}`)
  }

  const columns = [
    {
      name: 'No',
      selector: row => row.id,
      ignoreRowClick: true,
      button: true,
    },
    {
      name: 'ID Agen',
      selector: row => row.agen_id,
      sortable: true,
      cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailAgenHandler(row.agen_id)}>{row.agen_id}</Link>
    },
    {
      name: 'Nama Agen',
      selector: row => row.agen_name,
      sortable: true,
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
      selector: row => row.agen_bank_number,
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

  useEffect(() => {
    if (!access_token) {
    history.push('/login');
  }
    getDataAgen()
  }, [])

  // const [filterText, setFilterText] = useState('');
	// const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  // const filteredItems = listAgen.filter(
	// 	item => item.agen_name && item.agen_name.toLowerCase().includes(filterText.toLowerCase()),
	// );

  // const subHeaderComponentMemo = React.useMemo(() => {
	// 	const handleClear = () => {
	// 		if (filterText) {
	// 			setResetPaginationToggle(!resetPaginationToggle);
	// 			setFilterText('');
	// 		}
	// 	};

	// 	return (
	// 		<FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
	// 	);
	// }, [filterText, resetPaginationToggle]);

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
        <div className='search-bar mb-5' style={{ display: 'none' }}>
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
                style={{ width: 200, marginTop: '-7px' }}
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
              // onRowClicked={(listAgen) => {
              //   detailAgenHandler(listAgen.agen_id)
              // }}
            />
          </div>
        }
      </div>
    </div>
  )
}

export default DaftarAgen