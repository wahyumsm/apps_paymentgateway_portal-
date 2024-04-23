import React, { useEffect, useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import { Col, Form, Row } from '@themesberg/react-bootstrap';
import { BaseURL, CustomLoader, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ReactSelect, { components } from 'react-select';
import OtpInput from 'react-otp-input';
import $ from 'jquery'
import DataTable from 'react-data-table-component';
import { agenLists } from '../../../data/tables';

function TambahDataTerminalManual () {
    const history = useHistory()
    const storeId = sessionStorage.getItem('storeId');
    const [dataDetailTerminal, setDataDetailTerminal] = useState({})
    const [dataTerminalByStoreId, setDataTerminalByStoreId] = useState([])
    const [selectedDataTerminalByStore, setSelectedDataTerminalByStore] = useState([])
    const [pinTerminalKasir, setPinTerminalKasir] = useState("")
    const [isSecurePin, setIsSecurePin] = useState(true)
    const [inputStatusTerminal, setInputStatusTerminal] = useState(true)

    function handleChangeStatus (e) {
        setInputStatusTerminal({
            ...inputStatusTerminal,
            [e.target.name]: !inputStatusTerminal,
          });
    }

    function handleChangeOtp (value) {
        setPinTerminalKasir(value)
    }

    function terminalTabs(isTabs){
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
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'Terminal Kasir',
            selector: row => row.tvasettl_code,
            width: "251px"
        },
        {
            name: 'Password',
            selector: row => row.tvasettl_crtdt,
        },
        {
          name: 'Terakhir Aktif',
          selector: row => row.mfitur_desc,
          // sortable: true
        },
        {
            name: 'Status',
            selector: row => row.tvasettl_amount,
        },
        {
            name: 'Aksi',
            selector: row => row.tvasettl_amount,
        },
    ]

    console.log(isSecurePin, "isSecurePin");

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
                setDataTerminalByStoreId(dataTerminal.data.response_data.results)
            } else if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token !== null) {
                setUserSession(dataTerminal.data.response_new_token)
                setDataTerminalByStoreId(dataTerminal.data.response_data.results)
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
                // inputStyle={{ border: "1px solid rgba(0, 0, 0, 0.3)", borderRadius: "8px", width: "80% !important", height:"4rem", fontSize: 20, fontFamily: "Exo", fontWeight: 700, color: "#393939" }}
                // inputStyle={{ border: "1.4px solid #B9121B", borderRadius: 8, backgroundColor: "#FFFFFF" }}
            />
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <div className='custom-style-desc-data-terminal'>PIN digunakan oleh kasir untuk masuk ke dalam terminal kasir</div>
                <div className='lihat-pin-style' onClick={() => setIsSecurePin(!isSecurePin)} style={{ cursor: "pointer" }}>{isSecurePin ? "Lihat PIN" : "Sembunyikan PIN" }</div>
            </div>
            <button className='btn-ez-transfer mt-4'>Simpan</button>

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
                <div className="div-table">
                    <DataTable
                        columns={columnsTerminalAktif}
                        data={agenLists}
                        customStyles={customStyles}
                        // progressPending={pendingSettlement}
                        subHeader
                        // subHeaderComponent={subHeaderComponentMemoBrand}
                        persistTableHead
                        progressComponent={<CustomLoader />}
                    />
                </div>
                {/* <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                    <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageDataBrandQris}</div>
                    <Pagination
                        activePage={activePageDataBrandQris}
                        itemsCountPerPage={pageNumberDataBrandQris.row_per_page}
                        totalItemsCount={(pageNumberDataBrandQris.row_per_page*pageNumberDataBrandQris.max_page)}
                        pageRangeDisplayed={5}
                        itemClass="page-item"
                        linkClass="page-link"
                        onChange={handlePageChangeDataBrandQris}
                    />
                </div> */}
            </div>
            
        </div>
    )
}

export default TambahDataTerminalManual