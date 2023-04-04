import { Button, Col, Container, Form, Image, Modal, Row } from '@themesberg/react-bootstrap';
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import { agenLists } from '../../data/tables';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { BaseURL, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import encryptData from '../../function/encryptData';
import axios from 'axios';
import ReactSelect, { components } from 'react-select';
import Pagination from 'react-js-pagination';
import { DateRangePicker } from 'rsuite';
import triangleInfo from "../../assets/icon/triangle-info.svg"

const RiwayatDirectDebit = () => {
    const user_role = getRole()
    const history = useHistory();
    const [dataDirectDebit, setDataDirectDebit] = useState([])
    const [dataListPartner, setDataListPartner] = useState([])
    const [activePageDirectDebit, setActivePageDirectDebit] = useState(1)
    const [totalPageDirectDebit, setTotalPageDirectDebit] = useState(0)
    const [pageNumberDirectDebit, setPageNumberDirectDebit] = useState({})
    const [isFilterDirectDebit, setIsFilterDirectDebit] = useState(false)
    const [showModalDetailDirectDebit, setShowModalDetailDirectDebit] = useState(false)
    const [dateRangeDirectDebit, setDateRangeDirectDebit] = useState([])
    const [showDateDirectDebit, setShowDateDirectDebit] = useState("none")
    const [stateDirectDebit, setStateDirectDebit] = useState(null)
    const [openDetailFee, setOpenDetailFee] = useState(false)

    const [selectedPartnerDirectDebit, setSelectedPartnerDirectDebit] = useState([])
    const [inputHandle, setInputHandle] = useState({
        idTrans: 0,
        partnerTransId : "",
        partnerId: "",
        statusId: [],
        fiturId: 0,
        periode: 0,

    })

    console.log(isFilterDirectDebit, "isFilterDirectDebit");

    const { allowedMaxDays, allowedRange, combine } = DateRangePicker;
    const currentDate = new Date().toISOString().split('T')[0]
    const oneMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate() + 1).toISOString().split('T')[0]
    const threeMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 3, new Date().getDate() + 1).toISOString().split('T')[0]
    const column = [
        {
            label: <><img src={triangleInfo} alt="triangle_info" style={{ marginRight: 3, marginTop: -6 }} /> Range Tanggal maksimal 7 hari dan periode mutasi paling lama 90 hari</>,
            style: {
                color: '#383838',
                width: 'max-content',
                padding: '14px 25px 14px 14px',
                fontSize: 13,
                fontStyle: 'italic',
                textAlign: 'left',
                whiteSpace: 'normal',
                backgroundColor: 'rgba(255, 214, 0, 0.16)',
                opacity: 'unset'
            },
            placement: 'bottom',
            
        },
    ]
    const Locale = {
        sunday: 'Min',
        monday: 'Sen',
        tuesday: 'Sel',
        wednesday: 'Rab',
        thursday: 'Kam',
        friday: 'Jum',
        saturday: 'Sab',
        ok: 'Terapkan',
    };

    const showCheckboxes = () => {
        if (!openDetailFee) {
          setOpenDetailFee(true);
        } else {
          setOpenDetailFee(false);
        }
    };

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    console.log(inputHandle.idTrans, "inputHandle.idTrans" );

    function handlePageChangeRiwayatDirectDebit(page) {
        if (isFilterDirectDebit) {
            console.log("masuk 1");
            setActivePageDirectDebit(page);
            filterListDirectDebit(inputHandle.idTrans, dateRangeDirectDebit, inputHandle.periode, inputHandle.partnerId, inputHandle.partnerTransId, inputHandle.fiturId, inputHandle.statusId, page, 10)
        } else {
            console.log("masuk 2");
            setActivePageDirectDebit(page);
            getDirectDebit(page);
        }
    }

    function handleChangePeriodeDirectDebit(e) {
        if (e.target.value === "7") {
            setShowDateDirectDebit("")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateDirectDebit("none")
            setDateRangeDirectDebit([])
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateDirectDebit(item) {
        setStateDirectDebit(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
            setDateRangeDirectDebit(item)
        }
    }

    async function listPartner() {
        try {
            const auth = 'Bearer ' + getToken();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const listPartner = await axios.post(BaseURL + "/Partner/ListPartner", {data: ""}, {headers: headers})
            if (listPartner.status === 200 && listPartner.data.response_code === 200 && listPartner.data.response_new_token.length === 0) {
                let newArr = []
                listPartner.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.partner_id
                    obj.label = e.nama_perusahaan
                    newArr.push(obj)
                })
                setDataListPartner(newArr)
            } else if (listPartner.status === 200 && listPartner.data.response_code === 200 && listPartner.data.response_new_token.length !== 0) {
                setUserSession(listPartner.data.response_new_token)
                let newArr = []
                listPartner.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.partner_id
                    obj.label = e.nama_perusahaan
                    newArr.push(obj)
                })
                setDataListPartner(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getDirectDebit(currentPage) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"transactionID":0, "date_from":"1900-01-01", "date_to":"9999-01-01", "dateID":1, "partner_id": "", "partner_transid": "", "fitur_id": 0, "statusID":[1,2,7,9], "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataRiwayatDirectDebit = await axios.post(BaseURL + "/Report/GetListTransDirectDebit", { data: dataParams }, { headers: headers })
            if (dataRiwayatDirectDebit.data.response_code === 200 && dataRiwayatDirectDebit.status === 200 && dataRiwayatDirectDebit.data.response_new_token.length === 0) {
                dataRiwayatDirectDebit.data.response_data.results = dataRiwayatDirectDebit.data.response_data.results.map((obj, id) => ({ ...obj, number: (currentPage > 1) ? (id + 1)+((currentPage-1)*10) : id + 1 }));
                setDataDirectDebit(dataRiwayatDirectDebit.data.response_data.results)
                setPageNumberDirectDebit(dataRiwayatDirectDebit.data.response_data)
                setTotalPageDirectDebit(dataRiwayatDirectDebit.data.response_data.max_page)
            } else if (dataRiwayatDirectDebit.data.response_code === 200 && dataRiwayatDirectDebit.status === 200 && dataRiwayatDirectDebit.data.response_new_token.length !== 0) {
                setUserSession(dataRiwayatDirectDebit.data.response_new_token)
                dataRiwayatDirectDebit.data.response_data.results = dataRiwayatDirectDebit.data.response_data.results.map((obj, id) => ({ ...obj, number: (currentPage > 1) ? (id + 1)+((currentPage-1)*10) : id + 1 }));
                setDataDirectDebit(dataRiwayatDirectDebit.data.response_data.results)
                setPageNumberDirectDebit(dataRiwayatDirectDebit.data.response_data)
                setTotalPageDirectDebit(dataRiwayatDirectDebit.data.response_data.max_page)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    async function filterListDirectDebit(idTrans, periode, dateId, partnerId, partnerTransId, fiturId, statusId, page, rowPerPage) {
        try {
            setIsFilterDirectDebit(true)
            setActivePageDirectDebit(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"transactionID": ${idTrans !== 0 ? idTrans : 0}, "date_from":"${periode.length !== 0 ? periode[0] : ""}", "date_to":"${periode.length !== 0 ? periode[1] : ""}", "dateID": ${dateId}, "partner_id": "${partnerId}", "partner_transid": "${partnerTransId}", "fitur_id": ${fiturId}, "statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "page":${(page !== 0) ? page : 1}, "row_per_page": ${rowPerPage !== 0 ? rowPerPage : 10}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataRiwayatDirectDebit = await axios.post(BaseURL + "/Report/GetListTransDirectDebit", { data: dataParams }, { headers: headers })
            if (dataRiwayatDirectDebit.data.response_code === 200 && dataRiwayatDirectDebit.status === 200 && dataRiwayatDirectDebit.data.response_new_token.length === 0) {
                dataRiwayatDirectDebit.data.response_data.results = dataRiwayatDirectDebit.data.response_data.results.map((obj, id) => ({ ...obj, number: (page > 1) ? (id + 1)+((page-1)*10) : id + 1 }));
                setDataDirectDebit(dataRiwayatDirectDebit.data.response_data.results)
                setPageNumberDirectDebit(dataRiwayatDirectDebit.data.response_data)
                setTotalPageDirectDebit(dataRiwayatDirectDebit.data.response_data.max_page)
            } else if (dataRiwayatDirectDebit.data.response_code === 200 && dataRiwayatDirectDebit.status === 200 && dataRiwayatDirectDebit.data.response_new_token.length !== 0) {
                setUserSession(dataRiwayatDirectDebit.data.response_new_token)
                dataRiwayatDirectDebit.data.response_data.results = dataRiwayatDirectDebit.data.response_data.results.map((obj, id) => ({ ...obj, number: (page > 1) ? (id + 1)+((page-1)*10) : id + 1 }));
                setDataDirectDebit(dataRiwayatDirectDebit.data.response_data.results)
                setPageNumberDirectDebit(dataRiwayatDirectDebit.data.response_data)
                setTotalPageDirectDebit(dataRiwayatDirectDebit.data.response_data.max_page)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    function resetButtonDirectDebit(param) {
        if (param === "Direct Debit") {
            setInputHandle({
                ...inputHandle,
                idTrans: 0,
                partnerId: "",
                partnerTransId: "",
                statusId: [],
                periode: 0,
                fiturId: 0
            })
            setSelectedPartnerDirectDebit([])
            setStateDirectDebit(null)
            setDateRangeDirectDebit([])
            setShowDateDirectDebit("none")
        } 
    }

    const columnPartner = [
        {
            name: 'No',
            selector: row => row.id,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.IDAgen
        },
        {
            name: 'Waktu',
            selector: row => row.kodeUnik,
            width: "145px"
        },
        {
            name: 'Nama User',
            selector: row => row.namaAgen,
            width: "160px"
        },
        {
            name: 'No Handphone',
            selector: row => row.noHp,
            width: "170px"
        },
        {
            name: 'Channel Direct Debit',
            selector: row => row.email,
            width: "185px"
        },
        {
            name: 'Nominal Transaksi',
            selector: row => row.noRekening,
            width: "170px"
        },
        {
            name: 'Status',
            selector: row => row.status,
            width: "150px",
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 12px", margin: "6px 0px", width: "50%", borderRadius: 4, fontFamily: "Nunito", fontSize: 14, fontWeight: 600 },
            conditionalCellStyles: [
                {
                    when: row => row.status === "Aktif",
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
                },
                {
                    when: row => row.status === "Tidak Aktif",
                    style: { background: "#FDEAEA", color: "#EE2E2C" }
                }
            ],
        },
    ];

    const columnAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tdirectdebit_id,
            cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => setShowModalDetailDirectDebit(true)}>{row.tdirectdebit_id}</Link>
        },
        {
            name: 'Waktu',
            selector: row => row.tdirectdebit_crtdt_format,
            width: "145px"
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.tdirectdebit_partner_id,
            width: "150px"
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: "180px"
        },
        {
            name: 'Nama User',
            selector: row => row.tdirectdebit_customer_name,
            width: "160px"
        },
        {
            name: 'Channel Direct Debit',
            selector: row => row.mpaytype_name,
            width: "185px"
        },
        {
            name: 'No Handphone',
            selector: row => row.tdirectdebit_mobile_number,
            width: "170px"
        },
        {
            name: 'Nominal Transaksi',
            selector: row => row.tdirectdebit_partner_fee,
            width: "170px"
        },
        {
            name: 'Biaya Admin',
            selector: row => row.tdirectdebit_fee === null ? 0 : row.tdirectdebit_fee,
            width: "170px"
        },
        {
            name: 'Biaya Bank',
            selector: row => row.tdirectdebit_bank_fee,
            width: "170px"
        },
        {
            name: 'Biaya Pajak',
            selector: row => row.tdirectdebit_tax_fee,
            width: "170px"
        },
        {
            name: 'Total Akhir',
            selector: row => row.tdirectdebit_amount,
            width: "170px"
        },
        {
            name: 'Status',
            selector: row => row.mppobstatus_name,
            width: "150px",
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 12px", margin: "6px 0px", width: "50%", borderRadius: 4, fontFamily: "Nunito", fontSize: 14, fontWeight: 600 },
            conditionalCellStyles: [
                {
                    when: row => row.tdirectdebit_ppob_status !== 7,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
                },
                {
                    when: row => row.tdirectdebit_ppob_status === 7,
                    style: { background: "#FDEAEA", color: "#EE2E2C" }
                }
            ],
        },
    ];

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
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'flex-start',
                width: '150px'
            },
        },
    };

    const customStylesSelectedOption = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: "none",
            color: "black"
        })
    }

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
            <div>Loading...</div>
        </div>
    );

    useEffect(() => {
        if (user_role !== "102") {
            listPartner()
            getDirectDebit(activePageDirectDebit)
        }
    }, [])
    

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span' style={{ fontSize: 14 }}>
                <span style={{ cursor: "pointer" }}>
                    {user_role === "102" ? `Laporan` : `Beranda`}
                </span>{" "}
                <img alt="" src={breadcrumbsIcon} /> &nbsp;
                <span style={{ cursor: "pointer" }}>
                    Transaksi
                </span>{" "} &nbsp;
                <img alt="" src={breadcrumbsIcon} /> &nbsp;
                Direct Debit
            </span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Transaksi</h2>
            </div>
            <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>{user_role === "102" ? `Transaksi Direct Debit User` : `Transaksi Direct Debit Partner`}</h2>
            <div className='base-content'>
                <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Filter</span>
                {
                    user_role === "102" ? (
                        <>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Nama User</div>
                                    <input
                                        type="text"
                                        className="input-text-edit"
                                        placeholder="Masukkan Nama User"
                                    />
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Channel</div>
                                    <Form.Select
                                        name="periodePaylink"
                                        className="input-text-ez"
                                    >
                                        <option value={0}>Channel Direct Debit</option>
                                        <option value={2}>One Klik</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>ID Transaksi</div>
                                    <input
                                        type="text"
                                        className="input-text-edit"
                                        placeholder="ID Transaksi"
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Periode</div>
                                    <Form.Select
                                        name="periodePaylink"
                                        className="input-text-ez"
                                    >
                                        <option value={0}>Periode Transaksi</option>
                                        <option value={2}>Hari Ini</option>
                                        <option value={3}>Kemarin</option>
                                        <option value={4}>7 Hari Terakhir</option>
                                        <option value={5}>Bulan Ini</option>
                                        <option value={6}>Bulan Kemarin</option>
                                        <option value={7}>Pilih Range Tanggal</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Status</div>
                                    <Form.Select name="statusDanaMasuk" className='input-text-ez' style={{ display: "inline" }}>
                                    <option defaultChecked value="">Status Transaksi</option>
                                    <option value={2}>Berhasil</option>
                                    <option value={1}>Dalam Proses</option>
                                    <option value={7}>Menunggu Pembayaran</option>
                                    <option value={9}>Kadaluwarsa</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} style={{ width: "unset", padding: "8px 16px" }}>
                                    <button className='btn-ez-on'>
                                        Terapkan
                                    </button>
                                </Col>
                                <Col xs={6} style={{ width: "unset", padding: "8px 16px" }}>
                                    <button className='btn-reset'>
                                        Atur Ulang
                                    </button>
                                </Col>
                            </Row>
                            <div className='mt-3 mb-5'>
                                <Link to={"#"} className='export-span' style={{ textDecoration: "underline", color: "#077E86" }} >Export</Link>
                            </div>
                            <div className="div-table mt-3">
                                <DataTable
                                    columns={columnPartner}
                                    data={agenLists}
                                    customStyles={customStyles}
                                    // pagination
                                    highlightOnHover
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Nama Partner</div>
                                    <div className="dropdown dropDirectDebit">
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataListPartner}
                                            value={selectedPartnerDirectDebit}
                                            onChange={(selected) => setSelectedPartnerDirectDebit([selected])}
                                            placeholder="Pilih Nama Partner"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Nama User</div>
                                    <input
                                        type="text"
                                        className="input-text-edit"
                                        placeholder="Masukkan Nama User"
                                        name='partnerId'
                                        value={inputHandle.partnerId}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>ID Transaksi</div>
                                    <input
                                        type="text"
                                        className="input-text-edit"
                                        placeholder="ID Transaksi"
                                        name="idTrans"
                                        value={inputHandle.idTrans === 0 ? "" : inputHandle.idTrans}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Partner Trans ID</div>
                                    <input
                                        type="text"
                                        className="input-text-edit"
                                        placeholder="Masukkan Partner Trans ID"
                                        name='partnerTransId'
                                        value={inputHandle.partnerTransId}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Channel</div>
                                    <Form.Select
                                        name="fiturId"
                                        value={inputHandle.fiturId}
                                        onChange={(e) => handleChange(e)}
                                        className="input-text-ez"
                                    >
                                        <option value={0}>Channel Direct Debit</option>
                                        <option value={2}>One Klik</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Periode</div>
                                    <Form.Select
                                        name="periode"
                                        className="input-text-ez"
                                        value={inputHandle.periode}
                                        onChange={(e) => handleChangePeriodeDirectDebit(e)}
                                    >
                                        <option defaultChecked disabled value={0}>Periode Transaksi</option>
                                        <option value={2}>Hari Ini</option>
                                        <option value={3}>Kemarin</option>
                                        <option value={4}>7 Hari Terakhir</option>
                                        <option value={5}>Bulan Ini</option>
                                        <option value={6}>Bulan Kemarin</option>
                                        <option value={7}>Pilih Range Tanggal</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Status</div>
                                    <Form.Select name="statusId" value={inputHandle.statusId} className='input-text-ez' onChange={(e) => handleChange(e)} style={{ display: "inline" }}>
                                        <option defaultChecked value="">Status Transaksi</option>
                                        <option value={2}>Berhasil</option>
                                        <option value={1}>Dalam Proses</option>
                                        <option value={7}>Menunggu Pembayaran</option>
                                        <option value={9}>Kadaluwarsa</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4}></Col>
                                <Col xs={4}>
                                    <div style={{ display: showDateDirectDebit }}>
                                        <DateRangePicker
                                            onChange={(e) => pickDateDirectDebit(e)}
                                            ranges={column}
                                            value={stateDirectDebit}
                                            clearIcon={null}
                                            character=' - '
                                            cleanable={true}
                                            placement='bottomEnd'
                                            size='lg'
                                            placeholder="Select Date Range" 
                                            disabledDate={combine(allowedMaxDays(7), allowedRange(threeMonthAgo, currentDate))}
                                            className='datePicker'
                                            locale={Locale}
                                            format="yyyy-MM-dd"
                                            defaultCalendarValue={[new Date(`${oneMonthAgo}`), new Date(`${currentDate}`)]}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} style={{ width: "unset", padding: "8px 16px" }}>
                                    <button 
                                        onClick={() => filterListDirectDebit(inputHandle.idTrans, dateRangeDirectDebit, inputHandle.periode, selectedPartnerDirectDebit.length !== 0 ? selectedPartnerDirectDebit[0].value : "", inputHandle.partnerTransId, inputHandle.fiturId, inputHandle.statusId, 1, 10)}
                                        className={(inputHandle.periode !== 0 || dateRangeDirectDebit.length !== 0 || dateRangeDirectDebit.length !== 0 && Number(inputHandle.idTrans) !== 0 || dateRangeDirectDebit.length !== 0 && inputHandle.partnerTransId.length !== 0 || dateRangeDirectDebit.length !== 0 && inputHandle.statusId.length !== 0 || dateRangeDirectDebit.length !== 0 && selectedPartnerDirectDebit.length !== 0 || dateRangeDirectDebit.length !== 0 && inputHandle.fiturId !== 0) ? 'btn-ez-on' : 'btn-ez'} 
                                        disabled={inputHandle.periode === 0 || inputHandle.periode === 0 && Number(inputHandle.idTrans) === 0 || inputHandle.periode === 0 && inputHandle.partnerTransId.length === 0 || inputHandle.periode === 0 && inputHandle.statusId.length === 0 || inputHandle.periode === 0 && selectedPartnerDirectDebit.length === 0 || inputHandle.periode === 0 && inputHandle.fiturId === 0}
                                    >
                                        Terapkan
                                    </button>
                                </Col>
                                <Col xs={6} style={{ width: "unset", padding: "8px 16px" }}>
                                    <button 
                                        onClick={() => resetButtonDirectDebit("Direct Debit")}
                                        className={(inputHandle.periode !== 0 || dateRangeDirectDebit.length !== 0 || dateRangeDirectDebit.length !== 0 && Number(inputHandle.idTrans) !== 0 || dateRangeDirectDebit.length !== 0 && inputHandle.partnerTransId.length !== 0 || dateRangeDirectDebit.length !== 0 && inputHandle.statusId.length !== 0 || dateRangeDirectDebit.length !== 0 && selectedPartnerDirectDebit.length !== 0 || dateRangeDirectDebit.length !== 0 && inputHandle.fiturId !== 0) ? 'btn-reset'  : 'btn-ez-reset'} 
                                        disabled={inputHandle.periode === 0 || inputHandle.periode === 0 && Number(inputHandle.idTrans) === 0 || inputHandle.periode === 0 && inputHandle.partnerTransId.length === 0 || inputHandle.periode === 0 && inputHandle.statusId.length === 0 || inputHandle.periode === 0 && selectedPartnerDirectDebit.length === 0 || inputHandle.periode === 0 && inputHandle.fiturId === 0}
                                    >
                                        Atur Ulang
                                    </button>
                                </Col>
                            </Row>
                            <div className='mt-3 mb-5'>
                                <Link to={"#"} className='export-span' style={{ textDecoration: "underline", color: "#077E86" }} >Export</Link>
                            </div>
                            <div className="div-table mt-3">
                                <DataTable
                                    columns={columnAdmin}
                                    data={dataDirectDebit}
                                    customStyles={customStyles}
                                    highlightOnHover
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <div
                                className='mt-3'
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginTop: -15,
                                    paddingTop: 12,
                                    borderTop: "groove",
                                }}
                            >
                                <div style={{ marginRight: 10, marginTop: 10 }}>
                                    Total Page: {totalPageDirectDebit}
                                </div>
                                <Pagination
                                    activePage={activePageDirectDebit}
                                    itemsCountPerPage={pageNumberDirectDebit.row_per_page}
                                    totalItemsCount={
                                        pageNumberDirectDebit.row_per_page * pageNumberDirectDebit.max_page
                                    }
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeRiwayatDirectDebit}
                                />
                            </div>
                            <Modal centered show={showModalDetailDirectDebit} onHide={() => setShowModalDetailDirectDebit(false)} style={{ borderRadius: 8 }}>
                                <Modal.Body style={{ maxWidth: 468, width: "100%", padding: "0px 24px" }}>
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                                        <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }}>Detail Transaksi</p>
                                    </div>
                                    <div>
                                        <Container style={{ paddingLeft: "unset", paddingRight: "unset" }}>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400 }}>
                                                <Col>ID Transaksi</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>Status</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>
                                                <Col>123456</Col>
                                                <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 4, maxWidth: 175, width: "100%", height: 32, fontWeight: 400,
                                                    background: "rgba(7, 126, 134, 0.08)",
                                                    color: "#077E86" }}
                                                >
                                                    Berhasil
                                                </Col>
                                                <br />
                                            </Row>
                                            <div style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: -10 }}>18:13, 18/18/2022</div>
                                            <center>
                                                <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
                                            </center>
                                            <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, }}>Detail Pengiriman</div>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: 12 }}>
                                                <Col>Nama User</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>No Handphone User</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>
                                                <Col>Agung Wirawan</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>+62 878 9230 0922</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: 12 }}>
                                                <Col>Nama Partner</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>ID Partner</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>
                                                <Col>PT ABCDE</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>12333</Col>
                                            </Row>
                                            <center>
                                                <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
                                            </center>
                                            <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, }}>Rincian Dana</div>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                                <Col style={{ fontWeight: 400 }}>Nominal Transaksi</Col>
                                                <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>Rp 12.000.000</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                                <Col style={{ fontWeight: 400 }}>Channel Direct Debit</Col>
                                                <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>Rp 2.770</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                                <Col style={{ fontWeight: 400 }}>Total Biaya</Col>
                                                <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>
                                                    {
                                                        openDetailFee ? (
                                                            <div className='d-flex justify-content-center align-items-center' onClick={showCheckboxes} style={{ cursor: "pointer" }}>
                                                                <div>Rp 5.000</div>
                                                                <FontAwesomeIcon icon={faChevronUp} className="mx-2" />
                                                            </div>
                                                        ) : (
                                                            <div className='d-flex justify-content-center align-items-center' onClick={showCheckboxes} style={{ cursor: "pointer" }}>
                                                                <div>Rp 5.000</div>
                                                                <FontAwesomeIcon icon={faChevronDown} className="mx-2" />
                                                            </div>
                                                        )
                                                    }
                                                </Col>
                                            </Row>
                                            {
                                                openDetailFee && (
                                                    <div style={{ background: "rgba(196, 196, 196, 0.12)", borderRadius: 4, padding: 8 }} className='mt-2'>
                                                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                                            <Col style={{ fontWeight: 400 }}>Biaya Admin</Col>
                                                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>Rp 2.000</Col>
                                                        </Row>
                                                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                                            <Col style={{ fontWeight: 400 }}>Biaya Bank</Col>
                                                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>Rp 3.000</Col>
                                                        </Row>
                                                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                                            <Col style={{ fontWeight: 400 }}>Biaya Pajak</Col>
                                                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>Rp 0</Col>
                                                        </Row>
                                                    </div>
                                                )
                                            }
                                            <center>
                                                <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, padding: "0px 24px", border: "1px dashed #EBEBEB" }} />
                                            </center>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 700, marginTop: 12 }}>
                                                <Col>Total</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>Rp 12.0270.000</Col>
                                            </Row>
                                        </Container>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                                        <Button variant="primary" onClick={() => setShowModalDetailDirectDebit(false)} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Kembali</Button>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default RiwayatDirectDebit