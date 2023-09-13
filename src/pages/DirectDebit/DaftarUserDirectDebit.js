import { Button, Col, Form, Image, Modal, Row } from '@themesberg/react-bootstrap'
import React, { useCallback } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import noteIconGrey from "../../assets/icon/note_icon_grey.svg"
import copy from "../../assets/icon/iconcopy_icon.svg"
import DataTable from 'react-data-table-component'
import CopyToClipboard from "react-copy-to-clipboard";
import { BaseURL, errorCatch, getRole, getToken, replaceText, setUserSession } from '../../function/helpers'
import axios from 'axios'
import ReactSelect, { components } from 'react-select';
import encryptData from '../../function/encryptData'
import Pagination from 'react-js-pagination'
import check from "../../assets/icon/checklistpayment_icon.svg";
import { ind } from '../../components/Language'

function DaftarUserDirectDebit() {

    const user_role = getRole()
    const access_token = getToken()
    const [daftarUserDirectDebit, setDaftarUserDirectDebit] = useState([])
    const [channelDirectDebit, setChannelDirectDebit] = useState(0)
    const [statusDirectDebit, setStatusDirectDebit] = useState(0)
    const [showModalDaftarDirectDebit, setShowModalDaftarDirectDebit] = useState(false)
    const [selectedNamaPartnerDirectDebit, setSelectedNamaPartnerDirectDebit] = useState([])
    const [selectedNamaUserDirectDebit, setSelectedNamaUserDirectDebit] = useState([])
    const [activePageDaftarDirectDebit, setActivePageDaftarDirectDebit] = useState(1)
    const [totalPageDaftarDirectDebit, setTotalPageDaftarDirectDebit] = useState(0)
    const [pageNumberDaftarDirectDebit, setpageNumberDaftarDirectDebit] = useState({})
    const [isFilterDaftarDirectDebit, setIsFilterDaftarDirectDebit] = useState(false)

    const history = useHistory();
    const [dataListPartner, setDataListPartner] = useState([])
    const [dataListUser, setDataListUser] = useState([])
    const [partnerId, setPartnerId] = useState("")
    const [dataDetailUser, setDataDetailUser] = useState({})
    const [copied, setCopied] = useState(false)
    const [save, setSave] = useState(false)

    function getDetailIdUserDirectDebit (number) {
        const findData = daftarUserDirectDebit.find((item) => item.number === number)
        setDataDetailUser(findData)
        setShowModalDaftarDirectDebit(true)
    }

    function toDashboard() {
        history.push("/");
    }

    function toLaporan() {
        history.push("/Riwayat Transaksi/va-dan-paylink");
    }

    const columnsAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
        },
        {
            name: 'ID User',
            selector: row => row.mdirdebituser_partner_id,
            width: "130px",
            cell: (row) => <Link style={{ textDecoration: "unset", color: "#077E86" }} onClick={() => getDetailIdUserDirectDebit(row.number)}>{row.mdirdebituser_partner_id}</Link>
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: "150px",
            wrap: true,
        },
        {
            name: 'Nama User',
            selector: row => row.mdirdebituser_fullname,
            width: "150px",
        },
        {
            name: 'No Handphone',
            selector: row => row.mdirdebituser_mobile,
            width: "150px",
        },
        {
            name: 'Channel Direct Debit',
            selector: row => replaceText(row.mpaytype_name),
            width: "200px",
        },
        {
            name: 'Status',
            selector: row => row.mdirdebituser_is_active,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", fontSize: 14, fontFamily: "Nunito Sans", fontWeight: 600, alignItem: "center", padding: "6px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.mdirdebituser_is_active === "Aktif",
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
                },
                {
                    when: row => row.mdirdebituser_is_active !== "Aktif",
                    style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
                }
            ],
        },
    ];

    const columnsPartner = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
        },
        {
            name: 'ID User',
            selector: row => row.mdirdebituser_partner_id,
            width: "160px",
            cell: (row) => <Link style={{ textDecoration: "unset", color: "#077E86" }} onClick={() => getDetailIdUserDirectDebit(row.number)}>{row.mdirdebituser_partner_id}</Link>
        },
        {
            name: 'Nama User',
            selector: row => row.mdirdebituser_fullname,
            width: "170px",
        },
        {
            name: 'No Handphone',
            selector: row => row.mdirdebituser_mobile,
            width: "170px",
        },
        {
            name: 'Channel Direct Debit',
            selector: row => replaceText(row.mpaytype_name),
            width: "220px",
        },
        {
            name: 'Status',
            selector: row => row.mdirdebituser_is_active,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", fontSize: 14, fontFamily: "Nunito Sans", fontWeight: 600, alignItem: "center", padding: "6px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.mdirdebituser_is_active === "Aktif",
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
                },
                {
                    when: row => row.mdirdebituser_is_active !== "Aktif",
                    style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
                }
            ],
        },
    ];

    async function userDetails() {
        try {
          const auth = "Bearer " + getToken()
          const headers = {
              'Content-Type':'application/json',
              'Authorization' : auth
          }
          const userDetail = await axios.post(BaseURL + "/Account/GetUserProfile", { data: "" }, { headers: headers })
          // console.log(userDetail, 'ini user detal funct');
          if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length === 0) {
            setPartnerId(userDetail.data.response_data.muser_partnerdtl_id)
            getDaftarUserDirectDebit(activePageDaftarDirectDebit, userDetail.data.response_data.muser_partnerdtl_id)
          } else if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length !== 0) {
            setUserSession(userDetail.data.response_new_token)
            setPartnerId(userDetail.data.response_data.muser_partnerdtl_id)
            getDaftarUserDirectDebit(activePageDaftarDirectDebit, userDetail.data.response_data.muser_partnerdtl_id)
          }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
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

    async function listUser() {
        try {
          const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"partner_id": "", "mobile_number":""}`)
            const headers = {
              'Content-Type':'application/json',
              'Authorization' : auth
          }
          const dataUser = await axios.post(BaseURL + "/Home/GetAllDirectDebitUser", { data: dataParams }, { headers: headers })
        //   console.log(dataUser, 'ini user detal funct');
          if (dataUser.status === 200 && dataUser.data.response_code === 200 && dataUser.data.response_new_token.length === 0) {
            let newDataUser = []
            dataUser.data.response_data.results.forEach(e => {
                let obj = {}
                obj.value = e.mdirdebituser_mobile
                obj.label = e.mdirdebituser_fullname
                newDataUser.push(obj)
            })
            setDataListUser(newDataUser)
          } else if (dataUser.status === 200 && dataUser.data.response_code === 200 && dataUser.data.response_new_token.length !== 0) {
            setUserSession(dataUser.data.response_new_token)
            let newDataUser = []
            dataUser.data.response_data.results.forEach(e => {
                let obj = {}
                obj.value = e.mdirdebituser_mobile
                obj.label = e.mdirdebituser_fullname
                newDataUser.push(obj)
            })
            setDataListUser(newDataUser)
          }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }
    const language = JSON.parse(sessionStorage.getItem('lang'))

    async function getDaftarUserDirectDebit(currentPage, languages) {
        try {
            const auth = "Bearer " + getToken();
            const dataParams = encryptData(`{"paytype_id": 0, "partner_id":"", "mobile_number": "", "statusID": 0, "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                'Accept-Language' : languages,
            }
            const dataUserDirectDebit = await axios.post(BaseURL + "/Home/GetListDirectDebitUser", { data: dataParams }, { headers: headers })
            // console.log(dataUserDirectDebit, 'ini user detal funct');
            if (dataUserDirectDebit.status === 200 && dataUserDirectDebit.data.response_code === 200 && dataUserDirectDebit.data.response_new_token.length === 0) {
                dataUserDirectDebit.data.response_data.results = dataUserDirectDebit.data.response_data.results.map((obj, id) => ({ ...obj, number: (currentPage > 1) ? (id + 1)+((currentPage-1)*10) : id + 1}))
                setDaftarUserDirectDebit(dataUserDirectDebit.data.response_data.results)
                setpageNumberDaftarDirectDebit(dataUserDirectDebit.data.response_data)
                setTotalPageDaftarDirectDebit(dataUserDirectDebit.data.response_data.max_page)
            } else if (dataUserDirectDebit.status === 200 && dataUserDirectDebit.data.response_code === 200 && dataUserDirectDebit.data.response_new_token.length !== 0) {
                setUserSession(dataUserDirectDebit.data.response_new_token)
                dataUserDirectDebit.data.response_data.results = dataUserDirectDebit.data.response_data.results.map((obj, id) => ({ ...obj, number: (currentPage > 1) ? (id + 1)+((currentPage-1)*10) : id + 1}))
                setDaftarUserDirectDebit(dataUserDirectDebit.data.response_data.results)
                setpageNumberDaftarDirectDebit(dataUserDirectDebit.data.response_data)
                setTotalPageDaftarDirectDebit(dataUserDirectDebit.data.response_data.max_page)
            }
        } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

    async function filterDaftarUserDirectDebit(typeId, partnerId, userNumber, statusId, page, rowPerPage) {
        try {
            setIsFilterDaftarDirectDebit(true)
            setActivePageDaftarDirectDebit(page)
            const auth = "Bearer " + getToken()
                const dataParams = encryptData(`{"paytype_id": ${typeId}, "partner_id": "${partnerId.length !== 0 ? partnerId : ""}", "mobile_number": "${userNumber}", "statusID": ${statusId}, "page": ${(page < 1) ? 1 : page}, "row_per_page": ${rowPerPage !== 0 ? rowPerPage : 10}}`)
                const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataUserDirectDebit = await axios.post(BaseURL + "/Home/GetListDirectDebitUser", { data: dataParams }, { headers: headers })
            // console.log(dataUserDirectDebit, 'ini user detal funct');
            if (dataUserDirectDebit.status === 200 && dataUserDirectDebit.data.response_code === 200 && dataUserDirectDebit.data.response_new_token.length === 0) {
                dataUserDirectDebit.data.response_data.results = dataUserDirectDebit.data.response_data.results.map((obj, id) => ({ ...obj, number: (page > 1) ? (id + 1)+((page-1)*10) : id + 1}))
                setDaftarUserDirectDebit(dataUserDirectDebit.data.response_data.results)
                setpageNumberDaftarDirectDebit(dataUserDirectDebit.data.response_data)
                setTotalPageDaftarDirectDebit(dataUserDirectDebit.data.response_data.max_page)
            } else if (dataUserDirectDebit.status === 200 && dataUserDirectDebit.data.response_code === 200 && dataUserDirectDebit.data.response_new_token.length !== 0) {
                setUserSession(dataUserDirectDebit.data.response_new_token)
                dataUserDirectDebit.data.response_data.results = dataUserDirectDebit.data.response_data.results.map((obj, id) => ({ ...obj, number: (page > 1) ? (id + 1)+((page-1)*10) : id + 1}))
                setDaftarUserDirectDebit(dataUserDirectDebit.data.response_data.results)
                setpageNumberDaftarDirectDebit(dataUserDirectDebit.data.response_data)
                setTotalPageDaftarDirectDebit(dataUserDirectDebit.data.response_data.max_page)
            }
        } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

    function resetButtonUserDirectDebit () {
        getDaftarUserDirectDebit(activePageDaftarDirectDebit)
        setChannelDirectDebit(0)
        setStatusDirectDebit(0)
        setSelectedNamaPartnerDirectDebit([])
        setSelectedNamaUserDirectDebit([])
    }

    function handlePageChangeDaftarUserDirectDebit(page) {
        if (isFilterDaftarDirectDebit) {
            setActivePageDaftarDirectDebit(page);
            filterDaftarUserDirectDebit(channelDirectDebit, user_role === "102" ? partnerId : (selectedNamaPartnerDirectDebit.length !== 0 ? selectedNamaPartnerDirectDebit[0].value : ""), selectedNamaUserDirectDebit.length !== 0 ? selectedNamaUserDirectDebit[0].value : "", statusDirectDebit, 1, 10)
        } else {
            setActivePageDaftarDirectDebit(page);
            getDaftarUserDirectDebit(page);
        }
    }

    const onCopy = React.useCallback(() => {
        setCopied(true);
    }, [])

    const onClick = useCallback(({target: {innerText}}) => {
        // console.log(`Clicked on "${innerText}"!`);
        setSave(true)
    }, [])

    const closeModal = () => {
        setShowModalDaftarDirectDebit(false);
        setSave(false);
      };

    const customStylesSelectedOption = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: "none",
            color: "black"
        })
    }

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: '600',
                fontSize: '14px',
                fontFamily: "Exo",
                display: 'flex',
                justifyContent: 'flex-start',
                width: '150px'
            },
        },
    };

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
        </div>
    );

    console.log(language, "language");

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        getDaftarUserDirectDebit(activePageDaftarDirectDebit, "EN")
        listUser()
        if (user_role !== "102") {
            listPartner()
        } else {
            userDetails()
        }
    }, [])
    

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'>{user_role === "102" ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> Laporan</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda </span>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Daftar User Direct Debit</span>
            <div className='head-title'>
                <h2 className="h5 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Daftar User Direct Debit</h2>
            </div>
            <div className='main-content'>
                <div className='base-content mt-3 mb-4'>
                    <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                    <Row className='mt-4'>
                        {
                            user_role !== "102" ? (
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span className='me-4'>Nama Partner</span>
                                    <div className="dropdown dropSaldoPartner">
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataListPartner}
                                            value={selectedNamaPartnerDirectDebit}
                                            onChange={(selected) => setSelectedNamaPartnerDirectDebit([selected])}
                                            placeholder="Pilih Nama Partner"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                        />
                                    </div>
                                </Col>
                            ) : ""
                        }
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span className='me-5'>Nama User</span>
                            <div className="dropdown dropSaldoPartner">
                                <ReactSelect
                                    closeMenuOnSelect={true}
                                    hideSelectedOptions={false}
                                    options={dataListUser}
                                    value={selectedNamaUserDirectDebit}
                                    onChange={(selected) => setSelectedNamaUserDirectDebit([selected])}
                                    placeholder="Pilih Nama User"
                                    components={{ Option }}
                                    styles={customStylesSelectedOption}
                                />
                            </div>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span className='me-3'>Channel</span>
                            <Form.Select name="channelDirectDebit" className='input-text-riwayat ms-5' style={{ display: "inline" }} value={channelDirectDebit} onChange={(e) => setChannelDirectDebit(e.target.value)}>
                                <option defaultChecked disabled value={0}>Channel Direct Debit</option>
                                <option value={36}>OneKlik</option>
                                <option value={37}>Mandiri</option>
                            </Form.Select>
                        </Col>
                        <Col xs={4} className={user_role === "102" ? "d-flex justify-content-start align-items-center" : "d-flex justify-content-start align-items-center mt-4"}>
                            <span className='me-4'>Status</span>
                            <Form.Select name="statusDirectDebit" className='input-text-riwayat ms-5' style={{ display: "inline" }} value={statusDirectDebit} onChange={(e) => setStatusDirectDebit(e.target.value)}>
                                <option defaultChecked disabled value={0}>Pilih Status</option>
                                <option value={1}>Aktif</option>
                                <option value={2}>Tidak Aktif</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={5}>
                            <Row>
                                <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                    <button
                                        onClick={() => filterDaftarUserDirectDebit(channelDirectDebit, user_role === "102" ? partnerId : (selectedNamaPartnerDirectDebit.length !== 0 ? selectedNamaPartnerDirectDebit[0].value : ""), selectedNamaUserDirectDebit.length !== 0 ? selectedNamaUserDirectDebit[0].value : "", statusDirectDebit, 1, 10)}
                                        className={(channelDirectDebit !== 0 || selectedNamaPartnerDirectDebit.length !== 0 || selectedNamaUserDirectDebit.length !== 0 || statusDirectDebit !== 0) ? 'btn-ez-on' : 'btn-ez'}
                                        disabled={channelDirectDebit === 0 && selectedNamaPartnerDirectDebit.length === 0 && selectedNamaUserDirectDebit.length === 0 && statusDirectDebit === 0}
                                    >
                                        Terapkan
                                    </button>
                                </Col>
                                <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                    <button
                                        onClick={() => resetButtonUserDirectDebit()}
                                        className={(channelDirectDebit !== 0 || selectedNamaPartnerDirectDebit.length !== 0 || selectedNamaUserDirectDebit.length !== 0 || statusDirectDebit !== 0) ? 'btn-reset' : "btn-ez-reset"}
                                        disabled={channelDirectDebit === 0 && selectedNamaPartnerDirectDebit.length === 0 && selectedNamaUserDirectDebit.length === 0 && statusDirectDebit === 0}
                                    >
                                        Atur Ulang
                                    </button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <div className="div-table mt-4 pb-4">
                        <DataTable
                            columns={user_role !== "102" ? columnsAdmin : columnsPartner}
                            data={daftarUserDirectDebit}
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
                            Total Page: {totalPageDaftarDirectDebit}
                        </div>
                        <Pagination
                            activePage={activePageDaftarDirectDebit}
                            itemsCountPerPage={pageNumberDaftarDirectDebit.row_per_page}
                            totalItemsCount={
                                pageNumberDaftarDirectDebit.row_per_page * pageNumberDaftarDirectDebit.max_page
                            }
                            pageRangeDisplayed={5}
                            itemClass="page-item"
                            linkClass="page-link"
                            onChange={handlePageChangeDaftarUserDirectDebit}
                        />
                    </div>
                </div>
            </div>
            <Modal centered show={showModalDaftarDirectDebit} onHide={() => closeModal()} style={{ borderRadius: 8 }}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => closeModal()}
                    />
                </Modal.Header>
                <Modal.Title className="mt-1 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                    Detail ID User
                </Modal.Title>
                <center>
                    <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
                </center>
                <Modal.Body className='mt-2' style={{ maxWidth: 468, width: "100%", padding: "0px 24px" }}>
                    <div className='d-flex justify-content-center align-items-center py-2 px-3' style={{ background: "rgba(255, 214, 0, 0.16)", borderRadius: 4, color: "#383838", fontFamily: "Nunito", fontSize: 14 }}>
                        <img src={noteIconGrey} alt="icon grey" />
                        <div className='ms-2' style={{ fontStyle: "italic" }}>
                            ID User adalah kode unik yang didapat dari Bank berupa kombinasi angka dan alphanumerik serta tidak dapat diubah oleh admin
                        </div>
                    </div>
                    <div className='text-justify p-3 mt-4' style={{ background: "#F0F0F0", borderRadius: 8, border: "1.4px solid #C4C4C4", color: "#383838", fontFamily: "Nunito", fontSize: 14, wordWrap: "break-word" }}>
                        {dataDetailUser.mdirdebituser_ref_id}
                    </div>
                    {
                        save ? (
                            <div className='mt-4 pb-2' style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                                <Button className='d-flex justify-content-center align-items-center' variant="primary" style={{ cursor: "unset", fontFamily: "Exo", color: "#FFFFFF", background: "#492E20", maxHeight: 45, width: "100%", height: "100%" }}>
                                    <img src={check} alt="copy" />
                                    <div className='ms-2'>ID Tersalin</div>
                                </Button>
                            </div>
                        ) : (
                            <div className='mt-4 pb-2' style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                                <CopyToClipboard onCopy={onCopy} text={dataDetailUser.mdirdebituser_ref_id}>
                                    <Button className='d-flex justify-content-center align-items-center' variant="primary" onClick={onClick} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxHeight: 45, width: "100%", height: "100%" }}>
                                        <img src={copy} alt="copy" />
                                        <div className='ms-2'>Salin ID</div>
                                    </Button>
                                </CopyToClipboard>
                            </div>
                        )
                    }
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DaftarUserDirectDebit