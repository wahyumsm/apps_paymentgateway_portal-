import React, { useEffect, useMemo, useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import fotoIcon from "../../../assets/icon/foto_icon.svg";
import { useHistory } from 'react-router-dom';
import $ from 'jquery'
import uploadIcon from "../../../assets/icon/upload_icon.svg"
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { FilterComponentQrisTerminalDanKasir } from '../../../components/FilterComponentQris';
import { Image } from '@themesberg/react-bootstrap';
import Pagination from 'react-js-pagination';
import loadingEzeelink from "../../../assets/img/technologies/Double Ring-1s-303px.svg"

const PengaturanKasir = () => {
    const history = useHistory()
    const [isPengaturanKasir, setIsPengaturanKasir] = useState("daftarKasir")
    function pengaturanKasirTabs(isTabs){
        if(isTabs === "daftarKasir"){
            setIsPengaturanKasir(isTabs)
            setFilterTextListTerminal("")
            getAllDataDetailTerminal("", activePageDataListTerminal)
            getAllDataDetailKasir("", activePageDataListKasir)
            $('#daftarKasir').addClass('menu-detail-akun-hr-active')
            $('#daftarKasirspan').addClass('menu-detail-akun-span-active')
            $('#daftarTerminal').removeClass('menu-detail-akun-hr-active')
            $('#daftarTerminalspan').removeClass('menu-detail-akun-span-active')
        } else {
            setIsPengaturanKasir(isTabs)
            setFilterTextListKasir("")
            getAllDataDetailTerminal("", activePageDataListTerminal)
            getAllDataDetailKasir("", activePageDataListKasir)
            $('#daftarKasir').removeClass('menu-detail-akun-hr-active')
            $('#daftarKasirspan').removeClass('menu-detail-akun-span-active')
            $('#daftarTerminal').addClass('menu-detail-akun-hr-active')
            $('#daftarTerminalspan').addClass('menu-detail-akun-span-active')
        }
    }
    
    const removeUserSession = () => {
        sessionStorage.removeItem("storeId")
    };

    const columnTerminal = [
        {
            name: 'No',
            selector: row => row.rowNumber,
            width: '67px'
        },
        {
            name: 'Nama Grup',
            selector: row => row.mmerchant_name,
        },
        {
            name: 'Nama Brand',
            selector: row => row.moutlet_name,
        },
        {
            name: 'Nama Outlet', 
            selector: row => row.mstore_name,
        },
        {
            name: 'Jumlah Terminal', 
            selector: row => row.total_user,
        },
        {
            name: 'Terminal Aktif',
            selector: row => row.active_user,
        },
        {
            name: 'Terminal Nonaktif', 
            selector: row => row.inactive_user,
            width: "200px"
        },
        {
            name: 'Aksi',
            selector: row => row.tvasettl_amount,
            cell: (row) => (
                <div className="d-flex justify-content-center align-items-center">
                    <div style={{ cursor: "pointer", color: "#077E86", fontWeight: 700, fontSize: 14, fontFamily: "Exo"  }} onClick={() => toTambahTerminal(row.mstore_id)}>Lihat</div>
                </div>
            ),
        },
    ];
    
    const [dataListTerminal, setDataListTerminal] = useState([])
    const [pageNumberDataListTerminal, setPageNumberDataListTerminal] = useState({})
    const [totalPageDataListTerminal, setTotalPageDataListTerminal] = useState(0)
    const [activePageDataListTerminal, setActivePageDataListTerminal] = useState(1)
    const [pendingDataListTerminal, setPendingDataListTerminal] = useState(false)
    const [filterTextListTerminal, setFilterTextListTerminal] = React.useState('');
    const [resetPaginationToggleListTerminal, setResetPaginationToggleListTerminal] = React.useState(false);
    const filteredItemsListTerminal = dataListTerminal.filter(
        item => (item.mstore_name && item.mstore_name.toLowerCase().includes(filterTextListTerminal.toLowerCase())) || (item.moutlet_name && item.moutlet_name.toLowerCase().includes(filterTextListTerminal.toLowerCase())) || (item.mmerchant_name && item.mmerchant_name.toLowerCase().includes(filterTextListTerminal.toLowerCase())),
    );
    const subHeaderComponentMemoListTerminal = useMemo(() => {
        const handleClear = () => {
            if (filterTextListTerminal) {
                setResetPaginationToggleListTerminal(!resetPaginationToggleListTerminal);
                setFilterTextListTerminal('');
            }
        };

        function handleChangeFilterQris (e) {
            setFilterTextListTerminal(e.target.value)
            getAllDataDetailTerminal(e.target.value ,activePageDataListTerminal)
        }
        return (
            <FilterComponentQrisTerminalDanKasir onFilter={e => handleChangeFilterQris(e)} onClear={handleClear} filterText={filterTextListTerminal} title="Pencarian :" placeholder="Cari Grup, brand, outlet" onClickAddMerchant={() => history.push(`/tambah-manual-terminal`)} addMerchant="Tambah manual" />
        );	}, [filterTextListTerminal, resetPaginationToggleListTerminal]
    );

    function handlePageChangeListTerminal(page) {
        setActivePageDataListTerminal(page)
        getAllDataDetailTerminal(filterTextListTerminal, page)
    }

    function toTambahTerminal (storeId) {
        history.push('/tambah-manual-data-terminal');
        sessionStorage.setItem("storeId", storeId)
    }

    async function getAllDataDetailTerminal(filterName, currentPage) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"filter_name" : "${filterName.length !== 0 ? filterName : ""}", "page": ${currentPage}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataTerminal = await axios.post(BaseURL + "/QRIS/GetListTerminalCashierPaging", { data: dataParams }, { headers: headers })
            // console.log(dataTerminal, 'ini user detal funct');
            if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token.length === 0) {
                setDataListTerminal(dataTerminal.data.response_data.results)
                setPageNumberDataListTerminal(dataTerminal.data.response_data)
                setTotalPageDataListTerminal(dataTerminal.data.response_data.max_page)
                setPendingDataListTerminal(false)
            } else if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token.length !== 0) {
                setUserSession(dataTerminal.data.response_new_token)
                setDataListTerminal(dataTerminal.data.response_data.results)
                setPageNumberDataListTerminal(dataTerminal.data.response_data)
                setTotalPageDataListTerminal(dataTerminal.data.response_data.max_page)
                setPendingDataListTerminal(false)
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    const columnKasir = [
        {
            name: 'No',
            selector: row => row.rowNumber,
            width: '67px'
        },
        {
            name: 'Nama Grup',
            selector: row => row.mmerchant_name,
            wrap: true
        },
        {
            name: 'Nama Brand',
            selector: row => row.moutlet_name,
            wrap: true
        },
        {
            name: 'Nama Outlet', 
            selector: row => row.mstore_name,
            wrap: true
        },
        {
            name: 'Jumlah Kasir', 
            selector: row => row.total_user,
        },
        {
            name: 'Kasir Aktif',
            selector: row => row.active_user,
        },
        {
            name: 'Kasir Nonaktif', 
            selector: row => row.inactive_user,
            width: "170px"
        },
        {
            name: 'Aksi',
            selector: row => row.tvasettl_amount,
            cell: (row) => (
                <div className="d-flex justify-content-center align-items-center">
                    <div style={{ cursor: "pointer", color: "#077E86", fontWeight: 700, fontSize: 14, fontFamily: "Exo"  }} onClick={() => toTambahKasir(row.mstore_id)}>Lihat</div>
                </div>
            ),
        },
    ];

    const [isDataKasir, setIsDataKasir] = useState("")
    const [dataListKasir, setDataListKasir] = useState([])
    const [pageNumberDataListKasir, setPageNumberDataListKasir] = useState({})
    const [totalPageDataListKasir, setTotalPageDataListKasir] = useState(0)
    const [activePageDataListKasir, setActivePageDataListKasir] = useState(1)
    const [pendingDataListKasir, setPendingDataListKasir] = useState(false)
    const [filterTextListKasir, setFilterTextListKasir] = React.useState('');
    const [resetPaginationToggleListKasir, setResetPaginationToggleListKasir] = React.useState(false);
    const filteredItemsListKasir = dataListKasir.filter(
        item => (item.mstore_name && item.mstore_name.toLowerCase().includes(filterTextListKasir.toLowerCase())) || (item.moutlet_name && item.moutlet_name.toLowerCase().includes(filterTextListKasir.toLowerCase())) || (item.mmerchant_name && item.mmerchant_name.toLowerCase().includes(filterTextListKasir.toLowerCase())),
    );
    const subHeaderComponentMemoListKasir = useMemo(() => {
        const handleClear = () => {
            if (filterTextListKasir) {
                setResetPaginationToggleListKasir(!resetPaginationToggleListKasir);
                setFilterTextListKasir('');
            }
        };

        function handleChangeFilterQris (e) {
            setFilterTextListKasir(e.target.value)
            getAllDataDetailKasir(e.target.value, activePageDataListKasir)
        }
        return (
            <FilterComponentQrisTerminalDanKasir onFilter={e => handleChangeFilterQris(e)} onClear={handleClear} filterText={filterTextListKasir} title="Pencarian :" placeholder="Cari admin kasir" onClickAddMerchant={() => history.push(`/tambah-manual-kasir`)} addMerchant="Tambah kasir" />
        );	}, [filterTextListKasir, resetPaginationToggleListKasir]
    );

    function handlePageChangeListKasir(page) {
        setActivePageDataListKasir(page)
        getAllDataDetailKasir(filterTextListKasir, page)
    }

    function toTambahKasir (storeId) {
        history.push('/tambah-manual-data-kasir');
        sessionStorage.setItem("storeId", storeId)
    }

    async function getAllDataDetailKasir(filterName, currentPage) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"filter_name" : "${filterName.length !== 0 ? filterName : ""}", "page": ${currentPage}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataKasir = await axios.post(BaseURL + "/QRIS/GetListStoreCashierPaging", { data: dataParams }, { headers: headers })
            // console.log(dataKasir, 'ini user detal funct');
            if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token.length === 0) {
                setDataListKasir(dataKasir.data.response_data.results)
                setPageNumberDataListKasir(dataKasir.data.response_data)
                setTotalPageDataListKasir(dataKasir.data.response_data.max_page)
                setIsDataKasir(dataKasir.data.response_data.error_text)
                setPendingDataListKasir(false)
            } else if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token.length !== 0) {
                setUserSession(dataKasir.data.response_new_token)
                setDataListKasir(dataKasir.data.response_data.results)
                setPageNumberDataListKasir(dataKasir.data.response_data)
                setTotalPageDataListKasir(dataKasir.data.response_data.max_page)
                setIsDataKasir(dataKasir.data.response_data.error_text)
                setPendingDataListKasir(false)
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                
            },
        },
    };

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
          <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          <div>Loading...</div>
        </div>
    );

    useEffect(() => {
        removeUserSession()
        getAllDataDetailTerminal(filterTextListTerminal, 1)
        getAllDataDetailKasir(filterTextListKasir, 1)
    }, [])
    

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }} onClick={() => history.push("/")}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Pengaturan Kasir</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar {isPengaturanKasir === "daftarKasir" ? "Kasir" : "Terminal"}</span></span>
            <div className="head-title"> 
                <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Pengaturan Kasir</h2>
            </div>
            <div className='detail-akun-menu mt-4' style={{display: 'flex', height: 33}}>
                <div className='detail-akun-tabs menu-detail-akun-hr-active' id="daftarKasir" onClick={() => pengaturanKasirTabs("daftarKasir")}>
                    <span className='menu-detail-akun-span menu-detail-akun-span-active' id="daftarKasirspan">Daftar Kasir</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} id="daftarTerminal" onClick={() => pengaturanKasirTabs("daftarTerminal")}>
                    <span className='menu-detail-akun-span' id="daftarTerminalspan">Daftar Terminal</span>
                </div>
            </div>
            <hr className='hr-style' style={{marginTop: -2}}/>
            {
                isPengaturanKasir === "daftarKasir" ? 
                    isDataKasir === "Success" ? (
                        <div className='base-content mt-3'>
                            <div className="head-title"> 
                                <h2 className="h5" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Daftar kasir yang ditambahkan</h2>
                            </div>  
                            <div className="div-table">
                                <DataTable
                                    columns={columnKasir}
                                    data={filteredItemsListKasir}
                                    customStyles={customStyles}
                                    highlightOnHover
                                    progressPending={pendingDataListKasir}
                                    progressComponent={<CustomLoader />}
                                    subHeader
                                    subHeaderComponent={subHeaderComponentMemoListKasir}
                                    persistTableHead
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageDataListKasir}</div>
                                <Pagination
                                    activePage={activePageDataListKasir}
                                    itemsCountPerPage={pageNumberDataListKasir.row_per_page}
                                    totalItemsCount={(pageNumberDataListKasir.row_per_page*pageNumberDataListKasir.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeListKasir}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className='d-flex justify-content-center align-items-center flex-column mt-5'>
                            <img src={fotoIcon} alt="fotoIcon" />
                            <div className='mt-3' style={{ fontFamily: "Exo", color: "#393939", fontSize: 18, fontWeight: 700 }}>Belum Ada Data Kasir</div>
                            <div className='mt-3' style={{ fontFamily: "Nunito", color: "#848484", fontSize: 14 }}>Semua data kasir yang ditambahkan akan tampil disini</div>
                            <button 
                                className='btn-next-active mt-3'
                                style={{ width: 450, height: 44 }}
                                onClick={() => history.push('/tambah-manual-kasir')}
                            >
                                Tambah Manual
                            </button>
                            <button className="mt-4" style={{ color: "#077E86", fontFamily: "Exo", fontSize: 14, fontWeight: 700, alignItems: "center",  gap: 8, width: 450, height: 44, border: "1px solid var(--contoh-secondary-40-warna-utama, #077E86)", borderRadius: 4 }}>
                                <img
                                    src={uploadIcon}
                                    onClick={() => history.push('/tambah-manual-kasir')}
                                    style={{ cursor: "pointer" }}
                                    alt="icon edit"
                                /> Upload dokumen
                            </button>
                        </div>
                    )
                : (
                    dataListTerminal.length !== 0 ? (
                        <div className='base-content mt-3'>
                            <div className="head-title"> 
                                <h2 className="h5" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Daftar terminal yang ditambahkan</h2>
                            </div>  
                            <div className="div-table">
                                <DataTable
                                    columns={columnTerminal}
                                    data={filteredItemsListTerminal}
                                    customStyles={customStyles}
                                    highlightOnHover
                                    progressPending={pendingDataListTerminal}
                                    progressComponent={<CustomLoader />}
                                    subHeader
                                    subHeaderComponent={subHeaderComponentMemoListTerminal}
                                    persistTableHead
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageDataListTerminal}</div>
                                <Pagination
                                    activePage={activePageDataListTerminal}
                                    itemsCountPerPage={pageNumberDataListTerminal.row_per_page}
                                    totalItemsCount={(pageNumberDataListTerminal.row_per_page*pageNumberDataListTerminal.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeListTerminal}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className='d-flex justify-content-center align-items-center flex-column mt-5'>
                            <img src={fotoIcon} alt="fotoIcon" />
                            <div className='mt-3' style={{ fontFamily: "Exo", color: "#393939", fontSize: 18, fontWeight: 700 }}>Belum Ada Data Terminal</div>
                            <div className='mt-3' style={{ fontFamily: "Nunito", color: "#848484", fontSize: 14 }}>Semua data terminal yang ditambahkan akan tampil disini</div>
                            <button 
                                className='btn-next-active mt-3'
                                style={{ width: 450, height: 44 }}
                                onClick={() => history.push('/tambah-manual-terminal')}
                            >
                                Tambah Manual
                            </button>
                            <button className="mt-4" style={{ color: "#077E86", fontFamily: "Exo", fontSize: 14, fontWeight: 700, alignItems: "center",  gap: 8, width: 450, height: 44, border: "1px solid var(--contoh-secondary-40-warna-utama, #077E86)", borderRadius: 4 }}>
                                <img
                                    src={uploadIcon}
                                    // onClick={() => editInTableHandler(row.number)}
                                    style={{ cursor: "pointer" }}
                                    alt="icon edit"
                                /> Upload dokumen
                            </button>
                        </div>
                    )
                )
            }
        </div>
    )
}

export default PengaturanKasir