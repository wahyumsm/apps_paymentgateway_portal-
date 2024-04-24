import React, { useEffect, useMemo, useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import HideEye from "../../../assets/img/HideEye.png";
import ShowEye from "../../../assets/img/ShowEye.png";
import { Col, Form, OverlayTrigger, Row, Tooltip } from '@themesberg/react-bootstrap';
import { BaseURL, CustomLoader, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ReactSelect, { components } from 'react-select';
import OtpInput from 'react-otp-input';
import $ from 'jquery'
import DataTable from 'react-data-table-component';
import { FilterComponentQrisTerminal } from '../../../components/FilterComponentQris';
import Pagination from 'react-js-pagination';
import edit from "../../../assets/icon/edit_icon.svg";

function TambahDataTerminalManual () {
    const history = useHistory()
    const storeId = sessionStorage.getItem('storeId');
    const [dataDetailTerminal, setDataDetailTerminal] = useState({})
    const [dataTerminalByStoreId, setDataTerminalByStoreId] = useState([])
    const [selectedDataTerminalByStore, setSelectedDataTerminalByStore] = useState([])
    const [pinTerminalKasir, setPinTerminalKasir] = useState("")
    const [isSecurePin, setIsSecurePin] = useState(true)
    const [inputStatusTerminal, setInputStatusTerminal] = useState(false)
    const [inputStatusTerminalInListPaging, setInputStatusTerminalInListPaging] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [tabTerminal, setTabTerminal] = useState(true)
    const [dataListTerminalAktif, setDataListTerminalAktif] = useState([])
    const [pageNumberListTerminalAktif, setPageNumberListTerminalAktif] = useState({})
    const [totalPageListTerminalAktif, setTotalPageListTerminalAktif] = useState(0)
    const [activePageListTerminalAktif, setActivePageListTerminalAktif] = useState(1)

    const [filterTextTerminalAktif, setFilterTextTerminalAktif] = React.useState('');
    const [resetPaginationToggleTerminalAktif, setResetPaginationToggleTerminalAktif] = React.useState(false);
    const filteredItemsTerminalAktif = dataListTerminalAktif.filter(
        item => item.mterminalqris_terminal_name && item.mterminalqris_terminal_name.toLowerCase().includes(filterTextTerminalAktif.toLowerCase()),
    );
    const subHeaderComponentMemoTerminalAktif = useMemo(() => {
        const handleClear = () => {
            if (filterTextTerminalAktif) {
                setResetPaginationToggleTerminalAktif(!resetPaginationToggleTerminalAktif);
                setFilterTextTerminalAktif('');
            }
        };
        function handleChangeFilterQris (e) {
            setFilterTextTerminalAktif(e.target.value)
            getListTerminalHandler(storeId, 1, activePageListTerminalAktif)
        }
        return (
            <FilterComponentQrisTerminal onFilter={e => handleChangeFilterQris(e)} onClear={handleClear} filterText={filterTextTerminalAktif} title="Pencarian :" placeholder="Cari terminal" />
        );	}, [filterTextTerminalAktif, resetPaginationToggleTerminalAktif]
    );

    function showPasswordHandler () {
        setShowPassword(!showPassword)
    }

    function handleChangeStatus (e) {
        setInputStatusTerminal(!inputStatusTerminal);
    }

    function handleChangeStatusInListPaging (e, num, isTerminalActive) {
        console.log(e.target.checked, "e");
        setInputStatusTerminalInListPaging({
            ...inputStatusTerminalInListPaging,
            [`status${num}`] : e.target.checked
        })
        // hit api QRIS/updateTerminalActiveStatus
        getListTerminalHandler(storeId, isTerminalActive, 1)
        // setInputStatusTerminalInListPaging(inputStatusTerminalInListPaging === undefined ? !dataListTerminalAktif.mterminalqris_is_active : !inputStatusTerminalInListPaging);
    }

    console.log(inputStatusTerminalInListPaging, "inputStatusTerminalInListPaging");
    console.log(dataListTerminalAktif.mterminalqris_is_active, "dataListTerminalAktif.mterminalqris_is_active");

    function handleChangeOtp (value) {
        setPinTerminalKasir(value)
    }

    function terminalTabs(isTabs){
        setTabTerminal(isTabs)
        if(!isTabs) {
            $('#terminalAktiftab').removeClass('menu-detail-akun-hr-active')
            $('#terminalAktifspan').removeClass('menu-detail-akun-span-active')
            $('#terminalNonaktiftab').addClass('menu-detail-akun-hr-active')
            $('#terminalNonaktifspan').addClass('menu-detail-akun-span-active')
        } else {
            $('#terminalNonaktiftab').removeClass('menu-detail-akun-hr-active')
            $('#terminalNonaktifspan').removeClass('menu-detail-akun-span-active')
            $('#terminalAktiftab').addClass('menu-detail-akun-hr-active')
            $('#terminalAktifspan').addClass('menu-detail-akun-span-active')
        }
    }

    const columnsTerminalAktif = [
        {
            name: 'No',
            selector: row => row.rowNumber,
            width: "67px"
        },
        {
            name: 'Terminal Kasir',
            selector: row => row.mterminalqris_terminal_name,
        },
        {
            name: <>Password <span className='ms-3' style={{ cursor: "pointer" }} onClick={() => showPasswordHandler()}><img src={showPassword === false ? HideEye : ShowEye} alt="off"  /></span></>,
            selector: row => <div>{showPassword === false ? "......" : row.PIN}</div>,
        },
        {
            name: 'Terakhir Aktif',
            selector: row => row.terminal_last_active,
        },
        {
            name: 'Status',
            cell: row => <Form.Check type='switch' id='custom-switch' checked={inputStatusTerminalInListPaging?.[`status${row.rowNumber}`] !== undefined ? inputStatusTerminalInListPaging?.[`status${row.rowNumber}`] : row.mterminalqris_is_active} onChange={(e) => handleChangeStatusInListPaging(e, row.rowNumber, 1)} name='activeStatusAktif' />,
        },
        {
            name: 'Aksi',
            selector: row => row.tvasettl_amount,
            cell: (row) => (
                <div className="d-flex justify-content-center align-items-center">
                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Edit</div></Tooltip>}>
                        <img
                            src={edit}
                            // onClick={() => editInSubAcc(row.number)}
                            style={{ cursor: "pointer" }}
                            alt="icon edit"
                        />
                    </OverlayTrigger>
                    <div className='ms-3'>Lihat</div>
                </div>
            ),
        },
    ]

    const [dataListTerminalNonAktif, setDataListTerminalNonAktif] = useState([])
    const [pageNumberListTerminalNonAktif, setPageNumberListTerminalNonAktif] = useState({})
    const [totalPageListTerminalNonAktif, setTotalPageListTerminalNonAktif] = useState(0)
    const [activePageListTerminalNonAktif, setActivePageListTerminalNonAktif] = useState(1)

    const [filterTextTerminalNonAktif, setFilterTextTerminalNonAktif] = React.useState('');
    const [resetPaginationToggleTerminalNonAktif, setResetPaginationToggleTerminalNonAktif] = React.useState(false);
    const filteredItemsTerminalNonAktif = dataListTerminalNonAktif.filter(
        item => item.mterminalqris_terminal_name && item.mterminalqris_terminal_name.toLowerCase().includes(filterTextTerminalNonAktif.toLowerCase()),
    );
    const subHeaderComponentMemoTerminalNonAktif = useMemo(() => {
        const handleClear = () => {
            if (filterTextTerminalNonAktif) {
                setResetPaginationToggleTerminalNonAktif(!resetPaginationToggleTerminalNonAktif);
                setFilterTextTerminalNonAktif('');
            }
        };
        function handleChangeFilterQris (e) {
            setFilterTextTerminalNonAktif(e.target.value)
            getListTerminalHandler(storeId, 1, activePageListTerminalNonAktif)
        }
        return (
            <FilterComponentQrisTerminal onFilter={e => handleChangeFilterQris(e)} onClear={handleClear} filterText={filterTextTerminalNonAktif} title="Pencarian :" placeholder="Cari terminal" />
        );	}, [filterTextTerminalNonAktif, resetPaginationToggleTerminalNonAktif]
    );

    const columnsTerminalNonAktif = [
        {
            name: 'No',
            selector: row => row.rowNumber,
            width: "67px"
        },
        {
            name: 'Terminal Kasir',
            selector: row => row.mterminalqris_terminal_name,
        },
        {
            name: <>Password <span className='ms-3' style={{ cursor: "pointer" }} onClick={() => showPasswordHandler()}><img src={showPassword === false ? HideEye : ShowEye} alt="off"  /></span></>,
            selector: row => <div>{showPassword === false ? "......" : row.PIN}</div>,
        },
        {
            name: 'Terakhir Aktif',
            selector: row => row.terminal_last_active,
        },
        {
            name: 'Status',
            cell: row => <Form.Check type='switch' id='custom-switch' name='activeStatusNonAktif' />,
        },
        {
            name: 'Aksi',
            selector: row => row.tvasettl_amount,
            cell: (row) => (
                <div className="d-flex justify-content-center align-items-center">
                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Edit</div></Tooltip>}>
                        <img
                            src={edit}
                            // onClick={() => editInSubAcc(row.number)}
                            style={{ cursor: "pointer" }}
                            alt="icon edit"
                        />
                    </OverlayTrigger>
                    <div className='ms-3'>Lihat</div>
                </div>
            ),
        },
    ]

    async function getDataDetailTerminal(storeId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"store_id": "${storeId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataTerminal = await axios.post(BaseURL + "/QRIS/GetTerminalDetail", { data: dataParams }, { headers: headers })
            // console.log(dataTerminal, 'ini user detal funct');
            if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token.length === 0) {
                setDataDetailTerminal(dataTerminal.data.response_data.results)
            } else if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token.length !== 0) {
                setUserSession(dataTerminal.data.response_new_token)
                setDataDetailTerminal(dataTerminal.data.response_data.results)
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getDataTerminalHandler(storeId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"store_id": "${storeId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataTerminal = await axios.post(BaseURL + "/QRIS/GetListTerminalByStoreID", { data: dataParams }, { headers: headers })
            // console.log(dataTerminal, 'ini user detal funct');
            if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token === null) {
                let newArr = []
                dataTerminal.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mstore_id
                    obj.label = e.mterminalqris_terminal_name
                    newArr.push(obj)
                })
                setDataTerminalByStoreId(newArr)
            } else if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token !== null) {
                setUserSession(dataTerminal.data.response_new_token)
                let newArr = []
                dataTerminal.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mstore_id
                    obj.label = e.mterminalqris_terminal_name
                    newArr.push(obj)
                })
                setDataTerminalByStoreId(newArr)
            }
    } catch (error) {
            console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function addAndSaveDataTerminalHandler(terminalId, isActive, pin) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"terminal_id": ${terminalId}, "is_active": ${isActive}, "pin": "${pin}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataTerminal = await axios.post(BaseURL + "/QRIS/AddAndEditTerminalData", { data: dataParams }, { headers: headers })
            // console.log(dataTerminal, 'ini user detal funct');
            if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token === null) {
                alert("suksess")
                setPinTerminalKasir("")
                setInputStatusTerminal(false)
                setSelectedDataTerminalByStore([])
                getListTerminalHandler(storeId, 1, activePageListTerminalAktif)
            } else if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token !== null) {
                setUserSession(dataTerminal.data.response_new_token)
                alert("suksess")
                setPinTerminalKasir("")
                setInputStatusTerminal(false)
                setSelectedDataTerminalByStore([])
                getListTerminalHandler(storeId, 1, activePageListTerminalAktif)
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getListTerminalHandler(storeId, terminalIsActive, currentPage) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"store_id": "${storeId}", "terminal_is_active": ${terminalIsActive}, "date_from": "", "date_to": "", "page": ${currentPage}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataTerminal = await axios.post(BaseURL + "/QRIS/GetListTerminalQrisPaging", { data: dataParams }, { headers: headers })
            // console.log(dataTerminal, 'ini user detal funct');
            if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token.length === 0) {
                setDataListTerminalAktif(dataTerminal.data.response_data.results)
                setPageNumberListTerminalAktif(dataTerminal.data.response_data)
                setTotalPageListTerminalAktif(dataTerminal.data.response_data.max_page)
                setInputStatusTerminalInListPaging(dataTerminal.data.response_data.results.mterminalqris_is_active)
            } else if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token.length !== 0) {
                setUserSession(dataTerminal.data.response_new_token)
                setDataListTerminalAktif(dataTerminal.data.response_data.results)
                setPageNumberListTerminalAktif(dataTerminal.data.response_data)
                setTotalPageListTerminalAktif(dataTerminal.data.response_data.max_page)
                setInputStatusTerminalInListPaging(dataTerminal.data.response_data.results.mterminalqris_is_active)
            }
    } catch (error) {
            console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    const customStylesSelectedOption = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: "none",
            color: "black"
        })
    }

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: '600',
                fontSize: '14px',
                fontFamily: 'Exo'
            },
        },
        cells: {
            style: {
                cursor: 'pointer',
            }
        },
    };

    useEffect(() => {
        getDataDetailTerminal(storeId)
        getDataTerminalHandler(storeId)
        getListTerminalHandler(storeId, 1, activePageListTerminalAktif)
    }, [])
    

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Pengaturan Kasir</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar Terminal</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah Terminal Manual</span></span>
            <div className="head-title"> 
                <h2 className="h5 mt-4" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Tambah Terminal Manual</h2>
            </div>
            <div className='base-content mt-3'>
                <div className="nama-merchant-in-detail">{dataDetailTerminal?.merchant_name}</div>
                <Row className='mt-3'>
                    <Col xs={6} className='sub-title-detail-merchant'>Group</Col>
                    <Col xs={6} className='sub-title-detail-merchant'>Brand</Col>
                </Row>
                <Row className='mt-1'>
                    <Col xs={6} className='isi-content-detail-merchant'>{dataDetailTerminal?.merchant_name}</Col>
                    <Col xs={6} className='isi-content-detail-merchant'>{dataDetailTerminal?.outlet_name === "" ? "-" : dataDetailTerminal?.outlet_name}</Col>
                </Row>
                <Row className='mt-3'>
                    <Col xs={6} className='sub-title-detail-merchant'>Total Kasir Aktif</Col>
                    <Col xs={6} className='sub-title-detail-merchant'>Total Kasir Nonaktif</Col>
                </Row>
                <Row className='mt-1 pb-4'>
                    <Col xs={6} className='isi-content-detail-merchant'>{dataDetailTerminal?.active_user}</Col>
                    <Col xs={6} className='isi-content-detail-merchant'>{dataDetailTerminal?.inactive_user}</Col>
                </Row>
            </div>
            <div className='mt-3' style={{ fontFamily: "Exo", fontSize: 15, fontWeight: 600 }}>Tambah Terminal Kasir</div>
            <div className='sub-title-detail-merchant mt-1'>Terminal yang digunakan untuk transaksi dengan QRIS Ezeelink</div>
            <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Aktifkan Terminal</div>
            <Form.Check 
                type="switch"
                id="custom-switch"
                checked={
                    inputStatusTerminal
                }
                name="active"
                className='mt-2'
                onChange={handleChangeStatus}
            />
            <div className='mt-2'>Terminal Kasir</div>
            <div className="dropdown dropPartnerAddUser mt-2">
                <ReactSelect
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    options={dataTerminalByStoreId}
                    value={selectedDataTerminalByStore}
                    onChange={(selected) => setSelectedDataTerminalByStore([selected])}
                    placeholder="Pilih terminal kasir"
                    components={{ Option }}
                    styles={customStylesSelectedOption}
                />
            </div>
            <div className='mt-2'>PIN Terminal Kasir</div>
            <OtpInput
                isInputSecure={isSecurePin === true ? true : false}
                isInputNum={true}
                className='me-3 mt-2'
                value={pinTerminalKasir}
                onChange={(e) => handleChangeOtp(e)}
                numInputs={6}
                inputStyle={{ 
                    width: "100% ",
                    height: "4rem",
                    fontSize: "20px",
                    borderRadius: "8px",
                    border: "1px solid #EBEBEB",
                    fontFamily: isSecurePin ? "unset" : "Exo", 
                    fontWeight: isSecurePin ? "unset" : 700, 
                    backgroundColor: "#FFFFFF",
                }}
            />
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <div className='custom-style-desc-data-terminal'>PIN digunakan oleh kasir untuk masuk ke dalam terminal kasir</div>
                <div className='lihat-pin-style' onClick={() => setIsSecurePin(!isSecurePin)} style={{ cursor: "pointer" }}>{isSecurePin ? "Lihat PIN" : "Sembunyikan PIN" }</div>
            </div>
            {
                dataListTerminalAktif.length !== 0 ? 
                <>
                    <button className='btn-ez-transfer mt-4' onClick={() => addAndSaveDataTerminalHandler(44, inputStatusTerminal === true ? 1 : 0, pinTerminalKasir)}>Tambah Terminal</button>
                    <div className='base-content mt-4'>
                        <div className='detail-akun-menu' style={{display: 'flex', height: 33}}>
                            <div className='detail-akun-tabs menu-detail-akun-hr-active' id="terminalAktiftab">
                                <span className='menu-detail-akun-span menu-detail-akun-span-active' onClick={() => terminalTabs(true)} id="terminalAktifspan">Terminal Aktif</span>
                            </div>
                            <div className='detail-akun-tabs' style={{marginLeft: 15}} id="terminalNonaktiftab">
                                <span className='menu-detail-akun-span'  onClick={() => terminalTabs(false)} id="terminalNonaktifspan">Terminal Nonaktif</span>
                            </div>
                        </div>
                        <hr className='hr-style' style={{marginTop: -2}}/>
                        {
                            tabTerminal ?
                            <>
                                <div className="div-table">
                                    <DataTable
                                        columns={columnsTerminalAktif}
                                        data={filteredItemsTerminalAktif}
                                        customStyles={customStyles}
                                        // progressPending={pendingSettlement}
                                        subHeader
                                        subHeaderComponent={subHeaderComponentMemoTerminalAktif}
                                        persistTableHead
                                        progressComponent={<CustomLoader />}
                                    />
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                    <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageListTerminalAktif}</div>
                                    <Pagination
                                        activePage={activePageListTerminalAktif}
                                        itemsCountPerPage={pageNumberListTerminalAktif.row_per_page}
                                        totalItemsCount={(pageNumberListTerminalAktif.row_per_page*pageNumberListTerminalAktif.max_page)}
                                        pageRangeDisplayed={5}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        // onChange={handlePageChangeDataBrandQris}
                                    />
                                </div>
                            </> : 
                            <>
                                <div className="div-table">
                                    <DataTable
                                        columns={columnsTerminalNonAktif}
                                        data={filteredItemsTerminalNonAktif}
                                        customStyles={customStyles}
                                        // progressPending={pendingSettlement}
                                        subHeader
                                        subHeaderComponent={subHeaderComponentMemoTerminalNonAktif}
                                        persistTableHead
                                        progressComponent={<CustomLoader />}
                                    />
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                    <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageListTerminalNonAktif}</div>
                                    <Pagination
                                        activePage={activePageListTerminalNonAktif}
                                        itemsCountPerPage={pageNumberListTerminalNonAktif.row_per_page}
                                        totalItemsCount={(pageNumberListTerminalNonAktif.row_per_page*pageNumberListTerminalNonAktif.max_page)}
                                        pageRangeDisplayed={5}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        // onChange={handlePageChangeDataBrandQris}
                                    />
                                </div>
                            </>
                        }
                    </div>
                </>
                    :
                <button className='btn-ez-transfer mt-4' onClick={() => addAndSaveDataTerminalHandler(44, inputStatusTerminal === true ? 1 : 0, pinTerminalKasir)}>Simpan</button>
            }

            
            
        </div>
    )
}

export default TambahDataTerminalManual