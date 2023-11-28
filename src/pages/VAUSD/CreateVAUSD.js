import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import $ from 'jquery'
import noteInfo from "../../assets/icon/note_icon_grey_transparent_bg.svg"
import noteInfoRed from "../../assets/icon/note_icon_red_transparent_bg.svg"
import downloadIcon from "../../assets/icon/download_icon.svg"
import refreshIcon from "../../assets/icon/refresh_icon.svg"
import { Col, Image, Modal, OverlayTrigger, Row, Tooltip } from '@themesberg/react-bootstrap'
import { BaseURL, convertToRupiah, errorCatch, getToken, setUserSession } from '../../function/helpers'
import encryptData from '../../function/encryptData'
import CurrencyInput from "react-currency-input-field";
import axios from 'axios'
import DataTable, { defaultThemes } from 'react-data-table-component'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import Pagination from 'react-js-pagination'
import * as XLSX from "xlsx"
import ReactSelect, { components } from 'react-select';

function CreateVAUSD() {

    const history = useHistory()
    const [isVAUSD, setIsVAUSD] = useState(100)
    const [isTabFileId, setIsTabFileId] = useState(1)
    const [dataVABaru, setDataVABaru] = useState(0)
    const [generatedVA, setGeneratedVA] = useState({})
    const [fileTabs, setFileTabs] = useState([])
    const [listVAUSD, setListVAUSD] = useState([])
    const [pendingVAUSD, setPendingVAUSD] = useState(false)
    const [stockVA, setStockVA] = useState({
        available_stock: {
            stock: 0,
            stock_will_run_out: false
        },
        unavailable_stock: {
            stock: 0,
            stock_will_run_out: false
        }
    })
    const [totalPageCreate, setTotalPageCreate] = useState(1)
    const [activePageCreate, setActivePageCreate] = useState(1)
    const [pageNumberCreate, setPageNumberCreate] = useState({})
    const [showModalPerbaruiDataVA, setShowModalPerbaruiDataVA] = useState(false)
    const [showModalKonfirmasiVAUpdate, setShowModalKonfirmasiVAUpdate] = useState(false)

    const [dataListFile, setDataListFile] = useState([])
    const [selectedFileUpdate, setSelectedFileUpdate] = useState([])
    const [listUpdateVA, setListUpdateVA] = useState([])

    console.log(stockVA, 'stockVA');
    console.log(isTabFileId, 'isTabFileId');
    console.log(dataVABaru, 'dataVABaru');
    console.log(selectedFileUpdate, 'selectedFileUpdate');

    // SECTION TAB CREATE NEW VA

    function handlePageChangeCreate(page, bulkId) {
        console.log(page, 'getVAUSD changePage');
        setActivePageCreate(page)
        getVAUSD(bulkId, page)
    }

    function handleChange(e) {
        console.log(e, 'e');
        if (e === undefined || e === "") {
            setDataVABaru("0")
        } else if (e.length === 4 && e !== "1000") {
            setDataVABaru("1000")
        } else {
            setDataVABaru(e)
        }
    }

    function pindahFileTabCreate(fileId) {
        console.log(fileId, 'fileId');
        setIsTabFileId(fileId)
        getVAUSD(fileId, 1)
    }

    async function renewDataVA(bulkId) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"bulk_id": ${bulkId}, "username": ""}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            console.log(dataParams, 'dataParams');
            const newData = await axios.post(BaseURL + "/VirtualAccountUSD/UpdateUnvailabletoAvailableVA", {data: dataParams}, {headers: headers})
            console.log(newData, 'newData');
            if (newData.status === 200 && newData.data.response_code === 200 && newData.data.response_new_token === null) {
                getVAUSD(bulkId, 1)
                getFileNameAndStockVA()
                setShowModalPerbaruiDataVA(false)
            } else if (newData.status === 200 && newData.data.response_code === 200 && newData.data.response_new_token !== null) {
                setUserSession(newData.data.response_new_token)
                getVAUSD(bulkId, 1)
                getFileNameAndStockVA()
                setShowModalPerbaruiDataVA(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function generateFileCSV(bulkId) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"bulk_id": ${bulkId}, "username": ""}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            console.log(dataParams, 'dataParams');
            const dataFileCSV = await axios.post(BaseURL + "/VirtualAccountUSD/GetUnavailableVAUSD", {data: dataParams}, {headers: headers})
            console.log(dataFileCSV, 'dataFileCSV');
            if (dataFileCSV.status === 200 && dataFileCSV.data.response_code === 200 && dataFileCSV.data.response_new_token === null) {
                // const ws = XLSX.utils.sheet_to_csv(dataFileCSV.data.response_data.results)
                // const ws = XLSX.utils.json_to_sheet(dataFileCSV.data.response_data.results)
                // console.log(ws, 'ws');
                const data = dataFileCSV.data.response_data.results
                const arrayOfArraysIndex0 = data.map(obj => {
                    // const values = Object.values(obj);
                    const keys = Object.keys(obj);
                    return keys;
                });
                const arrayOfArraysNextIndex = data.map(obj => {
                    const values = Object.values(obj);
                    // const keys = Object.keys(obj);
                    return values;
                });
                arrayOfArraysNextIndex.unshift(arrayOfArraysIndex0[0])

                console.log(arrayOfArraysNextIndex, 'arrayOfArraysNextIndex');
                const ws = XLSX.utils.aoa_to_sheet(arrayOfArraysNextIndex)
                const wb = XLSX.utils.sheet_to_csv(ws)
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, ws, "Sheet1");
                XLSX.writeFile(workBook, `vausd_${new Date().toLocaleString('en-GB').split('/').join('').split(':').join('').split(', ').join('')}.csv`);
                // console.log(wb, 'wb');
            } else if (dataFileCSV.status === 200 && dataFileCSV.data.response_code === 200 && dataFileCSV.data.response_new_token !== null) {
                setUserSession(dataFileCSV.data.response_new_token)
                const data = dataFileCSV.data.response_data.results
                const arrayOfArraysIndex0 = data.map(obj => {
                    // const values = Object.values(obj);
                    const keys = Object.keys(obj);
                    return keys;
                });
                const arrayOfArraysNextIndex = data.map(obj => {
                    const values = Object.values(obj);
                    // const keys = Object.keys(obj);
                    return values;
                });
                arrayOfArraysNextIndex.unshift(arrayOfArraysIndex0[0])

                console.log(arrayOfArraysNextIndex, 'arrayOfArraysNextIndex');
                const ws = XLSX.utils.aoa_to_sheet(arrayOfArraysNextIndex)
                const wb = XLSX.utils.sheet_to_csv(ws)
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, ws, "Sheet1");
                XLSX.writeFile(workBook, `vausd_${new Date().toLocaleString('en-GB').split('/').join('').split(':').join('').split(', ').join('')}.csv`);
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getVAUSD(fileId, page) {
        try {
            setPendingVAUSD(true)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"bulk_id": ${fileId}, "page": ${page}, "row_per_page": 10}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            // console.log(dataParams, 'dataParams');
            const dataListVAUSD = await axios.post(BaseURL + "/VirtualAccountUSD/GetVirtualAccountUSD", {data: dataParams}, {headers: headers})
            console.log(dataListVAUSD, 'dataListVAUSD');
            if (dataListVAUSD.status === 200 && dataListVAUSD.data.response_code === 200 && dataListVAUSD.data.response_new_token === null) {
                dataListVAUSD.data.response_data.results = dataListVAUSD.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberCreate(dataListVAUSD.data.response_data)
                setTotalPageCreate(dataListVAUSD.data.response_data.max_page)
                setListVAUSD(dataListVAUSD.data.response_data.results)
                setPendingVAUSD(false)
            } else if (dataListVAUSD.status === 200 && dataListVAUSD.data.response_code === 200 && dataListVAUSD.data.response_new_token !== null) {
                setUserSession(dataListVAUSD.data.response_new_token)
                dataListVAUSD.data.response_data.results = dataListVAUSD.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberCreate(dataListVAUSD.data.response_data)
                setTotalPageCreate(dataListVAUSD.data.response_data.max_page)
                setListVAUSD(dataListVAUSD.data.response_data.results)
                setPendingVAUSD(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getFileNameAndStockVA(newDataVA) {
        try {
            const auth = 'Bearer ' + getToken();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const fileNameAndStockVa = await axios.post(BaseURL + "/VirtualAccountUSD/GetFileandStockforVAUSD", {data: ""}, {headers: headers})
            console.log(fileNameAndStockVa, 'fileNameAndStockVa');
            if (fileNameAndStockVa.status === 200 && fileNameAndStockVa.data.response_code === 200 && fileNameAndStockVa.data.response_new_token === null) {
                setFileTabs(fileNameAndStockVa.data.response_data.results.bulk)
                setIsTabFileId(fileNameAndStockVa.data.response_data.results.bulk[0].id)
                getVAUSD(fileNameAndStockVa.data.response_data.results.bulk[0].id, 1)
                setStockVA(fileNameAndStockVa.data.response_data.results.stock)
            } else if (fileNameAndStockVa.status === 200 && fileNameAndStockVa.data.response_code === 200 && fileNameAndStockVa.data.response_new_token !== null) {
                setUserSession(fileNameAndStockVa.data.response_new_token)
                setFileTabs(fileNameAndStockVa.data.response_data.results.bulk)
                setIsTabFileId(fileNameAndStockVa.data.response_data.results.bulk[0].id)
                getVAUSD(fileNameAndStockVa.data.response_data.results.bulk[0].id, 1)
                setStockVA(fileNameAndStockVa.data.response_data.results.stock)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function generateDataVABaru(dataVA) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"totalcollection": ${Number(dataVA)}}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            // console.log(dataParams, 'dataParams');
            const generateVA = await axios.post(BaseURL + "/VirtualAccountUSD/GenerateVirtualAccount", {data: dataParams}, {headers: headers})
            console.log(generateVA, 'generateVA');
            if (generateVA.status === 200 && generateVA.data.response_code === 200 && generateVA.data.response_new_token === null) {
                // setGeneratedVA(generateVA.data.response_data.results)
                getFileNameAndStockVA(generateVA.data.response_data.results)
                setDataVABaru(0)
            } else if (generateVA.status === 200 && generateVA.data.response_code === 200 && generateVA.data.response_new_token !== null) {
                setUserSession(generateVA.data.response_new_token)
                // setGeneratedVA(generateVA.data.response_data.results)
                getFileNameAndStockVA(generateVA.data.response_data.results)
                setDataVABaru(0)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    // SECTION TAB CREATE NEW VA END

    // SECTION TAB UPDATE VA

    function handleChangeFile(selected) {
        setSelectedFileUpdate(selected)
    }

    async function confirmUpdatedVAUSD(listFile) {
        try {
            let idLists = []
            listFile.forEach(item => {
                idLists.push(item.value)
            })
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"list": ${JSON.stringify(idLists)}}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            console.log(dataParams, 'dataParams');
            const confirmedVAUSD = await axios.post(BaseURL + "/VirtualAccountUSD/ConfirmVAUSDFileUpdated", {data: dataParams}, {headers: headers})
            console.log(confirmedVAUSD, 'confirmedVAUSD');
            if (confirmedVAUSD.status === 200 && confirmedVAUSD.data.response_code === 200 && confirmedVAUSD.data.response_new_token === null) {
                setShowModalKonfirmasiVAUpdate(false)
            } else if (confirmedVAUSD.status === 200 && confirmedVAUSD.data.response_code === 200 && confirmedVAUSD.data.response_new_token !== null) {
                setUserSession(confirmedVAUSD.data.response_new_token)
                setShowModalKonfirmasiVAUpdate(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function downloadVAUpdated() {
        try {
            const auth = 'Bearer ' + getToken();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const downloadUpdatedVA = await axios.post(BaseURL + "/VirtualAccountUSD/UpdateVAPagingGenerateCSV", {data: ""}, {headers: headers})
            console.log(downloadUpdatedVA, 'downloadUpdatedVA');
            if (downloadUpdatedVA.status === 200 && downloadUpdatedVA.data.response_code === 200 && downloadUpdatedVA.data.response_new_token === null) {
                getListUpdateVA(1)
                getDataNameFile()
                setSelectedFileUpdate([])
            } else if (downloadUpdatedVA.status === 200 && downloadUpdatedVA.data.response_code === 200 && downloadUpdatedVA.data.response_new_token !== null) {
                setUserSession(downloadUpdatedVA.data.response_new_token)
                getListUpdateVA(1)
                getDataNameFile()
                setSelectedFileUpdate([])
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getDataNameFile() {
        try {
            const auth = 'Bearer ' + getToken();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataListFileName = await axios.post(BaseURL + "/VirtualAccountUSD/GetFileVAUSDUpdated", {data: ""}, {headers: headers})
            console.log(dataListFileName, 'dataListFileName');
            if (dataListFileName.status === 200 && dataListFileName.data.response_code === 200 && dataListFileName.data.response_new_token === null) {
                let newArr = []
                dataListFileName.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.id
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataListFile(newArr)
            } else if (dataListFileName.status === 200 && dataListFileName.data.response_code === 200 && dataListFileName.data.response_new_token !== null) {
                setUserSession(dataListFileName.data.response_new_token)
                let newArr = []
                dataListFileName.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.id
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataListFile(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getListUpdateVA(page) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"page": ${page}, "row_per_page": 20}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            // console.log(dataParams, 'dataParams');
            const dataListUpdateVA = await axios.post(BaseURL + "/VirtualAccountUSD/UpdateVAPaging", {data: dataParams}, {headers: headers})
            // console.log(dataListUpdateVA, 'dataListUpdateVA');
            if (dataListUpdateVA.status === 200 && dataListUpdateVA.data.response_code === 200 && dataListUpdateVA.data.response_new_token === null) {
                dataListUpdateVA.data.response_data.results = dataListUpdateVA.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setListUpdateVA(dataListUpdateVA.data.response_data.results)
            } else if (dataListUpdateVA.status === 200 && dataListUpdateVA.data.response_code === 200 && dataListUpdateVA.data.response_new_token !== null) {
                setUserSession(dataListUpdateVA.data.response_new_token)
                dataListUpdateVA.data.response_data.results = dataListUpdateVA.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setListUpdateVA(dataListUpdateVA.data.response_data.results)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    // SECTION TAB UPDATE VA END

    useEffect(() => {
        getFileNameAndStockVA()
        getListUpdateVA(1)
        getDataNameFile()
    }, [])

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                    />{" "}
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };

    const customStylesSelectedOption = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: "none",
            color: "black"
        })
    }

    function pindahHalaman(param) {
        if (param === "create") {
            VAUSDTabs(100)
        } else if (param === "update") {
            getListUpdateVA(1)
            VAUSDTabs(101)
        } else if (param === "riwayat") {
            VAUSDTabs(102)
        }
    }

    function VAUSDTabs(isTabs){
        setIsVAUSD(isTabs)
        if (isTabs === 101) {
            $('#createTab').removeClass('menu-detail-akun-hr-active')
            $('#createSpan').removeClass('menu-detail-akun-span-active')
            $('#updateTab').addClass('menu-detail-akun-hr-active')
            $('#updateSpan').addClass('menu-detail-akun-span-active')
            $('#riwayatTab').removeClass('menu-detail-akun-hr-active')
            $('#riwayatSpan').removeClass('menu-detail-akun-span-active')
        } else if (isTabs === 102) {
            $('#createTab').removeClass('menu-detail-akun-hr-active')
            $('#createSpan').removeClass('menu-detail-akun-span-active')
            $('#riwayatTab').addClass('menu-detail-akun-hr-active')
            $('#riwayatSpan').addClass('menu-detail-akun-span-active')
            $('#updateTab').removeClass('menu-detail-akun-hr-active')
            $('#updateSpan').removeClass('menu-detail-akun-span-active')
        } else if (isTabs === 100) {
            $('#updateTab').removeClass('menu-detail-akun-hr-active')
            $('#updateSpan').removeClass('menu-detail-akun-span-active')
            $('#createTab').addClass('menu-detail-akun-hr-active')
            $('#createSpan').addClass('menu-detail-akun-span-active')
            $('#riwayatTab').removeClass('menu-detail-akun-hr-active')
            $('#riwayatSpan').removeClass('menu-detail-akun-span-active')
        }
    }

    const columnsVAUSD = [
        {
            name: 'No',
            selector: row => row.number,
            width: "70px",
            wrap: true,
            // sortable: true
        },
        {
            name: 'VA Company Code',
            selector: row => row.company_code,
            // width: "150px",
            wrap: true,
            // sortable: true
        },
        {
            name: 'Member Code',
            selector: row => row.member_code,
            // width: "150px",
            wrap: true,
            // sortable: true
        },
        {
            name: 'Member Name',
            selector: row => row.member_name,
            // sortable: true,
            // width: "180px",
            wrap: true,
        },
        {
            name: 'Amount',
            selector: row => `USD ${row.amount_request}`,
            wrap: true,
            // width: "180px"
        },
        {
            name: 'Period',
            selector: row => row.period,
            // sortable: true,
            wrap: true,
            // width: "170px",
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            width: "150px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }
                },
                {
                    when: row => row.status_id === 1 || row.status_id === 7,
                    style: { background: "#FEF4E9", color: "#F79421", }
                },
                {
                    when: row => row.status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C", }
                },
                {
                    when: row => row.status_id === 3 || row.status_id === 5 || row.status_id === 6 || row.status_id === 8 || row.status_id === 9 || row.status_id === 10 || row.status_id === 11 || row.status_id === 12 || row.status_id === 13 || row.status_id === 14 || row.status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", }
                }
            ],
        },
    ];

    const columnsUpdateVA = [
        {
            name: 'No',
            selector: row => row.number,
            // width: "150px",
            wrap: true,
            // sortable: true
        },
        {
            name: 'VA Company Code',
            selector: row => row.company_code,
            // width: "150px",
            wrap: true,
            // sortable: true
        },
        {
            name: 'Member Code',
            selector: row => row.member_code,
            // width: "150px",
            wrap: true,
            // sortable: true
        },
        {
            name: 'Member Name',
            selector: row => row.member_name,
            // sortable: true,
            // width: "180px",
            wrap: true,
        },
        {
            name: 'Amount',
            selector: row => `USD ${row.request_amount}`,
            wrap: true,
            // width: "180px"
        },
        {
            name: 'Period',
            selector: row => row.period_date,
            // sortable: true,
            wrap: true,
            // width: "170px",
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            width: "150px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }
                },
                {
                    when: row => row.status_id === 1 || row.status_id === 7,
                    style: { background: "#FEF4E9", color: "#F79421", }
                },
                {
                    when: row => row.status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C", }
                },
                {
                    when: row => row.status_id === 3 || row.status_id === 5 || row.status_id === 6 || row.status_id === 8 || row.status_id === 9 || row.status_id === 10 || row.status_id === 11 || row.status_id === 12 || row.status_id === 13 || row.status_id === 14 || row.status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", }
                }
            ],
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                width: 'max-content',
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'flex-start',

            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: defaultThemes.default.divider.default,
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
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;VA USD  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Buat VA USD</span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Virtual Account USD</h2>
            </div>
            <div className='base-content mt-3 pb-4'>
                <div className='detail-akun-menu' style={{fontFamily: "Exo", display: 'flex', height: 33}}>
                    <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => pindahHalaman("create")} id="createTab">
                        <span className='menu-detail-akun-span menu-detail-akun-span-active' id="createSpan">Buat VA Baru</span>
                    </div>
                    <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => pindahHalaman("update")} id="updateTab">
                        <span className='menu-detail-akun-span' id="updateSpan">Update VA</span>
                    </div>
                    <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => pindahHalaman("riwayat")} id="riwayatTab">
                        <span className='menu-detail-akun-span' id="riwayatSpan">Riwayat VA</span>
                    </div>
                </div>
                <hr className='hr-style mb-4' style={{marginTop: -2}}/>
                {
                    isVAUSD === 100 ?
                    <>
                        <span className='font-weight-bold mt-3' style={{fontFamily: "Exo", fontWeight: 700}}>Buat VA</span>
                        <div className='d-flex justify-content-start align-items-center mt-3 mb-3' style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'normal', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }}>
                            <div className='ms-2'>Virtual Account akan aktif selama <b>30 hari</b> setelah dibuat, dan akan aktif sejak tanggal <b>{`${new Date().toLocaleDateString('en-GB')} - ${new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()).toLocaleDateString('en-GB')}`}</b></div>
                        </div>
                        <div className='my-4'>
                            <div style={{ fontSize: 14, fontWeight: 400, marginBottom: 10 }}>Jumlah data VA baru</div>
                            <CurrencyInput
                                className="input-text-ez"
                                value={dataVABaru}
                                onValueChange={(e) => handleChange(e)}
                                placeholder="0"
                                style={{ width: "9%", marginLeft: "unset", }}
                                allowDecimals={false}
                                allowNegativeValue={false}
                                maxLength={4}
                            />
                            <button
                                onClick={() => generateDataVABaru(dataVABaru)}
                                // className={dataFromUpload.length === 0 ? 'btn-noez-transfer' : 'btn-ez-transfer'} //untukcsv
                                className={'btn-ez-transfer'} //untuk excel
                                style={{ width: '18%', marginLeft: 10 }}
                            >
                                Generate Virtual Account
                            </button>
                        </div>
                        <hr className='hr-style mb-4' style={{marginTop: -2}}/>
                        <div className='my-4'>
                            <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Daftar File & VA</div>
                            <Row>
                                <Col>
                                    <Row className='d-flex justify-content-start'>
                                        <Col xs={3} className="card-information mt-3" style={{border: stockVA.available_stock.stock_will_run_out ? '1px solid #B9121B' : '1px solid #EBEBEB', height: 'fit-content', padding: '12px 0px 12px 16px'}}>
                                            <div className='d-flex'>
                                                <OverlayTrigger
                                                    placement="bottom"
                                                    trigger={["hover"]}
                                                    overlay={
                                                        <Tooltip style={{ minWidth: 240 }}>Total sisa stok VA tersedia adalah VA yang telah di buat oleh Ezeelink dan telah aktif di OCBC, serta telah mengalami pembaruan status.</Tooltip>
                                                    }
                                                >
                                                    <img src={stockVA.available_stock.stock_will_run_out ? noteInfoRed : noteInfo} width="20" height="20" alt="circle_info" />
                                                </OverlayTrigger>
                                                <span className="p-info" style={{ paddingLeft: 7, width: 110 }}>Total sisa stok VA Tersedia: </span>
                                                <span style={{ fontFamily: "Exo", fontSize: 25, fontWeight: 700, paddingRight: 10, marginTop: 5 }}>{convertToRupiah(stockVA.available_stock.stock, false)}</span>
                                            </div>
                                        </Col>
                                        <Col xs={3} className="card-information mt-3 ms-3" style={{border: stockVA.unavailable_stock.stock_will_run_out ? '1px solid #B9121B' : '1px solid #EBEBEB', height: 'fit-content', padding: '12px 0px 12px 16px'}}>
                                            <div className='d-flex'>
                                                <OverlayTrigger
                                                    placement="bottom"
                                                    trigger={["hover"]}
                                                    overlay={
                                                        <Tooltip style={{ minWidth: 240 }}>Total VA belum tersedia adalah VA yang telah di buat oleh Ezeelink, tapi belum diaktifkan</Tooltip>
                                                    }
                                                >
                                                    <img src={stockVA.unavailable_stock.stock_will_run_out ? noteInfoRed : noteInfo} width="20" height="20" alt="circle_info" />
                                                </OverlayTrigger>
                                                <span className="p-info" style={{ paddingLeft: 7, width: 110 }}>Total VA Belum Tersedia: </span>
                                                <span style={{ fontFamily: "Exo", fontSize: 25, fontWeight: 700, paddingRight: 10, marginTop: 5 }}>{convertToRupiah(stockVA.unavailable_stock.stock, false)}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row className='d-flex justify-content-end'>
                                        <Col xs={3} className="card-information mt-3" style={{border: '1px solid #077E86', height: 44, padding: '8px 24px'}}>
                                            <div className='d-flex' style={{ cursor: "pointer" }} onClick={() => generateFileCSV(isTabFileId)}>
                                                <img src={downloadIcon} width="24" height="24" alt="download_icon" />
                                                <span style={{ paddingLeft: 7, fontFamily: 'Exo', fontSize: 18, fontWeight: 700, color: '#077E86' }}>Download File CSV</span>
                                            </div>
                                        </Col>
                                        <Col xs={3} className="card-information mt-3 ms-3" style={{border: '1px solid #077E86', height: 44, padding: '8px 24px'}}>
                                            <OverlayTrigger
                                                placement="bottom"
                                                trigger={["hover"]}
                                                overlay={
                                                    <Tooltip style={{ minWidth: 240 }}>Perbarui Data VA setelah file request VA yang telah di upload ke Dashboard OCBC sudah berubah. Hanya aktif setelah generate VA.</Tooltip>
                                                }
                                            >
                                                <div className='d-flex' style={{ cursor: "pointer" }} onClick={() => setShowModalPerbaruiDataVA(true)}>
                                                    <img src={refreshIcon} width="24" height="24" alt="refresh_icon" />
                                                    <span className="p-info" style={{ paddingLeft: 7, fontFamily: 'Exo', fontSize: 18, fontWeight: 700, color: '#077E86' }}>Perbarui Data</span>
                                                </div>
                                            </OverlayTrigger>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div className='mt-4' style={{ width: "auto" }}>
                                <div className='detail-akun-menu filename-bar' style={{fontFamily: "Exo", display: 'flex', height: 33, overflowX : "scroll"}}>
                                    {
                                        fileTabs.length !== 0 &&
                                        fileTabs.map(item => (
                                                <div key={item.id} className={`me-2 detail-akun-tabs ${isTabFileId === item.id && "menu-detail-akun-hr-active"}`} onClick={() => pindahFileTabCreate(item.id)} id={item.name}>
                                                    <span className={`menu-detail-akun-span ${isTabFileId === item.id && "menu-detail-akun-span-active"}`} id="createSpan">{item.name}</span>
                                                </div>
                                        ))
                                    }
                                </div>
                                <hr className='hr-style mb-4' style={{marginTop: -2, height: 0}}/>
                                <div className="div-table mt-4 pb-4">
                                    <DataTable
                                        columns={columnsVAUSD}
                                        data={listVAUSD}
                                        customStyles={customStyles}
                                        highlightOnHover
                                        progressPending={pendingVAUSD}
                                        progressComponent={<CustomLoader />}
                                        // pagination
                                    />
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                    <div style={{ marginRight: 10, marginTop: 10 }}>Total Halaman : {totalPageCreate}</div>
                                    <Pagination
                                        activePage={activePageCreate}
                                        itemsCountPerPage={pageNumberCreate.row_per_page}
                                        totalItemsCount={(pageNumberCreate.row_per_page*pageNumberCreate.max_page)}
                                        pageRangeDisplayed={5}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        onChange={(page) => handlePageChangeCreate(page, isTabFileId)}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Modal perbaharui data VA */}
                        <Modal size="xs" className='py-3' centered show={showModalPerbaruiDataVA} onHide={() => setShowModalPerbaruiDataVA(false)}>
                            <Modal.Title className='text-center mt-4 px-3' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20, color: "#393939" }}>
                                Yakin Perbarui file data VA dan data di Velocity (OCBC) sudah berubah?
                            </Modal.Title>
                            <Modal.Body >
                                <div className='text-center px-2' style={{ fontFamily: 'Nunito', color: "#848484", fontSize: 14 }}>
                                    Terdapat <b>{`${10}`} VA Baru yang akan Tersedia</b> untuk dapat digunakan oleh partner
                                </div>
                                <div className='d-flex justify-content-center align-items-center mt-3'>
                                    <div className='me-1'>
                                        <button
                                            onClick={() => setShowModalPerbaruiDataVA(false)}
                                            style={{
                                                fontFamily: "Exo",
                                                fontSize: 16,
                                                fontWeight: 900,
                                                alignItems: "center",
                                                padding: "12px 24px",
                                                gap: 8,
                                                width: 136,
                                                height: 45,
                                                background: "#FFFFFF",
                                                color: "#888888",
                                                border: "0.6px solid #EBEBEB",
                                                borderRadius: 6,
                                            }}
                                        >
                                            Batal
                                        </button>
                                    </div>
                                    <div className="ms-1">
                                        <button
                                            onClick={() => renewDataVA(isTabFileId)}
                                            style={{
                                                fontFamily: "Exo",
                                                fontSize: 16,
                                                fontWeight: 900,
                                                alignItems: "center",
                                                padding: "12px 24px",
                                                gap: 8,
                                                width: 136,
                                                height: 45,
                                                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                                border: "0.6px solid #2C1919",
                                                borderRadius: 6,
                                            }}
                                        >
                                            Konfirmasi
                                        </button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </> :
                    isVAUSD === 101 ?
                    <>
                        <span className='font-weight-bold mt-3' style={{fontFamily: "Exo", fontWeight: 700}}>Daftar VA</span>
                        <Row className='d-flex justify-content-between mt-3'>
                            <Col xs={5}>
                                <Row className=' justify-content-around'>
                                    <Col xs={3} className="card-information" style={{border: '1px solid #EBEBEB', height: 'fit-content', padding: '12px 0px 12px 16px'}}>
                                        <div className='d-flex'>
                                            <span className="p-info" style={{ paddingLeft: 7, width: 110 }}>Total VA yang perlu update: </span>
                                            <span style={{ fontFamily: "Exo", fontSize: 25, fontWeight: 700, paddingRight: 10, marginTop: 5 }}>{convertToRupiah(stockVA.available_stock.stock, false)}</span>
                                        </div>
                                    </Col>
                                    <Col xs={3} className="card-information ms-3">
                                        <div className='d-flex'>
                                            <button
                                                onClick={() => downloadVAUpdated()}
                                                className={listUpdateVA.length !== 0 ? 'btn-va-usd-active' : "btn-va-usd-non-active"}
                                                disabled={listUpdateVA.length === 0}
                                            >
                                                Download File VA Terupdate
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={1}>
                                <div style={{ border:"0.5px solid #EBEBEB", width: 0, borderRadius: "unset", height: 35, marginTop: 18 }}></div>
                            </Col>
                            <Col xs={4}>
                                <Row style={{border:"1px solid #EBEBEB", borderRadius: 8, height: 70, marginTop: 5}}>
                                    <Col className="card-information d-flex justify-content-center ms-3 mt-1" style={{ height: 50, padding: '12px 0px 12px 16px' }}>
                                        <div className="dropdown dropVAUSD">
                                            <ReactSelect
                                                isMulti
                                                closeMenuOnSelect={false}
                                                hideSelectedOptions={false}
                                                allowSelectAll={true}
                                                options={dataListFile}
                                                value={selectedFileUpdate}
                                                onChange={handleChangeFile}
                                                placeholder="Pilih File"
                                                components={{ Option }}
                                                styles={customStylesSelectedOption}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={1} className='d-flex justify-content-center'>
                                        <div style={{border:"0.5px solid #EBEBEB", width: 0, height: 35, marginTop: 18}}></div>
                                    </Col>
                                    <Col className='d-flex justify-content-center' style={{ paddingLeft: 'unset' }}>
                                        <button style={{ backgroundColor: 'unset', border: "1px solid #077E86", borderRadius: 8, height: 35, marginTop: 18, marginRight: 20 }}>
                                            <img src={downloadIcon} width="24" height="24" alt="download_icon" />
                                        </button>
                                        <button onClick={() => setShowModalKonfirmasiVAUpdate(true)} style={{ backgroundColor: 'unset', color: '#077E86', fontWeight: 700, border: "1px solid #077E86", borderRadius: 8, height: 35, marginTop: 18 }}>
                                            Konfirmasi
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <div className="div-table mt-4 pb-4">
                            <DataTable
                                columns={columnsUpdateVA}
                                data={listUpdateVA}
                                customStyles={customStyles}
                                highlightOnHover
                                progressPending={pendingVAUSD}
                                progressComponent={<CustomLoader />}
                                // pagination
                            />
                        </div>
                        {/* Modal konfirmasi file VA update */}
                        <Modal size="xs" className='py-3' centered show={showModalKonfirmasiVAUpdate} onHide={() => setShowModalKonfirmasiVAUpdate(false)}>
                            <Modal.Title className='text-center mt-4 px-3' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20, color: "#393939" }}>
                                Yakin file data VA yang di upload ke Velocity (OCBC) sudah berubah?
                            </Modal.Title>
                            <Modal.Body >
                                <div className='text-center px-2' style={{ fontFamily: 'Nunito', color: "#848484", fontSize: 14 }}>
                                    Total data VA yang akan di update adalah <b>{`${10}`}</b> data
                                </div>
                                <div className='d-flex justify-content-center align-items-center mt-3'>
                                    <div className='me-1'>
                                        <button
                                            onClick={() => setShowModalKonfirmasiVAUpdate(false)}
                                            style={{
                                                fontFamily: "Exo",
                                                fontSize: 16,
                                                fontWeight: 900,
                                                alignItems: "center",
                                                padding: "12px 24px",
                                                gap: 8,
                                                width: 136,
                                                height: 45,
                                                background: "#FFFFFF",
                                                color: "#888888",
                                                border: "0.6px solid #EBEBEB",
                                                borderRadius: 6,
                                            }}
                                        >
                                            Batal
                                        </button>
                                    </div>
                                    <div className="ms-1">
                                        <button
                                            onClick={() => confirmUpdatedVAUSD(selectedFileUpdate)}
                                            style={{
                                                fontFamily: "Exo",
                                                fontSize: 16,
                                                fontWeight: 900,
                                                alignItems: "center",
                                                padding: "12px 24px",
                                                gap: 8,
                                                width: 136,
                                                height: 45,
                                                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                                border: "0.6px solid #2C1919",
                                                borderRadius: 6,
                                            }}
                                        >
                                            Konfirmasi
                                        </button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </> :
                    <>
                    </>
                }
            </div>
        </div>
    )
}

export default CreateVAUSD