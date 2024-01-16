import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import $ from 'jquery'
import noteInfo from "../../assets/icon/note_icon_grey_transparent_bg.svg"
import noteInfoRed from "../../assets/icon/note_icon_red_transparent_bg.svg"
import downloadIcon from "../../assets/icon/download_icon.svg"
import downloadIconGrey from "../../assets/icon/download_icon_grey.svg"
import refreshIcon from "../../assets/icon/refresh_icon.svg"
import { Col, Form, Modal, OverlayTrigger, Row, Toast, Tooltip } from '@themesberg/react-bootstrap'
import { BaseURL, convertToRupiah, errorCatch, getToken, setUserSession, CustomLoader } from '../../function/helpers'
import encryptData from '../../function/encryptData'
import CurrencyInput from "react-currency-input-field";
import axios from 'axios'
import DataTable, { defaultThemes } from 'react-data-table-component'
import Pagination from 'react-js-pagination'
import * as XLSX from "xlsx"
import ReactSelect, { components } from 'react-select';
import Checklist from '../../assets/icon/checklist_icon.svg'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { saveAs } from 'file-saver';

function CreateVAUSD() {

    const history = useHistory()
    const [isVAUSD, setIsVAUSD] = useState(100)

    // STATE VA BARU

    const [isTabFileIdVABaru, setIsTabFileIdVABaru] = useState(1)
    const [selectedFileNameVAUSDBaru, setSelectedFileNameVAUSDBaru] = useState("")
    const [unAvailableVAUSDBaru, setUnAvailableVAUSDBaru] = useState(0)
    const [dataVABaru, setDataVABaru] = useState("0")
    const [fileTabsVABaru, setFileTabsVABaru] = useState([])
    const [listVAUSDBaru, setListVAUSDBaru] = useState([])
    const [pendingVAUSDBaru, setPendingVAUSDBaru] = useState(false)
    const [stockVABaru, setStockVABaru] = useState({
        available_stock: {
            stock: 0,
            stock_will_run_out: true
        },
        unavailable_stock: {
            stock: 0,
            stock_will_run_out: false
        }
    })
    const [totalPageVABaru, setTotalPageVABaru] = useState(1)
    const [activePageVABaru, setActivePageVABaru] = useState(1)
    const [pageNumberVABaru, setPageNumberVABaru] = useState({})
    const [showModalPerbaruiDataVABaru, setShowModalPerbaruiDataVABaru] = useState(false)
    const [showToastSuccessUpdateAvailableVABaru, setShowToastSuccessUpdateAvailableVABaru] = useState(false)
    const [successAvailableUpdateMessageVABaru, setSuccessAvailableUpdateMessageVABaru] = useState("")

    // STATE VA BARU END

    // STATE UPDATE VA

    const [dataListFileUpdateVA, setDataListFileUpdateVA] = useState([])
    const [dataListFileAPIUpdateVA, setDataListFileAPIUpdateVA] = useState([])
    const [selectedFileUpdateUpdateVA, setSelectedFileUpdateUpdateVA] = useState([])
    const [listUpdateVA, setListUpdateVA] = useState([])
    const [pendingUpdateVA, setPendingUpdateVA] = useState(false)
    const [showModalKonfirmasiUpdateVA, setShowModalKonfirmasiUpdateVA] = useState(false)
    const [totalPageUpdateVA, setTotalPageUpdateVA] = useState(1)
    const [activePageUpdateVA, setActivePageUpdateVA] = useState(1)
    const [pageNumberUpdateVA, setPageNumberUpdateVA] = useState({})
    const [totalDataConfirmationUpdateVA, setTotalDataConfirmationUpdateVA] = useState(0)

    // STATE UPDATE VA END

    // STATE RIWAYAT VA

    const [dataRiwayatVAUSD, setDataRiwayatVAUSD] = useState([])
    const [pendingRiwayatVA, setPendingRiwayatVA] = useState(false)
    const [totalPageRiwayatVA, setTotalPageRiwayatVA] = useState(1)
    const [activePageRiwayatVA, setActivePageRiwayatVA] = useState(1)
    const [pageNumberRiwayatVA, setPageNumberRiwayatVA] = useState({})
    const [inputHandleRiwayatVA, setInputHandleRiwayatVA] = useState({
        kodeVARiwayatVA: "",
        namaFileRiwayatVA: "",
        statusRiwayatVA: 0,
        periodeRiwayatVA: 0
    })
    const [showDateRiwayatVA, setShowDateRiwayatVA] = useState("none")
    const [stateRiwayatVA, setStateRiwayatVA] = useState(null)
    const [dateRangeRiwayatVA, setDateRangeRiwayatVA] = useState([])

    const currentDate = new Date().toLocaleString('en-US').split(',')[0]
    const tomorrowDate = new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-US').split(',')[0]
    const sevenDaysLater = new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString('en-US').split(',')[0]
    const firstDayThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleString('en-US').split(',')[0]
    const lastDayThisMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, -0).toLocaleString('en-US').split(',')[0]
    const firstDayNextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('en-US').split(',')[0]
    const lastDayNextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 2, -0).toLocaleDateString('en-US').split(',')[0]

    // STATE RIWAYAT VA END

    // FUNCTION SECTION TAB CREATE NEW VA

    function handlePageChangeCreate(page, bulkId) {
        setActivePageVABaru(page)
        getVAUSD(bulkId, page)
    }

    function handleChangeVABaru(e) {
        if (e === undefined || e === "") {
            setDataVABaru("0")
        } else if (e.length === 4 && e !== "1000") {
            setDataVABaru("1000")
        } else {
            setDataVABaru(e)
        }
    }

    function pindahFileTabCreate(item) {
        setIsTabFileIdVABaru(item.id)
        setSelectedFileNameVAUSDBaru(item.name)
        setUnAvailableVAUSDBaru(item.total_unavailable)
        setActivePageVABaru(1)
        getVAUSD(item.id, 1)
    }

    function perbaruiDataHandleClick(listVA) {
        let isAvailable = 0
        listVA.forEach(item => {
            if (item.status_name === "Tersedia") {
                isAvailable++
            }
        })
        if (isAvailable !== 0) {
            setSuccessAvailableUpdateMessageVABaru("Semua Data VA Sudah Tersedia")
            setShowModalPerbaruiDataVABaru(false)
            setShowToastSuccessUpdateAvailableVABaru(true)
            setTimeout(() => {
                setShowToastSuccessUpdateAvailableVABaru(false)
            }, 5000);
        } else {
            setShowModalPerbaruiDataVABaru(true)
        }
    }

    async function renewDataVA(bulkId, listVA) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"bulk_id": ${bulkId}, "username": ""}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            // console.log(dataParams, 'dataParams');
            const newData = await axios.post(BaseURL + "/VirtualAccountUSD/UpdateUnvailabletoAvailableVA", {data: dataParams}, {headers: headers})
            // console.log(newData, 'newData');
            if (newData.status === 200 && newData.data.response_code === 200 && newData.data.response_new_token === null) {
                setActivePageVABaru(1)
                getVAUSD(bulkId, 1)
                getFileNameAndStockVA()
                setShowModalPerbaruiDataVABaru(false)
                setSuccessAvailableUpdateMessageVABaru(`Berhasil perbarui <b>${listVA.length}</b> data VA`)
                setShowToastSuccessUpdateAvailableVABaru(true)
                setTimeout(() => {
                    setShowToastSuccessUpdateAvailableVABaru(false)
                }, 5000);
            } else if (newData.status === 200 && newData.data.response_code === 200 && newData.data.response_new_token !== null) {
                setUserSession(newData.data.response_new_token)
                setActivePageVABaru(1)
                getVAUSD(bulkId, 1)
                getFileNameAndStockVA()
                setShowModalPerbaruiDataVABaru(false)
                setSuccessAvailableUpdateMessageVABaru(`Berhasil perbarui <b>${listVA.length}</b> data VA`)
                setShowToastSuccessUpdateAvailableVABaru(true)
                setTimeout(() => {
                    setShowToastSuccessUpdateAvailableVABaru(false)
                }, 5000);
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function generateFileCSV(bulkId, fileName, listVA) {
        try {
            if (listVA.length === 0 || listVA[0].status_id === 11) {
                // console.log("Data Kosong");
            } else {
                const auth = 'Bearer ' + getToken();
                const dataParams = encryptData(`{"bulk_id": ${bulkId}, "username": ""}`)
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': auth
                }
                const dataFileCSV = await axios.post(BaseURL + "/VirtualAccountUSD/GetUnavailableVAUSD", {data: dataParams}, {headers: headers})
                // console.log(dataFileCSV, 'dataFileCSV');
                if (dataFileCSV.status === 200 && dataFileCSV.data.response_code === 200 && dataFileCSV.data.response_new_token === null) {
                    let data = []
                    dataFileCSV.data.response_data.results.forEach(item => {
                        let obj = {}
                        obj.company_code = `${item.company_code}`
                        obj.member_code = `${item.member_code}`
                        obj.member_name = `${item.member_name}`
                        obj.amount = ""
                        obj.period = `${new Date(item.period).toLocaleDateString('en-GB').split("/20").join("/")}`
                        obj.member_status = ""
                        data.push(obj)
                    })
                    // console.log(data, 'data new');
                    const arrayOfArraysNextIndex = data.map(obj => {
                        const values = Object.values(obj);
                        return values;
                    });
                    // console.log(arrayOfArraysNextIndex, 'arrayOfArraysNextIndex');
                    const ws = XLSX.utils.aoa_to_sheet(arrayOfArraysNextIndex)
                    const csv = XLSX.utils.sheet_to_csv(ws)
                    const zip = require('jszip')()
                    zip.file(`${fileName}.csv`, csv)
                    zip.generateAsync({type: "blob"}).then(content => {
                        saveAs(content, `${fileName}.zip`)
                    })
                    // const csvContent = `data:text/csv;charset=utf-8,${csv}`;
                    // const encodedURI = encodeURI(csvContent);
                    // console.log(encodedURI, 'encodedURI');
                    // var link = document.createElement("a");
                    // link.setAttribute('download', fileName);
                    // link.href = encodedURI;
                    // document.body.appendChild(link);
                    // link.click();
                    // link.remove();
                } else if (dataFileCSV.status === 200 && dataFileCSV.data.response_code === 200 && dataFileCSV.data.response_new_token !== null) {
                    setUserSession(dataFileCSV.data.response_new_token)
                    let data = []
                    dataFileCSV.data.response_data.results.forEach(item => {
                        let obj = {}
                        obj.company_code = `${item.company_code}`
                        obj.member_code = `${item.member_code}`
                        obj.member_name = `${item.member_name}`
                        obj.amount = ""
                        obj.period = `${new Date(item.period).toLocaleDateString('en-GB').split("/20").join("/")}`
                        obj.member_status = ""
                        data.push(obj)
                    })
                    const arrayOfArraysNextIndex = data.map(obj => {
                        const values = Object.values(obj);
                        return values;
                    });
                    const ws = XLSX.utils.aoa_to_sheet(arrayOfArraysNextIndex)
                    const csv = XLSX.utils.sheet_to_csv(ws)
                    const zip = require('jszip')()
                    zip.file(`${fileName}.csv`, csv)
                    zip.generateAsync({type: "blob"}).then(content => {
                        saveAs(content, `${fileName}.zip`)
                    })
                }
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getVAUSD(fileId, page) {
        try {
            setPendingVAUSDBaru(true)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"bulk_id": ${fileId}, "page": ${page}, "row_per_page": 10}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            // console.log(dataParams, 'dataParams');
            const dataListVAUSD = await axios.post(BaseURL + "/VirtualAccountUSD/GetVirtualAccountUSD", {data: dataParams}, {headers: headers})
            // console.log(dataListVAUSD, 'dataListVAUSD');
            if (dataListVAUSD.status === 200 && dataListVAUSD.data.response_code === 200 && dataListVAUSD.data.response_new_token === null) {
                dataListVAUSD.data.response_data.results = dataListVAUSD.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberVABaru(dataListVAUSD.data.response_data)
                setTotalPageVABaru(dataListVAUSD.data.response_data.max_page)
                setListVAUSDBaru(dataListVAUSD.data.response_data.results)
                setPendingVAUSDBaru(false)
            } else if (dataListVAUSD.status === 200 && dataListVAUSD.data.response_code === 200 && dataListVAUSD.data.response_new_token !== null) {
                setUserSession(dataListVAUSD.data.response_new_token)
                dataListVAUSD.data.response_data.results = dataListVAUSD.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberVABaru(dataListVAUSD.data.response_data)
                setTotalPageVABaru(dataListVAUSD.data.response_data.max_page)
                setListVAUSDBaru(dataListVAUSD.data.response_data.results)
                setPendingVAUSDBaru(false)
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
            // console.log(fileNameAndStockVa, 'fileNameAndStockVa');
            if (fileNameAndStockVa.status === 200 && fileNameAndStockVa.data.response_code === 200 && fileNameAndStockVa.data.response_new_token === null) {
                if (fileNameAndStockVa.data.response_data.results.bulk === null) {
                    fileNameAndStockVa.data.response_data.results.bulk = []
                    setFileTabsVABaru(fileNameAndStockVa.data.response_data.results.bulk)
                } else if (fileNameAndStockVa.data.response_data.results.bulk?.length !== 0) {
                    setFileTabsVABaru(fileNameAndStockVa.data.response_data.results.bulk)
                    setIsTabFileIdVABaru(fileNameAndStockVa.data.response_data.results.bulk[0].id)
                    setSelectedFileNameVAUSDBaru(fileNameAndStockVa.data.response_data.results.bulk[0].name)
                    setUnAvailableVAUSDBaru(fileNameAndStockVa.data.response_data.results.bulk[0].total_unavailable)
                    setActivePageVABaru(1)
                    getVAUSD(fileNameAndStockVa.data.response_data.results.bulk[0]?.id, 1)
                    setStockVABaru(fileNameAndStockVa.data.response_data.results.stock)
                }
            } else if (fileNameAndStockVa.status === 200 && fileNameAndStockVa.data.response_code === 200 && fileNameAndStockVa.data.response_new_token !== null) {
                setUserSession(fileNameAndStockVa.data.response_new_token)
                if (fileNameAndStockVa.data.response_data.results.bulk === null) {
                    fileNameAndStockVa.data.response_data.results.bulk = []
                    setFileTabsVABaru(fileNameAndStockVa.data.response_data.results.bulk)
                } else if (fileNameAndStockVa.data.response_data.results.bulk?.length !== 0) {
                    setFileTabsVABaru(fileNameAndStockVa.data.response_data.results.bulk)
                    setIsTabFileIdVABaru(fileNameAndStockVa.data.response_data.results.bulk[0].id)
                    setSelectedFileNameVAUSDBaru(fileNameAndStockVa.data.response_data.results.bulk[0].name)
                    setUnAvailableVAUSDBaru(fileNameAndStockVa.data.response_data.results.bulk[0].total_unavailable)
                    setActivePageVABaru(1)
                    getVAUSD(fileNameAndStockVa.data.response_data.results.bulk[0]?.id, 1)
                    setStockVABaru(fileNameAndStockVa.data.response_data.results.stock)
                }
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
            // console.log(generateVA, 'generateVA');
            if (generateVA.status === 200 && generateVA.data.response_code === 200 && generateVA.data.response_new_token === null) {
                getFileNameAndStockVA(generateVA.data.response_data.results)
                setDataVABaru(0)
            } else if (generateVA.status === 200 && generateVA.data.response_code === 200 && generateVA.data.response_new_token !== null) {
                setUserSession(generateVA.data.response_new_token)
                getFileNameAndStockVA(generateVA.data.response_data.results)
                setDataVABaru(0)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    // FUNCTION SECTION TAB CREATE NEW VA END

    // FUNCTION SECTION TAB UPDATE VA

    function downloadFileVABulk(selectedFile, listVA) {
        const foundedList = listVA.find(item => item.id === selectedFile.value)
        window.open(foundedList.source)
        // if (selectedFile.length === 0) {
        //     console.log('data kosong');
        // } else if (selectedFile.length === 1) {
        //     const foundedList = listVA.find(item => item.id === selectedFile[0].value)
        //     // window.open("www.google.com", '_blank')
        //     window.open(foundedList.source)
        //     // window.location.replace("www.google.com",)
        // } else {
        //     console.log('lebih dari 1');
        //     let arrSource = []
        //     listVA.forEach(item => {
        //         const foundedList = selectedFile.find(el => el.value === item.id)
        //         if (foundedList !== undefined) {
        //             arrSource.push(item.source)
        //         }
        //     })
        //     console.log(arrSource, 'arrSource');
        //     arrSource.forEach((item, id) => {console.log(item, id+1); window.open(item)})
        // }
    }

    function handleChangeFile(selected, listFile) {
        const foundFile = listFile.find(found => found.id === selected.value)
        setTotalDataConfirmationUpdateVA(foundFile.total_data)
        // if (selected.length === 1) {
        //     console.log('masuk 1');
        //     const foundFile = listFile.find(found => found.id === selected.value)
        //     console.log(foundFile, 'foundFile');
        //     setTotalDataConfirmationUpdateVA(foundFile.total_data)
        // } else if (selected.length > 1) {
        //     console.log('masuk 2');
        //     let totalData = 0
        //     selected.forEach(item => {
        //         listFile.forEach(item2 => {
        //             if (item2.id === item.value) {
        //                 totalData += item2.total_data
        //             }
        //         })
        //     })
        //     setTotalDataConfirmationUpdateVA(totalData)
        // } else {
        //     console.log('masuk 3');
        //     setTotalDataConfirmationUpdateVA(0)
        // }
        setSelectedFileUpdateUpdateVA(selected)
    }

    async function confirmUpdatedVAUSD(listFile) {
        try {
            // let idLists = []
            // listFile.forEach(item => {
            //     idLists.push(item.value)
            // })
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"list": ${JSON.stringify([listFile.value])}}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            // console.log(dataParams, 'dataParams');
            const confirmedVAUSD = await axios.post(BaseURL + "/VirtualAccountUSD/ConfirmVAUSDFileUpdated", {data: dataParams}, {headers: headers})
            // console.log(confirmedVAUSD, 'confirmedVAUSD');
            if (confirmedVAUSD.status === 200 && confirmedVAUSD.data.response_code === 200 && confirmedVAUSD.data.response_new_token === null) {
                setShowModalKonfirmasiUpdateVA(false)
                getListUpdateVA(1)
                getDataNameFile()
            } else if (confirmedVAUSD.status === 200 && confirmedVAUSD.data.response_code === 200 && confirmedVAUSD.data.response_new_token !== null) {
                setUserSession(confirmedVAUSD.data.response_new_token)
                setShowModalKonfirmasiUpdateVA(false)
                getListUpdateVA(1)
                getDataNameFile()
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
            // console.log(downloadUpdatedVA, 'downloadUpdatedVA');
            if (downloadUpdatedVA.status === 200 && downloadUpdatedVA.data.response_code === 200 && downloadUpdatedVA.data.response_new_token === null) {
                getListUpdateVA(1)
                getDataNameFile()
                setSelectedFileUpdateUpdateVA([])
            } else if (downloadUpdatedVA.status === 200 && downloadUpdatedVA.data.response_code === 200 && downloadUpdatedVA.data.response_new_token !== null) {
                setUserSession(downloadUpdatedVA.data.response_new_token)
                getListUpdateVA(1)
                getDataNameFile()
                setSelectedFileUpdateUpdateVA([])
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
            // console.log(dataListFileName, 'dataListFileName');
            if (dataListFileName.status === 200 && dataListFileName.data.response_code === 200 && dataListFileName.data.response_new_token === null) {
                let newArr = []
                dataListFileName.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.id
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataListFileUpdateVA(newArr)
                setDataListFileAPIUpdateVA(dataListFileName.data.response_data.results)
            } else if (dataListFileName.status === 200 && dataListFileName.data.response_code === 200 && dataListFileName.data.response_new_token !== null) {
                setUserSession(dataListFileName.data.response_new_token)
                let newArr = []
                dataListFileName.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.id
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataListFileUpdateVA(newArr)
                setDataListFileAPIUpdateVA(dataListFileName.data.response_data.results)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getListUpdateVA(page) {
        try {
            setPendingUpdateVA(true)
            setActivePageUpdateVA(page)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"page": ${page}, "row_per_page": 10}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            // console.log(dataParams, 'dataParams');
            const dataListUpdateVA = await axios.post(BaseURL + "/VirtualAccountUSD/UpdateVAPaging", {data: dataParams}, {headers: headers})
            // console.log(dataListUpdateVA, 'dataListUpdateVA');
            if (dataListUpdateVA.status === 200 && dataListUpdateVA.data.response_code === 200 && dataListUpdateVA.data.response_new_token === null) {
                dataListUpdateVA.data.response_data.results = dataListUpdateVA.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberUpdateVA(dataListUpdateVA.data.response_data)
                setTotalPageUpdateVA(dataListUpdateVA.data.response_data.max_page)
                setListUpdateVA(dataListUpdateVA.data.response_data.results)
                setPendingUpdateVA(false)
            } else if (dataListUpdateVA.status === 200 && dataListUpdateVA.data.response_code === 200 && dataListUpdateVA.data.response_new_token !== null) {
                setUserSession(dataListUpdateVA.data.response_new_token)
                dataListUpdateVA.data.response_data.results = dataListUpdateVA.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberUpdateVA(dataListUpdateVA.data.response_data)
                setTotalPageUpdateVA(dataListUpdateVA.data.response_data.max_page)
                setListUpdateVA(dataListUpdateVA.data.response_data.results)
                setPendingUpdateVA(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    // FUNCTION SECTION TAB UPDATE VA END

    // FUNCTION SECTION TAB RIWAYAT VA

    async function getRiwayatVAUSD(page, kodeVa, fileName, statusId, dateRange, periode) {
        try {
            setActivePageRiwayatVA(page)
            setPendingRiwayatVA(true)
            const auth = 'Bearer ' + getToken();
            // const dataParamsAdmin = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,4,19]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "payment_code":"${(paymentCode.length !== 0) ? paymentCode : ""}", "sub_partner_id":"${(partnerId.length !== 0) ? partnerId : ""}", "date_from": "${(dateRange.length !== 0) ? (typeof(dateRange) === 'object' ? dateRange[0] : periode[0]) : ""}", "date_to": "${(dateRange.length !== 0) ? (typeof(dateRange) === 'object' ? dateRange[1] : periode[1]) : ""}", "partner_trans_id":"${partnerTransId}", "reference_no": "${reffNo}", "keterangan": "${keterangan}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
            // const dataParams = encryptData(`{ "bulk_id": 0, "status": [${statusId !== 0 ? statusId : [2, 3, 11]}], "username": "${fileName}", "va_number": "${kodeVa}", "page" : ${page}, "row_per_page": 10, "date_from": "${dateId === 7 ? dateRange[0] : ""}", "date_to": "${dateId === 7 ? dateRange[1] : ""}", "period": ${dateId !== 0 ? dateId : 2} }`)
            const dataParams = encryptData(`{ "bulk_id": 0, "status": [${statusId !== 0 ? statusId : [2, 7, 9, 11, 12, 13]}], "username": "", "filename": "${fileName}", "va_number": "${kodeVa}", "page" : ${page}, "row_per_page": 10, "date_from": "${(dateRange.length !== 0) ? (typeof(dateRange) === 'object' ? dateRange[0] : periode[0]) : ""}", "date_to": "${(dateRange.length !== 0) ? (typeof(dateRange) === 'object' ? dateRange[1] : periode[1]) : ""}" }`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataRiwayatVAUSD = await axios.post(BaseURL + "/VirtualAccountUSD/GetTransactionVAUSDBasedOnBulk", {data: dataParams}, {headers: headers})
            // console.log(dataRiwayatVAUSD, 'dataRiwayatVAUSD');
            if (dataRiwayatVAUSD.status === 200 && dataRiwayatVAUSD.data.response_code === 200 && dataRiwayatVAUSD.data.response_new_token === null) {
                setPageNumberRiwayatVA(dataRiwayatVAUSD.data.response_data)
                setTotalPageRiwayatVA(dataRiwayatVAUSD.data.response_data.max_page)
                setDataRiwayatVAUSD(dataRiwayatVAUSD.data.response_data.results)
                setPendingRiwayatVA(false)
            } else if (dataRiwayatVAUSD.status === 200 && dataRiwayatVAUSD.data.response_code === 200 && dataRiwayatVAUSD.data.response_new_token !== null) {
                setUserSession(dataRiwayatVAUSD.data.response_new_token)
                setPageNumberRiwayatVA(dataRiwayatVAUSD.data.response_data)
                setTotalPageRiwayatVA(dataRiwayatVAUSD.data.response_data.max_page)
                setDataRiwayatVAUSD(dataRiwayatVAUSD.data.response_data.results)
                setPendingRiwayatVA(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    function resetButtonHandle() {
        setInputHandleRiwayatVA({
            ...inputHandleRiwayatVA,
            kodeVARiwayatVA: "",
            namaFileRiwayatVA: "",
            statusRiwayatVA: 0,
            periodeRiwayatVA: 0
        })
        setShowDateRiwayatVA("none")
        setStateRiwayatVA(null)
        setDateRangeRiwayatVA([])
    }

    function handleChange(e) {
        setInputHandleRiwayatVA({
            ...inputHandleRiwayatVA,
            [e.target.name]: e.target.value
        })
    }

    function handleChangePeriodeRiwayatVA(e) {
        if (e.target.value === "7") {
            setShowDateRiwayatVA("")
            setInputHandleRiwayatVA({
                ...inputHandleRiwayatVA,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateRiwayatVA("none")
            setStateRiwayatVA(null)
            setDateRangeRiwayatVA([])
            setInputHandleRiwayatVA({
                ...inputHandleRiwayatVA,
                [e.target.name] : e.target.value.split(",")
            })
        }
    }

    function pickDateRiwayatVA(item) {
        setStateRiwayatVA(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeRiwayatVA(item)
        }
    }

    // FUNCTION SECTION TAB RIWAYAT VA END

    useEffect(() => {
        getFileNameAndStockVA()
        // getListUpdateVA(1)
        // getDataNameFile()
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
            setDataVABaru("0")
            setSelectedFileUpdateUpdateVA([])
            resetButtonHandle()
            getFileNameAndStockVA()
            VAUSDTabs(100)
        } else if (param === "update") {
            setDataVABaru("0")
            setSelectedFileUpdateUpdateVA([])
            resetButtonHandle()
            getListUpdateVA(1)
            getDataNameFile()
            VAUSDTabs(101)
        } else if (param === "riwayat") {
            setDataVABaru("0")
            setSelectedFileUpdateUpdateVA([])
            resetButtonHandle()
            getRiwayatVAUSD(1, inputHandleRiwayatVA.kodeVARiwayatVA, inputHandleRiwayatVA.namaFileRiwayatVA, inputHandleRiwayatVA.statusRiwayatVA, ([`${currentDate}`, `${currentDate}`]), dateRangeRiwayatVA)
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
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", fontWeight: 600 }
                },
                {
                    when: row => row.status_id === 1 || row.status_id === 7 || row.status_id === 11 || row.status_id === 12,
                    style: { background: "#FEF4E9", color: "#F79421", fontWeight: 600 }
                },
                {
                    when: row => row.status_id === 4 || row.status_id === 9,
                    style: { background: "#FDEAEA", color: "#EE2E2C", fontWeight: 600 }
                },
                {
                    when: row => row.status_id === 3 || row.status_id === 5 || row.status_id === 6 || row.status_id === 8 || row.status_id === 10 || row.status_id === 13 || row.status_id === 14 || row.status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", fontWeight: 600 }
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
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", fontWeight: 600 }
                },
                {
                    when: row => row.status_id === 1 || row.status_id === 7 || row.status_id === 11 || row.status_id === 12,
                    style: { background: "#FEF4E9", color: "#F79421", fontWeight: 600 }
                },
                {
                    when: row => row.status_id === 4 || row.status_id === 9,
                    style: { background: "#FDEAEA", color: "#EE2E2C", fontWeight: 600 }
                },
                {
                    when: row => row.status_id === 3 || row.status_id === 5 || row.status_id === 6 || row.status_id === 8 || row.status_id === 10 || row.status_id === 13 || row.status_id === 14 || row.status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", fontWeight: 600 }
                }
            ],
        },
    ];

    const columnsRiwayatVA = [
        {
            name: 'No',
            selector: row => row.No,
            width: "80px",
            wrap: true,
            // sortable: true
        },
        {
            name: 'Kode VA',
            selector: row => row.va_number,
            // width: "150px",
            wrap: true,
            // sortable: true
        },
        {
            name: 'Nama File',
            selector: row => row.file_name,
            // width: "150px",
            wrap: true,
            // sortable: true
        },
        {
            name: 'Periode',
            selector: row => row.period,
            // sortable: true,
            // width: "180px",
            wrap: true,
        },
        {
            name: 'Status',
            selector: row => row.status !== 13 ? row.status_name : "Ditutup",
            width: "150px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", fontWeight: 600 }
                },
                {
                    when: row => row.status === 1 || row.status === 7 || row.status === 11 || row.status === 12,
                    style: { background: "#FEF4E9", color: "#F79421", fontWeight: 600 }
                },
                {
                    when: row => row.status === 4 || row.status === 9 || row.status === 13,
                    style: { background: "#FDEAEA", color: "#EE2E2C", fontWeight: 600 }
                },
                {
                    when: row => row.status === 3 || row.status === 5 || row.status === 6 || row.status === 8 || row.status === 10 || row.status === 14 || row.status === 15,
                    style: { background: "#F0F0F0", color: "#888888", fontWeight: 600 }
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

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            {
                showToastSuccessUpdateAvailableVABaru &&
                <div style={{ position: "fixed", zIndex: 999, width: "80%" }} className="d-flex justify-content-center align-items-center mt-4 ms-5">
                    <Toast style={{ width: "900px", backgroundColor: "#077E86" }} position="bottom-center" className="text-center">
                        <Toast.Body className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span><span style={{ fontSize: 16 }} dangerouslySetInnerHTML={{ __html: successAvailableUpdateMessageVABaru }} /></Toast.Body>
                    </Toast>
                </div>
            }
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
                                <div className='ms-2'>Virtual Account akan aktif selama <b>30 hari</b> setelah dibuat, dan akan aktif sejak tanggal <b>{`${new Date().toLocaleDateString('en-GB')} - ${new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString('en-GB')}`}</b></div>
                            </div>
                            <div className='my-4'>
                                <div style={{ fontSize: 14, fontWeight: 400, marginBottom: 10 }}>Jumlah data VA baru</div>
                                <CurrencyInput
                                    className="input-text-ez"
                                    value={dataVABaru}
                                    onValueChange={(e) => handleChangeVABaru(e)}
                                    placeholder="0"
                                    style={{ width: "9%", marginLeft: "unset", }}
                                    allowDecimals={false}
                                    allowNegativeValue={false}
                                    maxLength={4}
                                />
                                <button
                                    onClick={() => generateDataVABaru(dataVABaru)}
                                    // className={dataFromUpload.length === 0 ? 'btn-noez-transfer' : 'btn-ez-transfer'} //untukcsv
                                    className={dataVABaru === undefined || dataVABaru === "0" || dataVABaru === 0 ? 'btn-noez-transfer' : 'btn-ez-transfer'}
                                    disabled={dataVABaru === undefined || dataVABaru === "0" || dataVABaru === 0}
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
                                            <Col xs={3} className="card-information mt-3" style={{border: stockVABaru.available_stock.stock_will_run_out ? '1px solid #B9121B' : '1px solid #EBEBEB', height: 'fit-content', padding: '12px 0px 12px 16px'}}>
                                                <div className='d-flex'>
                                                    <OverlayTrigger
                                                        placement="bottom"
                                                        trigger={["hover"]}
                                                        overlay={
                                                            <Tooltip style={{ minWidth: 240 }}>Total sisa stok VA tersedia adalah VA yang telah di buat oleh Ezeelink dan telah aktif di OCBC, serta telah mengalami pembaruan status.</Tooltip>
                                                        }
                                                    >
                                                        <img src={stockVABaru.available_stock.stock_will_run_out ? noteInfoRed : noteInfo} width="20" height="20" alt="circle_info" />
                                                    </OverlayTrigger>
                                                    <span className="p-info" style={{ paddingLeft: 7, width: 110 }}>Total sisa stok VA Tersedia: </span>
                                                    <span style={{ fontFamily: "Exo", fontSize: 25, fontWeight: 700, paddingRight: 10, marginTop: 5 }}>{convertToRupiah(stockVABaru.available_stock.stock, false)}</span>
                                                </div>
                                            </Col>
                                            <Col xs={3} className="card-information mt-3 ms-3" style={{border: stockVABaru.unavailable_stock.stock_will_run_out ? '1px solid #B9121B' : '1px solid #EBEBEB', height: 'fit-content', padding: '12px 0px 12px 16px'}}>
                                                <div className='d-flex'>
                                                    <OverlayTrigger
                                                        placement="bottom"
                                                        trigger={["hover"]}
                                                        overlay={
                                                            <Tooltip style={{ minWidth: 240 }}>Total VA belum tersedia adalah VA yang telah di buat oleh Ezeelink, tapi belum diaktifkan</Tooltip>
                                                        }
                                                    >
                                                        <img src={stockVABaru.unavailable_stock.stock_will_run_out ? noteInfoRed : noteInfo} width="20" height="20" alt="circle_info" />
                                                    </OverlayTrigger>
                                                    <span className="p-info" style={{ paddingLeft: 7, width: 110 }}>Total VA Belum Tersedia: </span>
                                                    <span style={{ fontFamily: "Exo", fontSize: 25, fontWeight: 700, paddingRight: 10, marginTop: 5 }}>{convertToRupiah(stockVABaru.unavailable_stock.stock, false)}</span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Row className='d-flex justify-content-end'>
                                            <Col xs={3} className="card-information mt-3" style={{border: '1px solid #077E86', height: 44, padding: '8px 24px'}}>
                                                <Link
                                                    to={"#"}
                                                    className='d-flex'
                                                    style={{ cursor: listVAUSDBaru[0]?.status_id === 11 ? "not-allowed" : "pointer" }}
                                                    disabled={listVAUSDBaru[0]?.status_id === 11}
                                                    onClick={() => generateFileCSV(isTabFileIdVABaru, selectedFileNameVAUSDBaru, listVAUSDBaru)}
                                                >
                                                    <img src={downloadIcon} width="24" height="24" alt="download_icon" />
                                                    <span style={{ paddingLeft: 7, fontFamily: 'Exo', fontSize: 18, fontWeight: 700, color: '#077E86' }}>Download File CSV</span>
                                                </Link>
                                            </Col>
                                            <Col xs={3} className="card-information mt-3 ms-3" style={{border: '1px solid #077E86', height: 44, padding: '8px 24px'}}>
                                                <OverlayTrigger
                                                    placement="bottom"
                                                    trigger={["hover"]}
                                                    overlay={
                                                        <Tooltip style={{ minWidth: 240 }}>Perbarui Data VA setelah file request VA yang telah di upload ke Dashboard OCBC sudah berubah. Hanya aktif setelah generate VA.</Tooltip>
                                                    }
                                                >
                                                    <div className='d-flex' style={{ cursor: "pointer" }} onClick={() => perbaruiDataHandleClick(listVAUSDBaru)}>
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
                                            fileTabsVABaru.length !== 0 &&
                                            fileTabsVABaru.map(item => (
                                                    <div key={item.id} className={`me-2 detail-akun-tabs ${isTabFileIdVABaru === item.id && "menu-detail-akun-hr-active"}`} onClick={() => pindahFileTabCreate(item)} id={item.name}>
                                                        <span className={`menu-detail-akun-span ${isTabFileIdVABaru === item.id && "menu-detail-akun-span-active"}`} id="createSpan">{item.name}</span>
                                                    </div>
                                            ))
                                        }
                                    </div>
                                    <hr className='hr-style mb-4' style={{marginTop: -2, height: 0}}/>
                                    <div className="div-table mt-4 pb-4">
                                        <DataTable
                                            columns={columnsVAUSD}
                                            data={listVAUSDBaru}
                                            customStyles={customStyles}
                                            highlightOnHover
                                            progressPending={pendingVAUSDBaru}
                                            progressComponent={<CustomLoader />}
                                            // pagination
                                        />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Halaman : {totalPageVABaru}</div>
                                        <Pagination
                                            activePage={activePageVABaru}
                                            itemsCountPerPage={pageNumberVABaru.row_per_page}
                                            totalItemsCount={(pageNumberVABaru.row_per_page*pageNumberVABaru.max_page)}
                                            pageRangeDisplayed={5}
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            onChange={(page) => handlePageChangeCreate(page, isTabFileIdVABaru)}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Modal perbaharui data VA */}
                            <Modal size="xs" className='py-3' centered show={showModalPerbaruiDataVABaru} onHide={() => setShowModalPerbaruiDataVABaru(false)}>
                                <Modal.Title className='text-center mt-4 px-3' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20, color: "#393939" }}>
                                    Yakin Perbarui file data VA dan data di Velocity (OCBC) sudah berubah?
                                </Modal.Title>
                                <Modal.Body >
                                    <div className='text-center px-2' style={{ fontFamily: 'Nunito', color: "#848484", fontSize: 14 }}>
                                        Terdapat <b>{`${unAvailableVAUSDBaru}`} VA Baru yang akan Tersedia</b> untuk dapat digunakan oleh partner
                                    </div>
                                    <div className='d-flex justify-content-center align-items-center mt-3'>
                                        <div className='me-1'>
                                            <button
                                                onClick={() => setShowModalPerbaruiDataVABaru(false)}
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
                                                onClick={() => renewDataVA(isTabFileIdVABaru, listVAUSDBaru)}
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
                                                <span style={{ fontFamily: "Exo", fontSize: 25, fontWeight: 700, paddingRight: 10, marginTop: 5 }}>{pageNumberUpdateVA.total_data !== undefined ? convertToRupiah(pageNumberUpdateVA.total_data, false) : 0 }</span>
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
                                <Col xs={5}>
                                    <Row style={{border:"1px solid #EBEBEB", borderRadius: 8, height: 70, marginTop: 5}}>
                                        <Col className="card-information d-flex justify-content-center ms-3 mt-1" style={{ height: 50, padding: '12px 0px 12px 16px' }}>
                                            <div className="dropdown dropVAUSD">
                                                <ReactSelect
                                                    // isMulti
                                                    // closeMenuOnSelect={false}
                                                    hideSelectedOptions={false}
                                                    allowSelectAll={true}
                                                    options={dataListFileUpdateVA}
                                                    value={selectedFileUpdateUpdateVA}
                                                    onChange={(selected) => handleChangeFile(selected, dataListFileAPIUpdateVA)}
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
                                            <button onClick={() => downloadFileVABulk(selectedFileUpdateUpdateVA, dataListFileAPIUpdateVA)} disabled={selectedFileUpdateUpdateVA.length === 0} style={{ backgroundColor: 'unset', border: selectedFileUpdateUpdateVA.length !== 0 ? "1px solid #077E86" : "1px solid #C4C4C4", borderRadius: 8, height: 35, marginTop: 18, marginRight: 20 }}>
                                                <img src={selectedFileUpdateUpdateVA.length !== 0 ? downloadIcon : downloadIconGrey} width="24" height="24" alt="download_icon" />
                                            </button>
                                            <button onClick={() => setShowModalKonfirmasiUpdateVA(true)} disabled={selectedFileUpdateUpdateVA.length === 0} style={{ backgroundColor: 'unset', color: selectedFileUpdateUpdateVA.length !== 0 ? "#077E86" : "#C4C4C4", fontWeight: 700, border: selectedFileUpdateUpdateVA.length !== 0 ? "1px solid #077E86" : "1px solid #C4C4C4", borderRadius: 8, height: 35, marginTop: 18 }}>
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
                                    progressPending={pendingUpdateVA}
                                    progressComponent={<CustomLoader />}
                                    // pagination
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>Total Halaman : {totalPageUpdateVA}</div>
                                <Pagination
                                    activePage={activePageUpdateVA}
                                    itemsCountPerPage={pageNumberUpdateVA.row_per_page}
                                    totalItemsCount={(pageNumberUpdateVA.row_per_page*pageNumberUpdateVA.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={(page) => getListUpdateVA(page)}
                                />
                            </div>
                            {/* Modal konfirmasi file VA update */}
                            <Modal size="xs" className='py-3' centered show={showModalKonfirmasiUpdateVA} onHide={() => setShowModalKonfirmasiUpdateVA(false)}>
                                <Modal.Title className='text-center mt-4 px-3' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20, color: "#393939" }}>
                                    Yakin file data VA yang di upload ke Velocity (OCBC) sudah berubah?
                                </Modal.Title>
                                <Modal.Body >
                                    <div className='text-center px-2' style={{ fontFamily: 'Nunito', color: "#848484", fontSize: 14 }}>
                                        Total data VA yang akan di update adalah <b>{`${totalDataConfirmationUpdateVA}`}</b> data
                                    </div>
                                    <div className='d-flex justify-content-center align-items-center mt-3'>
                                        <div className='me-1'>
                                            <button
                                                onClick={() => setShowModalKonfirmasiUpdateVA(false)}
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
                                                onClick={() => confirmUpdatedVAUSD(selectedFileUpdateUpdateVA)}
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
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontSize: 16, fontFamily: "Exo", color: "#383838"}}>Filter</span>
                        <Row className='mt-4'>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span style={{ marginRight: 26 }}>Kode VA</span>
                                <input onChange={handleChange} value={inputHandleRiwayatVA.kodeVARiwayatVA} name="kodeVARiwayatVA" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan Kode VA'/>
                            </Col>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span style={{ marginRight: 26 }}>Nama File</span>
                                <input onChange={handleChange} value={inputHandleRiwayatVA.namaFileRiwayatVA} name="namaFileRiwayatVA" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan Nama File'/>
                            </Col>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span>Status</span>
                                <Form.Select name="statusRiwayatVA" className='input-text-riwayat ms-5' style={{ display: "inline" }} value={inputHandleRiwayatVA.statusRiwayatVA} onChange={(e) => handleChange(e)}>
                                    <option defaultChecked disabled value={0}>Pilih Status</option>
                                    <option value={12}>Belum Tersedia</option>
                                    <option value={11}>Tersedia</option>
                                    <option value={7}>Proses Bayar</option>
                                    <option value={2}>Sudah Bayar</option>
                                    <option value={9}>Kadaluwarsa</option>
                                    <option value={13}>Ditutup</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateRiwayatVA === "none") ? "33.2%" : "33.2%" }}>
                                <span style={{ marginRight: 26 }}>Periode<span style={{ color: "red" }}>*</span></span>
                                <Form.Select name='periodeRiwayatVA' className="input-text-riwayat ms-3" value={inputHandleRiwayatVA.periodeRiwayatVA} onChange={handleChangePeriodeRiwayatVA}>
                                    <option defaultChecked disabled value={0}>Pilih Periode</option>
                                    <option value={([`${currentDate}`, `${currentDate}`])}>Hari Ini</option>
                                    <option value={([`${tomorrowDate}`, `${tomorrowDate}`])}>Besok</option>
                                    <option value={([`${sevenDaysLater}`, `${tomorrowDate}`])}>7 Hari Kedepan</option>
                                    <option value={([`${firstDayThisMonth}`, `${lastDayThisMonth}`])}>Bulan Ini</option>
                                    <option value={([`${firstDayNextMonth}`, `${lastDayNextMonth}`])}>Bulan Depan</option>
                                    <option value={7}>Pilih Range Tanggal</option>
                                    {/* <option value={2}>Hari Ini</option>
                                    <option value={3}>Kemarin</option>
                                    <option value={4}>7 Hari Terakhir</option>
                                    <option value={5}>Bulan Ini</option>
                                    <option value={6}>Bulan Kemarin</option>
                                    <option value={7}>Pilih Range Tanggal</option> */}
                                </Form.Select>
                            </Col>
                            <Col xs={4} style={{ display: showDateRiwayatVA, paddingRight: 53 }} className='text-end'>
                                <div className='me-4' style={{ paddingRight: "0.5rem" }}>
                                    <DateRangePicker
                                        onChange={pickDateRiwayatVA}
                                        value={stateRiwayatVA}
                                        clearIcon={null}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col xs={5}>
                                <Row>
                                    <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => getRiwayatVAUSD(1, inputHandleRiwayatVA.kodeVARiwayatVA, inputHandleRiwayatVA.namaFileRiwayatVA, inputHandleRiwayatVA.statusRiwayatVA, inputHandleRiwayatVA.periodeRiwayatVA, dateRangeRiwayatVA)}
                                            className={(inputHandleRiwayatVA.periodeRiwayatVA === 0 || (inputHandleRiwayatVA.periodeRiwayatVA === 7 && dateRangeRiwayatVA.length === 0)) ? "btn-ez" : "btn-ez-on"}
                                            disabled={inputHandleRiwayatVA.periodeRiwayatVA === 0 || (inputHandleRiwayatVA.periodeRiwayatVA === 7 && dateRangeRiwayatVA.length === 0)}
                                        >
                                            Terapkan
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => resetButtonHandle()}
                                            className={(inputHandleRiwayatVA.periodeRiwayatVA === 0 || (inputHandleRiwayatVA.periodeRiwayatVA === 7 && dateRangeRiwayatVA.length === 0)) ? "btn-ez-reset" : "btn-reset"}
                                            disabled={inputHandleRiwayatVA.periodeRiwayatVA === 0 || (inputHandleRiwayatVA.periodeRiwayatVA === 7 && dateRangeRiwayatVA.length === 0)}
                                        >
                                            Atur Ulang
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <div className="div-table mt-4 pb-4">
                            <DataTable
                                columns={columnsRiwayatVA}
                                data={dataRiwayatVAUSD}
                                customStyles={customStyles}
                                highlightOnHover
                                progressPending={pendingRiwayatVA}
                                progressComponent={<CustomLoader />}
                                // pagination
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                            <div style={{ marginRight: 10, marginTop: 10 }}>Total Halaman : {totalPageRiwayatVA}</div>
                            <Pagination
                                activePage={activePageRiwayatVA}
                                itemsCountPerPage={pageNumberRiwayatVA.row_per_page}
                                totalItemsCount={(pageNumberRiwayatVA.row_per_page*pageNumberRiwayatVA.max_page)}
                                pageRangeDisplayed={5}
                                itemClass="page-item"
                                linkClass="page-link"
                                onChange={(page) => getRiwayatVAUSD(page, inputHandleRiwayatVA.kodeVARiwayatVA, inputHandleRiwayatVA.namaFileRiwayatVA, inputHandleRiwayatVA.statusRiwayatVA, inputHandleRiwayatVA.periodeRiwayatVA !== 0 ? inputHandleRiwayatVA.periodeRiwayatVA : ([`${currentDate}`, `${currentDate}`]), dateRangeRiwayatVA)}
                            />
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default CreateVAUSD