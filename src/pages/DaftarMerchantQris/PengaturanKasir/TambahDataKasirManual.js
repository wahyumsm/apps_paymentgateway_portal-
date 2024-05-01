import React, { useEffect, useMemo, useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import { Button, Col, Form, Modal, OverlayTrigger, Row, Toast, Tooltip } from '@themesberg/react-bootstrap';
import { BaseURL, CustomLoader, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import $ from 'jquery'
import DataTable from 'react-data-table-component';
import { FilterComponentQrisTerminal } from '../../../components/FilterComponentQris';
import Pagination from 'react-js-pagination';
import edit from "../../../assets/icon/pencil_green_icon.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Checklist from '../../../assets/icon/checklist_icon.svg';
import validator from "validator";
import noteIconRed from "../../../assets/icon/note_icon_red.svg";

function TambahDataKasirManual () {
    const history = useHistory()
    const storeId = sessionStorage.getItem('storeId');
    const [dataDetailKasir, setDataDetailKasir] = useState({})
    const [pinKasir, setPinKasir] = useState("")
    const [isSecurePin, setIsSecurePin] = useState(true)
    const [inputStatusKasir, setInputStatusKasir] = useState(true)
    const [inputStatusKasirInListPaging, setInputStatusKasirInListPaging] = useState({})
    const [inputStatusKasirNonAktifInListPaging, setInputStatusKasirNonAktifInListPaging] = useState({})
    const [tabKasir, setTabKasir] = useState(true)
    const [dataListKasirAktif, setDataListKasirAktif] = useState([])
    const [pageNumberListKasirAktif, setPageNumberListKasirAktif] = useState({})
    const [totalPageListKasirAktif, setTotalPageListKasirAktif] = useState(0)
    const [activePageListKasirAktif, setActivePageListKasirAktif] = useState(1)
    const [showModalStatusKasir, setShowModalStatusKasir] = useState(false)
    const [showModalStatusKasirNonAktif, setShowModalStatusKasirNonAktif] = useState(false)
    const [dataKasirIdQris, setDataKasirIdQris] = useState(0)
    const [expanded, setExpanded] = useState(true);
    const [showModal, setShowModal] = useState("");
    const [showStatusTambahKasir, setShowStatusTambahKasir] = useState(false)
    const [dataLastActive, setDataLastActive] = useState("")
    const [errMsgEmail, setErrMsgEmail] = useState(false)
    const [inputHandleTambahKasir, setInputHandleTambahKasir] = useState({
        namaKasir: "",
        emailKasir: "",
        role: 0
    })

    function handleChangeTambahKasir (e) {
        if (e.target.name === "emailKasir") {
            setErrMsgEmail(false)
            setInputHandleTambahKasir({
                ...inputHandleTambahKasir,
                [e.target.name] : e.target.value
            })
        } else {
            setInputHandleTambahKasir({
                ...inputHandleTambahKasir,
                [e.target.name] : e.target.value
            })
        }
    }

    console.log(errMsgEmail, "errMsgEmail");

    const showCheckboxes = () => {
        if (!expanded) {
            setExpanded(true);
        } else {
            setExpanded(false);
        }
    };

    const [filterTextKasirAktif, setFilterTextKasirAktif] = React.useState('');
    const [resetPaginationToggleKasirAktif, setResetPaginationToggleKasirAktif] = React.useState(false);
    const filteredItemsKasirAktif = dataListKasirAktif.filter(
        item => item.muserqris_username && item.muserqris_username.toLowerCase().includes(filterTextKasirAktif.toLowerCase()),
    );
    const subHeaderComponentMemoKasirAktif = useMemo(() => {
        const handleClear = () => {
            if (filterTextKasirAktif) {
                setResetPaginationToggleKasirAktif(!resetPaginationToggleKasirAktif);
                setFilterTextKasirAktif('');
            }
        };
        function handleChangeFilterQris (e) {
            setFilterTextKasirAktif(e.target.value)
            getListKasirHandler(storeId, 1, activePageListKasirAktif)
        }
        return (
            <FilterComponentQrisTerminal onFilter={e => handleChangeFilterQris(e)} onClear={handleClear} filterText={filterTextKasirAktif} title="Pencarian :" placeholder="Cari kasir" />
        );	}, [filterTextKasirAktif, resetPaginationToggleKasirAktif]
    );
    
    function handleChangeStatus () {
        setInputStatusKasir(!inputStatusKasir);
        setShowModalStatusKasir(false)
        setShowModalStatusKasirNonAktif(false)
    }

    function showModalAddDataKasir (isActive) {
        setShowModal("up")
        if (isActive === true) {
            setShowModalStatusKasir(true)
        } else {
            setShowModalStatusKasirNonAktif(true)
        }
    }

    function handleChangeOtp (value) {
        setPinKasir(value)
    }

    function lihatDanUbahPin (kasirId, statusPage) {
        history.push(`/ubah-pin-kasir/${kasirId}/${statusPage}`)
    }
    
    function showModalKasirAktif (e, userId) {
        setShowModal("down")
        setShowModalStatusKasir(true)
        setDataKasirIdQris(userId)
    }


    function showModalKasirNonAktif (e, userId, lastActive) {
        console.log(lastActive, "lastActive");
        setDataLastActive(lastActive)
        setShowModal("down")
        setShowModalStatusKasirNonAktif(true)
        setDataKasirIdQris(userId)
    }

    function handlePageChangeDataKasirAktif(page) {
        setActivePageListKasirAktif(page)
        getListKasirHandler(storeId, 1, activePageListKasirAktif)
    }

    function handlePageChangeDataKasirNonAktif(page) {
        setActivePageListKasirNonAktif(page)
        getListKasirHandler(storeId, 0, activePageListKasirNonAktif)
    }

    async function handleChangeStatusInListPaging (isKasirActive, userId) {
        if (isKasirActive === 0) {
            try {
                const auth = "Bearer " + getToken()
                const dataParams = encryptData(`{"user_id": ${userId}, "is_active": ${isKasirActive}}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth
                }
                const dataKasir = await axios.post(BaseURL + "/QRIS/UpdateCashierActiveStatus", { data: dataParams }, { headers: headers })
                // console.log(dataKasir, 'ini user detal funct');
                if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token === null) {
                    getListKasirHandler(storeId, 1, activePageListKasirAktif)
                    getListKasirHandler(storeId, 0, activePageListKasirAktif)
                    getDataDetailKasir(storeId)
                    setDataKasirIdQris(0)
                    setDataLastActive("")
                    setShowModalStatusKasir(false)

                } else if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token !== null) {
                    setUserSession(dataKasir.data.response_new_token)
                    getListKasirHandler(storeId, 1, activePageListKasirAktif)
                    getListKasirHandler(storeId, 0, activePageListKasirAktif)
                    getDataDetailKasir(storeId)
                    setDataKasirIdQris(0)
                    setDataLastActive("")
                    setShowModalStatusKasir(false)

                }
            } catch (error) {
                // console.log(error);
                history.push(errorCatch(error.response.status))
            }
        } else {
            try {
                const auth = "Bearer " + getToken()
                const dataParams = encryptData(`{"user_id": ${userId}, "is_active": ${isKasirActive}}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth
                }
                const dataKasir = await axios.post(BaseURL + "/QRIS/UpdateCashierActiveStatus", { data: dataParams }, { headers: headers })
                // console.log(dataKasir, 'ini user detal funct');
                if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token === null) {
                    getListKasirHandler(storeId, 1, activePageListKasirAktif)
                    getListKasirHandler(storeId, 0, activePageListKasirAktif)
                    getDataDetailKasir(storeId)
                    setDataKasirIdQris(0)
                    setShowModalStatusKasirNonAktif(false)

                } else if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token !== null) {
                    setUserSession(dataKasir.data.response_new_token)
                    getListKasirHandler(storeId, 1, activePageListKasirAktif)
                    getListKasirHandler(storeId, 0, activePageListKasirAktif)
                    getDataDetailKasir(storeId)
                    setDataKasirIdQris(0)         
                    setShowModalStatusKasirNonAktif(false)
                }
            } catch (error) {
                // console.log(error);
                history.push(errorCatch(error.response.status))
            }
        }
    }

    function terminalTabs(isTabs){
        setTabKasir(isTabs)
        if(!isTabs) {
            getListKasirHandler(storeId, 0, activePageListKasirNonAktif)
            $('#terminalAktiftab').removeClass('menu-detail-akun-hr-active')
            $('#terminalAktifspan').removeClass('menu-detail-akun-span-active')
            $('#terminalNonaktiftab').addClass('menu-detail-akun-hr-active')
            $('#terminalNonaktifspan').addClass('menu-detail-akun-span-active')
        } else {
            getListKasirHandler(storeId, 1, activePageListKasirAktif)
            $('#terminalNonaktiftab').removeClass('menu-detail-akun-hr-active')
            $('#terminalNonaktifspan').removeClass('menu-detail-akun-span-active')
            $('#terminalAktiftab').addClass('menu-detail-akun-hr-active')
            $('#terminalAktifspan').addClass('menu-detail-akun-span-active')
        }
    }

    const columnsKasirAktif = [
        {
            name: 'No',
            selector: row => row.rowNumber,
            width: "67px"
        },
        {
            name: 'Role',
            selector: row => row.user_role,
        },
        {
            name: 'Email Admin Kasir',
            selector: row => row.muserqris_username,
            width: "160px"
        },
        {
            name: 'Tanggal Daftar',
            selector: row => row.muserqris_crtdt_format,
            width: "160px"
        },
        {
            name: 'Terakhir Aktif',
            selector: row => row.last_active,
            width: "160px"
        },
        {
            name: 'Nama Kasir',
            selector: row => row.muserqris_name,
            width: "130px"
        },
        {
            name: 'Terminal Kasir',
            selector: row => row.mterminalqris_terminal_name === null ? "-" : row.mterminalqris_terminal_name,
            width: "140px"
        },
        {
            name: 'Status',
            cell: row => <Form.Check type='switch' id='custom-switch' checked={inputStatusKasirInListPaging?.[`status${row.rowNumber}`] !== undefined ? inputStatusKasirInListPaging?.[`status${row.rowNumber}`] : row.muserqris_is_active} onChange={(e) => showModalKasirAktif(e, row.muserqris_id)} name='activeStatusNonAktif' />,
        },
        {
            name: 'Aksi',
            selector: row => row.tvasettl_amount,
            cell: (row) => (
                <div className="d-flex justify-content-center align-items-center">
                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Edit</div></Tooltip>}>
                        <img
                            src={edit}
                            onClick={() => lihatDanUbahPin(row.muserqris_id, 1)}
                            style={{ cursor: "pointer", color: "#077E86" }}
                            alt="icon edit"
                        />
                    </OverlayTrigger>
                    <div className='ms-3' style={{ cursor: "pointer", color: "#077E86", fontWeight: 700, fontSize: 14, fontFamily: "Exo" }} onClick={() => lihatDanUbahPin(row.muserqris_id, 0)}>Lihat</div>
                </div>
            ),
        },
    ]

    const [dataListKasirNonAktif, setDataListKasirNonAktif] = useState([])
    const [pageNumberListKasirNonAktif, setPageNumberListKasirNonAktif] = useState({})
    const [totalPageListKasirNonAktif, setTotalPageListKasirNonAktif] = useState(0)
    const [activePageListKasirNonAktif, setActivePageListKasirNonAktif] = useState(1)

    const [filterTextKasirNonAktif, setFilterTextKasirNonAktif] = React.useState('');
    const [resetPaginationToggleKasirNonAktif, setResetPaginationToggleKasirNonAktif] = React.useState(false);
    const filteredItemsKasirNonAktif = dataListKasirNonAktif.filter(
        item => item.muserqris_username && item.muserqris_username.toLowerCase().includes(filterTextKasirNonAktif.toLowerCase()),
    );
    const subHeaderComponentMemoKasirNonAktif = useMemo(() => {
        const handleClear = () => {
            if (filterTextKasirNonAktif) {
                setResetPaginationToggleKasirNonAktif(!resetPaginationToggleKasirNonAktif);
                setFilterTextKasirNonAktif('');
            }
        };
        function handleChangeFilterQris (e) {
            setFilterTextKasirNonAktif(e.target.value)
            getListKasirHandler(storeId, 1, activePageListKasirNonAktif)
        }
        return (
            <FilterComponentQrisTerminal onFilter={e => handleChangeFilterQris(e)} onClear={handleClear} filterText={filterTextKasirNonAktif} title="Pencarian :" placeholder="Cari kasir" />
        );	}, [filterTextKasirNonAktif, resetPaginationToggleKasirNonAktif]
    );

    const columnsKasirNonAktif = [
        {
            name: 'No',
            selector: row => row.rowNumber,
            width: "67px"
        },
        {
            name: 'Role',
            selector: row => row.user_role,
        },
        {
            name: 'Email Admin Kasir',
            selector: row => row.muserqris_username,
            width: "160px"
        },
        {
            name: 'Tanggal Daftar',
            selector: row => row.muserqris_crtdt_format,
            width: "160px"
        },
        {
            name: 'Terakhir Aktif',
            selector: row => row.last_active,
            width: "160px"
        },
        {
            name: 'Nama Kasir',
            selector: row => row.muserqris_name,
            width: "130px"
        },
        {
            name: 'Terminal Kasir',
            selector: row => row.mterminalqris_terminal_name === null ? "-" : row.mterminalqris_terminal_name,
            width: "140px"
        },
        {
            name: 'Status',
            cell: row => <Form.Check type='switch' id='custom-switch' checked={inputStatusKasirNonAktifInListPaging?.[`status${row.rowNumber}`] !== undefined ? inputStatusKasirNonAktifInListPaging?.[`status${row.rowNumber}`] : row.muserqris_is_active} onChange={(e) => showModalKasirNonAktif(e, row.muserqris_id, row.last_active)} name='activeStatusNonAktif' />,
        },
        {
            name: 'Aksi',
            selector: row => row.tvasettl_amount,
            cell: (row) => (
                <div className="d-flex justify-content-center align-items-center">
                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Edit</div></Tooltip>}>
                        <img
                            src={edit}
                            onClick={() => lihatDanUbahPin(row.muserqris_id, 1)}
                            style={{ cursor: "pointer", color: "#077E86" }}
                            alt="icon edit"
                        />
                    </OverlayTrigger>
                    <div className='ms-3' style={{ cursor: "pointer", color: "#077E86", fontWeight: 700, fontSize: 14, fontFamily: "Exo" }} onClick={() => lihatDanUbahPin(row.muserqris_id, 0)}>Lihat</div>
                </div>
            ),
        },
    ]

    async function getDataDetailKasir(storeId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"store_id": "${storeId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataKasir = await axios.post(BaseURL + "/QRIS/GetUserQrisDetailAndCount", { data: dataParams }, { headers: headers })
            // console.log(dataKasir, 'ini user detal funct');
            if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token.length === 0) {
                setDataDetailKasir(dataKasir.data.response_data.results)
            } else if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token.length !== 0) {
                setUserSession(dataKasir.data.response_new_token)
                setDataDetailKasir(dataKasir.data.response_data.results)
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function addAndSaveDataKasirHandler(e, namaKasir, storeNou, email, role, isActive, pin) {
        try {
            e.preventDefault()
            if (validator.isEmail(email) === false) {
                setErrMsgEmail(true)
                return
            }
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"name": "${namaKasir}", "user_id": 0, "store_nou": ${storeNou}, "email": "${email}", "role" : ${role}, "is_active": ${isActive}, "pin": "${pin}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataKasir = await axios.post(BaseURL + "/QRIS/AddAndEditCashierData", { data: dataParams }, { headers: headers })
            // console.log(dataKasir, 'ini user detal funct');
            if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token === null) {
                setShowStatusTambahKasir(true)
                window.scrollTo(0,0)
                setPinKasir("")
                setInputHandleTambahKasir({
                    ...inputHandleTambahKasir,
                    namaKasir: "",
                    emailKasir: "",
                    role: 0
                })
                setInputStatusKasir(true)
                getListKasirHandler(storeId, 1, activePageListKasirAktif)
                setTimeout(() => {
                    setShowStatusTambahKasir(false)
                }, 5000);
            } else if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token !== null) {
                setUserSession(dataKasir.data.response_new_token)
                setShowStatusTambahKasir(true)
                window.scrollTo(0,0)
                setPinKasir("")
                setInputHandleTambahKasir({
                    ...inputHandleTambahKasir,
                    namaKasir: "",
                    emailKasir: "",
                    role: 0
                })
                setInputStatusKasir(true)
                getListKasirHandler(storeId, 1, activePageListKasirAktif)
                setTimeout(() => {
                    setShowStatusTambahKasir(false)
                }, 5000);
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getListKasirHandler(storeId, userIsActive, currentPage) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"store_id": "${storeId}", "user_is_active": ${userIsActive}, "date_from": "", "date_to": "", "page": ${currentPage}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataKasir = await axios.post(BaseURL + "/QRIS/GetListUserQrisPaging", { data: dataParams }, { headers: headers })
            // console.log(dataKasir, 'ini user detal funct');
            if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token.length === 0) {
                if (userIsActive === 1) {
                    setDataListKasirAktif(dataKasir.data.response_data.results)
                    setPageNumberListKasirAktif(dataKasir.data.response_data)
                    setTotalPageListKasirAktif(dataKasir.data.response_data.max_page)
                    setInputStatusKasirInListPaging(dataKasir.data.response_data.results.mterminalqris_is_active)
                } else {
                    setDataListKasirNonAktif(dataKasir.data.response_data.results)
                    setPageNumberListKasirNonAktif(dataKasir.data.response_data)
                    setTotalPageListKasirNonAktif(dataKasir.data.response_data.max_page)
                    setInputStatusKasirNonAktifInListPaging(dataKasir.data.response_data.results.mterminalqris_is_active)
                }
            } else if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token.length !== 0) {
                setUserSession(dataKasir.data.response_new_token)
                if (userIsActive === 1) {
                    setDataListKasirAktif(dataKasir.data.response_data.results)
                    setPageNumberListKasirAktif(dataKasir.data.response_data)
                    setTotalPageListKasirAktif(dataKasir.data.response_data.max_page)
                    setInputStatusKasirInListPaging(dataKasir.data.response_data.results.mterminalqris_is_active)
                } else {
                    setDataListKasirNonAktif(dataKasir.data.response_data.results)
                    setPageNumberListKasirNonAktif(dataKasir.data.response_data)
                    setTotalPageListKasirNonAktif(dataKasir.data.response_data.max_page)
                    setInputStatusKasirNonAktifInListPaging(dataKasir.data.response_data.results.mterminalqris_is_active)
                }
            }
        } catch (error) {
            console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

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
        getDataDetailKasir(storeId)
        getListKasirHandler(storeId, 1, activePageListKasirAktif)
        getListKasirHandler(storeId, 0, activePageListKasirNonAktif)
    }, [])
    

    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
                {
                    showStatusTambahKasir && (
                        <div className="align-items-center position-absolute" style={{ marginLeft: "6%" }}>
                            <Toast style={{width: "900px", backgroundColor: "#077E86"}} onClose={() => setShowStatusTambahKasir(false)} autohide>
                                <Toast.Body  className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span>Kasir berhasil ditambahkan</Toast.Body>
                            </Toast>
                        </div>
                    )
                }

                <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }} onClick={() => history.push("/")}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }} onClick={() => history.push("/daftar-merchant-qris/pengaturan-kasir")}>Pengaturan Kasir</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }} onClick={() => history.push("/daftar-merchant-qris/pengaturan-kasir")}>Daftar Kasir</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>{dataListKasirAktif.length !== 0 || dataListKasirNonAktif.length !== 0 ? "Info Kasir" : "Tambah Kasir Manual"}</span></span>
                <div className="head-title"> 
                    {
                        (dataListKasirAktif.length !== 0 || dataListKasirNonAktif.length !== 0) ? 
                        <h2 className="h5 mt-4" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Info Kasir</h2> :
                        <h2 className="h5 mt-4" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Tambah Kasir Manual</h2>
                    }
                </div>
                <div className='base-content mt-3'>
                    <div className="nama-merchant-in-detail">{dataDetailKasir?.merchant_name}</div>
                    <Row className='mt-3'>
                        <Col xs={6} className='sub-title-detail-merchant'>Group</Col>
                        <Col xs={6} className='sub-title-detail-merchant'>Brand</Col>
                    </Row>
                    <Row className='mt-1'>
                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailKasir?.merchant_name}</Col>
                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailKasir?.outlet_name === "" ? "-" : dataDetailKasir?.outlet_name}</Col>
                    </Row>
                    <Row className='mt-3'>
                        <Col xs={6} className='sub-title-detail-merchant'>Total Kasir Aktif</Col>
                        <Col xs={6} className='sub-title-detail-merchant'>Total Kasir Nonaktif</Col>
                    </Row>
                    <Row className='mt-1 pb-4'>
                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailKasir?.active_user}</Col>
                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailKasir?.inactive_user}</Col>
                    </Row>
                </div>
                {
                    (dataListKasirAktif.length !== 0 || dataListKasirNonAktif.length !== 0) ? (
                        <div className='d-flex justify-content-between align-items-center mt-3' style={{ cursor: "pointer" }} onClick={showCheckboxes}>
                            <div style={{ fontFamily: "Exo", fontSize: 15, fontWeight: 600 }}>Tambah Kasir</div>
                            <button
                                style={{
                                    fontFamily: "Exo",
                                    fontSize: 16,
                                    fontWeight: 700,
                                    alignItems: "center",
                                    gap: 8,
                                    height: 48,
                                    background: "unset",
                                    border: "unset",
                                }}
                            >
                                {
                                    expanded ?
                                    <FontAwesomeIcon icon={faChevronDown} className="mx-2" /> :
                                    <FontAwesomeIcon icon={faChevronUp} className="mx-2" />
                                }
                            </button>
                        </div>
                    ) :
                    <div className='mt-3' style={{ fontFamily: "Exo", fontSize: 15, fontWeight: 600 }}>Tambah Kasir</div>

                }
                <div className='sub-title-detail-merchant mt-1'>Kasir yang digunakan untuk akses masuk ke QRIS Ezeelink</div>
                {
                    (dataListKasirAktif.length !== 0 || dataListKasirNonAktif.length !== 0) ?
                        expanded && (
                            <>
                                <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Aktifkan Kasir</div>
                                <Form.Check 
                                    type="switch"
                                    id="custom-switch"
                                    checked={
                                        inputStatusKasir
                                    }
                                    name="active"
                                    className='mt-2'
                                    onChange={() => showModalAddDataKasir(inputStatusKasir)}
                                />
                                <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Nama Kasir</div>
                                <input name="namaKasir" value={inputHandleTambahKasir.namaKasir} onChange={(e) => handleChangeTambahKasir(e)} type='text'className='input-text-tambah-manual-qris mt-2' placeholder='Masukkan Nama Kasir'/>
                                <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Email Kasir</div>
                                <input name="emailKasir" value={inputHandleTambahKasir.emailKasir} onChange={(e) => handleChangeTambahKasir(e)} type='text'className='input-text-tambah-manual-qris mt-2' placeholder='contoh : Farida@gmail.com'/>
                                {
                                    errMsgEmail ? (
                                        <div style={{ color: "#B9121B", fontSize: 12 }} className="mt-1">
                                            <img src={noteIconRed} className="me-2" alt="icon notice" />
                                            Format email salah!
                                        </div>
                                    ) : ""
                                }
                                <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Role</div>
                                <Form.Select name='role' value={inputHandleTambahKasir.role} onChange={(e) => handleChangeTambahKasir(e)} className='input-text-tambah-manual-qris' style={{ display: "inline" }} >
                                    <option defaultValue disabled value={0}>Pilih Role</option>
                                    <option value={103}>Kepala Outlet</option>
                                    <option value={104}>Kasir</option>
                                </Form.Select>
                                <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>PIN Kasir</div>
                                <OtpInput
                                    isInputSecure={isSecurePin === true ? true : false}
                                    isInputNum={true}
                                    className='me-3 mt-2'
                                    value={pinKasir}
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
                            </>
                        ) :
                        <>
                            <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Aktifkan Kasir</div>
                            <Form.Check 
                                type="switch"
                                id="custom-switch"
                                checked={
                                    inputStatusKasir
                                }
                                name="active"
                                className='mt-2'
                                onChange={() => showModalAddDataKasir(inputStatusKasir)}
                            />
                            <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Nama Kasir</div>
                            <input name="namaKasir" value={inputHandleTambahKasir.namaKasir} onChange={(e) => handleChangeTambahKasir(e)} type='text'className='input-text-tambah-manual-qris mt-2' placeholder='Masukkan Nama Kasir'/>
                            <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Email Kasir</div>
                            <input name="emailKasir" value={inputHandleTambahKasir.emailKasir} onChange={(e) => handleChangeTambahKasir(e)} type='text'className='input-text-tambah-manual-qris mt-2' placeholder='contoh : Farida@gmail.com'/>
                            {
                                errMsgEmail ? (
                                    <div style={{ color: "#B9121B", fontSize: 12 }} className="mt-1">
                                        <img src={noteIconRed} className="me-2" alt="icon notice" />
                                        Format email salah!
                                    </div>
                                ) : ""
                            }
                            <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Role</div>
                            <Form.Select name='role' value={inputHandleTambahKasir.role} onChange={(e) => handleChangeTambahKasir(e)} className='input-text-tambah-manual-qris' style={{ display: "inline" }} >
                                <option defaultValue disabled value={0}>Pilih Role</option>
                                <option value={103}>Kepala Outlet</option>
                                <option value={104}>Kasir</option>
                            </Form.Select>
                            <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>PIN Kasir</div>
                            <OtpInput
                                isInputSecure={isSecurePin === true ? true : false}
                                isInputNum={true}
                                className='me-3 mt-2'
                                value={pinKasir}
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
                        </>
                }

                {
                    (dataListKasirAktif.length !== 0 || dataListKasirNonAktif.length !== 0) ? 
                    <>
                        {
                            expanded &&
                            <button 
                                className={inputHandleTambahKasir.namaKasir.length !== 0 && inputHandleTambahKasir.emailKasir.length !== 0 && inputHandleTambahKasir.role !== 0 && pinKasir.length !== 0 && pinKasir.length === 6 ? 'btn-ez-transfer mt-4' : 'btn-noez-transfer mt-4'}
                                disabled={inputHandleTambahKasir.namaKasir.length === 0 || inputHandleTambahKasir.emailKasir.length === 0 || inputHandleTambahKasir.role === 0 || pinKasir.length === 0 || (pinKasir.length !== 0 && pinKasir.length !== 6) }
                                onClick={(e) => addAndSaveDataKasirHandler(e, inputHandleTambahKasir.namaKasir, dataDetailKasir?.mobile_store_nou, inputHandleTambahKasir.emailKasir, inputHandleTambahKasir.role, inputStatusKasir === true ? 1 : 0, pinKasir)}
                            >
                                Tambah Kasir
                            </button>
                        }
                        <div className='base-content mt-4'>
                            <div className='detail-akun-menu' style={{display: 'flex', height: 33}}>
                                <div className='detail-akun-tabs menu-detail-akun-hr-active' id="terminalAktiftab">
                                    <span className='menu-detail-akun-span menu-detail-akun-span-active' onClick={() => terminalTabs(true)} id="terminalAktifspan">Kasir Aktif</span>
                                </div>
                                <div className='detail-akun-tabs' style={{marginLeft: 15}} id="terminalNonaktiftab">
                                    <span className='menu-detail-akun-span'  onClick={() => terminalTabs(false)} id="terminalNonaktifspan">Kasir Nonaktif</span>
                                </div>
                            </div>
                            <hr className='hr-style' style={{marginTop: -2}}/>
                            {
                                tabKasir ?
                                <>
                                    <div className="div-table">
                                        <DataTable
                                            columns={columnsKasirAktif}
                                            data={filteredItemsKasirAktif}
                                            customStyles={customStyles}
                                            // progressPending={pendingSettlement}
                                            subHeader
                                            subHeaderComponent={subHeaderComponentMemoKasirAktif}
                                            persistTableHead
                                            progressComponent={<CustomLoader />}
                                        />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageListKasirAktif}</div>
                                        <Pagination
                                            activePage={activePageListKasirAktif}
                                            itemsCountPerPage={pageNumberListKasirAktif.row_per_page}
                                            totalItemsCount={(pageNumberListKasirAktif.row_per_page*pageNumberListKasirAktif.max_page)}
                                            pageRangeDisplayed={5}
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            onChange={handlePageChangeDataKasirAktif}
                                        />
                                    </div>
                                </> : 
                                <>
                                    <div className="div-table">
                                        <DataTable
                                            columns={columnsKasirNonAktif}
                                            data={filteredItemsKasirNonAktif}
                                            customStyles={customStyles}
                                            // progressPending={pendingSettlement}
                                            subHeader
                                            subHeaderComponent={subHeaderComponentMemoKasirNonAktif}
                                            persistTableHead
                                            progressComponent={<CustomLoader />}
                                        />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageListKasirNonAktif}</div>
                                        <Pagination
                                            activePage={activePageListKasirNonAktif}
                                            itemsCountPerPage={pageNumberListKasirNonAktif.row_per_page}
                                            totalItemsCount={(pageNumberListKasirNonAktif.row_per_page*pageNumberListKasirNonAktif.max_page)}
                                            pageRangeDisplayed={5}
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            onChange={handlePageChangeDataKasirNonAktif}
                                        />
                                    </div>
                                </>
                            }
                        </div>
                    </>
                        :
                    <button className='btn-ez-transfer mt-4' onClick={(e) => addAndSaveDataKasirHandler(e, inputHandleTambahKasir.namaKasir, dataDetailKasir?.mobile_store_nou, inputHandleTambahKasir.emailKasir, inputHandleTambahKasir.role, inputStatusKasir === true ? 1 : 0, pinKasir)}>Simpan</button>
                }
            </div>

            <Modal
                size="lg"
                centered
                show={showModalStatusKasir}
                onHide={() => setShowModalStatusKasir(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                className='modal-daftar-settlement'
                >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Yakin ingin menonaktifkan kasir?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 15, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-center">Kasir <b>tidak dapat digunakan</b> setelah dinonaktifkan masih ingin melanjutkan ?</p>
                    </div>             
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalStatusKasir(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Batal</Button>
                        <Button onClick={showModal === "down" ? () => handleChangeStatusInListPaging(0, dataKasirIdQris) : () => handleChangeStatus()} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Ya</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                centered
                show={showModalStatusKasirNonAktif}
                onHide={() => setShowModalStatusKasirNonAktif(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                className='modal-daftar-settlement'
                >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Yakin ingin mengaktifkan kasir?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 15, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-center">tanggal dinonaktifkan <b>{dataLastActive}</b>, masih ingin melanjutkan ?</p>
                    </div>             
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalStatusKasirNonAktif(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Batal</Button>
                        <Button onClick={showModal === "down" ? () => handleChangeStatusInListPaging(1, dataKasirIdQris) : () => handleChangeStatus()} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Ya</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default TambahDataKasirManual