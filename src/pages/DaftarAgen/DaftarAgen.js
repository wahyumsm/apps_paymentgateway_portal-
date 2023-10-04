import React, { useEffect, useState } from 'react'
import '../../components/css/global.css'
import DataTable from 'react-data-table-component';
import { Col, Row, Button, Form, Image} from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory, Link } from 'react-router-dom';
import { BaseURL, errorCatch, getRole, getToken, RouteTo, setUserSession } from '../../function/helpers';
import axios from 'axios';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { useMemo } from 'react';
import FilterComponent from '../../components/FilterComponent';
import { eng, ind } from '../../components/Language';

function DaftarAgen() {

  const language = JSON.parse(sessionStorage.getItem('lang'))
  const history = useHistory()
  const access_token = getToken()
  const user_role = getRole()
  const [listAgen, setListAgen] = useState([])
  const [pending, setPending] = useState(true)
  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const filteredItems = listAgen.filter(
    item => item.agen_name && item.agen_name.toLowerCase().includes(filterText.toLowerCase()),
  );
  
  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
        if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
        }
    };
    return (
        <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} title={language === null ? eng.cariNamaAgen : language.cariNamaAgen} placeholder={language === null ? eng.placeholderCariNamaAgen : language.placeholderCariNamaAgen} />
    );	}, [filterText, resetPaginationToggle]
  );

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
      if (listAgen.status === 200 && listAgen.data.response_code === 200 && listAgen.data.response_new_token.length === 0) {
        listAgen.data.response_data = listAgen.data.response_data.map((obj, id) => ({ ...obj, id: id + 1, status: (obj.status === true) ? "Aktif" : "Tidak Aktif" }));
        setListAgen(listAgen.data.response_data)
        setPending(false)
      } else if (listAgen.status === 200 && listAgen.data.response_code === 200 && listAgen.data.response_new_token.length !== 0) {
        setUserSession(listAgen.data.response_new_token)
        listAgen.data.response_data = listAgen.data.response_data.map((obj, id) => ({ ...obj, id: id + 1, status: (obj.status === true) ? "Aktif" : "Tidak Aktif" }));
        setListAgen(listAgen.data.response_data)
        setPending(false)
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  // console.log(listAgen, "listagen");
  
  function detailAgenHandler(agenId) {
    history.push(`/detailagen/${agenId}`)
  }

  const columns = [
    {
      name: language === null ? eng.no : language.no,
      selector: row => row.id,
      ignoreRowClick: true,
      button: true,
      width: '67px'
    },
    {
      name: language === null ? eng.idAgen : language.idAgen,
      selector: row => row.agen_id,
      sortable: true,
      cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailAgenHandler(row.agen_id)}>{row.agen_id}</Link>,
      width: '150px'
    },
    {
      name: language === null ? eng.namaAgen : language.namaAgen,
      selector: row => row.agen_name,
      wrap: true,
      sortable: true,
      width: '140px'
    },
    {
      name: language === null ? eng.email : language.email,
      selector: row => row.agen_email,
      wrap: true,
      width: '150px'
    },
    {
      name: language === null ? eng.noTelp : language.noTelp,
      selector: row => row.agen_mobile,
      wrap: true,
      width: '130px'
    },
    {
      name: language === null ? eng.noRek : language.noRek,
      selector: row => row.agen_bank_number,
      width: '150px'
    },
    
    {
      name: language === null ? eng.noRekSubAkun : language.noRekSubAkun,
      selector: row => row.subaccount_acc_number === null ? "-" : row.subaccount_acc_number,
      wrap: true,
      width: '220px'
    },
    {
      name: language === null ? eng.default : language.default,
      selector: row => row.is_default === true ? "Default Partner" : "-",
      width: '130px'
    },
    {
      name: language === null ? eng.kodeUnik : language.kodeUnik,
      selector: row => row.agen_unique_code,
    },
    {
      name: language === null ? eng.status : language.status,
      selector: row => row.status === "Aktif" ? (language === null ? eng.aktif : language.aktif) : (language === null ? eng.tidakAktif : language.tidakAktif),
      sortable: true,
      width: "130px",
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

  function toDashboard() {
    history.push("/");
  }

  function toLaporan() {
    history.push("/riwayat-transaksi/va-dan-paylink");
  }

  useEffect(() => {
    if (!access_token) {
    history.push('/login');
  }
    getDataAgen()
  }, [pending])

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

  const CustomLoader = () => (
    <div style={{ padding: '24px' }}>
      <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
      <div>Loading...</div>
    </div>
  );  

  return (
    <div className='main-content mt-5' style={{ padding: "37px 27px" }}>
      <span className='breadcrumbs-span'>{user_role === "102" ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> {language === null ? eng.laporan : language.laporan}</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda </span>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;{language === null ? eng.daftarAgen : language.daftarAgen}</span>
      <div className="head-title">
        <h2 className="h4 mt-4 mb-5" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>{language === null ? eng.daftarAgen : language.daftarAgen}</h2>
      </div>
      <div style={{ display: "flex", justifyContent: "end", marginTop: -88, paddingBottom: 24 }}>
        <button onClick={() => tambahAgen()} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: language === null || language.flagName === "EN" ? 200 : 183, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> {language === null ? eng.tambahAgen : language.tambahAgen}
        </button>
      </div>
      <div className='base-content'>   
        {/* <div className='search-bar mb-5' >
          <Row>
            <Col xs={2} style={{  paddingRight: "unset" }}>
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
        </div> */}
        {/* {
          listAgen.length === 0 ?
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: 20, alignItems: "center" }}>There are no records to display</div> :
          <div className="div-table"> */}
            <DataTable
              columns={columns}
              data={filteredItems}
              customStyles={customStyles}
              pagination
              highlightOnHover
              paginationResetDefaultPage={resetPaginationToggle}
              progressPending={pending}
              progressComponent={<CustomLoader />}
              noDataComponent={language === null ? eng.tidakAdaData : language.tidakAdaData}
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
              persistTableHead
            />
          {/* </div>
        } */}
      </div>
    </div>
  )
}

export default DaftarAgen