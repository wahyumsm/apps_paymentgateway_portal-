import React, { useEffect, useMemo, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import $ from 'jquery'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import noteInfo from "../../assets/icon/note_icon.svg"
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import { Button, Col, Form, Modal, OverlayTrigger, Row, Toast, Tooltip } from '@themesberg/react-bootstrap'
import chevron from "../../assets/icon/chevron_down_icon.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import edit from "../../assets/icon/edit_icon.svg";
import deleted from "../../assets/icon/delete_icon.svg";
import noteIconRed from "../../assets/icon/note_icon_red.svg";
import saveIcon from "../../assets/icon/save_icon.svg";
import DataTable from 'react-data-table-component'
import { agenLists } from '../../data/tables'
import axios from 'axios'
import FilterSubAccount from '../../components/FilterSubAccount'
import { sum } from 'lodash'
import * as XLSX from "xlsx"
import validator from "validator";
import Checklist from '../../assets/icon/checklist_icon.svg'
import NoteIconWhite from "../../assets/icon/note_icon_white.svg"

function DisbursementPage() {

    const user_role = getRole()
    const [isDisbursementManual, setisDisbursementManual] = useState(true)
    const history = useHistory()
    const [listBank, setListBank] = useState([])
    const [showBank, setShowBank] = useState(false)
    const [rekeningList, setRekeningList] = useState([])
    const [feeBank, setFeeBank] = useState([])
    const [getBalance, setGetBalance] = useState({})
    const [dataDisburse, setDataDisburse] = useState([])
    const [editTabelDisburse, setEditTabelDisburse] = useState(false)
    const [editNominal, setEditNominal] = useState(false)
    const [numbering, setNumbering] = useState(0)
    const [allNominal, setAllNominal] = useState([])
    const [allFee, setAllFee] = useState([])
    const [isChecked, setIsChecked] = useState(false)
    const [isCheckedConfirm, setIsCheckedConfirm] = useState(false)
    const [responMsg, setResponMsg] = useState(0)
    const [errMsgEmail, setErrMsgEmail] = useState(false)
    const [dataExcelDisburse, setDataExcelDisburse] = useState({})
    const [isManual, setIsManual] = useState((sessionStorage.getItem('disbursement') !== 'manual' || sessionStorage.getItem('disbursement') === null) ? true : false)
    const [isBulk, setIsBulk] = useState((sessionStorage.getItem('disbursement') !== 'bulk' || sessionStorage.getItem('disbursement') === null) ? false : true)
    const [showStatusTransfer, setShowStatusTransfer] = useState(false)
    const [showDaftarRekening, setShowDaftarRekening] = useState(false)
    const [showModalConfirm, setShowModalConfirm] = useState(false)
    const [showModalPindahHamalan, setShowModalPindahHamalan] = useState(false)
    const [showModalPanduan, setShowModalPanduan] = useState(false)
    const [showModalDuplikasi, setShowModalDuplikasi] = useState(false)
    const [showModalStatusDisburse, setShowModalStatusDisburse] = useState(false)
    const [filterTextBank, setFilterTextBank] = useState('')
    const [filterTextRekening, setFilterTextRekening] = useState('')
    const filterItemsBank = listBank.filter(
        item => (item.mbank_name && item.mbank_name.toLowerCase().includes(filterTextBank.toLowerCase())) || (item.mbank_code && item.mbank_code.toLowerCase().includes(filterTextBank.toLowerCase()))
    )
    const filterItemsRekening = rekeningList.filter(
        item => (item.mbank_name && item.mbank_name.toLowerCase().includes(filterTextRekening.toLowerCase())) || (item.mbankaccountlist_name && item.mbankaccountlist_name.toLowerCase().includes(filterTextRekening.toLowerCase()))
    )

    const subHeaderComponentMemoBank = useMemo(() => {
        return (
            <FilterSubAccount filterText={filterTextBank} onFilter={e => setFilterTextBank(e.target.value)} title="Cari Data Bank :" placeholder="Masukkan Nama / Kode Bank" />
        );	}, [filterTextBank]
    );

    const subHeaderComponentMemoRekening = useMemo(() => {
        return (
            <FilterSubAccount filterText={filterTextRekening} onFilter={e => setFilterTextRekening(e.target.value)} title="Cari Data Bank :" placeholder="Masukkan Nama / Kode Bank" />
        );	}, [filterTextRekening]
    );

    const handleChangeCheckBox = () => {
        setIsChecked(!isChecked)
    }

    const handleChangeCheckBoxConfirm = () => {
        setIsCheckedConfirm(!isCheckedConfirm)
    }

    function tabDisbursement(tabDisbursement) {
        if (tabDisbursement === 'manual') {
            sessionStorage.setItem('disbursement', 'manual');
            setIsManual(true)
            setIsBulk(false)
        } else {
            sessionStorage.setItem('disbursement', 'bulk');
            setIsBulk(true)
            setIsManual(false)
        }
    }

    function batalIn (param) {
        if (param === "rekening") {
            setShowDaftarRekening(false)
            setFilterTextRekening('')
        } else {
            setShowBank(false)
            setFilterTextBank('')
        }
    }

    function batalConfirm () {
        setIsCheckedConfirm(false)
        setShowModalConfirm(false)
    }

    const [inputData, setInputData] = useState({
        bankName: "",
        bankCode: ""
    })

    const [inputRekening, setInputRekening] = useState({
        bankNameRek: "",
        bankNumberRek: ""
    })

    const [inputHandle, setInputHandle] = useState({
        bankCabang: "",
        nominal: "",
        emailPenerima: "",
        catatan: ""
    })

    // console.log(inputData.bankName,"bankName");
    // console.log(inputData.bankCode,"bankCode");
    // console.log(inputRekening.bankNameRek,"bankNameRek");
    // console.log(inputRekening.bankNumberRek,"bankNumberRek");
    // console.log(inputHandle.bankCabang,"bankCabang");
    // console.log(inputHandle.nominal,"nominal");
    // console.log(inputHandle.emailPenerima.length,"emailPenerima");
    // console.log(inputHandle.catatan,"catatan");
    console.log(isChecked,"saveAcc");
    console.log(dataDisburse,"dataDisburse");

    const columns = [
        {
          name: "No",
          selector: (row) => row.number,
          width: "67px"
        },
        {
          name: "Bank Tujuan",
          selector: (row) => row.bankCodeTujuan + ` - ` + row.bankNameTujuan,
        },
        {
          name: "Cabang (Khusus Non-BCA)",
          selector: (row) => row.cabang,
        },
        {
          name: "No. Rekening Tujuan",
          selector: (row) => row.noRek,
        },
        {
          name: "Nama Pemilik Rekening",
          selector: (row) => row.nameRek,
        },
        {
          name: "Nominal Disbursement",
          selector: (row) => row.nominal,
        },
        {
          name: "Email Penerima",
          selector: (row) => row.emailPenerima,
        },
        {
          name: "Catatan",
          selector: (row) => row.catatan,
        },
        {
            name: "Aksi",
            //   selector: (row) => row.icon,
            width: "130px",
            cell: (row) => (
                <div className="d-flex justify-content-center align-items-center">
                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Edit</div></Tooltip>}>
                        <img
                            src={edit}
                            style={{ cursor: "pointer" }}
                            alt="icon edit"
                            onClick={() => editDataDisburse(row.number)}
                        />
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Delete</div></Tooltip>}>
                        <img
                            src={deleted}
                            style={{ cursor: "pointer" }}
                            className="ms-2"
                            alt="icon delete"
                            onClick={() => deleteDataDisburse(row.number)}
                        />
                    </OverlayTrigger>
                </div>
            ),
        },
    ];

    const columnsBank = [
        {
            name: 'No',
            selector: row => row.number,
            width: "80px"
        },
        {
            name: 'Nama Bank',
            selector: row => row.mbank_name,
        },
        {
            name: 'Kode Bank',
            selector: row => row.mbank_code,
            width: "150px"
        },
    ]

    const columnsRekening = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'Bank Tujuan',
            selector: row => row.mbank_name,
            width: "150px"
        },
        {
            name: 'Cabang (Khusus Non-BCA)',
            selector: row => row.mbankaccountlist_branch_name,
            width: "300px"
        },
        {
            name: 'No Rekening',
            selector: row => row.mbankaccountlist_number,
            width: "150px"
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.mbankaccountlist_name,
        },
    ]

    const columnsBulk = [
        {
            name: 'No',
            selector: row => row.id,
            width: "67px"
        },
        {
            name: 'Bank Tujuan',
            selector: row => row.email,
            width: "180px"
        },
        {
            name: 'Cabang (Khusus Non-BCA)',
            selector: row => row.IDAgen,
            width: "250px"
        },
        {
            name: 'No. Rekening Tujuan',
            selector: row => row.noRekening,
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.namaAgen,
            width: '250px'
        }
    ]

    async function getBankList() {
        try {
          const auth = "Bearer " + getToken()
          const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
          }
          const bankList = await axios.post(BaseURL + "/Home/BankGetList", { data: "" }, { headers: headers })
          if (bankList.status === 200 && bankList.data.response_code === 200 && bankList.data.response_new_token.length === 0) {
            bankList.data.response_data = bankList.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
            setListBank(bankList.data.response_data)
          } else if (bankList.status === 200 && bankList.data.response_code === 200 && bankList.data.response_new_token.length !== 0) {
            setUserSession(bankList.data.response_new_token)
            bankList.data.response_data = bankList.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
            setListBank(bankList.data.response_data)
          }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    async function getRekeningList() {
        try {
          const auth = "Bearer " + getToken()
          const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
          }
          const listRekening = await axios.post(BaseURL + "/Partner/GetAccountList", { data: "" }, { headers: headers })
          if (listRekening.status === 200 && listRekening.data.response_code === 200 && listRekening.data.response_new_token.length === 0) {
            listRekening.data.response_data = listRekening.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
            setRekeningList(listRekening.data.response_data)
          } else if (listRekening.status === 200 && listRekening.data.response_code === 200 && listRekening.data.response_new_token.length !== 0) {
            setUserSession(listRekening.data.response_new_token)
            listRekening.data.response_data = listRekening.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
            setRekeningList(listRekening.data.response_data)
          }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    async function feeBankList() {
        try {
          const auth = "Bearer " + getToken()
          const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
          }
          const listFeeBank = await axios.post(BaseURL + "/Partner/GetFeeDisbursement", { data: "" }, { headers: headers })
          if (listFeeBank.status === 200 && listFeeBank.data.response_code === 200 && listFeeBank.data.response_new_token.length === 0) {
            setFeeBank(listFeeBank.data.response_data)
          } else if (listFeeBank.status === 200 && listFeeBank.data.response_code === 200 && listFeeBank.data.response_new_token.length !== 0) {
            setUserSession(listFeeBank.data.response_new_token)
            setFeeBank(listFeeBank.data.response_data)
          }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    async function getBalanceHandle () {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getBalance = await axios.post(BaseURL + "/Partner/GetBalance", { data: "" }, { headers: headers })
            if (getBalance.data.response_code === 200 && getBalance.status === 200 && getBalance.data.response_new_token.length === 0) {
                setGetBalance(getBalance.data.response_data)
                // setBalanceDetail(getBalance.data.response_data.balance_detail)
            } else if (getBalance.data.response_code === 200 && getBalance.status === 200 && getBalance.data.response_new_token.length !== 0) {
                setUserSession(getBalance.data.response_new_token)
                setGetBalance(getBalance.data.response_data)
                // setBalanceDetail(getBalance.data.response_data.balance_detail)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
          }
    }

    const handleRowClicked = row => {
        filterItemsBank.map(item => {
            if (row.mbank_code === item.mbank_code) {
                setInputData({
                    bankName: row.mbank_name,
                    bankCode: row.mbank_code
                });
                setShowBank(false)
            }
        });
    };

    const handleRowClickedRekening = row => {
        setInputRekening({
            bankNameRek: row.mbankaccountlist_name,
            bankNumberRek: row.mbankaccountlist_number
        })
        setInputData({
            bankCode: row.mbankaccountlist_bank_code,
            bankName: row.mbank_name
        })
        setInputHandle({
            bankCabang: row.mbankaccountlist_branch_name,
            nominal: inputHandle.nominal,
            emailPenerima: inputHandle.emailPenerima,
            catatan: inputHandle.catatan
        })
        setShowDaftarRekening(false)
    };

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : (e.target.name === "nominal") ? Number(e.target.value).toString() : e.target.value
        })
        if (e.target.name === "emailPenerima") {
            setErrMsgEmail(false)
        }
    }

    function handleChangeRek(e) {
        setInputRekening({
            ...inputRekening,
            [e.target.name] : e.target.value
        })
    }

   var sisa = ((getBalance.balance) - (sum(allNominal) + sum(allFee)))
   
   console.log(sisa, "sisa");

    function saveNewDisburse (
        number,
        bankNameTujuan,
        bankCodeTujuan,
        cabang,
        noRek,
        nameRek,
        nominal,
        emailPenerima,
        catatan,
        saveAcc
    ) {
        if (emailPenerima.length !== 0 && validator.isEmail(emailPenerima) === false) {
            setErrMsgEmail(true)
            return
        }
        let sameFlag = 0
        dataDisburse.forEach((val) => {
            console.log(val.noRek, "val noRek");
            console.log(val.nominal, "val nominal");
            console.log(noRek, "noRek");
            console.log(nominal, "nominal");
            if (val.noRek === noRek && Number(val.nominal) === Number(nominal)) {
                console.log("masuk 1");
                sameFlag++
            }
        })
        console.log(sameFlag, "sameFlag");
        if (sameFlag === 0) {
            setShowModalDuplikasi(false)
            const newData = {
                number: number,
                bankNameTujuan: bankNameTujuan,
                bankCodeTujuan: bankCodeTujuan,
                cabang: cabang,
                noRek : noRek,
                nameRek: nameRek,
                nominal: Number(nominal),
                emailPenerima: emailPenerima.length !== 0 ? emailPenerima : "",
                catatan: catatan.length !== 0 ? catatan : "",
                saveAcc: saveAcc
            }
            const result = feeBank.find((item) => item.mpaytype_bank_code === bankCodeTujuan)
            setAllFee([...allFee, result.fee_bank])
            setDataDisburse([...dataDisburse, newData])
            setAllNominal([...allNominal, Number(nominal)])
            setInputData({
                bankName: "",
                bankCode: "",
            })
            setInputRekening({
                bankNameRek: "",
                bankNumberRek: ""
            })
            setInputHandle({
                bankCabang: "",
                nominal: "",
                emailPenerima: "",
                catatan: ""
            })
            setIsChecked(false)
        } else {
            setShowModalDuplikasi(true)
        }
    }

    function lanjutSaveNew (
        number,
        bankNameTujuan,
        bankCodeTujuan,
        cabang,
        noRek,
        nameRek,
        nominal,
        emailPenerima,
        catatan,
        saveAcc
    ) {
        const newData = {
            number: number,
            bankNameTujuan: bankNameTujuan,
            bankCodeTujuan: bankCodeTujuan,
            cabang: cabang,
            noRek : noRek,
            nameRek: nameRek,
            nominal: Number(nominal),
            emailPenerima: emailPenerima.length !== 0 ? emailPenerima : "",
            catatan: catatan.length !== 0 ? catatan : "",
            saveAcc: saveAcc
        }
        const result = feeBank.find((item) => item.mpaytype_bank_code === bankCodeTujuan)
        setAllFee([...allFee, result.fee_bank])
        setDataDisburse([...dataDisburse, newData])
        setAllNominal([...allNominal, Number(nominal)])
        setInputData({
            bankName: "",
            bankCode: "",
        })
        setInputRekening({
            bankNameRek: "",
            bankNumberRek: ""
        })
        setInputHandle({
            bankCabang: "",
            nominal: "",
            emailPenerima: "",
            catatan: ""
        })
        setIsChecked(false)
        setShowModalDuplikasi(false)
    }

    function editDataDisburse(numberId) {
        setEditTabelDisburse(true)
        const result = dataDisburse.find((item) => item.number === numberId);
        console.log(result, "result");
        setInputData({
            bankName: result.bankNameTujuan,
            bankCode: result.bankCodeTujuan
        })
        setInputRekening({
            bankNameRek: result.nameRek,
            bankNumberRek: result.noRek
        })
        setInputHandle({
            bankCabang: result.cabang,
            nominal: Number(result.nominal),
            emailPenerima: result.emailPenerima,
            catatan: result.catatan
        })
        setNumbering(result.number)
        setIsChecked(result.saveAcc)
    }

    function saveEditDataDisburse(
        number,
        bankNameTujuan,
        bankCodeTujuan,
        cabang,
        noRek,
        nameRek,
        nominal,
        emailPenerima,
        catatan,
        saveAcc
    ) {
        if (emailPenerima.length !== 0 && validator.isEmail(emailPenerima) === false) {
            setErrMsgEmail(true)
            return
        }
        let sameFlag = 0
        const results = dataDisburse.filter(res => res.number !== number)
        console.log(results, "results filter");
        results.forEach((val) => {
            if (val.noRek === noRek && Number(val.nominal) === Number(nominal)) {
                sameFlag++
            }
        })
        if (sameFlag === 0) {
            setShowModalDuplikasi(false)
            const source = {
                number: number,
                bankNameTujuan: bankNameTujuan,
                bankCodeTujuan: bankCodeTujuan,
                cabang: cabang,
                noRek : noRek,
                nameRek: nameRek,
                nominal: Number(nominal),
                emailPenerima: emailPenerima,
                catatan: catatan,
                saveAcc: saveAcc
            };
            const target = dataDisburse.find((item) => item.number === number)
            const finding = dataDisburse.findIndex((object) => {
                return object.number === number
            })
            const result = feeBank.find((item) => item.mpaytype_bank_code === bankCodeTujuan)
                Object.assign(target, source)
                setDataDisburse([...dataDisburse])
                if (finding) {
                    allNominal[finding] = Number(nominal)
                    allFee[finding] = result.fee_bank
                }
                setAllNominal([...allNominal])
                setAllFee([...allFee])
                setEditTabelDisburse(false)
                setInputData({
                    bankName: "",
                    bankCode: "",
                })
                setInputRekening({
                    bankNameRek: "",
                    bankNumberRek: ""
                })
                setInputHandle({
                    bankCabang: "",
                    nominal: "",
                    emailPenerima: "",
                    catatan: ""
                })
                setNumbering(0)
                setIsChecked(false)
        } else {
            setShowModalDuplikasi(true)
        }
        
    }

    function lanjutSaveEdit (
        number,
        bankNameTujuan,
        bankCodeTujuan,
        cabang,
        noRek,
        nameRek,
        nominal,
        emailPenerima,
        catatan,
        saveAcc
    ) {
        const source = {
            number: number,
            bankNameTujuan: bankNameTujuan,
            bankCodeTujuan: bankCodeTujuan,
            cabang: cabang,
            noRek : noRek,
            nameRek: nameRek,
            nominal: Number(nominal),
            emailPenerima: emailPenerima,
            catatan: catatan,
            saveAcc: saveAcc
        };
        const target = dataDisburse.find((item) => item.number === number)
        const finding = dataDisburse.findIndex((object) => {
            return object.number === number
        })
        const result = feeBank.find((item) => item.mpaytype_bank_code === bankCodeTujuan)
        Object.assign(target, source)
        setDataDisburse([...dataDisburse])
        if (finding) {
            allNominal[finding] = Number(nominal)
            allFee[finding] = result.fee_bank
        }
        setAllNominal([...allNominal])
        setAllFee([...allFee])
        setEditTabelDisburse(false)
        setInputData({
            bankName: "",
            bankCode: "",
        })
        setInputRekening({
            bankNameRek: "",
            bankNumberRek: ""
        })
        setInputHandle({
            bankCabang: "",
            nominal: "",
            emailPenerima: "",
            catatan: ""
        })
        setNumbering(0)
        setIsChecked(false)
        setShowModalDuplikasi(false)
    }

    function batalEdit () {
        setEditTabelDisburse(false)
        setInputData({
            bankName: "",
            bankCode: "",
        })
        setInputRekening({
            bankNameRek: "",
            bankNumberRek: ""
        })
        setInputHandle({
            bankCabang: "",
            nominal: "",
            emailPenerima: "",
            catatan: ""
        })
        setNumbering(0)
        setIsChecked(false)
    }

    function deleteDataDisburse(numberId) {
        const result = dataDisburse.findIndex((item) => item.number === numberId);
        dataDisburse.splice(result, 1);
        setDataDisburse([...dataDisburse]);
        setInputData({
            bankName: "",
            bankCode: ""
        })
        setInputRekening({
            bankNameRek: "",
            bankNumberRek: ""
        })
        setInputHandle({
            bankCabang: "",
            nominal: "",
            emailPenerima: "",
            catatan: ""
        })
    }

    function createDataDisburseExcel (dataDisburse) {
        let dataExcel = []
        for (let i = 0; i < dataDisburse.length; i++) {
            dataExcel.push({"bank_code": dataDisburse[i].bankCodeTujuan, "branch_name": dataDisburse[i].cabang, "account_number": dataDisburse[i].noRek, "account_name": dataDisburse[i].nameRek, "amount": dataDisburse[i].nominal, "email": dataDisburse[i].emailPenerima, "description": dataDisburse[i].catatan, "save_account_number": dataDisburse[i].saveAcc})
        }
        let workSheet = XLSX.utils.json_to_sheet(dataExcel)
        let workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
        XLSX.writeFile(workBook, "Disbursement Report.xlsx");
        const convertFile = XLSX.write(workBook, {bookType: "xlsx", type: "array"})
        var data = new Blob([new Uint8Array(convertFile)], { type: "application/octet-stream"})
        console.log(workBook, 'workBook');
        setDataExcelDisburse(data)
        setShowModalConfirm(true)
    }

    async function sendDataDisburse (data) {
        try {
            
            const auth = "Bearer " + getToken()
            var formData = new FormData()
            formData.append('file_excel', data, 'file_data_karyawan.xlsx')
            const headers = {
                'Content-Type':'multipart/form-data',
                'Authorization' : auth
            }
            const dataSendHandler = await axios.post(BaseURL + "/Partner/UploadDisbursementFile", formData, {headers: headers})
            // console.log(dataSendHandler, 'dataSendHandler');
            if (dataSendHandler.data.response_code === 200 && dataSendHandler.status === 200 && dataSendHandler.data.response_new_token.length === 0) {
                setShowModalConfirm(false)
                // history.push("/disbursement/disbursementpage")
                setDataDisburse([])
                setAllNominal([])
                setAllFee([])
                setShowModalStatusDisburse(true)
                setResponMsg(dataSendHandler.data.response_data.status_id)
            } else if (dataSendHandler.data.response_code === 200 && dataSendHandler.status === 200 && dataSendHandler.data.response_new_token.length !== 0) {
                sessionStorage(dataSendHandler.data.response_new_token)
                setShowModalConfirm(false)
                // history.push("/disbursement/disbursementpage")
                setDataDisburse([])
                setAllNominal([])
                setAllFee([])
                setShowModalStatusDisburse(true)
                setResponMsg(dataSendHandler.data.response_data.status_id)
            }
        } catch (e) {
            if (e.response.data.response_message === "Failed") {
                alert(e.response.data.response_message)
            }
            history.push(errorCatch(e.response.status));
        }
    }

    setTimeout(() => {
        setShowModalStatusDisburse(false);
    }, 60000);

    function toReportDisburse () {
        history.push('/disbursement/report')
    }

    function disbursementTabs(isTabs){
        setisDisbursementManual(isTabs)
        if(!isTabs){
            $('#detailakuntab').removeClass('menu-detail-akun-hr-active')
            $('#detailakunspan').removeClass('menu-detail-akun-span-active')
            $('#konfigurasitab').addClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').addClass('menu-detail-akun-span-active')
        }else{
            $('#konfigurasitab').removeClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').removeClass('menu-detail-akun-span-active')
            $('#detailakuntab').addClass('menu-detail-akun-hr-active')
            $('#detailakunspan').addClass('menu-detail-akun-span-active')
        }
    }

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: "#F2F2F2",
                border: "12px",
                fontWeight: "bold",
                fontSize: "16px",
                maxWidth: "max-content"
            },
        },
        cells: {
            style: {
                cursor: 'pointer',
            }
        },
    };

    useEffect(() => {
        getBankList()
        getRekeningList()
        feeBankList()
        getBalanceHandle()
    }, [])

    return (
        <>  
            {
                showModalStatusDisburse && (responMsg !== 0 && responMsg === 2) &&
                <div style={{ position: "fixed", zIndex: 999, width: "80%" }} className="d-flex justify-content-center align-items-center mt-4 ms-5">
                    <Toast style={{ width: "900px", backgroundColor: "#077E86" }} position="bottom-center" className="text-center">
                        <Toast.Body className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span>Disbursement Berhasil. <span style={{ textDecoration: 'underline', cursor: "pointer" }} onClick={() => toReportDisburse()}>Lihat Riwayat Disbursement</span></Toast.Body>
                    </Toast>
                </div>
            }
            {
                showModalStatusDisburse && (responMsg !== 0 && responMsg === 4) &&
                <div style={{ position: "fixed", zIndex: 999, width: "80%" }} className="d-flex justify-content-center align-items-center mt-4 ms-5">
                    <Toast style={{ width: "900px", backgroundColor: "#B9121B" }} position="bottom-center" className="text-center">
                        <Toast.Body className="text-center text-white"><span className="mx-2"><img src={NoteIconWhite} alt="checklist" /></span>Disbursement Gagal. <span style={{ textDecoration: 'underline', cursor: "pointer" }} onClick={() => toReportDisburse()}>Lihat Riwayat Disbursement</span></Toast.Body>
                    </Toast>
                </div>
            }
            <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
                <span className='breadcrumbs-span'>{ user_role === "102" ? <Link style={{ cursor: "pointer" }} to={"/laporan"}> Laporan</Link> : <Link style={{ cursor: "pointer" }} to={"/"}>Beranda</Link> }  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Disbursement</span>
                <div className='detail-akun-menu mt-5' style={{display: 'flex', height: 33}}>
                    <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => disbursementTabs(true)} id="detailakuntab">
                        <span className='menu-detail-akun-span menu-detail-akun-span-active' id="detailakunspan">Disbursement Manual</span>
                    </div>
                    <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => disbursementTabs(false)} id="konfigurasitab">
                        <span className='menu-detail-akun-span' id="konfigurasispan">Disbursement Bulk</span>
                    </div>
                </div>
                {
                    isDisbursementManual ?
                        <>
                            <div id='disbursement-manual'>
                                <hr className='hr-style' style={{marginTop: -2}}/>
                                <div className='base-content mb-4'>
                                    <span style={{ color: '#383838', width: 'max-content', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'normal', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }}>
                                        <img src={noteInfo} width="25" height="25" alt="circle_info" style={{ marginRight: 10 }} />
                                        Pastikan data tujuan Disbursement sudah benar, kesalahan pada data akan berakibat gagalnya proses transaksi Disbursement.
                                    </span>
                                    <div className='pt-5 pb-5'>
                                        <Row className='mb-4 align-items-center' style={{ fontSize: 14 }}>
                                            <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                                Pilih Bank Tujuan <span style={{ color: "red" }}>*</span>
                                            </Col>
                                            <Col xs={10} style={{ cursor: "pointer" }} className="position-relative d-flex justify-content-between align-items-center" onClick={() => setShowBank(true)}>
                                                <Form.Control
                                                    placeholder="Pilih Bank"
                                                    className='input-text-user'
                                                    type='text'
                                                    disabled
                                                    name="bankName" 
                                                    value={inputData.bankName}
                                                    style={{ cursor: "pointer",  backgroundColor: "#FFFFFF" }}
                                                />
                                                <div className="position-absolute right-4" ><img src={chevron} alt="time" /></div>
                                            </Col>
                                        </Row>
                                        <Row className='mb-4 align-items-center' style={{ fontSize: 14 }}>
                                            <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                                Cabang (Khusus Non-BCA) <span style={{ color: "red" }}>*</span>
                                            </Col>
                                            <Col xs={10}>
                                                <Form.Control
                                                    placeholder="Masukkan Cabang Bank "
                                                    type='text'
                                                    className='input-text-user'
                                                    name="bankCabang"
                                                    value={inputHandle.bankCabang}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className='mb-4 align-items-center' style={{ fontSize: 14 }}>
                                            <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                                No. Rekening Tujuan <span style={{ color: "red" }}>*</span>
                                            </Col>
                                            <Col xs={10}>
                                                <Form.Control
                                                    placeholder="Masukan No. Rekening Tujuan"
                                                    type='text'
                                                    className='input-text-user'
                                                    name="bankNumberRek"
                                                    value={inputRekening.bankNumberRek}
                                                    onChange={(e) => handleChangeRek(e)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className='align-items-center' style={{ fontSize: 14 }}>
                                            <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                                Nama Pemilik Rekening <span style={{ color: "red" }}>*</span>
                                            </Col>
                                            <Col xs={10}>
                                                <Form.Control
                                                    placeholder="Masukan Nama Pemilik Rekening"
                                                    type='text'
                                                    className='input-text-user'
                                                    name="bankNameRek"
                                                    value={inputRekening.bankNameRek}
                                                    onChange={(e) => handleChangeRek(e)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={2}></Col>
                                            <Col xs={10}>
                                                <div className='d-flex align-items-center justify-content-between'>
                                                    <div className='mb-3'>
                                                        <Form.Check
                                                            label="Simpan ke Daftar Rekening"
                                                            id="statusId"
                                                            onChange={handleChangeCheckBox}
                                                            checked={isChecked}
                                                        />
                                                    </div>
                                                    <div className='mb-3'>
                                                        <button
                                                            style={{
                                                                fontFamily: "Exo",
                                                                fontSize: 14,
                                                                fontWeight: 700,
                                                                alignItems: "center",
                                                                height: 48,
                                                                color: "#077E86",
                                                                background: "unset",
                                                                border: "unset",
                                                                textDecoration: 'underline'
                                                            }}
                                                            onClick={() => setShowDaftarRekening(true)}
                                                        >
                                                            Lihat Daftar Rekening
                                                        </button>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className='mb-4 align-items-center' style={{ fontSize: 14 }}>
                                            <Col xs={2} style={{ fontFamily: 'Nunito' }}>    
                                                Nominal Disbursement <span style={{ color: "red" }}>*</span>
                                            </Col>
                                            <Col xs={10}>
                                                {
                                                    editNominal ?
                                                        <Form.Control
                                                            placeholder="Rp 0"
                                                            type='number'
                                                            className='input-text-user'
                                                            name="nominal"
                                                            value={inputHandle.nominal === undefined ? 0 : inputHandle.nominal}
                                                            onChange={(e) => handleChange(e)}
                                                            onBlur={() => setEditNominal(!editNominal)}
                                                            onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                        /> :
                                                        <Form.Control
                                                            placeholder="Rp 0"
                                                            type='text'
                                                            className='input-text-user'
                                                            name="nominal"
                                                            value={inputHandle.nominal === undefined ? convertToRupiah(0, true, 0) : convertToRupiah(inputHandle.nominal)}
                                                            onChange={(e) => handleChange(e)}
                                                            onFocus={() => setEditNominal(!editNominal)}
                                                        />
                                                }
                                            </Col>
                                        </Row>
                                        <Row className='mb-3 align-items-center' style={{ fontSize: 14 }}>
                                            <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                                <span style={{ fontFamily: "Nunito" }}>
                                                    Email Penerima
                                                </span>
                                            </Col>
                                            <Col xs={10}>
                                                <Form.Control
                                                    placeholder="Masukkan Alamat Email Peneima"
                                                    type='text'
                                                    className='input-text-user'
                                                    name="emailPenerima"
                                                    value={inputHandle.emailPenerima}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className='mb-3'>
                                            <Col xs={2}></Col>
                                            <Col xs={10}>
                                                {
                                                    !errMsgEmail ? "" :
                                                    <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B"}} className='text-start'>
                                                        <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                                        Format email wajib memakai tanda ‘@’. Contoh: nama@mail.com
                                                    </div>
                                                }
                                            </Col>
                                        </Row>
                                        <Row className='mb-4 align-items-center' style={{ fontSize: 14 }}>
                                            <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                                <span style={{ fontFamily: "Nunito" }}>
                                                    Catatan
                                                </span>
                                            </Col>
                                            <Col xs={10}>
                                                <textarea
                                                    className='input-text-disburs'
                                                    placeholder="Masukkan catatan bila perlu"
                                                    style={{ width: "100%", padding: 10 }}
                                                    name="catatan"
                                                    value={inputHandle.catatan}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={2}></Col>
                                            <Col>
                                                {
                                                    editTabelDisburse === false ?
                                                    <button
                                                        onClick={() => saveNewDisburse(
                                                            dataDisburse.length + 1,
                                                            inputData.bankName,
                                                            inputData.bankCode,
                                                            inputHandle.bankCabang,
                                                            inputRekening.bankNumberRek,
                                                            inputRekening.bankNameRek,
                                                            inputHandle.nominal,
                                                            inputHandle.emailPenerima,
                                                            inputHandle.catatan,
                                                            isChecked
                                                        )}
                                                        className={
                                                            (inputData.bankName.length !== 0 && inputData.bankCode.length !== 0 && (inputData.bankCode === "014" ? (inputHandle.bankCabang.length === 0 || inputHandle.bankCabang.length !== 0) : inputHandle.bankCabang.length !== 0) && inputRekening.bankNameRek.length !== 0 && inputRekening.bankNumberRek.length !== 0 && inputHandle.nominal.length >= 5 && dataDisburse.length < 10) ? 'btn-ez-disbursement' : 'btn-disbursement-reset'
                                                        }
                                                        disabled={
                                                            (inputData.bankName.length === 0 || inputData.bankCode.length === 0 || (inputData.bankCode !== "014" && inputHandle.bankCabang.length === 0) || inputRekening.bankNameRek.length === 0 || inputRekening.bankNumberRek.length === 0 || inputHandle.nominal < 5 || dataDisburse.length >= 10)
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPlus}
                                                            style={{ marginRight: 10 }}
                                                        />{" "}
                                                        Tambah Tujuan Disbursement
                                                    </button>  :
                                                    <div className='d-flex justify-content-start align-items-center'>
                                                        <div className='me-1'>
                                                            <button
                                                                onClick={() => batalEdit()}
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
                                                        <div className='ms-1'>
                                                            <button
                                                                style={{
                                                                    fontFamily: "Exo",
                                                                    fontSize: 16,
                                                                    fontWeight: 700,
                                                                    alignItems: "center",
                                                                    padding: "12px 24px",
                                                                    gap: 8,
                                                                    width: 136,
                                                                    height: 45,
                                                                    color: "#077E86",
                                                                    background: "transparent",
                                                                    border: "1px solid #077E86",
                                                                    borderRadius: 6,
                                                                }}
                                                                onClick={() => saveEditDataDisburse(
                                                                    numbering,
                                                                    inputData.bankName,
                                                                    inputData.bankCode,
                                                                    inputHandle.bankCabang,
                                                                    inputRekening.bankNumberRek,
                                                                    inputRekening.bankNameRek,
                                                                    inputHandle.nominal,
                                                                    inputHandle.emailPenerima,
                                                                    inputHandle.catatan,
                                                                    isChecked
                                                                )}
                                                            >
                                                                Simpan
                                                            </button>
                                                        </div>  
                                                    </div>
                                                }      
                                            </Col>
                                        </Row>
                                        {
                                            dataDisburse.length !== 0 ?
                                                // <div className="div-table pt-3">
                                                //     <DataTable
                                                //         columns={columns}
                                                //         data={dataDisburse}
                                                //         customStyles={customStyles}
                                                //         noDataComponent={<div style={{ marginBottom: 10 }}>Belum ada data tujuan Disbursement</div>}
                                                //         highlightOnHover
                                                //     />
                                                // </div>
                                                <div className='scroll-confirm' style={{ overflowX: 'auto', maxWidth: 'max-content' }}>
                                                    <table
                                                        className="table mt-5"
                                                        id="tableInvoice"
                                                        hover
                                                    >
                                                        <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                            <tr 
                                                            className='ms-3'  
                                                            >
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Bank Tujuan</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Cabang (Khusus Non-BCA)</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No. Rekening Tujuan</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nama Pemilik Rekening</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nominal Disbursement</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Email Penerima</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Catatan</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Aksi</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                dataDisburse.map((item) => {
                                                                    return (
                                                                        <tr>
                                                                            <td className='ps-3'>
                                                                                {item.number}
                                                                            </td>
                                                                            <td className='ps-3'>
                                                                                {item.bankCodeTujuan + ` - ` + item.bankNameTujuan}
                                                                            </td>
                                                                            <td className='ps-3'>
                                                                                {item.cabang}
                                                                            </td>
                                                                            <td className='ps-3'>
                                                                                {item.noRek}
                                                                            </td>
                                                                            <td className='ps-3'>
                                                                                {item.nameRek}
                                                                            </td>
                                                                            <td className='ps-3'>
                                                                                {convertToRupiah(item.nominal)}
                                                                            </td>
                                                                            <td className='ps-3'>
                                                                                {item.emailPenerima}
                                                                            </td>
                                                                            <td className='ps-3'>
                                                                                {item.catatan}
                                                                            </td>
                                                                            <td className='ps-3'>
                                                                                <div className="d-flex justify-content-center align-items-center">
                                                                                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Edit</div></Tooltip>}>
                                                                                        <img
                                                                                            src={edit}
                                                                                            style={{ cursor: "pointer" }}
                                                                                            alt="icon edit"
                                                                                            onClick={() => editDataDisburse(item.number)}
                                                                                        />
                                                                                    </OverlayTrigger>
                                                                                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Delete</div></Tooltip>}>
                                                                                        <img
                                                                                            src={deleted}
                                                                                            style={{ cursor: "pointer" }}
                                                                                            className="ms-2"
                                                                                            alt="icon delete"
                                                                                            onClick={() => deleteDataDisburse(item.number)}
                                                                                        />
                                                                                    </OverlayTrigger>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div> :
                                                <div className='scroll-confirm' style={{ overflowX: 'auto', maxWidth: 'max-content' }}>
                                                    <table
                                                        className="table text-center mt-5"
                                                        id="tableInvoice"
                                                        hover
                                                    >
                                                        <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                            <tr 
                                                                
                                                            >
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Bank Tujuan</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Cabang (Khusus Non-BCA)</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No. Rekening Tujuan</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nama Pemilik Rekening</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nominal Disbursement</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Email Penerima</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Catatan</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Aksi</th>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                    <div className='text-center pb-3'>Belum ada data tujuan Disbursement</div>
                                                </div>
                                        }
                                        
                                        <div className='sub-base-content-disburse mt-5'>
                                            <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>Ringkasan</div>
                                            <div className='d-flex justify-content-between align-items-center mt-3'>
                                                <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>Total Disbursement</div>
                                                <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(sum(allNominal), true, 0)}</div>
                                            </div>
                                            <div className='d-flex justify-content-between align-items-center mt-2'>
                                                <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>Total Fee Disbursement</div>
                                                <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(sum(allFee), true, 0)}</div>
                                            </div>
                                            <div className='mt-2' style={{ border: "1px dashed #C4C4C4" }}></div>
                                            <div className='d-flex justify-content-between align-items-center mt-3' style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>
                                                <div>Total Fee Disbursement + Total Fee</div>
                                                <div>{convertToRupiah(sum(allNominal) + sum(allFee))}</div>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center mt-3'>
                                            <div style={{ fontFamily: 'Nunito' }}>
                                                <div style={{ fontSize: 14, color: '#383838' }}>Sisa Saldo Tersedia</div>
                                                <div style={{ fontSize: 12, color: '#888888' }}>(Terhitung setelah seluruh disbursement berhasil)</div>
                                            </div>
                                            {
                                                Number((getBalance.balance) - (sum(allNominal) + sum(allFee))) < 0  ?
                                                <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B", width: 250 }} className='text-end'>
                                                    <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                                    Saldo Anda tidak cukup, Topup saldo terlebih dahulu sebelum melakukan disbursement
                                                </div> :
                                                <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(Number((getBalance.balance) - (sum(allNominal) + sum(allFee))), true, 0)}</div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="d-flex justify-content-end align-items-center">
                                <button
                                    onClick={() => createDataDisburseExcel(dataDisburse)}
                                    className={(dataDisburse.length !== 0 && Number((getBalance.balance) - (sum(allNominal) + sum(allFee))) >= 0) ? 'btn-ez-transfer' : 'btn-noez-transfer'}
                                    disabled={dataDisburse.length === 0 || Number((getBalance.balance) - (sum(allNominal) + sum(allFee))) < 0}
                                    style={{ width: '25%' }}
                                >
                                    Lakukan Disbursement
                                </button>
                            </div>

                            {/*Modal Pilih Bank*/}
                            <Modal className="history-modal bank-list-subakun" size="xs" centered show={showBank} onHide={() => setShowBank(false)}>
                                <Modal.Header className="border-0">
                                    <Button
                                        className="position-absolute top-0 end-0 m-3"
                                        variant="close"
                                        aria-label="Close"
                                        onClick={() => batalIn('bank')}
                                    />
                                    
                                </Modal.Header>
                                <Modal.Title className="mt-2 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                                    Daftar Bank
                                </Modal.Title>
                                <Modal.Body>
                                    <div className="div-table mt-3">
                                        <DataTable 
                                            columns={columnsBank}
                                            data={filterItemsBank}
                                            customStyles={customStyles}
                                            // progressComponent={<CustomLoader />}
                                            highlightOnHover
                                            subHeader
                                            subHeaderComponent={subHeaderComponentMemoBank}
                                            persistTableHead
                                            onRowClicked={handleRowClicked}
                                            fixedHeader={true}
                                            fixedHeaderScrollHeight="300px"
                                        />
                                    </div>
                                    <div className='text-center my-1'>
                                        <button
                                            onClick={() => batalIn('bank')}
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
                                </Modal.Body>
                            </Modal>

                            {/*Modal Daftar Rekening*/}
                            <Modal className="disburse-modal" size="xl" centered show={showDaftarRekening} onHide={() => setShowDaftarRekening(false)}>
                                <Modal.Header className="border-0">
                                    <Button
                                        className="position-absolute top-0 end-0 m-3"
                                        variant="close"
                                        aria-label="Close"
                                        onClick={() => batalIn('rekening')}
                                    />
                                    
                                </Modal.Header>
                                <Modal.Title className="mt-2 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                                    Daftar Rekening
                                </Modal.Title>
                                <Modal.Body>
                                    <div className="div-table bank-list-subakun mt-3">
                                        <DataTable 
                                            columns={columnsRekening}
                                            data={filterItemsRekening}
                                            customStyles={customStyles}
                                            // progressComponent={<CustomLoader />}
                                            subHeader
                                            subHeaderComponent={subHeaderComponentMemoRekening}
                                            persistTableHead
                                            onRowClicked={handleRowClickedRekening}
                                            highlightOnHover
                                            fixedHeader={true}
                                            fixedHeaderScrollHeight="300px"
                                        />
                                    </div>
                                    <div className='text-center my-1'>
                                        <button
                                            onClick={() => batalIn('rekening')}
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
                                </Modal.Body>
                            </Modal>
                        </> :
                        <>
                            <div id='disbursement-bulk'>
                                <hr className='hr-style' style={{marginTop: -2}}/>
                                <div className='base-content'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div style={{ fontFamily: 'Nunito', fontSize: 14 }}>Perhatikan panduan pengisian template untuk menghindari kesalahan: <span onClick={() => setShowModalPanduan(true)} style={{ textDecoration: 'underline', fontFamily: 'Exo', fontWeight: 700, fontSize: 14, color: '#077E86', cursor: 'pointer' }}>Lihat Panduan</span></div>
                                        <div>
                                            <button
                                                style={{
                                                    color: '#077E86',
                                                    border: "1px solid #077E86",
                                                    borderRadius: 6,
                                                    gap: 8,
                                                    padding: '10px 14px',
                                                    backgroundColor: "#ffffff",
                                                    fontFamily:"Exo",
                                                    fontWeight: 700,
                                                    fontSize: 14
                                                }}
                                            >
                                                <span className='me-2'><img src={saveIcon} alt="save icon"/></span>
                                                Download Template
                                            </button>
                                        </div>
                                    </div>
                                    <div className='text-center my-3 position-relative' style={{ background: 'rgba(7, 126, 134, 0.04)', border: '1px dashed #077E86', borderRadius: 8, boxSizing: 'border-box' }}>
                                        {/* <div className='position-absolute' style={{ background: '#077E86', borderRadius: '0px 0px 8px 8px', color: "#FFFFFF", fontFamily: 'Nunito', fontWeight: 600, fontSize: 14, left: "calc(50% - 195px/2)", padding: "10px 24px" }}>Letakkan file di area ini</div> */}

                                        { /* Kondisi Error */ }
                                        {/* <div className='d-flex justify-content-center align-items-center text-center mt-3' style={{ padding: "0px 200px", color: '#B9121B' }}>
                                            <img src={noteIconRed} alt='notice'/>
                                            <div style={{ fontSize: 14, fontFamily: 'Nunito' }}>Konten pada tabel tidak sesuai dengan template Disbursement Bulk Ezeelink. Harap download dan menggunakan template yang disediakan untuk mempermudah pengecekkan data disbursement.</div>
                                        </div> */}

                                        {/* <div className='d-flex justify-content-center align-items-center text-center mt-3' style={{ padding: "0px 200px", color: '#B9121B' }}>
                                            <img src={noteIconRed} alt='notice'/>
                                            <div className='ms-2' style={{ fontSize: 14, fontFamily: 'Nunito' }}>Data pada nomor “3”, kolom “No. Rekening” tidak sesuai.</div>
                                        </div> */}

                                        {/* <div className='d-flex justify-content-center align-items-center text-center mt-3' style={{ padding: "0px 200px", color: '#B9121B' }}>
                                            <img src={noteIconRed} alt='notice'/>
                                            <div className='ms-2' style={{ fontSize: 14, fontFamily: 'Nunito' }}>Data pada nomor “3”, kolom “Bank Tujuan” data Bank tidak ditemukan.</div>
                                        </div> */}

                                        <div className='py-4 mt-3' style={{ fontFamily: 'Nunito', fontSize: 12 }}>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                        <div className='pb-4'>
                                            <button
                                                style={{
                                                    width: "170px",
                                                    color: '#077E86',
                                                    border: "1px solid #077E86",
                                                    borderRadius: 6,
                                                    gap: 8,
                                                    padding: '12px 24px',
                                                    backgroundColor: "#ffffff",
                                                    fontFamily:"Exo",
                                                    fontWeight: 700,
                                                    fontSize: 14
                                                }}
                                            >
                                                Upload File
                                            </button>
                                        </div>
                                    </div>
                                    <div className="div-table pt-3 pb-5">
                                        <DataTable
                                            columns={columnsBulk}
                                            data={agenLists}
                                            customStyles={customStyles}
                                            noDataComponent={<div style={{ marginBottom: 10 }}>Belum ada data tujuan Disbursement</div>}
                                            // pagination
                                            highlightOnHover
                                            // progressComponent={<CustomLoader />}
                                            // subHeaderComponent={subHeaderComponentMemo}
                                        />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end align-items-center my-4">
                                    <button 
                                        className='btn-ez-transfer'
                                        style={{ width: '25%' }}
                                    >
                                        Lakukan Disbursement
                                    </button>
                                </div>
                                
                                {/* Modal Lihat Panduan */}
                                <Modal className="panduan-modal" size="xl" centered show={showModalPanduan} onHide={() => setShowModalPanduan(false)}>
                                    <Modal.Header className="border-0">
                                        <Button
                                            className="position-absolute top-0 end-0 m-3"
                                            variant="close"
                                            aria-label="Close"
                                            onClick={() => setShowModalPanduan(false)}
                                        />
                                        
                                    </Modal.Header>
                                    <Modal.Title className='text-center mt-4' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20, color: "#393939" }}>
                                        Panduan Pengisian Disbursement Bulk
                                    </Modal.Title>
                                    <Modal.Body className='px-4'>
                                        <div style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'pre-wrap', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }} className='d-flex justify-content-center align-items-center'>
                                            <img src={noteInfo} width="25" height="25" alt="circle_info" style={{ marginRight: 10 }} />
                                            <span>Harap perhatikan panduan pengisian sebelum melakukan penginputan data pada template yang disediakan. Kesalahan penulisan data dapat menyebabkan gagalnya transaksi disbursement.</span>
                                        </div>
                                        <div className='mt-3' style={{ color: '#383838', fontSize: 14, fontFamily: 'Nunito' }}>
                                            <div className='d-flex justify-content-start'><div>1.</div> <span className='ms-3'>File yang diunggah wajib dalam format Excel *.csv, dan tidak dapat menggunakan format lain</span></div>
                                            <div className='d-flex justify-content-start'><div>2.</div> <span className='ms-3'>File yang diunggah wajib menggunakan template file Excel yang telah disediakan, tidak bisa membuat format Excel sendiri</span></div>
                                            <div className='d-flex justify-content-start'><div>3.</div> <span className='ms-3'>Data perkolom <b>wajib</b> dipisahkan  dengan tanda "|" (garis lurus). Dilarang menggunakan tanda baca lain sebagai pemisah data antar kolom. Dilarang menambahkan spasi setelah tanda garis lurus. Contoh penulisan : No|BTN|Gambir|51234678|Agatha|10000|agatha@mail.com|-</span></div>
                                            <div className='d-flex justify-content-start'><div>4.</div> <span className='ms-3'>Dilarang mengubah atau menambahkan nama sheet, nama tabel, urutan tabel dan tipe data tabel. Mengubah nama file diperbolehkan sesuai kebutuhan</span></div>
                                            <div className='d-flex justify-content-start'><div>5.</div> <span className='ms-3'><b>Wajib Diisi - </b> Bank Tujuan diisi dengan menuliskan nama bank sesuai dengan daftar bank tujuan disbursement yang telah disediakan pada file berikut : <span style={{ color: "#077E86", textDecoration: "underline", cursor: "pointer" }}>Download Daftar Bank Tujuan</span> </span></div>
                                            <div className='d-flex justify-content-start'><div>6.</div> <span className='ms-3'><b>Wajib Diisi khusus</b> cabang tujuan bank selain BCA. Apabila bank yang dipilih adalah BCA maka dapat dikosongkan </span></div>
                                            <div className='d-flex justify-content-strat'><div>7.</div> <span className='ms-3'><b>Wajib Diisi - </b> Nomor Rekening Tujuan diisi sesuai format rekening bank tujuan. Gunakan format angka dan harap perhatikan digit rekening</span></div>
                                            <div className='d-flex justify-content-start'><div>8.</div> <span className='ms-3'><b>Wajib Diisi - </b> Nama Pemilik Rekening wajib diisi dengan benar dan sesuai. </span></div>
                                            <div className='d-flex justify-content-start'><div>9.</div> <span className='ms-3'><b>Wajib Diisi - </b> Nominal Disbursement diisi dalam format Rupiah. Jika nominal merupakan bilangan desimal, maka penulisan tanda koma diganti dengan tanda titik. Contoh: 5500,68 ditulis 5500.68 </span></div>
                                            <div className='d-flex justify-content-start'><div>10.</div> <span className='ms-2'>Email Penerima bersifat opsional dan dapat diisi untuk mengirim notifikasi berhasil Disburse. Apabila email tidak diisi, maka dapat dikosongkan </span></div>
                                            <div className='d-flex justify-content-start'><div>11.</div> <span className='ms-2'>Catatan dapat diisi bila diperlukan dan bersifat opsional dan maksimal 25 karakter (termasuk spasi). Hanya diperbolehkan menggunakan karakter spesial berupa tanda @, &, dan #. <br/> Apabila catatan tidak diisi, maka dapat dikosongkan</span></div>
                                        </div>
                                        <div className='text-center my-3'>
                                            <button
                                                onClick={() => setShowModalPanduan(false)}
                                                className='btn-ez-transfer'
                                                style={{ width: '25%' }}
                                            >
                                                Mengerti
                                            </button>
                                        </div>
                                    </Modal.Body>
                                </Modal>

                            </div>
                        </>
                }

                {/* Modal Pindah Halaman */}
                <Modal size="xs" centered show={showModalPindahHamalan} onHide={() => setShowModalPindahHamalan(false)}>
                    <Modal.Title className='text-center mt-4' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20, color: "#393939" }}>
                        Yakin ingin pindah halaman?
                    </Modal.Title>
                    <Modal.Body >
                        <div className='text-center mt-3 px-4' style={{ fontFamily: 'Nunito', color: "#848484", fontSize: 14 }}>Seluruh data yang telah diinput akan terhapus jika pindah halaman, masih ingin melanjutkan ?</div>
                        <div className='d-flex justify-content-center align-items-center mt-3'>
                            <div className='me-1'>
                                <button
                                    onClick={() => setShowModalPindahHamalan(false)}
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
                                    Ya
                                </button>
                            </div>
                            <div className="ms-1">
                                <button
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
                                    Tidak
                                </button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                {/*Modal Konfirmasi Disbursement*/}
                <Modal className="confirm-disburse-modal" size="lg" centered show={showModalConfirm} onHide={() => setShowModalConfirm(false)}>
                    <Modal.Header className="border-0">
                        <Button
                            className="position-absolute top-0 end-0 m-3"
                            variant="close"
                            aria-label="Close"
                            onClick={() => batalConfirm()}
                        />
                        
                    </Modal.Header>
                    <Modal.Title className="mt-2 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                        Konfirmasi Disbursement
                    </Modal.Title>
                    <Modal.Body className='mx-2'>
                        <div style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'pre-wrap', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }} className='d-flex justify-content-center align-items-center'>
                            <img src={noteInfo} width="25" height="25" alt="circle_info" style={{ marginRight: 10 }} />
                            <span>Harap pastikan seluruh data disbursement sudah benar. Kesalahan pada data dapat menyebabkan kegagalan disbursement dan tetap akan dikenakan biaya sesuai dengan Fee Disbursement yang ditetapkan.</span>
                        </div>
                        <div>
                            <div className='mt-3' style={{ fontFamily: 'Source Sans Pro', fontSize: 14, color: '#888888' }}>Dari Rekening</div>
                            <div className='mt-1' style={{ fontFamily: 'Source Sans Pro', fontSize: 16, color: '#383838', fontWeight: 600 }}>2348-3492-0943</div>
                            <div className='mt-3' style={{ fontFamily: 'Source Sans Pro', fontSize: 16, color: '#383838', fontWeight: 600 }}>Tujuan Disbursement</div>
                            {/* <div className="div-table bank-list-subakun1 mt-3">
                                <DataTable 
                                    columns={columnsRekening}
                                    data={filterItemsRekening}
                                    customStyles={customStyles}
                                    // progressComponent={<CustomLoader />}
                                    persistTableHead
                                    // onRowClicked={handleRowClickedRekening}
                                    highlightOnHover
                                    fixedHeader={true}
                                    fixedHeaderScrollHeight="300px"
                                />
                            </div> */}
                            {
                                dataDisburse.length !== 0 ?
                                <div className='scroll-confirm' style={{ overflowX: 'auto', maxWidth: 'max-content' }}>
                                    <table
                                        className="table mt-3"
                                        id="tableInvoice"
                                        hover
                                    >
                                        <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                            <tr 
                                                className='ms-3'  
                                            >
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Bank Tujuan</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Cabang (Khusus Non-BCA)</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No. Rekening Tujuan</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nama Pemilik Rekening</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nominal Disbursement</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Email Penerima</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Catatan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                dataDisburse.map((item) => {
                                                    return (
                                                        <tr>
                                                            <td className='ps-3'>
                                                                {item.number}
                                                            </td>
                                                            <td className='ps-3'>
                                                                {item.bankCodeTujuan + ` - ` + item.bankNameTujuan}
                                                            </td>
                                                            <td className='ps-3'>
                                                                {item.cabang}
                                                            </td>
                                                            <td className='ps-3'>
                                                                {item.noRek}
                                                            </td>
                                                            <td className='ps-3'>
                                                                {item.nameRek}
                                                            </td>
                                                            <td className='ps-3'>
                                                                {convertToRupiah(item.nominal)}
                                                            </td>
                                                            <td className='ps-3'>
                                                                {item.emailPenerima}
                                                            </td>
                                                            <td className='ps-3'>
                                                                {item.catatan}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div> :
                                <div className='scroll-confirm' style={{ overflowX: 'auto', maxWidth: 'max-content' }}>
                                    <table
                                        className="table text-center mt-5"
                                        id="tableInvoice"
                                        hover
                                    >
                                        <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                            <tr 
                                                
                                            >
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Bank Tujuan</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Cabang (Khusus Non-BCA)</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No. Rekening Tujuan</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nama Pemilik Rekening</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nominal Disbursement</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Email Penerima</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Catatan</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Aksi</th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div className='text-center pb-3'>Belum ada data tujuan Disbursement</div>
                                </div>
                            }
                            <div className='sub-base-content-disburse mt-3'>
                                <div className='d-flex justify-content-between align-items-center mt-1'>
                                    <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>Total Disbursement</div>
                                    <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(sum(allNominal), true, 0)}</div>
                                </div>
                                <div className='d-flex justify-content-between align-items-center mt-2'>
                                    <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>Total Fee Disbursement</div>
                                    <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(sum(allFee), true, 0)}</div>
                                </div>
                                <div className='mt-2' style={{ border: "1px dashed #C4C4C4" }}></div>
                                <div className='d-flex justify-content-between align-items-center mt-3' style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>
                                    <div>Total Disbursement + Total Fee</div>
                                    <div>{convertToRupiah(sum(allNominal) + sum(allFee))}</div>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between align-items-center mt-3'>
                                <div style={{ fontFamily: 'Nunito' }}>
                                    <div style={{ fontSize: 14, color: '#383838' }}>Sisa Saldo Tersedia</div>
                                    <div style={{ fontSize: 12, color: '#888888' }}>(Terhitung setelah seluruh disbursement berhasil)</div>
                                </div>
                                {
                                    Number((getBalance.balance) - (sum(allNominal) + sum(allFee))) < 0  ?
                                    <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B", width: 250 }} className='text-end'>
                                        <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                        Saldo Anda tidak cukup, Topup saldo terlebih dahulu sebelum melakukan disbursement
                                    </div> :
                                    <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(((getBalance.balance) - (sum(allNominal) + sum(allFee))), true, 0)}</div>
                                }
                            </div>
                            <div className='mb-3 mt-3'>
                                <Form.Check
                                    className='form-confirm'
                                    label="Saya bertanggung jawab atas seluruh kebenaran maupun kesalahan data di atas"
                                    id="statusId"
                                    onChange={handleChangeCheckBoxConfirm}
                                    checked={isCheckedConfirm}
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end align-items-center mt-3">
                            <button
                                onClick={() => batalConfirm()}
                                style={{
                                    fontFamily: "Exo",
                                    fontSize: 16,
                                    fontWeight: 900,
                                    alignItems: "center",
                                    gap: 8,
                                    width: 136,
                                    height: 40,
                                    background: "#FFFFFF",
                                    color: "#888888",
                                    border: "0.6px solid #EBEBEB",
                                    borderRadius: 6,
                                }}
                            >
                                Batal
                            </button>
                            <button 
                                onClick={() => sendDataDisburse(dataExcelDisburse)}
                                className={isCheckedConfirm === true ? 'btn-ez-transfer ms-3' : 'btn-noez-transfer ms-3'}
                                disabled={isCheckedConfirm === false}
                                style={{ width: '25%' }}
                            >
                                Lakukan Disbursement
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* Modal Data Duplikasi */}
                <Modal size="xs" centered show={showModalDuplikasi} onHide={() => setShowModalDuplikasi(false)}>
                    <Modal.Title className='text-center mt-4' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20, color: "#393939" }}>
                        Ditemukan Duplikasi Data, Ingin Tetap Melanjutkan?
                    </Modal.Title>
                    <Modal.Body >
                        <div className='text-center px-4' style={{ fontFamily: 'Nunito', color: "#848484", fontSize: 14 }}>Data yang ingin Anda tambahkan sudah tersedia di tabel.</div>
                        <div className='d-flex justify-content-center align-items-center mt-3'>
                            <div className='me-1'>
                                <button
                                    onClick={editTabelDisburse === false ?
                                        () => lanjutSaveNew(
                                            dataDisburse.length + 1,
                                            inputData.bankName,
                                            inputData.bankCode,
                                            inputHandle.bankCabang,
                                            inputRekening.bankNumberRek,
                                            inputRekening.bankNameRek,
                                            inputHandle.nominal,
                                            inputHandle.emailPenerima,
                                            inputHandle.catatan,
                                            isChecked
                                        ) :
                                        () => lanjutSaveEdit(
                                            numbering,
                                            inputData.bankName,
                                            inputData.bankCode,
                                            inputHandle.bankCabang,
                                            inputRekening.bankNumberRek,
                                            inputRekening.bankNameRek,
                                            inputHandle.nominal,
                                            inputHandle.emailPenerima,
                                            inputHandle.catatan,
                                            isChecked
                                        )
                                    }
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
                                    Lanjutkan
                                </button>
                            </div>
                            <div className="ms-1">
                                <button
                                    onClick={() => setShowModalDuplikasi(false)}
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
                                    Perbaiki
                                </button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    )
}

export default DisbursementPage