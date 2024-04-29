import React, { useEffect, useMemo, useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import HideEye from "../../../assets/img/HideEye.png";
import ShowEye from "../../../assets/img/ShowEye.png";
import { Button, Col, Form, Modal, OverlayTrigger, Row, Toast, Tooltip } from '@themesberg/react-bootstrap';
import { BaseURL, CustomLoader, currentDateTemplate, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ReactSelect, { components } from 'react-select';
import OtpInput from 'react-otp-input';
import $ from 'jquery'
import DataTable from 'react-data-table-component';
import { FilterComponentQrisTerminal } from '../../../components/FilterComponentQris';
import Pagination from 'react-js-pagination';
import edit from "../../../assets/icon/pencil_green_icon.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Checklist from '../../../assets/icon/checklist_icon.svg'
import ChecklistGreenIcon from '../../../assets/icon/checklist_green_icon.svg'

function TambahDataTerminalManual () {
    const history = useHistory()
    const storeId = sessionStorage.getItem('storeId');
    const [dataDetailTerminal, setDataDetailTerminal] = useState({})
    const [dataTerminalByStoreId, setDataTerminalByStoreId] = useState([])
    const [selectedDataTerminalByStore, setSelectedDataTerminalByStore] = useState([])
    const [pinTerminalKasir, setPinTerminalKasir] = useState("")
    const [isSecurePin, setIsSecurePin] = useState(true)
    const [inputStatusTerminal, setInputStatusTerminal] = useState(true)
    const [inputStatusTerminalInListPaging, setInputStatusTerminalInListPaging] = useState({})
    const [inputStatusTerminalNonAktifInListPaging, setInputStatusTerminalNonAktifInListPaging] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [tabTerminal, setTabTerminal] = useState(true)
    const [dataListTerminalAktif, setDataListTerminalAktif] = useState([])
    const [pageNumberListTerminalAktif, setPageNumberListTerminalAktif] = useState({})
    const [totalPageListTerminalAktif, setTotalPageListTerminalAktif] = useState(0)
    const [activePageListTerminalAktif, setActivePageListTerminalAktif] = useState(1)
    const [showModalStatusTerminal, setShowModalStatusTerminal] = useState(false)
    const [showModalStatusTerminalNonAktif, setShowModalStatusTerminalNonAktif] = useState(false)
    const [dataTerminalIdQris, setDataTerminalIdQris] = useState(0)
    const [expanded, setExpanded] = useState(true);
    const [showModal, setShowModal] = useState("");
    const [showStatusTambahTerminal, setShowStatusTambahTerminal] = useState(false)
    const [dataLastActive, setDataLastActive] = useState("")

    const showCheckboxes = () => {
        if (!expanded) {
            setExpanded(true);
        } else {
            setExpanded(false);
        }
    };

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
    
    function handleChangeStatus () {
        setInputStatusTerminal(!inputStatusTerminal);
        setShowModalStatusTerminal(false)
        setShowModalStatusTerminalNonAktif(false)
    }

    function showModalAddDataTerminal (isActive) {
        setShowModal("up")
        if (isActive === true) {
            setShowModalStatusTerminal(true)
        } else {
            setShowModalStatusTerminalNonAktif(true)
        }
    }

    console.log(inputStatusTerminal, "inputStatusTerminal");

    function handleChangeOtp (value) {
        setPinTerminalKasir(value)
    }

    function lihatDanUbahPin (terminalId, statusPage) {
        history.push(`/ubah-pin-terminal/${terminalId}/${statusPage}`)
    }
    
    function showModalTerminalAktif (e, terminalId) {
        setShowModal("down")
        setShowModalStatusTerminal(true)
        setDataTerminalIdQris(terminalId)
    }


    function showModalTerminalNonAktif (e, terminalId, lastActive) {
        console.log(lastActive, "lastActive");
        setDataLastActive(lastActive)
        setShowModal("down")
        setShowModalStatusTerminalNonAktif(true)
        setDataTerminalIdQris(terminalId)
    }

    function handlePageChangeDataTerminalAktif(page) {
        setActivePageListTerminalAktif(page)
        getListTerminalHandler(storeId, 1, activePageListTerminalAktif)
    }

    function handlePageChangeDataTerminalNonAktif(page) {
        setActivePageListTerminalNonAktif(page)
        getListTerminalHandler(storeId, 0, activePageListTerminalNonAktif)
    }

    async function handleChangeStatusInListPaging (isTerminalActive, terminalId) {
        if (isTerminalActive === 0) {
            try {
                const auth = "Bearer " + getToken()
                const dataParams = encryptData(`{"terminal_id": ${terminalId}, "is_active": ${isTerminalActive}}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth
                }
                const dataTerminal = await axios.post(BaseURL + "/QRIS/UpdateTerminalActiveStatus", { data: dataParams }, { headers: headers })
                // console.log(dataTerminal, 'ini user detal funct');
                if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token === null) {
                    getListTerminalHandler(storeId, 1, activePageListTerminalAktif)
                    getDataDetailTerminal(storeId)
                    setDataTerminalIdQris(0)
                    setDataLastActive("")
                    setShowModalStatusTerminal(false)

                } else if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token !== null) {
                    setUserSession(dataTerminal.data.response_new_token)
                    getListTerminalHandler(storeId, 1, activePageListTerminalAktif)
                    getDataDetailTerminal(storeId)
                    setDataTerminalIdQris(0)
                    setDataLastActive("")
                    setShowModalStatusTerminal(false)

                }
            } catch (error) {
                // console.log(error);
                history.push(errorCatch(error.response.status))
            }
        } else {
            try {
                const auth = "Bearer " + getToken()
                const dataParams = encryptData(`{"terminal_id": ${terminalId}, "is_active": ${isTerminalActive}}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth
                }
                const dataTerminal = await axios.post(BaseURL + "/QRIS/UpdateTerminalActiveStatus", { data: dataParams }, { headers: headers })
                // console.log(dataTerminal, 'ini user detal funct');
                if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token === null) {
                    getListTerminalHandler(storeId, 0, activePageListTerminalAktif)
                    getDataDetailTerminal(storeId)
                    setDataTerminalIdQris(0)
                    setShowModalStatusTerminalNonAktif(false)

                } else if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token !== null) {
                    setUserSession(dataTerminal.data.response_new_token)
                    getListTerminalHandler(storeId, 0, activePageListTerminalAktif)
                    getDataDetailTerminal(storeId)
                    setDataTerminalIdQris(0)         
                    setShowModalStatusTerminalNonAktif(false)

                }
            } catch (error) {
                // console.log(error);
                history.push(errorCatch(error.response.status))
            }
        }
    }

    function terminalTabs(isTabs){
        setTabTerminal(isTabs)
        if(!isTabs) {
            getListTerminalHandler(storeId, 0, activePageListTerminalNonAktif)
            $('#terminalAktiftab').removeClass('menu-detail-akun-hr-active')
            $('#terminalAktifspan').removeClass('menu-detail-akun-span-active')
            $('#terminalNonaktiftab').addClass('menu-detail-akun-hr-active')
            $('#terminalNonaktifspan').addClass('menu-detail-akun-span-active')
        } else {
            getListTerminalHandler(storeId, 1, activePageListTerminalAktif)
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
            name: 'Nama Kasir',
            selector: row => row.muserqris_name === null ? "-" : row.muserqris_name,
        },
        {
            name: 'Status',
            cell: row => <Form.Check type='switch' id='custom-switch' checked={inputStatusTerminalInListPaging?.[`status${row.rowNumber}`] !== undefined ? inputStatusTerminalInListPaging?.[`status${row.rowNumber}`] : row.mterminalqris_is_active} onChange={(e) => showModalTerminalAktif(e, row.mterminalqris_id)} name='activeStatusAktif' />,
        },
        {
            name: 'Aksi',
            selector: row => row.tvasettl_amount,
            cell: (row) => (
                <div className="d-flex justify-content-center align-items-center">
                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Edit</div></Tooltip>}>
                        <img
                            src={edit}
                            onClick={() => lihatDanUbahPin(row.mterminalqris_id, 1)}
                            style={{ cursor: "pointer", color: "#077E86" }}
                            alt="icon edit"
                        />
                    </OverlayTrigger>
                    <div className='ms-3' style={{ cursor: "pointer", color: "#077E86", fontWeight: 700, fontSize: 14, fontFamily: "Exo" }} onClick={() => lihatDanUbahPin(row.mterminalqris_id, 0)}>Lihat</div>
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
            name: 'Nama Kasir',
            selector: row => row.muserqris_name === null ? "-" : row.muserqris_name,
        },
        {
            name: 'Status',
            cell: row => <Form.Check type='switch' id='custom-switch' checked={inputStatusTerminalNonAktifInListPaging?.[`status${row.rowNumber}`] !== undefined ? inputStatusTerminalNonAktifInListPaging?.[`status${row.rowNumber}`] : row.mterminalqris_is_active} onChange={(e) => showModalTerminalNonAktif(e, row.mterminalqris_id, row.terminal_last_active_pop_up)} name='activeStatusNonAktif' />,
        },
        {
            name: 'Aksi',
            selector: row => row.tvasettl_amount,
            cell: (row) => (
                <div className="d-flex justify-content-center align-items-center">
                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Edit</div></Tooltip>}>
                        <img
                            src={edit}
                            onClick={() => lihatDanUbahPin(row.mterminalqris_id, 1)}
                            style={{ cursor: "pointer", color: "#077E86" }}
                            alt="icon edit"
                        />
                    </OverlayTrigger>
                    <div className='ms-3' style={{ cursor: "pointer", color: "#077E86", fontWeight: 700, fontSize: 14, fontFamily: "Exo" }} onClick={() => lihatDanUbahPin(row.mterminalqris_id, 0)}>Lihat</div>
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
                    obj.value = e.mterminalqris_id
                    obj.label = e.mterminalqris_terminal_name
                    obj.isdisabled = e.is_terminal_have_pin 
                    newArr.push(obj)
                })
                setDataTerminalByStoreId(newArr)
            } else if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token !== null) {
                setUserSession(dataTerminal.data.response_new_token)
                let newArr = []
                dataTerminal.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mterminalqris_id
                    obj.label = e.mterminalqris_terminal_name
                    obj.isdisabled = e.is_terminal_have_pin 
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
                setShowStatusTambahTerminal(true)
                window.scrollTo(0,0)
                setPinTerminalKasir("")
                setInputStatusTerminal(false)
                setSelectedDataTerminalByStore([])
                getListTerminalHandler(storeId, 1, activePageListTerminalAktif)
                getDataTerminalHandler(storeId)
                setTimeout(() => {
                    setShowStatusTambahTerminal(false)
                }, 5000);
            } else if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token !== null) {
                setUserSession(dataTerminal.data.response_new_token)
                setShowStatusTambahTerminal(true)
                window.scrollTo(0,0)
                setPinTerminalKasir("")
                setInputStatusTerminal(false)
                setSelectedDataTerminalByStore([])
                getListTerminalHandler(storeId, 1, activePageListTerminalAktif)
                getDataTerminalHandler(storeId)
                setTimeout(() => {
                    setShowStatusTambahTerminal(false)
                }, 5000);
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
                if (terminalIsActive === 1) {
                    setDataListTerminalAktif(dataTerminal.data.response_data.results)
                    setPageNumberListTerminalAktif(dataTerminal.data.response_data)
                    setTotalPageListTerminalAktif(dataTerminal.data.response_data.max_page)
                    setInputStatusTerminalInListPaging(dataTerminal.data.response_data.results.mterminalqris_is_active)
                } else {
                    setDataListTerminalNonAktif(dataTerminal.data.response_data.results)
                    setPageNumberListTerminalNonAktif(dataTerminal.data.response_data)
                    setTotalPageListTerminalNonAktif(dataTerminal.data.response_data.max_page)
                    setInputStatusTerminalNonAktifInListPaging(dataTerminal.data.response_data.results.mterminalqris_is_active)
                }
            } else if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token.length !== 0) {
                setUserSession(dataTerminal.data.response_new_token)
                if (terminalIsActive === 1) {
                    setDataListTerminalAktif(dataTerminal.data.response_data.results)
                    setPageNumberListTerminalAktif(dataTerminal.data.response_data)
                    setTotalPageListTerminalAktif(dataTerminal.data.response_data.max_page)
                    setInputStatusTerminalInListPaging(dataTerminal.data.response_data.results.mterminalqris_is_active)
                } else {
                    setDataListTerminalNonAktif(dataTerminal.data.response_data.results)
                    setPageNumberListTerminalNonAktif(dataTerminal.data.response_data)
                    setTotalPageListTerminalNonAktif(dataTerminal.data.response_data.max_page)
                    setInputStatusTerminalNonAktifInListPaging(dataTerminal.data.response_data.results.mterminalqris_is_active)
                }
            }
        } catch (error) {
            console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    const customStylesSelectedOption = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isDisabled ? "#EBEBEB" : "none",
            color: state.isDisabled ? "#888888" : "black",
            // borderColor: state.isDisabled ? "#C4C4C4" : "none"
            borderBottom: "2px solid #F0F0F0",
            "&:hover": {
                backgroundColor: state.isDisabled ? "none" : "#3b8aff" 
            }
        }),
        control: (provided, state) => ({
            ...provided,
            borderRadius: "8px",
            
        })
    }

    const Option = (props) => {
        console.log(props, "props");
        return (
            <div>
                <components.Option {...props}>
                    <label className='d-flex justify-content-between align-items-center'><div>{props.label}</div> <div>{props.isSelected === true ? <img src={ChecklistGreenIcon} alt="checklist" /> : ""}</div></label>
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
        getListTerminalHandler(storeId, 0, activePageListTerminalNonAktif)
    }, [])
    

    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
                {
                    showStatusTambahTerminal && (
                        <div className="align-items-center position-absolute" style={{ marginLeft: "6%" }}>
                            <Toast style={{width: "900px", backgroundColor: "#077E86"}} onClose={() => setShowStatusTambahTerminal(false)} autohide>
                                <Toast.Body  className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span>Terminal berhasil ditambahkan</Toast.Body>
                            </Toast>
                        </div>
                    )
                }

                <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }} onClick={() => history.push("/")}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }} onClick={() => history.push("/daftar-merchant-qris/pengaturan-kasir")}>Pengaturan Kasir</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }} onClick={() => history.push("/daftar-merchant-qris/pengaturan-kasir")}>Daftar Terminal</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>{dataListTerminalAktif.length !== 0 || dataListTerminalNonAktif.length !== 0 ? "Info Terminal" : "Tambah Terminal Manual"}</span></span>
                <div className="head-title"> 
                    {
                        (dataListTerminalAktif.length !== 0 || dataListTerminalNonAktif.length !== 0) ? 
                        <h2 className="h5 mt-4" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Info Terminal</h2> :
                        <h2 className="h5 mt-4" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Tambah Terminal Manual</h2>
                    }
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
                        <Col xs={6} className='sub-title-detail-merchant'>Total Terminal Aktif</Col>
                        <Col xs={6} className='sub-title-detail-merchant'>Total Terminal Nonaktif</Col>
                    </Row>
                    <Row className='mt-1 pb-4'>
                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailTerminal?.active_user}</Col>
                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailTerminal?.inactive_user}</Col>
                    </Row>
                </div>
                {
                    (dataListTerminalAktif.length !== 0 || dataListTerminalNonAktif.length !== 0) ? (
                        <div className='d-flex justify-content-between align-items-center mt-3' style={{ cursor: "pointer" }} onClick={showCheckboxes}>
                            <div style={{ fontFamily: "Exo", fontSize: 15, fontWeight: 600 }}>Tambah Terminal Kasir</div>
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
                    <div className='mt-3' style={{ fontFamily: "Exo", fontSize: 15, fontWeight: 600 }}>Tambah Terminal Kasir</div>

                }
                <div className='sub-title-detail-merchant mt-1'>Terminal yang digunakan untuk transaksi dengan QRIS Ezeelink</div>
                {
                    (dataListTerminalAktif.length !== 0 || dataListTerminalNonAktif.length !== 0) ?
                        expanded && (
                            <>
                                <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Aktifkan Terminal</div>
                                <Form.Check 
                                    type="switch"
                                    id="custom-switch"
                                    checked={
                                        inputStatusTerminal
                                    }
                                    name="active"
                                    className='mt-2'
                                    onChange={() => showModalAddDataTerminal(inputStatusTerminal)}
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
                                        isOptionDisabled={(option) => option.isdisabled}
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
                            </>
                        ) :
                        <>
                            <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Aktifkan Terminal</div>
                            <Form.Check 
                                type="switch"
                                id="custom-switch"
                                checked={
                                    inputStatusTerminal
                                }
                                name="active"
                                className='mt-2'
                                onChange={() => showModalAddDataTerminal(inputStatusTerminal)}
                            />
                            <div className='mt-2'>Terminal Kasir</div>
                            <div className="dropdown dropInfoPemilikBrand mt-2">
                                <ReactSelect
                                    closeMenuOnSelect={true}
                                    hideSelectedOptions={false}
                                    options={dataTerminalByStoreId}
                                    value={selectedDataTerminalByStore}
                                    onChange={(selected) => setSelectedDataTerminalByStore([selected])}
                                    placeholder="Pilih terminal kasir"
                                    components={{ Option }}
                                    styles={customStylesSelectedOption}
                                    isOptionDisabled={(option) => option.isdisabled}
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
                        </>
                }

                {
                    (dataListTerminalAktif.length !== 0 || dataListTerminalNonAktif.length !== 0) ? 
                    <>
                        {
                            expanded &&
                            <button 
                                className={selectedDataTerminalByStore.length !== 0 && pinTerminalKasir.length !== 0 && pinTerminalKasir.length === 6 ? 'btn-ez-transfer mt-4' : 'btn-noez-transfer mt-4'}
                                disabled={selectedDataTerminalByStore.length === 0 || pinTerminalKasir.length === 0 || (pinTerminalKasir.length !== 0 && pinTerminalKasir.length !== 6) }
                                onClick={() => addAndSaveDataTerminalHandler(selectedDataTerminalByStore.length !== 0 ? selectedDataTerminalByStore[0].value : 0, inputStatusTerminal === true ? 1 : 0, pinTerminalKasir)}
                            >
                                Tambah Terminal
                            </button>
                        }
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
                                            onChange={handlePageChangeDataTerminalAktif}
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
                                            onChange={handlePageChangeDataTerminalNonAktif}
                                        />
                                    </div>
                                </>
                            }
                        </div>
                    </>
                        :
                    <button className='btn-ez-transfer mt-4' onClick={() => addAndSaveDataTerminalHandler(selectedDataTerminalByStore.length !== 0 ? selectedDataTerminalByStore[0].value : 0, inputStatusTerminal === true ? 1 : 0, pinTerminalKasir)}>Simpan</button>
                }
            </div>

            <Modal
                size="lg"
                centered
                show={showModalStatusTerminal}
                onHide={() => setShowModalStatusTerminal(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                className='modal-daftar-settlement'
                >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Yakin ingin menonaktifkan terminal?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 15, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-center">Terminal <b>tidak dapat digunakan</b> setelah dinonaktifkan masih ingin melanjutkan ?</p>
                    </div>             
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalStatusTerminal(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Batal</Button>
                        <Button onClick={showModal === "down" ? () => handleChangeStatusInListPaging(0, dataTerminalIdQris) : () => handleChangeStatus()} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Ya</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                centered
                show={showModalStatusTerminalNonAktif}
                onHide={() => setShowModalStatusTerminalNonAktif(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                className='modal-daftar-settlement'
                >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Yakin ingin mengaktifkan terminal?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 15, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-center">tanggal dinonaktifkan <b>{dataLastActive}</b>, masih ingin melanjutkan ?</p>
                    </div>             
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalStatusTerminalNonAktif(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Batal</Button>
                        <Button onClick={showModal === "down" ? () => handleChangeStatusInListPaging(1, dataTerminalIdQris) : () => handleChangeStatus()} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Ya</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default TambahDataTerminalManual