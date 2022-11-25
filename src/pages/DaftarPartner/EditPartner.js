import React, { useEffect, useRef, useState, useCallback } from "react";
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import { Col, Form, Row, Image, Fade, OverlayTrigger, Tooltip } from "@themesberg/react-bootstrap";
import $ from "jquery";
import axios from "axios";
import {
  BaseURL,
  convertFormatNumberPartner,
  errorCatch,
  getRole,
  getToken,
  RouteTo,
  setUserSession,
} from "../../function/helpers";
import { Link, useHistory, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import encryptData from "../../function/encryptData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronDown,
  faChevronUp,
  faTruckLoading,
} from "@fortawesome/free-solid-svg-icons";
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg";
import noteIconRed from "../../assets/icon/note_icon_red.svg";
import edit from "../../assets/icon/edit_icon.svg";
import deleted from "../../assets/icon/delete_icon.svg";
import FilterComponent from "../../components/FilterComponent";
import { useMemo } from "react";

function EditPartner() {
  const [isDetailAkun, setIsDetailAkun] = useState(true);
  const history = useHistory();
  const access_token = getToken();
  const user_role = getRole();
  const { partnerId } = useParams();
  const [listAgen, setListAgen] = useState([]);
  const [detailPartner, setDetailPartner] = useState([]);
  const [payment, setPayment] = useState([]);
  const [subAccount,setSubAccount] = useState([])
  const [expanded, setExpanded] = useState(false);
  const [expandedSubAcc, setExpandedSubAcc] = useState(false)
  const myRef = useRef(null);
  const [listTypeMethod, setListTypeMethod] = useState({});
  const [fiturType, setFiturType] = useState({});
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [fitur, setFitur] = useState("", "");
  const [paymentNameMethod, setPaymentNameMethod] = useState([]);
  const [numbering, setNumbering] = useState(0);
  const [numberSubAcc, setNumberSubAcc] = useState(0)
  const [edited, setEdited] = useState(false);
  const [editInput, setEditInput] = useState(false);
  const [editedSubAcc, setEditedSubAcc] = useState(false);
  const [editFee, setEditFee] = useState(false)
  const [loading, setLoading] = useState(false);
  const [redFlag, setRedFlag] = useState(false)
  const [mustFill, setMustFill] = useState(false)
  const [alertFee, setAlertFee] = useState(false)
  const [alertSettlement, setAlertSettlement] = useState(false)
  const [alertFillAgen, setAlertFillAgen] = useState(false)
  const [alertNoRek, setAlertNoRek] = useState(false)
  const [alertNameRek, setAlertNameRek] = useState(false)
  const [alertMaxSubAcc, setAlertMaxSubAcc] = useState(false)
  const [alertSamePartner, setAlertSamePartner] = useState(false)
  const [sumberAgenList, setSumberAgenList] = useState([])
  const [inputHandle, setInputHandle] = useState({
    id: partnerId,
    namaPerusahaan: detailPartner.mpartner_name,
    emailPerusahaan: detailPartner.mpartner_email,
    phoneNumber: detailPartner.mpartner_telp,
    alamat: detailPartner.mpartner_address,
    noNpwp: detailPartner.mpartner_npwp,
    namaNpwp: detailPartner.mpartner_npwp_name,
    nama: detailPartner.mpartner_direktur,
    noHp: detailPartner.mpartner_direktur_telp,
    active: detailPartner.mpartner_is_active,
    bankName: 1,
    akunBank: detailPartner.mpartnerdtl_account_number,
    rekeningOwner: detailPartner.mpartnerdtl_account_name,
    fee: 0,
    settlementFee: 0,
    sumberAgen: "",
    sumberAgenName: "",
    bankNameSubAcc: "Danamon",
    akunBankSubAcc: "",
    rekeningOwnerSubAcc: "",
    paymentType: [],
    fiturs: 0,
  });
  const [agenName, setAgenName] = useState("")
  const [agenCode, setAgenCode] = useState("")
  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const filteredItems = listAgen.filter(
      item => item.agen_name && item.agen_name.toLowerCase().includes(filterText.toLowerCase()),
  );

  console.log(agenName, "agen name");
  console.log(agenCode, "agen code");

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
        if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
        }
    };
    return (
        <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} title="Cari Data Agen :" placeholder="Masukkan Nama Agen" />
    );	}, [filterText, resetPaginationToggle]
  );

  const showCheckboxes = () => {
    if (!expanded) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  };

  const showCheckboxesSubAccount = () => {
    if (!expandedSubAcc) {
      setExpandedSubAcc(true);
    } else {
      setExpandedSubAcc(false);
    }
  };

  function handleChange(e) {
    if (e.target.name === "active") {
      setInputHandle({
        ...inputHandle,
        [e.target.name]: !inputHandle.active,
      });
    } else {
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    }
  }

  function handleChangeSubAcc (e) {
    if (e.target.name === "sumberAgen") {
      setAlertFillAgen(false)
      setAlertSamePartner(false)
      console.log(e.target.value, "target value");
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
      const resultAgen = sumberAgenList.find((item) => 
        item.mpartnerdtl_sub_id === e.target.value
      )
      setAgenName(resultAgen.mpartnerdtl_sub_name);
      setAgenCode(resultAgen.mpartnerdtl_sub_id);
    } else {
      setAlertFillAgen(false)
      setAlertSamePartner(false)
      setAlertNoRek(false)
      setAlertNameRek(false)
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    }
  }

  function handleChangeFee (e) {
    if (e.target.name === "active") {
      setAlertFee(false)
      setInputHandle({
        ...inputHandle,
        [e.target.name]: !inputHandle.active,
      });
    } else {
      setAlertFee(false)
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    }
    if (e.target.value.length === 0) {
      setAlertFee(true)
    } 
  }

  function handleChangeSettle (e) {
    if (e.target.name === "active") {
      setAlertSettlement(false)
      setInputHandle({
        ...inputHandle,
        [e.target.name]: !inputHandle.active,
      });
    } else {
      setAlertSettlement(false)
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    }
    if (e.target.value.length === 0) {
      setAlertSettlement(true)
    }
  }

  const handleChoosenPaymentType = useCallback(
    (e, payTypeId, payTypeName, listMethod) => {
      if (e.target.checked) {
        if (payTypeId === 0) {
          const allId = Object.values(listMethod).map((val) => val.payment_id);
          const allName = Object.values(listMethod).map(
            (val) => val.payment_name
          );
          setPaymentMethod(allId);
          setPaymentNameMethod(allName);
        } else {
          setPaymentMethod((value) => [...value, payTypeId]);
          setPaymentNameMethod((item) => [...item, payTypeName]);
        }
        setRedFlag(false)
        setMustFill(false)
      } else {
        if (payTypeId === 0) {
          setPaymentMethod([]);
          setPaymentNameMethod([]);
        } else {
          setPaymentMethod((item) =>
            item.filter((value) => value !== payTypeId)
          );
          setPaymentNameMethod((item) =>
            item.filter((items) => items !== payTypeName)
          );
        }
        setRedFlag(false)
        setMustFill(false)
      }
    },
    [setPaymentMethod, setPaymentNameMethod]
  );

  const handleChangeFitur = (e) => {
    setLoading(true);
    setRedFlag(false)
    getTypeMethod(e.target.value);
    if (e.target.checked) {
      setFitur([e.target.value, e.target.name]);
      setLoading(false);
      setPaymentMethod([]);
      setPaymentNameMethod([]);
    }
  };

  // console.log(paymentMethod,"ini metode payment");
  //   console.log(paymentNameMethod, "ini name methodnya");
  //   console.log(payment, "ini payment");
  //   console.log(fitur[0], "ini fitur id");
  //   console.log(fitur[1], "ini fitur id");
  // console.log(inputHandle.fee, "ini fee");
  // console.log(inputHandle.settlementFee, "ini settle");
  // console.log(listMethodMenu.length, "ini list method menu");
  // console.log(inputHandle.akunBankSubAcc, "nomor rek");
  // console.log(inputHandle.rekeningOwnerSubAcc, "nama pemilik");
  // console.log(inputHandle.sumberAgen, "nama agennya");

  function editInTableHandler(numberId) {
    setEdited(true);
    const result = payment.find((item) => item.number === numberId);
    getTypeMethod(result.fitur_id);
    setInputHandle({
      fee: result.fee,
      settlementFee: result.fee_settle,
    });
    if (result.fitur_id) {
      setFitur([result.fitur_id, result.fitur_name]);
      setPaymentMethod(result.mpaytype_id);
      setPaymentNameMethod(result.mpaytype_name);
      setNumbering(result.number);
    }
  }

  function saveEditInTableHandler(
    numberId,
    fee,
    settleFee,
    fiturId,
    fiturName,
    typeId,
    typeName
  ) {
    if (typeId.length === 0) {
      setMustFill(true)
    } else {
      let sameFlag = 0
      const result = payment.filter(res => res.number !== numberId)
      result.forEach((val) => {
        if (val.fitur_id === Number(fiturId)) {
          val.mpaytype_id.forEach(item => {
            typeId.forEach(item2 => {
              if (item === item2) {
                sameFlag++
              }
            })
          })
        }
      })
      if (sameFlag === 0) {
        const source = {
          fee: Number(fee),
          fee_settle: Number(settleFee),
          fitur_id: Number(fiturId),
          fitur_name: fiturName,
          mpaytype_id: typeId,
          mpaytype_name: typeName,
          number: numberId,
        };
        const target = payment.find((item) => item.number === numberId);
        Object.assign(target, source);
        setPayment([...payment]);
        setEdited(false);
        setInputHandle({
          fee: 0,
          settlementFee: 0,
        });
        setFitur("", "");
        setPaymentMethod([]);
        setPaymentNameMethod([]);
      } else {
        setRedFlag(true)
      }
    }    
  }

  function batalEdit() {
    setInputHandle({
      fee: 0,
      settlementFee: 0,
    });
    setFitur("", "");
    setPaymentMethod([]);
    setPaymentNameMethod([]);
    setEdited(false);
    setRedFlag(false)
    setMustFill(false)
  }

  function deleteDataHandler(numberId) {
    const result = payment.findIndex((item) => item.number === numberId);
    payment.splice(result, 1);
    setPayment([...payment]);
    setInputHandle({
      fee: 0,
      settlementFee: 0,
    });
    setFitur("", "");
    setPaymentMethod([]);
    setPaymentNameMethod([]);
    setEdited(false);
  }

  function editInSubAcc(numberId) {
    setEditedSubAcc(true);
    const result = subAccount.find((item) => item.number === numberId);
    const resultAgen = sumberAgenList.find((item) => 
      item.mpartnerdtl_sub_id === result.subpartner_id
    )
    console.log(result, "ini result sub account edit");
    setInputHandle({
      akunBankSubAcc: result.bank_number,
      rekeningOwnerSubAcc: result.bank_account_name,
      sumberAgen: result.subpartner_id,
    })
    setAgenName(resultAgen.mpartnerdtl_sub_name);
    setAgenCode(resultAgen.mpartnerdtl_sub_id);
    console.log(inputHandle.sumberAgen, 'di input handle');
    setNumberSubAcc(numberId)
  }

  function saveEditTableSubAcc (
    numberId,
    sumberAgenCode,
    sumberAgen,
    akunBankSubAcc,
    rekeningOwnerSubAcc
  ) {
    if (sumberAgenCode !== "" && sumberAgen !== "" && akunBankSubAcc !== "" && rekeningOwnerSubAcc !== "") {
      setAlertFillAgen(false)
      setAlertNoRek(false)
      setAlertNameRek(false)
      const target = subAccount.find((item) => item.number === numberId)
      const source = {
        number: numberId,
        subpartner_id: sumberAgenCode,
        agen_source: sumberAgen,
        bank_number: akunBankSubAcc,
        bank_account_name: rekeningOwnerSubAcc,
        bank_name: "Danamon"
      }
      Object.assign(target, source);
      setSubAccount([...subAccount])
      setEditedSubAcc(false)
      setInputHandle({
        sumberAgen: "",
        akunBankSubAcc: "",
        rekeningOwnerSubAcc: "",
      })
    } else {
      if (sumberAgenCode === "" || sumberAgen === "") {
        setAlertFillAgen(true)
      }
      if (akunBankSubAcc === "") {
        setAlertNoRek(true)
      }
      if (rekeningOwnerSubAcc === "") {
        setAlertNameRek(true)
      }
    }
  }

  function batalEditSubAcc() {
    setInputHandle({
      sumberAgen: "",
      akunBankSubAcc: "",
      rekeningOwnerSubAcc: "",
    })
    setAgenName("")
    setAgenCode("")
    setEditedSubAcc(false);
    setAlertFillAgen(false)
    setAlertNoRek(false)
    setAlertNameRek(false)
  }

  function deleteHandlerSubAcc (numberId) {
    const result = subAccount.findIndex((item) => item.number === numberId);
    subAccount.splice(result, 1);
    setSubAccount([...subAccount]);
    setInputHandle({
      sumberAgen: "",
      akunBankSubAcc: "",
      rekeningOwnerSubAcc: ""
    });
    setEditedSubAcc(false);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getDetailPartner(partnerId) {
    try {
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(`{"partner_id":"${partnerId}"}`);
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const detailPartner = await axios.post(BaseURL +
        "/Partner/EditPartner",
        { data: dataParams },
        { headers: headers }
      );
      // console.log(detailPartner, "ini detail partner");
      if (
        detailPartner.status === 200 &&
        detailPartner.data.response_code === 200 &&
        detailPartner.data.response_new_token.length === 0
      ) {
        if (detailPartner.data.response_data.mpartner_is_active === true) {
          detailPartner.data.response_data = {
            ...detailPartner.data.response_data,
            isActive: "Aktif",
          };
        } else {
          detailPartner.data.response_data = {
            ...detailPartner.data.response_data,
            isActive: "Tidak Aktif",
          };
        }
        detailPartner.data.response_data.payment_method =
          detailPartner.data.response_data.payment_method.map((obj, id) => ({
            ...obj,
            number: id + 1,
          }));
        detailPartner.data.response_data.sub_account =
          detailPartner.data.response_data.sub_account.map((obj, id) => ({
            ...obj,
            number: id + 1,
          }));
        setDetailPartner(detailPartner.data.response_data);
        setPayment(detailPartner.data.response_data.payment_method);
        setSubAccount(detailPartner.data.response_data.sub_account);
      } else if (
        detailPartner.status === 200 &&
        detailPartner.data.response_code === 200 &&
        detailPartner.data.response_new_token.length !== 0
      ) {
        setUserSession(detailPartner.data.response_new_token);
        if (detailPartner.data.response_data.mpartner_is_active === true) {
          detailPartner.data.response_data = {
            ...detailPartner.data.response_data,
            isActive: "Aktif",
          };
        } else {
          detailPartner.data.response_data = {
            ...detailPartner.data.response_data,
            isActive: "Tidak Aktif",
          };
        }
        detailPartner.data.response_data.payment_method =
          detailPartner.data.response_data.payment_method.map((obj, id) => ({
            ...obj,
            number: id + 1,
          }));
        detailPartner.data.response_data.sub_account =
          detailPartner.data.response_data.sub_account.map((obj, id) => ({
            ...obj,
            number: id + 1,
          }));
        setDetailPartner(detailPartner.data.response_data);
        setPayment(detailPartner.data.response_data.payment_method);
        setSubAccount(detailPartner.data.response_data.sub_account);
      }
    } catch (error) {
      // RouteTo(errorCatch(error.response.status))
      history.push(errorCatch(error.response.status));
    }
  }

  console.log(subAccount, "ini sub acc");

  async function getTypeFitur() {
    try {
      const auth = "Bearer " + getToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const listFitur = await axios.post(BaseURL +
        "/Partner/GetFitur",
        { data: "" },
        { headers: headers }
      );
      // console.log(listFitur, "ini data list fitur");
      if (
        listFitur.status === 200 &&
        listFitur.data.response_code === 200 &&
        listFitur.data.response_new_token.length === 0
      ) {
        setFiturType(listFitur.data.response_data);
      } else if (
        listFitur.status === 200 &&
        listFitur.data.response_code === 200 &&
        listFitur.data.response_new_token.length !== 0
      ) {
        setUserSession(listFitur.data.response_new_token);
        setFiturType(listFitur.data.response_data);
      }
    } catch (error) {
      // RouteTo(errorCatch(error.response.status))
      history.push(errorCatch(error.response.status));
    }
  }

  async function getTypeMethod(fiturId) {
    try {
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(`{"fitur_id":"${fiturId}"}`);
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const paymentMethodType = await axios.post(BaseURL +
        "/PaymentLink/GetMetodePembayaran",
        { data: dataParams },
        { headers: headers }
      );
      if (
        paymentMethodType.status === 200 &&
        paymentMethodType.data.response_code === 200 &&
        paymentMethodType.data.response_new_token.length === 0
      ) {
        paymentMethodType.data.response_data.unshift({
          payment_name: "Pilih Semua",
          payment_id: 0,
        });
        setListTypeMethod(paymentMethodType.data.response_data);
      } else if (
        paymentMethodType.status === 200 &&
        paymentMethodType.data.response_code === 200 &&
        paymentMethodType.data.response_new_token.length !== 0
      ) {
        setUserSession(paymentMethodType.data.response_new_token);
        paymentMethodType.data.response_data.unshift({
          payment_name: "Pilih Semua",
          payment_id: 0,
        });
        setListTypeMethod(paymentMethodType.data.response_data);
      }
    } catch (error) {
      // RouteTo(errorCatch(error.response.status))
      history.push(errorCatch(error.response.status));
    }
  }

  let atasFitur = 0;
  let bawahFitur = 0;
  let equalFitur = 0;

  if (fiturType.length % 2 === 1) {
    atasFitur = Math.ceil(fiturType.length / 2);
    bawahFitur = fiturType.length - atasFitur;
  } else {
    equalFitur = fiturType.length / 2;
  }

  function dataAtasFitur(params1) {
    let dataFitur = [];
    for (let i = 0; i < params1; i++) {
      dataFitur.push(fiturType[i]);
    }
    return dataFitur;
  }

  function dataBawahFitur(params2) {
    let dataFitur = [];
    for (let i = params2 + 1; i < fiturType.length; i++) {
      dataFitur.push(fiturType[i]);
    }
    return dataFitur;
  }

  function dataAtasEqualFitur(params1) {
    let dataFitur = [];
    for (let i = 0; i < params1; i++) {
      dataFitur.push(fiturType[i]);
    }
    return dataFitur;
  }

  function dataBawahEqualFitur(params2) {
    let dataFitur = [];
    for (let i = params2; i < fiturType.length; i++) {
      dataFitur.push(fiturType[i]);
    }
    return dataFitur;
  }

  let atasTypeMethod = 0;
  let bawahTypeMethod = 0;
  let equalTypeMethod = 0;

  if (listTypeMethod.length % 2 === 1) {
    atasTypeMethod = Math.ceil(listTypeMethod.length / 2);
    bawahTypeMethod = listTypeMethod.length - atasTypeMethod;
  } else {
    equalTypeMethod = listTypeMethod.length / 2;
  }

  function dataAtasMethod(params1) {
    let dataTypeMethod = [];
    for (let i = 0; i < params1; i++) {
      dataTypeMethod.push(listTypeMethod[i]);
    }
    return dataTypeMethod;
  }

  function dataBawahMethod(params2) {
    let dataTypeMethod = [];
    for (let i = params2 + 1; i < listTypeMethod.length; i++) {
      dataTypeMethod.push(listTypeMethod[i]);
    }
    return dataTypeMethod;
  }

  function dataAtasEqualMethod(params1) {
    let dataTypeMethod = [];
    for (let i = 0; i < params1; i++) {
      dataTypeMethod.push(listTypeMethod[i]);
    }
    return dataTypeMethod;
  }

  function dataBawahEqualMethod(params2) {
    let dataTypeMethod = [];
    for (let i = params2; i < listTypeMethod.length; i++) {
      dataTypeMethod.push(listTypeMethod[i]);
    }
    return dataTypeMethod;
  }

  const columns = [
    {
      name: "No",
      selector: (row) => row.number,
      ignoreRowClick: true,
      button: true,
    },
    {
      name: "ID Agen",
      selector: (row) => row.agen_id,
      sortable: true,
      //   cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailAgenHandler(row.agen_id)}>{row.agen_id}</Link>
    },
    {
      name: "Nama Agen",
      selector: (row) => row.agen_name,
      sortable: true,
      width: "120px",
    },
    {
      name: "Email",
      selector: (row) => row.agen_email,
      sortable: true,
    },
    {
      name: "No Hp",
      selector: (row) => row.agen_mobile,
      sortable: true,
    },
    {
      name: "No Rekening",
      selector: (row) => row.no_rekening,
      sortable: true,
      width: "150px",
    },
    {
      name: "No Rekening Sub Account",
      selector: (row) => row.no_rekening,
      sortable: true,
      width: "235px",
    },
    {
      name: "Nama Pemilik Rekening",
      selector: (row) => row.nama_pemilik_rekening,
      sortable: true,
      width: "240px",
    },
    {
      name: "Kode Unik",
      selector: (row) => row.agen_unique_code,
      width: "132px",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row.status === true ? (
          <div className="active-status-badge">Aktif</div>
        ) : (
          <div className="inactive-status-badge">Tidak Aktif</div>
        ),
      width: "90px",
      style: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItem: "center",
        padding: "6px 12px",
        margin: "6px 0px",
        width: "50%",
        borderRadius: 4,
      },
    },
  ];

  const columnPayment = [
    {
      name: "No",
      selector: (row) => row.number,
      width: "67px",
    },
    {
      name: "Fitur",
      selector: (row) => row.fitur_name,
    },
    {
      name: "Metode Pembayaran",
      selector: (row) => row.mpaytype_name.join(", "),
      width: "230px",
    },
    {
      name: "Fee",
      selector: (row) => convertFormatNumberPartner(row.fee),
    },
    {
      name: "Settlement Fee",
      selector: (row) => convertFormatNumberPartner(row.fee_settle),
      width: "150px",
    },
    {
      name: "Aksi",
      //   selector: (row) => row.icon,
      width: "130px",
      cell: (row) => (
        <div className="d-flex justify-content-center align-items-center">
          <img
            src={edit}
            onClick={() => editInTableHandler(row.number)}
            style={{ cursor: "pointer" }}
            alt="icon edit"
          />
          <img
            onClick={() => deleteDataHandler(row.number)}
            src={deleted}
            style={{ cursor: "pointer" }}
            className="ms-2"
            alt="icon delete"
          />
        </div>
      ),
    },
  ];

  const columnSubAcc = [
    {
      name: "No",
      selector: (row) => row.number,
      width: "67px",
    },
    {
      name: "Sumber Agen",
      selector: (row) => row.agen_source,
      width: "180px",
    },
    {
      name: "Nama Bank",
      selector: (row) => (row.bank_name),
      width: "160px",
    },
    {
      name: "Nomor Rekening",
      selector: (row) => row.bank_number,
      width: "180px",
    },
    {
      name: "Nama Pemilik Rekening",
      selector: (row) => row.bank_account_name,
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
              onClick={() => editInSubAcc(row.number)}
              style={{ cursor: "pointer" }}
              alt="icon edit"
            />
          </OverlayTrigger>
          <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Delete</div></Tooltip>}>
            <img
              onClick={() => deleteHandlerSubAcc(row.number)}
              src={deleted}
              style={{ cursor: "pointer" }}
              className="ms-2"
              alt="icon delete"
            />
          </OverlayTrigger>
        </div>
      ),
    },
  ];

  function saveNewSchemaHandle(
    fee,
    fee_settle,
    fiturId,
    fiturName,
    typeId,
    typeName,
    number
  ) {
    let sameFlag = 0
    payment.forEach((val) => {
      if (val.fitur_id === Number(fiturId)) {
        val.mpaytype_id.forEach(item => {
          typeId.forEach(item2 => {
            if (item === item2) {
              sameFlag++
            }
          })
        })
      }      
    })
    if (sameFlag === 0) {
      if (typeId.length === 0) {
        setMustFill(true)
      } else {
        setMustFill(false)
        if (inputHandle.fee === "") {
          setAlertFee(true)
        } else {
          setAlertFee(false)
          if (inputHandle.settlementFee === "") {
            setAlertSettlement(true)
          } else {
            setAlertSettlement(false)
            const newData = {
              fee: Number(fee),
              fee_settle: Number(fee_settle),
              fitur_id: Number(fiturId),
              fitur_name: fiturName,
              mpaytype_id: typeId,
              mpaytype_name: typeName,
              number: number,
            };
            setPayment([...payment, newData]);
            setRedFlag(false)
            setInputHandle({
              fee: 0,
              settlementFee: 0,
            });
            setFitur("", "");
            setPaymentMethod([]);
            setPaymentNameMethod([]);
          }
        }
      }
    } else {      
      setRedFlag(true)
    }
  }

  function saveNewSchemaSubAccHandle (
    sumberAgenCode,
    sumberAgen,
    akunBankSubAcc,
    rekeningOwnerSubAcc,
    number
  ) {
    if (number > 2) {
      setAlertMaxSubAcc(true)
      setInputHandle({
        sumberAgen: "",
        akunBankSubAcc: "",
        rekeningOwnerSubAcc: "",
      })
      setAgenName("")
      setAgenCode("")
    } else {
      setAlertMaxSubAcc(false)
      if (sumberAgenCode !== "" && sumberAgen !== "" && akunBankSubAcc !== "" && rekeningOwnerSubAcc !== "") {
        setAlertFillAgen(false)
        setAlertNoRek(false)
        setAlertNameRek(false)
        subAccount.find((item) => {
          if (item.subpartner_id === sumberAgenCode) {
            setAlertSamePartner(true)
          } else {
              setAlertSamePartner(false)
              const newDataSubAcc = {
              bank_name: "Danamon",
              bank_number: akunBankSubAcc,
              bank_account_name: rekeningOwnerSubAcc,
              subpartner_id: sumberAgenCode,
              agen_source: sumberAgen,
              number: number
            }
            setSubAccount([...subAccount, newDataSubAcc])
            setInputHandle({
              sumberAgen: "",
              akunBankSubAcc: "",
              rekeningOwnerSubAcc: "",
            })
          }
        })
        
      } else {
        if (sumberAgenCode === "" || sumberAgen === "") {
          setAlertFillAgen(true)
        }
        if (akunBankSubAcc === "") {
          setAlertNoRek(true)
        }
        if (rekeningOwnerSubAcc === "") {
          setAlertNameRek(true)
        }
      }
    }
    
  }

  async function editDetailPartner(
    id,
    namaPerusahaan,
    emailPerusahaan,
    phoneNumber,
    alamat,
    noNpwp,
    namaNpwp,
    nama,
    noHp,
    active,
    akunBank,
    rekeningOwner,
    paymentData,
    subAccount
  ) {
    try {
      if (namaPerusahaan === undefined) {
        namaPerusahaan = detailPartner.mpartner_name;
      }
      if (emailPerusahaan === undefined) {
        emailPerusahaan = detailPartner.mpartner_email;
      }
      if (phoneNumber === undefined) {
        phoneNumber = detailPartner.mpartner_telp;
      }
      if (alamat === undefined) {
        alamat = detailPartner.mpartner_address;
      }
      if (noNpwp === undefined) {
        noNpwp = detailPartner.mpartner_npwp;
      }
      if (namaNpwp === undefined) {
        namaNpwp = detailPartner.mpartner_npwp_name;
      }
      if (nama === undefined) {
        nama = detailPartner.mpartner_direktur;
      }
      if (noHp === undefined) {
        noHp = detailPartner.mpartner_direktur_telp;
      }
      if (active === undefined) {
        active = detailPartner.mpartner_is_active;
      }
      if (akunBank === undefined) {
        akunBank = detailPartner.mpartnerdtl_account_number;
      }
      if (rekeningOwner === undefined) {
        rekeningOwner = detailPartner.mpartnerdtl_account_name;
      }
      paymentData = paymentData.map((item) => ({
        ...item,
        payment_id: item.mpaytype_id,
        settle_fee: item.fee_settle,
      }));
      paymentData = paymentData.filter(
        (item) => (
          delete item.icon,
          delete item.number,
          delete item.mpaytype_name,
          delete item.mpaytype_id,
          delete item.fee_settle,
          delete item.fitur_name
        )
      );

      subAccount = subAccount.map((item) => ({
        ...item,
        account_number: item.bank_number,
        account_name: item.bank_account_name,
        sub_partnerID: item.subpartner_id,
        bank_code: "011"
      }));
      subAccount = subAccount.filter(
        (item) => (
          delete item.number,
          delete item.bank_number,
          delete item.bank_account_name,
          delete item.bank_name,
          delete item.agen_source,
          delete item.subpartner_id
        )
      );
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(
        `{"mpartner_id":"${id}", "mpartner_name": "${namaPerusahaan}", "mpartner_email": "${emailPerusahaan}", "mpartner_telp": "${phoneNumber}", "mpartner_address": "${alamat}", "mpartner_npwp": "${noNpwp}", "mpartner_npwp_name": "${namaNpwp}", "mpartner_direktur": "${nama}", "mpartner_direktur_telp": "${noHp}", "mpartner_is_active": ${active}, "bank_account_number": "${akunBank}", "bank_account_name": "${rekeningOwner}", "payment_method": ${JSON.stringify(
          paymentData
        )}, "sub_account": ${JSON.stringify(
          subAccount
        )}}`
      );
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const editPartner = await axios.post(BaseURL +
        "/Partner/UpdatePartner",
        { data: dataParams },
        { headers: headers }
      );
      // console.log(editPartner, "ini add partner");
      if (
        editPartner.status === 200 &&
        editPartner.data.response_code === 200 &&
        editPartner.data.response_new_token.length === 0
      ) {
        // RouteTo('/daftarpartner')
        history.push("/daftarpartner");
      } else if (
        editPartner.status === 200 &&
        editPartner.data.response_code === 200 &&
        editPartner.data.response_new_token.length !== 0
      ) {
        setUserSession(editPartner.data.response_new_token);
        history.push("/daftarpartner");
      }

      alert("Edit Data Partner Berhasil");
    } catch (error) {
      // RouteTo(errorCatch(error.response.status))
      history.push(errorCatch(error.response.status));
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getDataAgen(partnerId) {
    try {
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(`{"partner_id":"${partnerId}"}`);
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const listAgen = await axios.post(BaseURL +
        "/Partner/GetListAgen",
        { data: dataParams },
        { headers: headers }
      );
      //   console.log(listAgen, 'ini data agen');
      if (
        listAgen.status === 200 &&
        listAgen.data.response_code === 200 &&
        listAgen.data.response_new_token.length === 0
      ) {
        listAgen.data.response_data = listAgen.data.response_data.map(
          (obj, id) => ({ ...obj, number: id + 1 })
        );
        setListAgen(listAgen.data.response_data);
      } else if (
        listAgen.status === 200 &&
        listAgen.data.response_code === 200 &&
        listAgen.data.response_new_token.length !== 0
      ) {
        setUserSession(listAgen.data.response_new_token);
        setListAgen(listAgen.data.response_data);
      }
    } catch (error) {
      // RouteTo(errorCatch(error.response.status))
      history.push(errorCatch(error.response.status));
    }
  }

  async function listSumberAgenHandler(partnerId) {
    try {
        const auth = 'Bearer ' + getToken();
        const dataParams = encryptData(`{"mpartnerdtl_sub_id":"${partnerId}"}`);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': auth
        }
        const getSumberAgen = await axios.post(BaseURL + "/Partner/GetSumberAgen", {data: dataParams}, {headers: headers})
        console.log(getSumberAgen, "list disburse");
        if (getSumberAgen.status === 200 && getSumberAgen.data.response_code === 200 && getSumberAgen.data.response_new_token.length === 0) {
            setSumberAgenList(getSumberAgen.data.response_data)
        } else if (getSumberAgen.status === 200 && getSumberAgen.data.response_code === 200 && getSumberAgen.data.response_new_token.length !== 0) {
            setUserSession(getSumberAgen.data.response_new_token)
            setSumberAgenList(getSumberAgen.data.response_data)
        }
    } catch (error) {
        // console.log(error);
        history.push(errorCatch(error.response.status))
    }
  }

  useEffect(() => {
    if (!access_token) {
      // RouteTo('/login')
      history.push("/login");
    }
    if (user_role === "102") {
      history.push("/404");
    }
    getDetailPartner(partnerId);
    getDataAgen(partnerId);
    getTypeFitur();
    listSumberAgenHandler(partnerId)
  }, [access_token, user_role, partnerId]);

  const CustomLoader = () => (
    <div style={{ padding: "24px" }}>
      <Image
        className="loader-element animate__animated animate__jackInTheBox"
        src={loadingEzeelink}
        height={80}
      />
      <div>Loading...</div>
    </div>
  );

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#F2F2F2",
        border: "12px",
        fontWeight: "bold",
        fontSize: "16px",
      },
    },
  };

  function detailAgenHandler(agenId) {
    // RouteTo(`/detailagen/${agenId}`)
    history.push(`/detailagen/${agenId}`);
  }

  const goBack = () => {
    window.history.back();
  };

  function detailAkunTabs(isTabs) {
    setIsDetailAkun(isTabs);
    if (!isTabs) {
      $("#detailakuntab").removeClass("menu-detail-akun-hr-active");
      $("#detailakunspan").removeClass("menu-detail-akun-span-active");
      $("#konfigurasitab").addClass("menu-detail-akun-hr-active");
      $("#konfigurasispan").addClass("menu-detail-akun-span-active");
    } else {
      $("#konfigurasitab").removeClass("menu-detail-akun-hr-active");
      $("#konfigurasispan").removeClass("menu-detail-akun-span-active");
      $("#detailakuntab").addClass("menu-detail-akun-hr-active");
      $("#detailakunspan").addClass("menu-detail-akun-span-active");
    }
  }

  return (
    <div className="container-content-partner mt-5">
      {isDetailAkun ? (
        <span className="breadcrumbs-span">
          <Link to={"/"}>Beranda</Link> &nbsp;
          <img alt="" src={breadcrumbsIcon} /> &nbsp;<Link to={"/daftarpartner"}>Daftar Partner</Link> &nbsp;
          <img alt="" src={breadcrumbsIcon} /> &nbsp;Detail Partner
        </span>
      ) : (
        <span className="breadcrumbs-span">
          <Link to={"/"}>Beranda</Link> &nbsp;
          <img alt="" src={breadcrumbsIcon} /> &nbsp;<Link to={"/daftarpartner"}>Daftar Partner</Link> &nbsp;
          <img alt="" src={breadcrumbsIcon} /> &nbsp;Daftar Agen
        </span>
      )}
      <div
        className="detail-akun-menu mt-5"
        style={{ display: "flex", height: 33 }}
      >
        <div
          className="detail-akun-tabs menu-detail-akun-hr-active"
          onClick={() => detailAkunTabs(true)}
          id="detailakuntab"
        >
          <span
            className="menu-detail-akun-span menu-detail-akun-span-active"
            id="detailakunspan"
          >
            Profil Partner
          </span>
        </div>
        <div
          className="detail-akun-tabs"
          style={{ marginLeft: 15 }}
          onClick={() => detailAkunTabs(false)}
          id="konfigurasitab"
        >
          <span className="menu-detail-akun-span" id="konfigurasispan">
            Daftar Agen
          </span>
        </div>
      </div>
      {isDetailAkun ? (
        <>
          <div className="detail-akun-section">
            <hr className="hr-style" style={{ marginTop: -2 }} />
            <br />
            <span className="head-title">Profil Perusahaan</span>
            <br />
            <br />
            <div className="base-content">
              <table
                style={{ width: "100%", marginLeft: "unset" }}
                className="table-form"
              >
                <thead></thead>
                <tbody>
                  <tr>
                    <td style={{ width: 200 }}>Status</td>
                    <td>
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        label={
                          inputHandle.active === undefined
                            ? detailPartner.isActive
                            : inputHandle.active === true
                            ? "Aktif"
                            : "Tidak Aktif"
                        }
                        checked={
                          inputHandle.active === undefined
                            ? detailPartner.mpartner_is_active
                            : inputHandle.active
                        }
                        name="active"
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td style={{ width: 200 }}>ID Partner</td>
                    <td>
                      <input
                        type="text"
                        className="input-text-ez"
                        value={detailPartner.mpartner_id}
                        disabled
                        style={{ width: "100%", marginLeft: "unset" }}
                      />
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td style={{ width: 200 }}>Nama Perusahaan <span style={{ color: "red" }}>*</span></td>
                    <td>
                      <input
                        type="text"
                        className="input-text-ez"
                        onChange={handleChange}
                        value={inputHandle.namaPerusahaan === undefined ? detailPartner.mpartner_name : inputHandle.namaPerusahaan}
                        name="namaPerusahaan"
                        style={{ width: "100%", marginLeft: "unset" }}
                      />
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td style={{ width: 200 }}>Email Perusahaan <span style={{ color: "red" }}>*</span></td>
                    <td>
                      <input
                        type="text"
                        className="input-text-ez"
                        onChange={handleChange}
                        value={inputHandle.emailPerusahaan === undefined ? detailPartner.mpartner_email : inputHandle.emailPerusahaan}
                        name="emailPerusahaan"
                        style={{ width: "100%", marginLeft: "unset" }}
                      />
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td style={{ width: 200 }}>Nomor Telepon <span style={{ color: "red" }}>*</span></td>
                    <td>
                      <input
                        type="number"
                        className="input-text-ez"
                        onChange={handleChange}
                        value={inputHandle.phoneNumber === undefined ? detailPartner.mpartner_telp : inputHandle.phoneNumber}
                        name="phoneNumber"
                        style={{ width: "100%", marginLeft: "unset" }}
                        onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                      />
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td style={{ width: 200 }}>Alamat <span style={{ color: "red" }}>*</span></td>
                    <td>
                      <input
                        type="text"
                        className="input-text-ez"
                        onChange={handleChange}
                        value={inputHandle.alamat === undefined ? detailPartner.mpartner_address : inputHandle.alamat}
                        name="alamat"
                        style={{ width: "100%", marginLeft: "unset" }}
                      />
                    </td>
                  </tr>
                  <br />
                </tbody>
              </table>
            </div>
            <br />
            <span className="head-title">Detail NPWP</span>
            <br />
            <br />
            <div className="base-content">
              <table
                style={{ width: "100%", marginLeft: "unset" }}
                className="table-form"
              >
                <thead></thead>
                <tbody>
                  <tr>
                    <td style={{ width: 200 }}>No NPWP <span style={{ color: "red" }}>*</span></td>
                    <td>
                      <input
                        type="number"
                        className="input-text-ez"
                        onChange={handleChange}
                        defaultValue={
                          // inputHandle.noNpwp === undefined ? detailPartner.mpartner_npwp : inputHandle.noNpwp
                          detailPartner.mpartner_npwp !== null
                            ? detailPartner.mpartner_npwp
                            : "-"
                        }
                        name="noNpwp"
                        style={{ width: "100%", marginLeft: "unset" }}
                        onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                      />
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td style={{ width: 200 }}>Nama NPWP <span style={{ color: "red" }}>*</span></td>
                    <td>
                      <input
                        type="text"
                        className="input-text-ez"
                        onChange={handleChange}
                        defaultValue={
                          // inputHandle.namaNpwp === undefined ? detailPartner.mpartner_npwp_name : inputHandle.namaNpwp
                          detailPartner.mpartner_npwp_name !== null
                            ? detailPartner.mpartner_npwp_name
                            : "-"
                        }
                        name="namaNpwp"
                        style={{ width: "100%", marginLeft: "unset" }}
                      />
                    </td>
                  </tr>
                  <br />
                </tbody>
              </table>
            </div>
            <br />
            <span className="head-title">Profil Direktur Perusahaan</span>
            <br />
            <br />
            <div className="base-content">
              <table
                style={{ width: "100%", marginLeft: "unset" }}
                className="table-form"
              >
                <thead></thead>
                <tbody>
                  <tr>
                    <td style={{ width: 200 }}>Nama Direktur <span style={{ color: "red" }}>*</span></td>
                    <td>
                      <input
                        type="text"
                        className="input-text-ez"
                        onChange={handleChange}
                        value={inputHandle.nama === undefined ? detailPartner.mpartner_direktur : inputHandle.nama}
                        name="nama"
                        style={{ width: "100%", marginLeft: "unset" }}
                      />
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td style={{ width: 200 }}>No Hp Direktur <span style={{ color: "red" }}>*</span></td>
                    <td>
                      <input
                        type="number"
                        className="input-text-ez"
                        onChange={handleChange}
                        value={inputHandle.noHp === undefined ? detailPartner.mpartner_direktur_telp : inputHandle.noHp}
                        name="noHp"
                        style={{ width: "100%", marginLeft: "unset" }}
                        onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                      />
                    </td>
                  </tr>
                  <br />
                </tbody>
              </table>
            </div>
            <br />
            <span className="head-title">Rekening</span>
            <br />
            <br />
            <div className="base-content">
              <table
                style={{ width: "100%", marginLeft: "unset" }}
                className="table-form"
              >
                <thead></thead>
                <tbody>
                  <tr>
                    <td style={{ width: 200 }}>Nama Bank <span style={{ color: "red" }}>*</span></td>
                    <td>
                      <input
                        type="text"
                        className="input-text-ez"
                        value={detailPartner.mbank_name}
                        name="bankName"
                        disabled
                        style={{ width: "100%", marginLeft: "unset" }}
                      />
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td style={{ width: 200 }}>No. Rekening <span style={{ color: "red" }}>*</span></td>
                    <td>
                      <input
                        type="number"
                        className="input-text-ez"
                        onChange={handleChange}
                        value={inputHandle.akunBank === undefined ? detailPartner.mpartnerdtl_account_number : inputHandle.akunBank}
                        name="akunBank"
                        style={{ width: "100%", marginLeft: "unset" }}
                        onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                      />
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td style={{ width: 200 }}>Nama Pemilik Rekening <span style={{ color: "red" }}>*</span></td>
                    <td>
                      <input
                        type="text"
                        className="input-text-ez"
                        onChange={handleChange}
                        value={inputHandle.rekeningOwner === undefined ? detailPartner.mpartnerdtl_account_name : inputHandle.rekeningOwner}
                        name="rekeningOwner"
                        style={{ width: "100%", marginLeft: "unset" }}
                      />
                    </td>
                  </tr>
                  <br />
                </tbody>
              </table>
            </div>
          </div>
          <br />
          <span className="head-title">Biaya</span>
          <br />
          <br />
          <div className="base-content">
            <table
              style={{ width: "100%", marginLeft: "unset" }}
              className="table-form"
            >
              <thead></thead>
              <tbody>
                <tr>
                  <td style={{ width: 200 }}>Fee <span style={{ color: "red" }}>*</span></td>
                  <td>
                    {editFee ?
                      <input
                        type="number"
                        className="input-text-ez"
                        onChange={handleChangeFee}
                        value={(inputHandle.fee === undefined) ? 0 : (inputHandle.fee)}
                        name="fee"
                        placeholder="Rp 0"
                        style={{ width: "100%", marginLeft: "unset", borderColor: alertFee ? "red" : "" }}
                        onBlur={() => setEditFee(!editFee)}
                        min={0}
                        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                      /> :
                      <input
                        type="text"
                        className="input-text-ez"
                        onChange={handleChangeFee}
                        value={(inputHandle.fee === undefined) ? convertFormatNumberPartner(0) : convertFormatNumberPartner(inputHandle.fee)}
                        name="fee"
                        placeholder="Rp 0"
                        style={{ width: "100%", marginLeft: "unset", borderColor: alertFee ? "red" : "" }}
                        onFocus={() => setEditFee(!editFee)}
                        min={0}
                      />
                    }
                    {alertFee === true ?
                    <div style={{ color: "#B9121B", fontSize: 12 }} className="mt-1">
                        <img src={noteIconRed} className="me-2" alt="icon notice" />
                        Fee Wajib Diisi. Jika tidak dikenakan biaya silahkan tulis 0
                    </div> : ""}
                  </td>
                </tr>
                <br />
                <tr>
                  <td style={{ width: 200 }}>Settlement Fee <span style={{ color: "red" }}>*</span></td>
                  <td>
                    {editInput ? (
                      <input
                        type="number"
                        className="input-text-ez"
                        onChange={handleChangeSettle}
                        value={(inputHandle.settlementFee === undefined) ? (0) : (inputHandle.settlementFee)}
                        name="settlementFee"
                        placeholder={"Rp 0"}
                        style={{ width: "100%", marginLeft: "unset", borderColor: alertSettlement ? "red" : "" }}
                        onBlur={() => setEditInput(!editInput)}
                        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                      />
                    ) : (
                      <input
                        type="text"
                        className="input-text-ez"
                        onChange={handleChangeSettle}
                        value={(inputHandle.settlementFee === undefined) ? convertFormatNumberPartner(0) : convertFormatNumberPartner(inputHandle.settlementFee)}
                        name="settlementFee"
                        placeholder={"Rp 0"}
                        style={{ width: "100%", marginLeft: "unset", borderColor: alertSettlement ? "red" : "" }}
                        onFocus={() => setEditInput(!editInput)}
                      />
                    )}
                    {alertSettlement === true ?
                      <div style={{color: "#B9121B", fontSize: 12}} className="mt-1">
                          <img src={noteIconRed} className="me-2" alt="icon notice" />
                          Settlement Fee Wajib Diisi. Jika tidak dikenakan biaya silahkan tulis 0
                      </div> : ""
                    }
                  </td>
                </tr>
                <br/>
                <tr>
                  <td style={{ width: 200 }}>Fitur <span style={{ color: "red" }}>*</span></td>
                  <td>
                    {equalFitur === 0 ? (
                      <>
                        <Row>
                          {dataAtasFitur(atasFitur).map((item) => {
                            return (
                              <Col key={item.fitur_id} xs={2}>
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="inlineCheckbox1"
                                    name={item.fitur_name}
                                    value={item.fitur_id}
                                    onChange={(e) => handleChangeFitur(e)}
                                    checked={
                                      edited === true
                                        ? fitur[0] &&
                                          fitur.includes(item.fitur_name)
                                        : fitur.includes(item.fitur_name)
                                    }
                                    // checked={edited === true ? fitur[0] : inputHandle.fiturs ? inputHandle.fiturs : 0}
                                  />
                                  <label
                                    className="form-check-label"
                                    style={{ fontWeight: 400, fontSize: "14px" }}
                                    for="inlineCheckbox1"
                                  >
                                    {item.fitur_name}
                                  </label>
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                        <Row>
                          {dataBawahFitur(bawahFitur).map((item) => {
                            return (
                              <Col key={item.fitur_id} xs={2}>
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="inlineCheckbox1"
                                    name={item.fitur_name}
                                    value={item.fitur_id}
                                    onChange={(e) => handleChangeFitur(e)}
                                    // checked={edited === true ? fitur[0] : inputHandle.fiturs ? inputHandle.fiturs : 0}
                                    checked={
                                      edited === true
                                        ? fitur[0] &&
                                          fitur.includes(item.fitur_name)
                                        : fitur.includes(item.fitur_name)
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    style={{ fontWeight: 400, fontSize: "14px" }}
                                    for="inlineCheckbox1"
                                  >
                                    {item.fitur_name}
                                  </label>
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                      </>
                    ) : (
                      <>
                        <Row>
                          {dataAtasEqualFitur(equalFitur).map((item) => {
                            return (
                              <Col key={item.fitur_id} xs={2}>
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="inlineCheckbox1"
                                    name={item.fitur_name}
                                    value={item.fitur_id}
                                    onChange={(e) => handleChangeFitur(e)}
                                    checked={
                                      edited === true
                                        ? fitur[0] &&
                                          fitur.includes(item.fitur_name)
                                        : fitur.includes(item.fitur_name)
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    style={{ fontWeight: 400, fontSize: "14px" }}
                                    for="inlineCheckbox1"
                                  >
                                    {item.fitur_name}
                                  </label>
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                        <Row>
                          {dataBawahEqualFitur(equalFitur).map((item) => {
                            return (
                              <Col key={item.fitur_id} xs={2}>
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="inlineCheckbox1"
                                    name={item.fitur_name}
                                    value={item.fitur_id}
                                    onChange={(e) => handleChangeFitur(e)}
                                    checked={
                                      edited === true
                                        ? fitur[0] &&
                                          fitur.includes(item.fitur_name)
                                        : fitur.includes(item.fitur_name)
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    style={{ fontWeight: 400, fontSize: "14px" }}
                                    for="inlineCheckbox1"
                                  >
                                    {item.fitur_name}
                                  </label>
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                      </>
                    )}
                  </td>
                </tr>
                <br/>
                <tr 
                  className="mt-4"
                  style={{
                    display:
                      fitur[0] !== undefined || edited === true ? "" : "none",
                  }}
                >
                  <td style={{ width: 200 }}>Metode Pembayaran <span style={{ color: "red" }}>*</span></td>
                  <td>
                    {equalTypeMethod === 0 ? (
                      <>
                        {loading ? (
                          <div className="d-flex justify-content-center align-items-center vh-100">
                            <CustomLoader />
                          </div>
                        ) : (
                          <>
                            <Row style={{ flexWrap: "nowrap" }}>
                              {dataAtasMethod(atasTypeMethod).map((item) => {
                                return (
                                  <Col key={item.payment_id} xs={2}>
                                    <div className="form-check form-check-inline">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="inlineCheckbox1"
                                        name={item.payment_name}
                                        value={item.payment_id}
                                        checked={
                                          listTypeMethod.length - 1 ===
                                          paymentMethod.length
                                            ? true
                                            : paymentMethod.includes(
                                                item.payment_id
                                              )
                                        }
                                        onChange={(e) =>
                                          handleChoosenPaymentType(
                                            e,
                                            item.payment_id,
                                            item.payment_name,
                                            listTypeMethod
                                          )
                                        }
                                      />
                                      <label
                                        className="form-check-label"
                                        style={{
                                          fontWeight: 400,
                                          fontSize: "14px",
                                        }}
                                        for="inlineCheckbox1"
                                      >
                                        {item.payment_name}
                                      </label>
                                    </div>
                                  </Col>
                                );
                              })}
                            </Row>
                            <Row>
                              {dataBawahMethod(bawahTypeMethod).map((item) => {
                                return (
                                  <Col key={item.payment_id} xs={2}>
                                    <div className="form-check form-check-inline">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="inlineCheckbox1"
                                        name={item.payment_name}
                                        value={item.payment_id}
                                        checked={
                                          listTypeMethod.length - 1 ===
                                          paymentMethod.length
                                            ? true
                                            : paymentMethod.includes(
                                                item.payment_id
                                              )
                                        }
                                        onChange={(e) =>
                                          handleChoosenPaymentType(
                                            e,
                                            item.payment_id,
                                            item.payment_name,
                                            listTypeMethod
                                          )
                                        }
                                      />
                                      <label
                                        className="form-check-label"
                                        style={{
                                          fontWeight: 400,
                                          fontSize: "14px",
                                        }}
                                        for="inlineCheckbox1"
                                      >
                                        {item.payment_name}
                                      </label>
                                    </div>
                                  </Col>
                                );
                              })}
                            </Row>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {loading ? (
                          <div className="d-flex justify-content-center align-items-center vh-100">
                            <CustomLoader />
                          </div>
                        ) : (
                          <>
                            <Row>
                              {dataAtasEqualMethod(equalTypeMethod).map((item) => {
                                return (
                                  <Col key={item.payment_id} xs={2}>
                                    <div className="form-check form-check-inline">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="inlineCheckbox1"
                                        name={item.payment_name}
                                        value={item.payment_id}
                                        checked={
                                          listTypeMethod.length - 1 ===
                                          paymentMethod.length
                                            ? true
                                            : paymentMethod.includes(
                                                item.payment_id
                                              )
                                        }
                                        onChange={(e) =>
                                          handleChoosenPaymentType(
                                            e,
                                            item.payment_id,
                                            item.payment_name,
                                            listTypeMethod
                                          )
                                        }
                                      />
                                      <label
                                        className="form-check-label"
                                        style={{
                                          fontWeight: 400,
                                          fontSize: "14px",
                                        }}
                                        for="inlineCheckbox1"
                                      >
                                        {item.payment_name}
                                      </label>
                                    </div>
                                  </Col>
                                );
                              })}
                            </Row>
                            <Row>
                              {dataBawahEqualMethod(equalTypeMethod).map((item) => {
                                return (
                                  <Col key={item.payment_id} xs={2}>
                                    <div className="form-check form-check-inline">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="inlineCheckbox1"
                                        name={item.payment_name}
                                        value={item.payment_id}
                                        checked={
                                          listTypeMethod.length - 1 ===
                                          paymentMethod.length
                                            ? true
                                            : paymentMethod.includes(
                                                item.payment_id
                                              )
                                        }
                                        onChange={(e) =>
                                          handleChoosenPaymentType(
                                            e,
                                            item.payment_id,
                                            item.payment_name,
                                            listTypeMethod
                                          )
                                        }
                                      />
                                      <label
                                        className="form-check-label"
                                        style={{
                                          fontWeight: 400,
                                          fontSize: "14px",
                                        }}
                                        for="inlineCheckbox1"
                                      >
                                        {item.payment_name}
                                      </label>
                                    </div>
                                  </Col>
                                );
                              })}
                            </Row>
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>                        
            {mustFill === true ?
              <div style={{ color: "#B9121B", fontSize: 12, marginLeft: 210 }} className="mt-3">
                <img src={noteIconRed} className="me-2" alt="icon notice"/>
                Wajib Dipilih
              </div> : ""
            }
            {redFlag === true ?
              <div style={{ color: "#B9121B", fontSize: 12, marginLeft: 210 }} className="mt-1">
                <img src={noteIconRed} className="me-2" alt="icon notice"/>
                Metode Pembayaran tidak boleh sama dalam satu Fitur
              </div> : ""
            }
            <table >              
              <thead></thead>
              <tbody>
                <tr>
                  <td style={{ width: 210 }}></td>
                  <td>
                    {edited === false ? (
                      <button
                        onClick={() =>
                          saveNewSchemaHandle(
                            inputHandle.fee,
                            inputHandle.settlementFee,
                            fitur[0],
                            fitur[1],
                            paymentMethod.filter((it) => it !== 0),
                            paymentNameMethod.filter((it) => it !== "Pilih Semua"),
                            payment.length + 1
                          )
                        }
                        style={{
                          fontFamily: "Exo",
                          fontSize: 16,
                          fontWeight: 700,
                          alignItems: "center",
                          padding: "12px 24px",
                          gap: 8,
                          width: 250,
                          height: 48,
                          color: "#077E86",
                          background: "unset",
                          border: "0.6px solid #077E86",
                          borderRadius: 6,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ marginRight: 10 }}
                        />{" "}
                        Tambah Skema Baru
                      </button>
                    ) : (
                      <>
                        <button
                          className="mx-2"
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
                          onClick={() =>
                            saveEditInTableHandler(
                              numbering,
                              inputHandle.fee,
                              inputHandle.settlementFee,
                              fitur[0],
                              fitur[1],
                              paymentMethod.filter((it) => it !== 0),
                              paymentNameMethod.filter((it) => it !== "Pilih Semua")
                            )
                          }
                        >
                          Simpan
                        </button>
                      </>
                    )}
                  </td>
                  {/* <td style={{ width: "13%"}}></td> */}
                  <td className="d-flex justify-content-end align-items-center text-end ms-4">
                    {expanded ? (
                      <div
                        className="my-4 text-end"
                        style={{
                          // display: "flex",
                          // justifyContent: "end",
                          // alignItems: "center",
                          // padding: "unset",
                          // width:"100%"
                        }}
                      >
                        <button
                          style={{
                            fontFamily: "Exo",
                            fontSize: 16,
                            fontWeight: 700,
                            alignItems: "center",
                            gap: 8,
                            // width: "100%",
                            height: 48,
                            color: "#077E86",
                            background: "unset",
                            border: "unset",
                          }}
                          onClick={showCheckboxes}
                          className="text-end"
                        >
                          Sembunyikan tabel skema biaya{" "}
                          <FontAwesomeIcon icon={faChevronUp} className="mx-2" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="my-4 mb-4 text-end"
                        style={{
                          // display: "flex",
                          // justifyContent: "end",
                          // alignItems: "center",
                          // padding: "unset",
                          // width:"100%"
                        }}
                      >
                        <button
                          style={{
                            fontFamily: "Exo",
                            fontSize: 16,
                            fontWeight: 700,
                            alignItems: "center",
                            gap: 8,
                            // width: "100%",
                            height: 48,
                            color: "#077E86",
                            background: "unset",
                            border: "unset",
                          }}
                          onClick={showCheckboxes}
                          className="text-end"
                        >
                          Lihat tabel skema lainnya{" "}
                          <FontAwesomeIcon icon={faChevronDown} className="mx-2" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            {expanded && (
              <div className="div-table pb-4" ref={myRef}>
                <DataTable
                  columns={columnPayment}
                  data={payment}
                  customStyles={customStyles}
                  // progressPending={pendingSettlement}
                  progressComponent={<CustomLoader />}
                />
              </div>
            )}
          </div>

          <br />
          <span className="head-title">Rekening Sub Account</span>
          <br />
          <br />
          <div className="base-content">
            <table
              style={{ width: "100%", marginLeft: "unset" }}
              className="table-form"
            >
              <thead></thead>
              <tbody>
                <tr>
                  <td style={{ width: 200 }}>Sumber Agen</td>
                  <td>
                    <Form.Select name='sumberAgen' value={inputHandle.sumberAgen} className='input-text-ez' style={{ width: "100%", marginLeft: "unset" }} onChange={(e) => handleChangeSubAcc(e)}>
                        <option defaultChecked disabled value={""} style={{ color: "#b4c0d2" }} >Pilih Agen</option>
                        {
                          sumberAgenList.map((item, index) => {
                            return (
                              <option key={index} value={item.mpartnerdtl_sub_id}>{item.mpartnerdtl_sub_name}</option>
                            )
                          })
                        }
                    </Form.Select>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: 200 }}></td>
                  <td>
                    {
                      alertFillAgen === true ?
                      <div style={{ color: "#B9121B", fontSize: 12 }} className="mt-1">
                          <img src={noteIconRed} className="me-2" alt="icon notice" />
                          Sumber Agen wajib diisi
                      </div> : ""
                    }
                    {
                      alertSamePartner === true ?
                      <div style={{ color: "#B9121B", fontSize: 12 }} className="mt-1">
                          <img src={noteIconRed} className="me-2" alt="icon notice" />
                          Agen telah ada
                      </div> : ""
                    }
                  </td>
                </tr>
                <br />
                <tr>
                  <td style={{ width: 200 }}>Nama Bank</td>
                  <td>
                    <input
                      type="text"
                      className="input-text-ez"
                      disabled
                      value={"Bank Danamon"}
                      // name="bankNameSubAcc"
                      style={{ width: "100%", marginLeft: "unset" }}
                    />
                  </td>
                </tr>
                <br />
                <tr>
                  <td style={{ width: 200 }}>No. Rekening <span style={{ color: "red" }}>*</span></td>
                  <td>
                    <input
                      type="number"
                      className="input-text-edit"
                      onChange={(e) => handleChangeSubAcc(e)}
                      value={inputHandle.akunBankSubAcc === undefined ? "" : inputHandle.akunBankSubAcc}
                      placeholder="Masukkan Nomor Rekening"
                      name="akunBankSubAcc"
                      style={{ width: "100%", marginLeft: "unset" }}
                      onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ width: 200 }}></td>
                  <td>
                    {
                      alertNoRek === true ?
                      <div style={{ color: "#B9121B", fontSize: 12 }} className="mt-1">
                          <img src={noteIconRed} className="me-2" alt="icon notice" />
                          No Rekening Wajib diisi
                      </div> : ""
                    }
                  </td>
                </tr>
                <br />
                <tr>
                  <td style={{ width: 200 }}>Nama Pemilik Rekening</td>
                  <td>
                    <input
                      type="text"
                      className="input-text-edit"
                      onChange={(e) => handleChangeSubAcc(e)}
                      value={inputHandle.rekeningOwnerSubAcc === undefined ? "" : inputHandle.rekeningOwnerSubAcc}
                      name="rekeningOwnerSubAcc"
                      placeholder="Masukkan Nama Pemilik Rekening"
                      style={{ width: "100%", marginLeft: "unset" }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ width: 200 }}></td>
                  <td>
                    {
                      alertNameRek === true ?
                      <div style={{ color: "#B9121B", fontSize: 12 }} className="mt-1">
                          <img src={noteIconRed} className="me-2" alt="icon notice" />
                          Nama Pemilik Rekening wajib diisi
                      </div> : ""
                    }
                  </td>
                </tr>
                <br />
              </tbody>
            </table>
            <table >              
              <thead></thead>
              <tbody>
                <tr>
                  <td style={{ width: 210 }}></td>
                  <td>
                    {editedSubAcc === false ? (
                      <button
                        onClick={() =>
                          saveNewSchemaSubAccHandle(
                            agenCode,
                            agenName,
                            inputHandle.akunBankSubAcc,
                            inputHandle.rekeningOwnerSubAcc,
                            subAccount.length + 1
                          )
                        }
                        style={{
                          fontFamily: "Exo",
                          fontSize: 16,
                          fontWeight: 700,
                          alignItems: "center",
                          padding: "12px 24px",
                          gap: 8,
                          width: 250,
                          height: 48,
                          color: subAccount.length >= 2 ? "#888888" : "#077E86",
                          background: "unset",
                          border: subAccount.length >= 2 ? "0.6px solid #888888" : "0.6px solid #077E86",
                          borderRadius: 6,
                          cursor: subAccount.length >= 2 ? "unset" : "pointer"
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ marginRight: 10 }}
                        />{" "}
                        Tambah Sub Account
                      </button>
                    ) : (
                      <>
                        <button
                          className="mx-2"
                          onClick={() => batalEditSubAcc()}
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
                          onClick={() =>
                            saveEditTableSubAcc(
                              numberSubAcc,
                              agenCode,
                              agenName,
                              inputHandle.akunBankSubAcc,
                              inputHandle.rekeningOwnerSubAcc
                            )
                          }
                        >
                          Simpan
                        </button>
                      </>
                    )}
                  </td>
                  {/* <td style={{ width: "13%"}}></td> */}
                  <td className="d-flex justify-content-end align-items-center text-end ms-4">
                    {expandedSubAcc ? (
                      <div
                        className="my-4 text-end"
                        style={{
                          // display: "flex",
                          // justifyContent: "end",
                          // alignItems: "center",
                          // padding: "unset",
                          // width:"100%"
                        }}
                      >
                        <button
                          style={{
                            fontFamily: "Exo",
                            fontSize: 16,
                            fontWeight: 700,
                            alignItems: "center",
                            gap: 8,
                            // width: "100%",
                            height: 48,
                            color: "#077E86",
                            background: "unset",
                            border: "unset",
                          }}
                          onClick={showCheckboxesSubAccount}
                          className="text-end"
                        >
                          Sembunyikan daftar Sub Account{" "}
                          <FontAwesomeIcon icon={faChevronUp} className="mx-2" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="my-4 mb-4 text-end"
                        style={{
                          // display: "flex",
                          // justifyContent: "end",
                          // alignItems: "center",
                          // padding: "unset",
                          // width:"100%"
                        }}
                      >
                        <button
                          style={{
                            fontFamily: "Exo",
                            fontSize: 16,
                            fontWeight: 700,
                            alignItems: "center",
                            gap: 8,
                            // width: "100%",
                            height: 48,
                            color: "#077E86",
                            background: "unset",
                            border: "unset",
                          }}
                          onClick={showCheckboxesSubAccount}
                          className="text-end"
                        >
                          Lihat daftar Sub Account{" "}
                          <FontAwesomeIcon icon={faChevronDown} className="mx-2" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ width: 210 }}></td>
                  <td>
                    {
                      subAccount.length >= 2 ?
                      <div style={{ color: "#B9121B", fontSize: 12 }} className="mt-1">
                          <img src={noteIconRed} className="me-2" alt="icon notice" />
                          Maksimal 2 akun untuk ditambahkan.
                      </div> : ""
                    }
                  </td>
                </tr>
                <br/>
              </tbody>
            </table>
            {expandedSubAcc && (
              <div className="div-table pb-4" ref={myRef}>
                <DataTable
                  columns={columnSubAcc}
                  data={subAccount}
                  customStyles={customStyles}
                  // progressPending={pendingSettlement}
                  progressComponent={<CustomLoader />}
                />
              </div>
            )}
          </div>

          <div
            className="mb-5 mt-3"
            style={{ display: "flex", justifyContent: "end" }}
          >
            <button
              onClick={goBack}
              className="mx-2"
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
            <button
              onClick={() =>
                editDetailPartner(
                  detailPartner.mpartner_id,
                  inputHandle.namaPerusahaan,
                  inputHandle.emailPerusahaan,
                  inputHandle.phoneNumber,
                  inputHandle.alamat,
                  inputHandle.noNpwp,
                  inputHandle.namaNpwp,
                  inputHandle.nama,
                  inputHandle.noHp,
                  inputHandle.active,
                  inputHandle.akunBank,
                  inputHandle.rekeningOwner,
                  payment,
                  subAccount
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
                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                border: "0.6px solid #2C1919",
                borderRadius: 6,
              }}
            >
              Simpan
            </button>
          </div>
        </>
      ) : (
        <> 
          <hr className='hr-style' style={{marginTop: -2}}/>
          <div className='base-content mt-5 mb-5'>  
              {
              listAgen.length === 0 ?
              <div style={{ display: "flex", justifyContent: "center", paddingBottom: 20, alignItems: "center" }}>There are no records to display</div> :
              <div className="div-table">
                  <DataTable
                      columns={columns}
                      data={filteredItems}
                      customStyles={customStyles}
                      noDataComponent={<div style={{ marginBottom: 10 }}>There are no records to display</div>}
                      pagination
                      highlightOnHover
                      progressComponent={<CustomLoader />}
                      subHeader
                      subHeaderComponent={subHeaderComponentMemo}
                  />
              </div>
              }
          </div>
        </>
      )}
    </div>
  );
}

export default EditPartner;
