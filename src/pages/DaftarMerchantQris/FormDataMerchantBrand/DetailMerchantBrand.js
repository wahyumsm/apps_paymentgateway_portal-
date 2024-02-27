import React, { useEffect, useMemo, useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import noteInfo from "../../../assets/icon/alert_icon_yellow.svg"
import { Button, Col, Image, Modal, OverlayTrigger, Row, Tooltip } from '@themesberg/react-bootstrap';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { agenLists } from '../../../data/tables';
import { FilterComponentQrisOutletDetail } from '../../../components/FilterComponentQris';
import loadingEzeelink from "../../../assets/img/technologies/Double Ring-1s-303px.svg"
import { useHistory, useParams } from 'react-router-dom';
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import ReactSelect, { components } from 'react-select';
import Pagination from 'react-js-pagination';

const DetailMerchantBrand = () => {
    const history = useHistory()
    const { profileId } = useParams()
    const [showModalTambahOutletDetail, setShowModalTambahOutletDetail] = useState(false)
    const [dataDetailBrand, setDataDetailBrand] = useState({})
    const [getDataBank, setGetDataBank] = useState([])
    const [selectedDataBank, setSelectedDataBank] = useState([])
    const [getDataKategoriUsaha, setgetDataKategoriUsaha] = useState([])
    const [selectedDataKategoriUsaha, setSelectedDataKategoriUsaha] = useState([])
    const [dataKodePos, setDataKodePos] = useState({})
    const [inputHandle, setInputHandle] = useState({
        namaKepalaOutlet: "",
        nikKepalaOutlet: "",
        email: "",
        namaBrand: "",
        cabang: "",
        namaYangDicetakQris: "",
        alamat: "",
        kodePos: "",
        nomorRek: "",
        namaPemiliRek: ""
    })

    function handleChange (e) {
        if (e.target.name === "nikKepalaOutlet") {
            if (e.target.value.length > 16) {
                setInputHandle({
                    ...inputHandle,
                    [e.target.name]: (e.target.value).slice(0,16)
                })
            } else {
                setInputHandle({
                    ...inputHandle,
                    [e.target.name]: e.target.value
                })
            }
        } else if (e.target.name === "namaYangDicetakQris") {
            if (e.target.value.length > 25) {
                setInputHandle({
                    ...inputHandle,
                    [e.target.name]: (e.target.value).slice(0,25)
                })
            } else {
                setInputHandle({
                    ...inputHandle,
                    [e.target.name]: e.target.value
                })
            }
        } else if (e.target.name === "kodePos") {
            if (e.target.value.length > 5) {
                getDataPostalCodeHandler((e.target.value).slice(0,5))
                setInputHandle({
                    ...inputHandle,
                    [e.target.name]: (e.target.value).slice(0,5)
                })
            } else {
                getDataPostalCodeHandler(e.target.value)
                setInputHandle({
                    ...inputHandle,
                    [e.target.name]: e.target.value
                })
            }
        } else {
            setInputHandle({
                ...inputHandle,
                [e.target.name]: e.target.value
            })
        }
    }

    function getPageRegisterQris (id, settleId, merchantNou, userNou, statusId) {
        if (statusId === 106 || statusId === 107) {
            history.push(`/form-info-rekening-outlet/${settleId}/${merchantNou}/${userNou}/${id}`)
        } else {
            history.push(`/detail-merchant-outlet/${id}`)
        }
    }

    async function getDataPostalCodeHandler(postalCode) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"postal_code": "${postalCode}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/OnboardingGetPostalCodeDetail", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token.length === 0) {
                if (getData.data.response_data.results === null) {
                    setDataKodePos({})
                } else {
                    setDataKodePos(getData.data.response_data.results)
                }
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token.length !== 0) {
                setUserSession(getData.data.response_new_token)
                if (getData.data.response_data.results === null) {
                    setDataKodePos({})
                } else {
                    setDataKodePos(getData.data.response_data.results)
                }
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getBankListHandler() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetBankList", { data: "" }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mbank_id
                    obj.label = e.mbank_name
                    newArr.push(obj)
                })
                setGetDataBank(newArr)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mbank_id
                    obj.label = e.mbank_name
                    newArr.push(obj)
                })
                setGetDataBank(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getDataKategoriUsahaHnadler(businessCategory) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"business_category": ${businessCategory}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetListBusinessCategory", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token.length === 0) {
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mbuscat_id
                    obj.label = e.mbuscat_name
                    newArr.push(obj)
                })
                setgetDataKategoriUsaha(newArr)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token.length !== 0) {
                setUserSession(getData.data.response_new_token)
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mbuscat_id
                    obj.label = e.mbuscat_name
                    newArr.push(obj)
                })
                setgetDataKategoriUsaha(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getListDataDetailBrandQrisHandler(profileId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"profile_id": ${profileId}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const datamerchantGrup = await axios.post(BaseURL + "/QRIS/OnboardingGetProfileOutlet", { data: dataParams }, { headers: headers })
            // console.log(datamerchantGrup, 'ini user detal funct');
            if (datamerchantGrup.status === 200 && datamerchantGrup.data.response_code === 200 && datamerchantGrup.data.response_new_token.length === 0) {
                setDataDetailBrand(datamerchantGrup.data.response_data.results)
                getListDataOutletQrisHandler(activePageDataOutletQris, datamerchantGrup.data.response_data.results.mprofile_merchant_id, datamerchantGrup.data.response_data.results.moutlet_nou)
            } else if (datamerchantGrup.status === 200 && datamerchantGrup.data.response_code === 200 && datamerchantGrup.data.response_new_token.length !== 0) {
                setUserSession(datamerchantGrup.data.response_new_token)
                setDataDetailBrand(datamerchantGrup.data.response_data.results)
                getListDataOutletQrisHandler(activePageDataOutletQris, datamerchantGrup.data.response_data.results.mprofile_merchant_id, datamerchantGrup.data.response_data.results.moutlet_nou)
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    const [pageNumberDataOutletQris, setPageNumberDataOutletQris] = useState({})
    const [totalPageDataOutletQris, setTotalPageDataOutletQris] = useState(0)
    const [activePageDataOutletQris, setActivePageDataOutletQris] = useState(1)
    const [dataMerchantOutletQris, setDataMerchantOutletQris] = useState([])
    const [pendingDataOutletQris, setPendingDataOutletQris] = useState(true)

    const [filterTextOutlet, setFilterTextOutlet] = React.useState('');
    const [resetPaginationToggleOutlet, setResetPaginationToggleOutlet] = React.useState(false);
    const filteredItemsOutlet = dataMerchantOutletQris.filter(
        item => item.mstore_name && item.mstore_name.toLowerCase().includes(filterTextOutlet.toLowerCase()),
    );
    const subHeaderComponentMemoOutlet = useMemo(() => {
        const handleClear = () => {
            if (filterTextOutlet) {
                setResetPaginationToggleOutlet(!resetPaginationToggleOutlet);
                setFilterTextOutlet('');
            }
        };

        function handleChangeFilterQris (e) {
            setFilterTextOutlet(e.target.value)
        }
        return (
            <FilterComponentQrisOutletDetail onFilter={e => handleChangeFilterQris(e)} onClear={handleClear} filterText={filterTextOutlet} title="Pencarian :" placeholder="Masukkan nama outlet" onClickAddMerchantDeatil={() => setShowModalTambahOutletDetail(true)} />
        );	}, [filterTextOutlet, resetPaginationToggleOutlet]
    );

    function handlePageChangeDataOutletQris(page) {
        setActivePageDataOutletQris(page)
        getListDataOutletQrisHandler(page, dataDetailBrand?.mprofile_merchant_id, dataDetailBrand?.moutlet_nou)
    }

    const columnsOutlet = [
        {
            name: 'No',
            selector: row => row.number,
            width: '67px'
        },
        {
            name: 'ID outlet',
            selector: row => row.mstore_id,
            width: "150px"
        },
        {
            name: 'Waktu',
            selector: row => row.mstore_create_date_format,
            width: "160px"
        },
        {
            name: 'Cabang outlet', 
            selector: row => row.mstore_name,
            wrap: true,
            width: "160px"
        },
        {
            name: 'Bank Tujuan',
            selector: row => row.bank_name === null ? "-" : row.bank_name,
            wrap: true,
            width: "140px"
        },
        {
            name: 'Nomor Rekening',
            selector: row => row.settlement_account_number === null ? "-" : row.settlement_account_number,
            wrap: true,
            width: "170px"
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.settlement_account_name === null ? "-" : row.settlement_account_name,
            wrap: true,
            width: "220px"
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "unset", margin: "6px", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 105,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }
                },
                {
                    when: row => row.status_id === 106 || row.status_id === 107,
                    style: { background: "#FEF4E9", color: "#F79421", }
                }
            ],
        },
        {
            name: 'Aksi',
            width: "170px",
            cell: (row) => (
                <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">{(row.status_id === 106 || row.status_id === 107) ? 'Lanjutkan daftar' : 'Lihat'}</div></Tooltip>}>
                    <FontAwesomeIcon onClick={() => getPageRegisterQris(row.mprofile_id, row.mqrissettlegroup_id, row.merchant_nou, row.outlet_nou, row.status_id)}  icon={(row.status_id === 106 || row.status_id === 107) ? faPencilAlt : faEye} className="me-2" style={{cursor: "pointer"}} />
                </OverlayTrigger> 
            ),
        },
    ];

    async function getListDataOutletQrisHandler(page, merchantNou, outletNou) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"merchant_nou": ${merchantNou}, "outlet_nou": ${outletNou}, "outlet_name": "", "date_from": "", "date_to": "", "page": ${(page !== 0) ? page : 1}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const datamerchantOutlet = await axios.post(BaseURL + "/QRIS/OnboardingGetListStore", { data: dataParams }, { headers: headers })
            // console.log(datamerchantOutlet, 'ini user detal funct');
            if (datamerchantOutlet.status === 200 && datamerchantOutlet.data.response_code === 200 && datamerchantOutlet.data.response_new_token.length === 0) {
                setPageNumberDataOutletQris(datamerchantOutlet.data.response_data)
                setTotalPageDataOutletQris(datamerchantOutlet.data.response_data.max_page)
                setDataMerchantOutletQris(datamerchantOutlet.data.response_data.results.list_data)
                setPendingDataOutletQris(false)
            } else if (datamerchantOutlet.status === 200 && datamerchantOutlet.data.response_code === 200 && datamerchantOutlet.data.response_new_token.length !== 0) {
                setUserSession(datamerchantOutlet.data.response_new_token)
                setPageNumberDataOutletQris(datamerchantOutlet.data.response_data)
                setTotalPageDataOutletQris(datamerchantOutlet.data.response_data.max_page)
                setDataMerchantOutletQris(datamerchantOutlet.data.response_data.results.list_data)
                setPendingDataOutletQris(false)
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function addFormTambahOutletHandler(email, alamat, bank, cabang, kategoriUsaha, kodePos, namaBrand, namaKepalaOutlet, namaPemilikRek, namaYangDicetakQris, nikKepalaOutlet, nomorRek, profileId, step) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"email": "${email}", "alamat_outlet": "${alamat}", "Bank": ${bank}, "cabang": "${cabang}", "kategori_usaha": ${kategoriUsaha}, "kode_pos": "${kodePos}", "namaBrand": "${namaBrand}", "nama_kepala_outlet": "${namaKepalaOutlet}", "nama_pemilik_rekening": "${namaPemilikRek}", "nama_yang_dicetak_QRIS": "${namaYangDicetakQris}", "nik": "${nikKepalaOutlet}", "nomor_rekening": "${nomorRek}", "profile_id": ${profileId}, "step" : ${step}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const datamerchantOutlet = await axios.post(BaseURL + "/QRIS/OnboardingAddOutletByBrand", { data: dataParams }, { headers: headers })
            // console.log(datamerchantOutlet, 'ini user detal funct');
            if ((datamerchantOutlet.status === 200 || datamerchantOutlet.status === 202) && datamerchantOutlet.data.response_code === 200 && datamerchantOutlet.data.response_new_token === null) {
                setShowModalTambahOutletDetail(false)
                window.location.reload()
            } else if ((datamerchantOutlet.status === 200 || datamerchantOutlet.status === 202) && datamerchantOutlet.data.response_code === 200 && datamerchantOutlet.data.response_new_token !== null) {
                setUserSession(datamerchantOutlet.data.response_new_token)
                setShowModalTambahOutletDetail(false)
                window.location.reload()
            }
    } catch (error) {
            // console.log(error);
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
        getListDataDetailBrandQrisHandler(profileId)
        getDataKategoriUsahaHnadler(0)
        getBankListHandler()
    }, [])

    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
                <span className='breadcrumbs-span'><span onClick={() => history.push('/')} style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span onClick={() => history.push(`/daftar-merchant-qris`)} style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span onClick={() => history.push(`/daftar-merchant-qris`)} style={{ cursor: "pointer" }}>Merchant Brand</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Info Merchant Brand</span></span>
                <div className="head-title"> 
                    <h2 className="h5 mt-4" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Info Merchant Brand</h2>
                </div>
                <div className='base-content mt-4 pb-4'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='nama-merchant-in-detail'>{dataDetailBrand?.moutlet_name}</div>
                        <div className='status-in-detail-qris-brand-success'>{dataDetailBrand?.mregstatus_name_ind}</div>
                    </div>
                    <Row>
                        <Col xs={4}>
                            <div className='sub-title-detail-merchant mt-3'>Group</div>
                            <div className='isi-content-detail-merchant mt-2'>{dataDetailBrand?.mmerchant_name}</div>
                            <div className='sub-title-detail-merchant mt-3'>Kategori Usaha</div>
                            <div className='isi-content-detail-merchant mt-2'>{dataDetailBrand?.mbustype_name}</div>
                            <div className='sub-title-detail-merchant mt-3'>Riwayat terakhir</div>
                            <div className='isi-content-detail-merchant mt-2'>{dataDetailBrand?.edit_date}</div>
                            {
                                dataDetailBrand?.tujuan_settlement === "Rekening Outlet" ? "" :
                                <>
                                    <div className='sub-title-detail-merchant mt-3'>Nomor rekening</div>
                                    <div className='isi-content-detail-merchant mt-2'>{(dataDetailBrand?.mqrismerchsettle_acc_number === null || dataDetailBrand?.mqrismerchsettle_acc_number === "") ? "-" : dataDetailBrand?.mqrismerchsettle_acc_number}</div>
                                </>
                            }
                        </Col>
                        <Col xs={4}>
                            <div className='sub-title-detail-merchant mt-3'>ID brand</div>
                            <div className='isi-content-detail-merchant mt-2'>{dataDetailBrand?.moutlet_id}</div>
                            <div className='sub-title-detail-merchant mt-3'>No. handphone pemilik/direktur</div>
                            <div className='isi-content-detail-merchant mt-2'>{dataDetailBrand?.mprofdtl_mobile === "" ? "-" : dataDetailBrand?.mprofdtl_mobile}</div>
                            <div className='sub-title-detail-merchant mt-3'>Jenis settlement</div>
                            <div className='isi-content-detail-merchant mt-2'>{dataDetailBrand?.mprofilefee_settle_type_name === "" ? "-" : dataDetailBrand?.mprofilefee_settle_type_name}</div>
                            {
                                dataDetailBrand?.tujuan_settlement === "Rekening Outlet" ? "" :
                                <>
                                    <div className='sub-title-detail-merchant mt-3'>Nama pemilik rekening</div>
                                    <div className='isi-content-detail-merchant mt-2'>{(dataDetailBrand?.mqrismerchsettle_acc_name === "" || dataDetailBrand?.mqrismerchsettle_acc_name === null) ? "-" : dataDetailBrand?.mqrismerchsettle_acc_name}</div>
                                </>
                            }
                        </Col>
                        <Col xs={4}>
                            <div className='sub-title-detail-merchant mt-3'>Tanggal terdaftar</div>
                            <div className='isi-content-detail-merchant mt-2'>{dataDetailBrand?.create_date}</div>
                            <div className='sub-title-detail-merchant mt-3'>Email terdaftar</div>
                            <div className='isi-content-detail-merchant mt-2'>{dataDetailBrand?.mprofdtl_email === "" ? "-" : dataDetailBrand?.mprofdtl_email}</div>
                            <div className='sub-title-detail-merchant mt-3'>Tujuan settlment</div>
                            <div className='isi-content-detail-merchant mt-2'>{dataDetailBrand?.tujuan_settlement === null ? "-" : dataDetailBrand?.tujuan_settlement}</div>
                        </Col>
                    </Row>
                </div>
                <div className='d-flex justify-content-start align-items-center my-3' style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, whiteSpace: 'normal', fontWeight: 700, backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 6 }}>
                    <img src={noteInfo} alt="" />
                    <div className='ms-3'>Anda WAJIB mengisi data outlet</div>
                </div>
                <div className='base-content pb-4'>
                    <div className="div-table">
                        <DataTable
                            columns={columnsOutlet}
                            data={filteredItemsOutlet}
                            customStyles={customStyles}
                            highlightOnHover
                            progressPending={pendingDataOutletQris}
                            progressComponent={<CustomLoader />}
                            subHeader
                            subHeaderComponent={subHeaderComponentMemoOutlet}
                            persistTableHead
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageDataOutletQris}</div>
                        <Pagination
                            activePage={activePageDataOutletQris}
                            itemsCountPerPage={pageNumberDataOutletQris.row_per_page}
                            totalItemsCount={(pageNumberDataOutletQris.row_per_page*pageNumberDataOutletQris.max_page)}
                            pageRangeDisplayed={5}
                            itemClass="page-item"
                            linkClass="page-link"
                            onChange={handlePageChangeDataOutletQris}
                        />
                    </div>
                </div>
            </div>

            <Modal className="data-outlet-detail" size="xl" centered show={showModalTambahOutletDetail} onHide={() => setShowModalTambahOutletDetail(false)}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => setShowModalTambahOutletDetail(false)}
                    />
                </Modal.Header>
                <Modal.Title  className='text-center mt-2' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20, color: "#393939" }}>
                    Data Outlet
                </Modal.Title>
                <Modal.Body >
                    <div style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 18, color: "#393939" }}>Formulir Data Outlet</div>
                    <div className='base-content mt-3 pb-4'>
                        <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }}>Nama Kepala Outlet</div>
                        <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                            <input name="namaKepalaOutlet" value={inputHandle.namaKepalaOutlet} onChange={(e) => handleChange(e)} className='input-text-form' type="text" placeholder='Masukan Nama Kepala Outlet' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                        </div>
                        <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>NIK Kepala Outlet Sesuai e-KTP</div>
                        <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                            <input name="nikKepalaOutlet" value={inputHandle.nikKepalaOutlet} onChange={(e) => handleChange(e)} className='input-text-form' type="number" onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} placeholder='Masukan NIK Kepala Outlet Sesuai e-KTP' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                        </div>
                        <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Kategori Usaha</div>
                        <div className="dropdown dropSaldoPartner pt-2">
                            <ReactSelect
                                closeMenuOnSelect={true}
                                hideSelectedOptions={false}
                                options={getDataKategoriUsaha}
                                value={selectedDataKategoriUsaha}
                                onChange={(selected) => setSelectedDataKategoriUsaha([selected])}
                                placeholder="Pilih Kategori Usaha"
                                components={{ Option }}
                                styles={customStylesSelectedOption}
                            />
                        </div>
                        <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>E-mail</div>
                        <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                            <input name="email" value={inputHandle.email} onChange={(e) => handleChange(e)} className='input-text-form' type="text" placeholder='Masukan E-mail' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                        </div>
                        <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama Brand</div>
                        <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                            <input name="namaBrand" value={inputHandle.namaBrand} onChange={(e) => handleChange(e)} className='input-text-form' type="text" placeholder='Masukan Nama Brand' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                        </div>
                        <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Cabang</div>
                        <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                            <input name="cabang" value={inputHandle.cabang} onChange={(e) => handleChange(e)} className='input-text-form' type="text" placeholder='Masukan Cabang' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                        </div>
                        <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama yang dicetak dalam QRIS</div>
                        <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                            <input name="namaYangDicetakQris" value={inputHandle.namaYangDicetakQris} onChange={(e) => handleChange(e)} className='input-text-form' type="text" placeholder='Masukan Nama yang dicetak dalam QRIS' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                        </div>
                        <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Alamat Outlet</div>
                        <div className='pt-2 d-flex justify-content-end align-items-center'>
                            <textarea name="alamat" value={inputHandle.alamat} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='cth: jln. nama jalan no.01 RT.001 RW 002' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838", height: 100, padding: 12 }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                        </div>
                        <Row className='pt-2'>
                            <Col xs={6}>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }}>Kode Pos</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input name="kodePos" value={inputHandle.kodePos} onChange={(e) => handleChange(e)} onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} type="number" maxLength={5} className='input-text-user' placeholder='Masukkan kode pos' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                            </Col>
                        </Row>
                        <Row className='pt-2'>
                            <Col xs={6}>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }}>Provinsi</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input disabled value={Object.keys(dataKodePos).length === 0 ? "" : dataKodePos.mprovince_name} className='input-text-user' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                            </Col>
                            <Col xs={6}>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }}>Kabupaten/kota</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input disabled value={Object.keys(dataKodePos).length === 0 ? "" : dataKodePos.mcity_name} className='input-text-user' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                            </Col>
                        </Row>
                        <Row className='pt-2'>
                            <Col xs={6}>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Kecamatan</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input disabled value={Object.keys(dataKodePos).length === 0 ? "" : dataKodePos.mdistrict_name} className='input-text-user' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                            </Col>
                            <Col xs={6}>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Kelurahan</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input disabled value={Object.keys(dataKodePos).length === 0 ? "" : dataKodePos.mvillage_name} className='input-text-user' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                            </Col>
                        </Row>
                        {
                            (dataDetailBrand?.tujuan_settlement === "Rekening Outlet") && (
                                <>
                                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-2'>Nama Bank</div>
                                    <div className="dropdown dropSaldoPartner pt-2">
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={getDataBank}
                                            value={selectedDataBank}
                                            onChange={(selected) => setSelectedDataBank([selected])}
                                            placeholder="Pilih Bank"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                        />
                                    </div>
                                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nomor rekening</div>
                                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                        <input name="nomorRek" value={inputHandle.nomorRek} onChange={(e) => handleChange(e)} className='input-text-form' type="number" onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} placeholder='Masukan nomor rekening' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                    </div>
                                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama pemilik rekening</div>
                                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                        <input name="namaPemiliRek" value={inputHandle.namaPemiliRek} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='Masukan nama rekening' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                    </div>
                                </>
                            )
                        }
                    </div>
                    <div className='d-flex justify-content-between align-items-center mt-4 pb-4' >
                        <button 
                            className='btn-prev-info-usaha me-2'
                            onClick={() => setShowModalTambahOutletDetail(false)}
                        >
                            Batal
                        </button>
                        <button 
                            className={(
                                inputHandle.namaKepalaOutlet.length !== 0 &&
                                inputHandle.nikKepalaOutlet.length !== 0 &&
                                selectedDataKategoriUsaha.length !== 0 &&
                                inputHandle.email.length !== 0 &&
                                inputHandle.namaBrand.length !== 0 && 
                                inputHandle.cabang.length !== 0 && 
                                inputHandle.namaYangDicetakQris.length !== 0 &&
                                inputHandle.alamat.length !== 0 &&
                                inputHandle.kodePos.length !== 0 
                                // ((selectedDataBank.length !== 0 && inputHandle.namaPemiliRek.length !== 0 && inputHandle.nomorRek.length !== 0))
                                ) ? 'btn-next-info-usaha ms-2' : 'btn-next-info-usaha-inactive ms-2'
                            }
                            disabled= {(
                                inputHandle.namaKepalaOutlet.length === 0 ||
                                inputHandle.nikKepalaOutlet.length === 0 ||
                                selectedDataKategoriUsaha.length === 0 ||
                                inputHandle.email.length === 0 ||
                                inputHandle.namaBrand.length === 0 || 
                                inputHandle.cabang.length === 0 || 
                                inputHandle.namaYangDicetakQris.length === 0 ||
                                inputHandle.alamat.length === 0 ||
                                inputHandle.kodePos.length === 0 
                                // ((selectedDataBank.length === 0 || inputHandle.namaPemiliRek.length === 0 || inputHandle.nomorRek.length === 0))
                            )}
                            onClick={() => addFormTambahOutletHandler(inputHandle.email, inputHandle.alamat, selectedDataBank.length !== 0 ? selectedDataBank[0].value : 0, inputHandle.cabang, selectedDataKategoriUsaha.length !== 0 ? selectedDataKategoriUsaha[0].value : 0, inputHandle.kodePos, inputHandle.namaBrand, inputHandle.namaKepalaOutlet, inputHandle.namaPemiliRek, inputHandle.namaYangDicetakQris, inputHandle.nikKepalaOutlet, inputHandle.nomorRek, profileId, 300)}
                        >
                            Simpan
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default DetailMerchantBrand 