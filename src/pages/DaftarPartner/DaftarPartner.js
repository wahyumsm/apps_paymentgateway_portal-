import React, { useEffect, useState } from 'react'
import '../../components/css/global.css'
import DataTable from 'react-data-table-component';
import {Link, useHistory} from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { BaseURL, errorCatch, getRole, getToken, RouteTo, setUserSession, CustomLoader } from '../../function/helpers';
import axios from 'axios';
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import FilterComponent from '../../components/FilterComponent';
import { useMemo } from 'react';

function DaftarPartner() {

    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
    const [listPartner, setListPartner] = useState([])
    const [pending, setPending] = useState(true)
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredItems = listPartner.filter(
        item => item.nama_perusahaan && item.nama_perusahaan.toLowerCase().includes(filterText.toLowerCase()),
    );

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };
        return (
            <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} title="Cari Daftar Partner :" placeholder="Masukkan Nama Partner" />
        );	}, [filterText, resetPaginationToggle]
    );

    function tambahPartner() {
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
            // console.log(listDataPartner, "listttt");
            if (listDataPartner.data.response_code === 200 && listDataPartner.status === 200 && listDataPartner.data.response_new_token.length === 0) {
                listDataPartner.data.response_data = listDataPartner.data.response_data.map((obj, id) => ({ ...obj, id: id + 1, status: (obj.status === true) ? obj.status = "Aktif" : obj.status = "Tidak Aktif" }));
                setListPartner(listDataPartner.data.response_data)
                setPending(false)
            } else if (listDataPartner.data.response_code === 200 && listDataPartner.status === 200 && listDataPartner.data.response_new_token.length !== 0) {
                setUserSession(listDataPartner.data.response_new_token)
                listDataPartner.data.response_data = listDataPartner.data.response_data.map((obj, id) => ({ ...obj, id: id + 1, status: (obj.status === true) ? obj.status = "Aktif" : obj.status = "Tidak Aktif" }));
                setListPartner(listDataPartner.data.response_data)
                setPending(false)
            }

        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(()=>{
        if (!access_token) {
            history.push("/login")
        }
        if (user_role === "102") {
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
            cell: (row) => <Link style={{textDecoration: "underline", color: "#077E86"}} onClick={() => detailPartnerHandler(row.partner_id)}>{row.partner_id}</Link>,
            width: "130px"
        },
        {
            name: 'Nama Perusahaan',
            selector: row => row.nama_perusahaan,
            wrap: true,
            sortable: true,
            width: "230px"
        },
        {
            name: 'Email Perusahaan',
            selector: row => row.email_perusahaan ? row.email_perusahaan : <><div>-</div></>,
            wrap: true,
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
            width: "180px",
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
        <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Daftar Partner</span>
        <div className="head-title">
            <h2 className="h4 mt-4 mb-5" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Daftar Partner</h2>
        </div>
        <div style={{ display: "flex", justifyContent: "end", marginTop: -88, paddingBottom: 24 }}>
            <button onClick={() => tambahPartner()} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 201, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Tambah Partner
            </button>
        </div>
        <div className='base-content'>
            <div className="div-table">
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    customStyles={customStyles}
                    pagination
                    highlightOnHover
                    progressPending={pending}
                    paginationResetDefaultPage={resetPaginationToggle}
                    progressComponent={<CustomLoader />}
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                    persistTableHead
                />
            </div>
        </div>
    </div>
    )
}

export default DaftarPartner