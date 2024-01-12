import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import { Col, Form, Row, Fade, OverlayTrigger, Tooltip } from "@themesberg/react-bootstrap";
import $ from "jquery";
import axios from "axios";
import {
  BaseURL,
  convertToRupiah,
  errorCatch,
  getRole,
  getToken,
  RouteTo,
  setUserSession,
  CustomLoader
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
import noteIconRed from "../../assets/icon/note_icon_red.svg";
import edit from "../../assets/icon/edit_icon.svg";
import deleted from "../../assets/icon/delete_icon.svg";
import FilterComponent from "../../components/FilterComponent";
import noteIconGrey from "../../assets/icon/note_icon_grey.svg"
import CurrencyInput from "react-currency-input-field";

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
  const [editMinTopup, setEditMinTopup] = useState(false)
  const [editMinTransaksi, setEditMinTransaksi] = useState(false)
  const [editMaksTransaksi, setEditMaksTransaksi] = useState(false)
  const [loading, setLoading] = useState(false);
  const [redFlag, setRedFlag] = useState(false)
  const [mustFill, setMustFill] = useState(false)
  const [alertFee, setAlertFee] = useState(false)
  const [alertSettlement, setAlertSettlement] = useState(false)
  const [alertFeeType, setAlertFeeType] = useState(false)
  const [alertMinTransaksi, setAlertMinTransaksi] = useState(false)
  const [alertMaksTransaksi, setAlertMaksTransaksi] = useState(false)
  const [alertFillAgen, setAlertFillAgen] = useState(false)
  const [alertNoRek, setAlertNoRek] = useState(false)
  const [alertNameRek, setAlertNameRek] = useState(false)
  const [alertMaxSubAcc, setAlertMaxSubAcc] = useState(false)
  const [alertSamePartner, setAlertSamePartner] = useState(false)
  const [sumberAgenList, setSumberAgenList] = useState([])
  const [isDisableFeeType, setIsDisableFeeType] = useState(false)
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
    paymentType: [],
    fiturs: 0,
    isChargeFee: detailPartner.mpartner_is_charge_fee,
  });
  const [biayaHandle, setBiayaHandle] = useState({
    fee: 0,
    settlementFee: 0,
    feeType: 0,
    minTransaksi: 0,
    maksTransaksi: 0
  })
  const [subAccountHandle, setSubAccountHandle] = useState({
    sumberAgen: "",
    sumberAgenName: "",
    bankNameSubAcc: "Danamon",
    akunBankSubAcc: "",
    rekeningOwnerSubAcc: "",
  })
  const [agenName, setAgenName] = useState("")
  const [agenCode, setAgenCode] = useState("")
  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const filteredItems = listAgen.filter(
      item => item.agen_name && item.agen_name.toLowerCase().includes(filterText.toLowerCase()),
  );
  // console.log(fitur, 'fitur');
  // console.log(isDisableFeeType, 'isDisableFeeType');

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
        [e.target.name]: inputHandle.active === undefined ? !detailPartner.mpartner_is_active : !inputHandle.active,
      });
    } else if (e.target.name === "isChargeFee") {
      setInputHandle({
        ...inputHandle,
        [e.target.name]: inputHandle.isChargeFee === undefined ? !detailPartner.mpartner_is_charge_fee : !inputHandle.isChargeFee,
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
      setSubAccountHandle({
        ...subAccountHandle,
        [e.target.name]: e.target.value,
      });
      const resultAgen = sumberAgenList.find((item) =>
        item.mpartnerdtl_sub_id === e.target.value
      )
      setAgenName(resultAgen.mpartnerdtl_sub_name);
      setAgenCode(resultAgen.mpartnerdtl_sub_id);
    } else if (e.target.name === "akunBankSubAcc") {
      setAlertNoRek(false)
      setSubAccountHandle({
        ...subAccountHandle,
        [e.target.name]: e.target.value,
      });
    } else {
      setAlertNameRek(false)
      setSubAccountHandle({
        ...subAccountHandle,
        [e.target.name]: e.target.value,
      });
    }
  }

  // function handleChangeFee (e) {
  //   if (e.target.value.length === 0) {
  //     setAlertFee(true)
  //   }  else {
  //     setAlertFee(false)
  //     setBiayaHandle({
  //       ...biayaHandle,
  //       [e.target.name]: Number(e.target.value).toString(),
  //     });
  //   }
  // }

  function handleChangeFee(e, feeType) {
    // console.log(feeType, 'feeType');
    // console.log(e, 'e');
    setAlertFee(false)
    setBiayaHandle({
      ...biayaHandle,
      fee: e,
    });
    if (feeType === 101) {
      if (e === undefined || e === "") {
        // console.log('masuk if 1');
        setAlertFee(true)
      } else if (e.length === 3 && e !== "100") {
        // console.log('masuk if 2');
        setBiayaHandle({
          ...biayaHandle,
          fee: "100",
        });
      }
    }
  }

  // function handleChangeSettle (e) {
  //   if (e.target.value.length === 0) {
  //     setAlertSettlement(true)
  //   } else {
  //     setAlertSettlement(false)
  //     setBiayaHandle({
  //       ...biayaHandle,
  //       [e.target.name]: Number(e.target.value).toString(),
  //     });
  //   }
  // }

  function handleChangeSettle(e) {
    setAlertSettlement(false)
    setBiayaHandle({
      ...biayaHandle,
      settlementFee: e,
    });
    if (e === undefined || e === "") {
      setAlertSettlement(true)
    }
  }

  // function handleChangeFeeType(e) {
  //   if (e.target.value.length === 0) {
  //     setAlertFeeType(true)
  //   } else {
  //     setAlertFeeType(false)
  //     setBiayaHandle({
  //       ...biayaHandle,
  //       [e.target.name]: Number(e.target.value).toString()
  //     })
  //   }
  // }

  function handleChangeFeeType(e) {
    setAlertFeeType(false)
    setBiayaHandle({
      ...biayaHandle,
      feeType: e,
    });
    if (e === undefined || e === "") {
      setAlertFeeType(true)
    }
  }

  // function handleChangeMinTransaksi(e) {
  //   if (e.target.value.length === 0) {
  //     setAlertMinTransaksi(true)
  //   } else {
  //     setAlertMinTransaksi(false)
  //     setBiayaHandle({
  //       ...biayaHandle,
  //       [e.target.name]: Number(e.target.value).toString()
  //     })
  //   }
  // }

  function handleChangeMinTransaksi(e) {
    setAlertMinTransaksi(false)
    setBiayaHandle({
      ...biayaHandle,
      minTransaksi: e,
    });
    if (e === undefined || e === "") {
      setAlertMinTransaksi(true)
    }
  }

  // function handleChangeMaksTransaksi(e) {
  //   if (e.target.value.length === 0) {
  //     setAlertMaksTransaksi(true)
  //   } else {
  //     setAlertMaksTransaksi(false)
  //     setBiayaHandle({
  //       ...biayaHandle,
  //       [e.target.name]: Number(e.target.value).toString()
  //     })
  //   }
  // }

  function handleChangeMaksTransaksi(e) {
    setAlertMaksTransaksi(false)
    setBiayaHandle({
      ...biayaHandle,
      maksTransaksi: e,
    });
    if (e === undefined || e === "") {
      setAlertMaksTransaksi(true)
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

  const handleChangeFitur = (e, handleBiaya) => {
    // console.log(e.target.name, 'e.target.name');
    if (e.target.name === "Payment Collection") {
      setIsDisableFeeType(false)
    } else if (e.target.name === "VA USD") {
      setIsDisableFeeType(true)
      if (handleBiaya.feeType !== 101) {
        setBiayaHandle({
          ...biayaHandle,
          feeType: 101,
          fee: ""
        })
      }
    } else {
      setIsDisableFeeType(true)
      if (handleBiaya.feeType !== 100) {
        setBiayaHandle({
          ...biayaHandle,
          feeType: 100,
          fee: ""
        })
      }
    }
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

  // console.log(subAccount, "subAccount");

  function editInTableHandler(numberId) {
    setEdited(true);
    const result = payment.find((item) => item.number === numberId);
    getTypeMethod(result.fitur_id);
    setBiayaHandle({
      fee: result.fee,
      settlementFee: result.fee_settle,
      feeType: result.fee_type,
      minTransaksi: result.mpartfitur_min_amount_trx,
      maksTransaksi: result.mpartfitur_max_amount_trx
    });
    if (result.fitur_id) {
      setFitur([result.fitur_id, result.fitur_name]);
      setPaymentMethod(result.mpaytype_id);
      setPaymentNameMethod(result.mpaytype_name);
      setNumbering(result.number);
    }
    // console.log(result.fitur_id, 'result.fitur_id');
    if (result.fitur_id === 105) {
      setIsDisableFeeType(false)
    } else {
      setIsDisableFeeType(true)
    }
  }

  function saveEditInTableHandler(
    numberId,
    fee,
    settleFee,
    feeType,
    minTransaksi,
    maksTransaksi,
    fiturId,
    fiturName,
    typeId,
    typeName
  ) {
    if (fee.length === 0) {
      setAlertFee(true)
    } else if (typeId.length === 0) {
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
          fee: typeof fee === "string" ? Number(fee.replaceAll(',', '.')) : fee,
          fee_settle: typeof settleFee === "string" ? Number(settleFee.replaceAll(',', '.')) : settleFee,
          fee_type: typeof feeType === "string" ? Number(feeType.replaceAll(',', '.')) : feeType,
          mpartfitur_min_amount_trx: typeof minTransaksi === "string" ? Number(minTransaksi.replaceAll(',', '.')) : minTransaksi,
          mpartfitur_max_amount_trx: typeof maksTransaksi === "string" ? Number(maksTransaksi.replaceAll(',', '.')) : maksTransaksi,
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
        setBiayaHandle({
          fee: 0,
          settlementFee: 0,
          feeType: 0,
          minTransaksi: 0,
          maksTransaksi: 0
        });
        setFitur("", "");
        setPaymentMethod([]);
        setPaymentNameMethod([]);
        setIsDisableFeeType(false)
      } else {
        setRedFlag(true)
      }
    }
  }

  function batalEdit() {
    setBiayaHandle({
      fee: 0,
      settlementFee: 0,
      feeType: 0,
      minTransaksi: 0,
      maksTransaksi: 0
    });
    setFitur("", "");
    setPaymentMethod([]);
    setPaymentNameMethod([]);
    setEdited(false);
    setRedFlag(false)
    setMustFill(false)
    setIsDisableFeeType(false)
  }

  function deleteDataHandler(numberId) {
    const result = payment.findIndex((item) => item.number === numberId);
    payment.splice(result, 1);
    setPayment([...payment]);
    setBiayaHandle({
      fee: 0,
      settlementFee: 0,
      feeType: 0,
      minTransaksi: 0,
      maksTransaksi: 0
    });
    setFitur("", "");
    setPaymentMethod([]);
    setPaymentNameMethod([]);
    setEdited(false);
    setIsDisableFeeType(false)
  }

  function editInSubAcc(numberId) {
    setEditedSubAcc(true);
    const result = subAccount.find((item) => item.number === numberId);
    const resultAgen = sumberAgenList.find((item) =>
      item.mpartnerdtl_sub_id === result.subpartner_id
    )
    // console.log(result, "ini result sub account edit");
    setSubAccountHandle({
      akunBankSubAcc: result.bank_number,
      rekeningOwnerSubAcc: result.bank_account_name,
      sumberAgen: result.subpartner_id,
    })
    setAgenName(resultAgen.mpartnerdtl_sub_name);
    setAgenCode(resultAgen.mpartnerdtl_sub_id);
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
      const finder = subAccount.find((item) => item.subpartner_id === sumberAgenCode)
      if (finder !== undefined) {
        if (finder.number === numberId) {
          setAlertSamePartner(false)
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
          setSubAccountHandle({
            sumberAgen: "",
            akunBankSubAcc: "",
            rekeningOwnerSubAcc: "",
          })
        } else {
          setAlertSamePartner(true)
        }
      } else {
        setAlertSamePartner(false)
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
        setSubAccountHandle({
          sumberAgen: "",
          akunBankSubAcc: "",
          rekeningOwnerSubAcc: "",
        })
      }
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
    setSubAccountHandle({
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
    setAlertSamePartner(false)
  }

  function deleteHandlerSubAcc (numberId) {
    const result = subAccount.findIndex((item) => item.number === numberId);
    subAccount.splice(result, 1);
    setSubAccount([...subAccount]);
    setSubAccountHandle({
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
      cell: (row) => <Link style={{textDecoration: "underline", color: "#077E86"}} onClick={() => detailAgenHandler(row.agen_id)}>{row.agen_id}</Link>,
      // wrap: true,
      width: "150px"
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
      selector: (row) => row.subaccount_acc_number === null ? "-" : row.subaccount_acc_number,
      sortable: true,
      width: "235px",
    },
    {
      name: "Kode Unik",
      selector: (row) => row.agen_unique_code === null ? "-" : row.agen_unique_code,
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
      width: "150px",
      wrap: true
    },
    {
      name: "Metode Pembayaran",
      selector: (row) => row.mpaytype_name.join(", "),
      width: "230px",
      wrap: true
    },
    {
      name: "Tipe Fee",
      selector: (row) => row.fee_type === 100 ? "Fix Fee" : "Persentase",
      width: "200px",
      wrap: true
    },
    {
      name: "Fee",
      selector: (row) => row.fee_type === 100 ? convertToRupiah(row.fee, true, 2) : `${row.fee}%`,
    },
    {
      name: "Settlement Fee",
      selector: (row) => convertToRupiah(row.fee_settle, true, 2),
      width: "150px",
    },
    // {
    //   name: "Minimal Topup Alokasi",
    //   selector: (row) => convertToRupiah(row.mpartfitur_min_topup_allocation, true, 2),
    //   width: "200px",
    //   wrap: true
    // },
    {
      name: "Minimal Transaksi",
      selector: (row) => convertToRupiah(row.mpartfitur_min_amount_trx, true, 2),
      width: "180px",
      wrap: true
    },
    {
      name: "Maksimal Transaksi",
      selector: (row) => convertToRupiah(row.mpartfitur_max_amount_trx, true, 2),
      width: "180px",
      wrap: true
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
              onClick={() => editInTableHandler(row.number)}
              style={{ cursor: "pointer" }}
              alt="icon edit"
            />
          </OverlayTrigger>
          <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Delete</div></Tooltip>}>
            <img
              onClick={() => deleteDataHandler(row.number)}
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
    feeType,
    minTransaksi,
    maksTransaksi,
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
      if (feeType === undefined || feeType === "0") {
        setAlertFeeType(true)
      } else {
        setAlertFeeType(false)
        if (typeId.length === 0) {
          setMustFill(true)
        } else {
          setMustFill(false)
          if (fee === undefined || fee.length === 0) {
            setAlertFee(true)
          } else {
            setAlertFee(false)
            if (fee_settle === undefined || fee_settle.length === 0) {
              setAlertSettlement(true)
            } else {
              setAlertSettlement(false)
              if (minTransaksi === undefined || minTransaksi.length === 0) {
                setAlertMinTransaksi(true)
              } else {
                setAlertMinTransaksi(false)
                if (maksTransaksi === undefined || maksTransaksi.length === 0) {
                  setAlertMaksTransaksi(true)
                } else {
                  setAlertMaksTransaksi(false)
                  const newData = {
                    fee: typeof fee === "string" ? Number(fee.replaceAll(',', '.')) : fee,
                    fee_settle: typeof fee_settle === "string" ? Number(fee_settle.replaceAll(',', '.')) : fee_settle,
                    fee_type: typeof feeType === "string" ? Number(feeType.replaceAll(',', '.')) : feeType,
                    mpartfitur_min_amount_trx: typeof minTransaksi === "string" ? Number(minTransaksi.replaceAll(',', '.')) : minTransaksi,
                    mpartfitur_max_amount_trx: typeof maksTransaksi === "string" ? Number(maksTransaksi.replaceAll(',', '.')) : maksTransaksi,
                    fitur_id: Number(fiturId),
                    fitur_name: fiturName,
                    mpaytype_id: typeId,
                    mpaytype_name: typeName,
                    number: number,
                  };
                  setPayment([...payment, newData]);
                  setRedFlag(false)
                  setBiayaHandle({
                    fee: 0,
                    settlementFee: 0,
                    feeType: 0,
                    minTransaksi: 0,
                    maksTransaksi: 0
                  });
                  setFitur("", "");
                  setPaymentMethod([]);
                  setPaymentNameMethod([]);
                  setIsDisableFeeType(false)
                }
              }
              // if (feeType === undefined || feeType.length === 0) {
              //   setAlertFeeType(true)
              // } else {
              //   setAlertFeeType(false)
              // }
            }
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
    // if (number > 2) {
    //   setAlertMaxSubAcc(true)
    //   setSubAccountHandle({
    //     sumberAgen: "",
    //     akunBankSubAcc: "",
    //     rekeningOwnerSubAcc: "",
    //   })
    //   setAgenName("")
    //   setAgenCode("")
    // } else {
    //   setAlertMaxSubAcc(false)

    // }
    if (sumberAgenCode !== "" && sumberAgen !== "" && akunBankSubAcc !== "" && rekeningOwnerSubAcc !== "") {
      setAlertFillAgen(false)
      setAlertNoRek(false)
      setAlertNameRek(false)
      if (subAccount.length !== 0) {
        const finder = subAccount.find((item) => (item.subpartner_id === sumberAgenCode))
        if (finder) {
          setAlertSamePartner(true)
        } else {
          setAlertSamePartner(false)
          const newDataSubAcc = {
            bank_name: "BANK DANAMON",
            bank_number: akunBankSubAcc,
            bank_account_name: rekeningOwnerSubAcc,
            subpartner_id: sumberAgenCode,
            agen_source: sumberAgen,
            number: number
          }
          setSubAccount([...subAccount, newDataSubAcc])
          setSubAccountHandle({
            sumberAgen: "",
            akunBankSubAcc: "",
            rekeningOwnerSubAcc: "",
          })
        }
      } else {
        const newDataSubAcc = {
          bank_name: "BANK DANAMON",
          bank_number: akunBankSubAcc,
          bank_account_name: rekeningOwnerSubAcc,
          subpartner_id: sumberAgenCode,
          agen_source: sumberAgen,
          number: number
        }
        setSubAccount([...subAccount, newDataSubAcc])
        setSubAccountHandle({
          sumberAgen: "",
          akunBankSubAcc: "",
          rekeningOwnerSubAcc: "",
        })
      }
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
    isChargeFee,
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
      if (isChargeFee === undefined) {
        isChargeFee = detailPartner.mpartner_is_charge_fee;
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
        `{"mpartner_id":"${id}", "mpartner_name": "${namaPerusahaan}", "mpartner_email": "${emailPerusahaan}", "mpartner_telp": "${phoneNumber}", "mpartner_address": "${alamat}", "mpartner_npwp": "${noNpwp}", "mpartner_npwp_name": "${namaNpwp}", "mpartner_direktur": "${nama}", "mpartner_direktur_telp": "${noHp}", "mpartner_is_active": ${active}, "bank_account_number": "${akunBank}", "bank_account_name": "${rekeningOwner}", "mpartner_is_charged_fee": ${isChargeFee}, "payment_method": ${JSON.stringify(
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
        alert("Edit Data Partner Berhasil");
      } else if (
        editPartner.status === 200 &&
        editPartner.data.response_code === 200 &&
        editPartner.data.response_new_token.length !== 0
      ) {
        setUserSession(editPartner.data.response_new_token);
        history.push("/daftarpartner");
        alert("Edit Data Partner Berhasil");
      }
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
        // console.log(getSumberAgen, "list disburse");
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
    <div className="container-content-partner mt-5" style={{padding: "37px 27px 37px 27px"}}>
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
                  <td style={{ width: 200 }}>Partner Charge Fee Bank</td>
                  <td>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label={
                        inputHandle.isChargeFee === undefined && detailPartner.mpartner_is_charge_fee === true || inputHandle.isChargeFee === true
                          ? "True"
                          : "False"
                      }
                      checked={
                        inputHandle.isChargeFee === undefined
                          ? detailPartner.mpartner_is_charge_fee
                          : inputHandle.isChargeFee
                      }
                      name="isChargeFee"
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <br />
                {/* <tr>
                  <td style={{width: 200}}>Is Charge Fee</td>
                  <td><Form.Check
                    type="switch"
                    id="custom-switch"
                    label={(detailPartner.mpartner_is_charge_fee === true) ? "True" : "False"}
                    checked={(detailPartner.mpartner_is_charge_fee === true) ? true : false}
                  /></td>
                </tr>
                <br/> */}
                {/* feeType awal */}
                <tr>
                  <td style={{ width: 200 }}>Tipe Fee <span style={{ color: "red" }}>*</span></td>
                  <td>
                    <Form.Select name='feeType' className='input-text-user' style={{ display: "inline" }} value={biayaHandle.feeType} disabled={isDisableFeeType} onChange={(e) => { setAlertFeeType(false); setBiayaHandle({ ...biayaHandle, feeType: Number(e.target.value), fee: "" }) }}>
                      <option defaultValue disabled value={0}>Pilih Tipe Fee</option>
                      <option value={100}>Fix Fee</option>
                      <option value={101}>Persentase</option>
                    </Form.Select>
                    {alertFeeType === true ?
                      <div style={{color: "#B9121B", fontSize: 12}} className="mt-1">
                          <img src={noteIconRed} className="me-2" alt="icon notice" />
                          Tipe Fee harus dipilih
                      </div> : ""
                    }
                  </td>
                </tr>
                {/* feeType akhir */}
                <br/>
                <tr>
                  <td style={{ width: 200 }}>Fee <span style={{ color: "red" }}>*</span></td>
                  <td>
                    <CurrencyInput
                      className="input-text-user"
                      value={biayaHandle.fee}
                      onValueChange={(e) => handleChangeFee(e, biayaHandle.feeType)}
                      placeholder="Masukkan Fee"
                      style={{
                        borderColor: alertFee ? "red" : ""
                      }}
                      groupSeparator={"."}
                      decimalSeparator={','}
                      maxLength={biayaHandle.feeType === 101 ? 3 : false}
                      prefix={biayaHandle.feeType === 0 || biayaHandle.feeType === 100 ? "Rp " : ""}
                      suffix={biayaHandle.feeType === 0 || biayaHandle.feeType === 100 ? "" : "%"}
                    />
                    {/* {editFee ?
                      <input
                        type="number"
                        className="input-text-ez"
                        onChange={handleChangeFee}
                        value={(biayaHandle.fee === undefined) ? 0 : (biayaHandle.fee)}
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
                        value={(biayaHandle.fee.length === 0) ? convertToRupiah(0, true, 2) : convertToRupiah(biayaHandle.fee, true, 2)}
                        name="fee"
                        placeholder="Rp 0"
                        style={{ width: "100%", marginLeft: "unset", borderColor: alertFee ? "red" : "" }}
                        onFocus={() => setEditFee(!editFee)}
                        min={0}
                      />
                    } */}
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
                    <CurrencyInput
                      className="input-text-user"
                      value={biayaHandle.settlementFee}
                      onValueChange={(e) => handleChangeSettle(e)}
                      placeholder="Masukkan Settlement Fee"
                      style={{
                        borderColor: alertSettlement ? "red" : ""
                      }}
                      groupSeparator={"."}
                      decimalSeparator={','}
                      prefix={"Rp "}
                    />
                    {/* {editInput ? (
                          <input
                            type="number"
                            className="input-text-ez"
                            onChange={handleChangeSettle}
                            value={(biayaHandle.settlementFee === undefined) ? 0 : (biayaHandle.settlementFee)}
                            name="settlementFee"
                            placeholder={"Rp 0"}
                            style={{ width: "100%", marginLeft: "unset", borderColor: alertSettlement ? "red" : "" }}
                            onBlur={() => setEditInput(!editInput)}
                            min={0}
                            onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                          />
                        ) : (
                          <input
                            type="text"
                            className="input-text-ez"
                            onChange={handleChangeSettle}
                            value={(biayaHandle.settlementFee.length === 0) ? convertToRupiah(0, true, 2) : convertToRupiah(biayaHandle.settlementFee, true, 2)}
                            name="settlementFee"
                            placeholder="Rp 0"
                            style={{ width: "100%", marginLeft: "unset", borderColor: alertSettlement ? "red" : "" }}
                            onFocus={() => setEditInput(!editInput)}
                            min={0}
                          />
                    )} */}
                    {alertSettlement === true ?
                      <div style={{color: "#B9121B", fontSize: 12}} className="mt-1">
                          <img src={noteIconRed} className="me-2" alt="icon notice" />
                          Settlement Fee Wajib Diisi. Jika tidak dikenakan biaya silahkan tulis 0
                      </div> : ""
                    }
                  </td>
                </tr>
                {/* settlementFee akhir */}
                <br/>
                {/* minTransaksi awal */}
                <tr>
                  <td style={{ width: 200 }}>Minimal Transaksi <span style={{ color: "red" }}>*</span></td>
                  <td>
                    <CurrencyInput
                      className="input-text-user"
                      value={biayaHandle.minTransaksi}
                      onValueChange={(e) => handleChangeMinTransaksi(e)}
                      placeholder="Masukkan Minimal Transaksi"
                      style={{
                        borderColor: alertMinTransaksi ? "red" : ""
                      }}
                      groupSeparator={"."}
                      decimalSeparator={','}
                      prefix={"Rp "}
                    />
                    {/* {editMinTransaksi ? (
                      <input
                        type="number"
                        className="input-text-ez"
                        onChange={handleChangeMinTransaksi}
                        value={(biayaHandle.minTransaksi === undefined) ? 0 : (biayaHandle.minTransaksi)}
                        name="minTransaksi"
                        placeholder={"Rp 0"}
                        style={{ width: "100%", marginLeft: "unset", borderColor: alertMinTransaksi ? "red" : "" }}
                        onBlur={() => setEditMinTransaksi(!editMinTransaksi)}
                        min={0}
                        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                      />
                      ) : (
                        <input
                          type="text"
                          className="input-text-ez"
                          onChange={handleChangeMinTransaksi}
                          value={(biayaHandle.minTransaksi.length === 0) ? convertToRupiah(0, true, 2) : convertToRupiah(biayaHandle.minTransaksi, true, 2)}
                          name="minTransaksi"
                          placeholder="Rp 0"
                          style={{ width: "100%", marginLeft: "unset", borderColor: alertMinTransaksi ? "red" : "" }}
                          onFocus={() => setEditMinTransaksi(!editMinTransaksi)}
                          min={0}
                        />
                      )
                    } */}
                    {alertMinTransaksi === true ?
                      <div style={{color: "#B9121B", fontSize: 12}} className="mt-1">
                          <img src={noteIconRed} className="me-2" alt="icon notice" />
                          Minimal Transaksi Wajib Diisi. Jika tidak dikenakan biaya silahkan tulis 0
                      </div> : ""
                    }
                  </td>
                </tr>
                {/* minTransaksi akhir */}
                <br/>
                {/* maksTransaksi awal */}
                <tr>
                  <td style={{ width: 200 }}>Maksimal Transaksi <span style={{ color: "red" }}>*</span></td>
                  <td>
                    <CurrencyInput
                      className="input-text-user"
                      value={biayaHandle.maksTransaksi}
                      onValueChange={(e) => handleChangeMaksTransaksi(e)}
                      placeholder="Masukkan Maksimal Transaksi"
                      style={{
                        borderColor: alertMaksTransaksi ? "red" : ""
                      }}
                      groupSeparator={"."}
                      decimalSeparator={','}
                      prefix={"Rp "}
                    />
                    {/* {editMaksTransaksi ? (
                      <input
                        type="number"
                        className="input-text-ez"
                        onChange={handleChangeMaksTransaksi}
                        value={(biayaHandle.maksTransaksi === undefined) ? 0 : (biayaHandle.maksTransaksi)}
                        name="maksTransaksi"
                        placeholder={"Rp 0"}
                        style={{ width: "100%", marginLeft: "unset", borderColor: alertMaksTransaksi ? "red" : "" }}
                        onBlur={() => setEditMaksTransaksi(!editMaksTransaksi)}
                        min={0}
                        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                      />
                      ) : (
                        <input
                          type="text"
                          className="input-text-ez"
                          onChange={handleChangeMaksTransaksi}
                          value={(biayaHandle.maksTransaksi.length === 0) ? convertToRupiah(0, true, 2) : convertToRupiah(biayaHandle.maksTransaksi, true, 2)}
                          name="maksTransaksi"
                          placeholder="Rp 0"
                          style={{ width: "100%", marginLeft: "unset", borderColor: alertMaksTransaksi ? "red" : "" }}
                          onFocus={() => setEditMaksTransaksi(!editMaksTransaksi)}
                          min={0}
                        />
                      )
                    } */}
                    {alertMaksTransaksi === true ?
                      <div style={{color: "#B9121B", fontSize: 12}} className="mt-1">
                          <img src={noteIconRed} className="me-2" alt="icon notice" />
                          Maksimal Transaksi Wajib Diisi. Jika tidak dikenakan biaya silahkan tulis 0
                      </div> : ""
                    }
                  </td>
                </tr>
                {/* maksTransaksi akhir */}
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
                                    onChange={(e) => handleChangeFitur(e, biayaHandle)}
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
                                    onChange={(e) => handleChangeFitur(e, biayaHandle)}
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
                                    onChange={(e) => handleChangeFitur(e, biayaHandle)}
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
                                    onChange={(e) => handleChangeFitur(e, biayaHandle)}
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
            <Row className="d-flex justify-content-between align-items-center">
              <Col xs={2} style={{ width: 200 }}></Col>
              <Col className="ms-2">
                {edited === false ? (
                  <button
                    onClick={() =>
                      saveNewSchemaHandle(
                        biayaHandle.fee,
                        biayaHandle.settlementFee,
                        biayaHandle.feeType,
                        biayaHandle.minTransaksi,
                        biayaHandle.maksTransaksi,
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
                      className="me-2"
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
                          biayaHandle.fee,
                          biayaHandle.settlementFee,
                          biayaHandle.feeType,
                          biayaHandle.minTransaksi,
                          biayaHandle.maksTransaksi,
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
              </Col>
              <Col>
                {expanded ? (
                  <div
                    className="my-4 text-end"
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                      padding: "unset",
                      width:"100%"
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
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                      padding: "unset",
                      width:"100%"
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
              </Col>
            </Row>

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
                    <Form.Select name='sumberAgen' value={subAccountHandle.sumberAgen} className='input-text-ez' style={{ width: "100%", marginLeft: "unset" }} onChange={(e) => handleChangeSubAcc(e)}>
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
                      value={subAccountHandle.akunBankSubAcc === undefined ? "" : subAccountHandle.akunBankSubAcc}
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
                  <td style={{ width: 200 }}>Nama Pemilik Rekening <span style={{ color: "red" }}>*</span></td>
                  <td>
                    <input
                      type="text"
                      className="input-text-edit"
                      onChange={(e) => handleChangeSubAcc(e)}
                      value={subAccountHandle.rekeningOwnerSubAcc === undefined ? "" : subAccountHandle.rekeningOwnerSubAcc}
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

            <Row className="d-flex justify-content-between align-items-center">
              <Col xs={2} style={{ width: 200 }}></Col>
              <Col className="ms-2">
                {editedSubAcc === false ? (
                  <button
                    onClick={() =>
                      saveNewSchemaSubAccHandle(
                        agenCode,
                        agenName,
                        subAccountHandle.akunBankSubAcc,
                        subAccountHandle.rekeningOwnerSubAcc,
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
                      color: "#077E86",
                      background: "unset",
                      border: "0.6px solid #077E86",
                      borderRadius: 6,
                      cursor: "pointer"
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
                      // className="me-2"
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
                          subAccountHandle.akunBankSubAcc,
                          subAccountHandle.rekeningOwnerSubAcc
                        )
                      }
                    >
                      Simpan
                    </button>
                  </>
                )}
              </Col>
              <Col style={{ padding: "unset" }}>
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
                        textAlign: 'end'
                      }}
                      onClick={showCheckboxesSubAccount}
                      className="text-end"
                    >
                      Sembunyikan daftar akun Sub Account{" "}
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
                        textAlign: 'end'
                      }}
                      onClick={showCheckboxesSubAccount}
                      className="text-end"
                    >
                      Lihat daftar Sub Account{" "}
                      <FontAwesomeIcon icon={faChevronDown} className="mx-2" />
                    </button>
                  </div>
                )}
              </Col>
            </Row>
            {/* <Row>
              <Col xs={2} style={{ width: 200 }}></Col>
              <Col className="ms-2">
                {
                  subAccount.length >= 2 ?
                  <div style={{ color: "#888888", fontSize: 12 }} className="mb-4">
                      <img src={noteIconGrey} className="me-2" alt="icon notice" />
                      Maksimal 2 akun untuk ditambahkan.
                  </div> : ""
                }
              </Col>
            </Row> */}


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
                  inputHandle.isChargeFee,
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
