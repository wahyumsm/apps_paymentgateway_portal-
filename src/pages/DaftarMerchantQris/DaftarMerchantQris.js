import React, { useMemo, useState } from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import $ from 'jquery'
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Image } from '@themesberg/react-bootstrap';
import { agenLists } from '../../data/tables';
import FilterComponent from '../../components/FilterComponent';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"

const DaftarMerchantQris = () => {
    function disbursementTabs(isTabs){
        if(isTabs === "merchantGrup"){
            $('#merchantGrup').addClass('menu-detail-akun-hr-active')
            $('#merchantGrupspan').addClass('menu-detail-akun-span-active')
            $('#merchantBrand').removeClass('menu-detail-akun-hr-active')
            $('#merchantBrandspan').removeClass('menu-detail-akun-span-active')
            $('#merchantOutlet').removeClass('menu-detail-akun-hr-active')
            $('#merchantOutletspan').removeClass('menu-detail-akun-span-active')
        } else if (isTabs === "merchantBrand") {
            $('#merchantGrup').removeClass('menu-detail-akun-hr-active')
            $('#merchantGrupspan').removeClass('menu-detail-akun-span-active')
            $('#merchantBrand').addClass('menu-detail-akun-hr-active')
            $('#merchantBrandspan').addClass('menu-detail-akun-span-active')
            $('#merchantOutlet').removeClass('menu-detail-akun-hr-active')
            $('#merchantOutletspan').removeClass('menu-detail-akun-span-active')
        } else {
            $('#merchantGrup').removeClass('menu-detail-akun-hr-active')
            $('#merchantGrupspan').removeClass('menu-detail-akun-span-active')
            $('#merchantBrand').removeClass('menu-detail-akun-hr-active')
            $('#merchantBrandspan').removeClass('menu-detail-akun-span-active')
            $('#merchantOutlet').addClass('menu-detail-akun-hr-active')
            $('#merchantOutletspan').addClass('menu-detail-akun-span-active')
        }
    }

    const [pending, setPending] = useState(true)
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredItems = agenLists.filter(
        item => item.namaAgen && item.namaAgen.toLowerCase().includes(filterText.toLowerCase()),
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

    const columns = [
        {
            name: 'No',
            selector: row => row.id,
            width: '67px'
        },
        {
            name: 'ID Partner',
            selector: row => row.IDAgen,
            width: "130px"
        },
        {
            name: 'Nama Perusahaan',
            selector: row => row.namaAgen,
            wrap: true,
            sortable: true,
            width: "230px"
        },
        {
            name: 'Email Perusahaan',
            selector: row => row.email,
            wrap: true,
            sortable: true
        },
        {
            name: 'No. Telepon',
            selector: row => row.noHp,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => row.status,
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

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
          <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          <div>Loading...</div>
        </div>
    );

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar Merchant</span></span>
            <div className="head-title"> 
                <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Daftar Merchant</h2>
            </div>
            <div className='detail-akun-menu mt-4' style={{display: 'flex', height: 33}}>
                <div className='detail-akun-tabs menu-detail-akun-hr-active' id="merchantGrup" onClick={() => disbursementTabs("merchantGrup")}>
                    <span className='menu-detail-akun-span menu-detail-akun-span-active' id="merchantGrupspan">Merchant grup</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} id="merchantBrand" onClick={() => disbursementTabs("merchantBrand")}>
                    <span className='menu-detail-akun-span' id="merchantBrandspan">Merchant brand</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} id="merchantOutlet" onClick={() => disbursementTabs("merchantOutlet")}>
                    <span className='menu-detail-akun-span' id="merchantOutletspan">Merchant outlet</span>
                </div>
            </div>
            <hr className='hr-style' style={{marginTop: -2}}/>
            <div className='base-content positiion-relative'>
                <div style={{ display: "flex", justifyContent: "end" }}>
                    <button style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 201, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Tambah Partner
                    </button>
                </div>
                <div className="div-table" style={{ marginBottom: 500 }}>
                    <DataTable
                        columns={columns}
                        data={filteredItems}
                        customStyles={customStyles}
                        pagination
                        highlightOnHover
                        // progressPending={pending}
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

export default DaftarMerchantQris