import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Modal, Row } from '@themesberg/react-bootstrap'
import { useHistory, useParams } from 'react-router-dom'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import ReactSelect, { components } from 'react-select';
import noteIconRed from "../../../assets/icon/note_icon_red.svg";

const FormInfoUsahaOutlet = () => {
    const history = useHistory()
    const { profileId } = useParams()
    const [dataKategoriUsaha, setDataKategoriUsaha] = useState([])
    const [dataKodePos, setDataKodePos] = useState({})
    const [selectedDataKategoriUsaha, setSelectedDataKategoriUsaha] = useState([])
    const [showModalSimpanData, setShowModalSimpanData] = useState(false)
    const [isLoadingInfoUsaha, setIsLoadingInfoUsaha] = useState(false)
    const [alertMinNmid, setAlertMinNmid] = useState(false)
    const [alertMaxFile, setAlertMaxFile] = useState(false)
    const [alertMaxJumlahKasir, setAlertMaxJumlahKasir] = useState(false)
    const [inputHandle, setInputHandle] = useState({
        businessType: 0,
        namaPerusahaan: "",
        bentukPerusahaan: 0,
        bentukPerusahaanLainnya: "",
        emailPerusahaan: "",
        namaBrand: "",
        namaYangDicetakQris: "",
        namaYangTampil: "",
        jumlahKasir: 0,
        pendapatanPertahun: 0,
        alamatUsaha: "",
        kodePos: "",
        onlineShopUrl: "",
        kepunyaanQris: 2,
        nmid: ""
    })
    const [jenisToko, setJenisToko] = useState([])

    const hiddenFileInputTempatUsaha = useRef(null)
    const [imageFileTempatUsaha, setImageFileTempatUsaha] = useState([])
    const [uploadTempatUsaha, setUploadTempatUsaha] = useState(false)

    const handleClickTempatUsaha = () => {
        hiddenFileInputTempatUsaha.current.click();
    };

    function handleChange(e) {
        if (e.target.name === "namaPerusahaan") {
            if (e.target.value.length > 50) {
                setInputHandle({
                    ...inputHandle,
                    [e.target.name]: (e.target.value).slice(0,50)
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
        } else if (e.target.name === "namaYangTampil") {
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
        } else if (e.target.name === "pendapatanPertahun") {
            setSelectedDataKategoriUsaha([])
            getDataKategoriUsaha(e.target.value)
            setInputHandle({
                ...inputHandle,
                [e.target.name]: Number(e.target.value)
            })
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
        } else if (e.target.name === "nmid") {
            if (e.target.value.length < 13) {
                setAlertMinNmid(true)
                setInputHandle({
                    ...inputHandle,
                    [e.target.name]: e.target.value
                })
            } else {
                setAlertMinNmid(false)
                setInputHandle({
                    ...inputHandle,
                    [e.target.name]: e.target.value
                })
            }
        } else if (e.target.name === "kepunyaanQris") {
            if (Number(e.target.value) === 0) {
                setInputHandle({
                    ...inputHandle,
                    kepunyaanQris: Number(e.target.value),
                    nmid: ""
                })
            } else {
                setInputHandle({
                    ...inputHandle,
                    [e.target.name]: Number(e.target.value)
                })
            }
        } else if (e.target.name === "jumlahKasir") {
            if (Number(e.target.value) > 1500) {
                setAlertMaxJumlahKasir(true)
            } else {
                setAlertMaxJumlahKasir(false)
            }
            setInputHandle({
                ...inputHandle,
                [e.target.name]: Number(e.target.value).toString()
            })
        } else {
            setInputHandle({
                ...inputHandle,
                [e.target.name]: (e.target.name === "bentukPerusahaan") ? Number(e.target.value) : e.target.value
            })
        }
    }

    function handleChangeJenisToko (e) {
        if (e.target.checked) {
            setJenisToko([...jenisToko, e.target.value])
        } else {
            setJenisToko(jenisToko.filter(item => item !== e.target.value))
        }
    }

    const handleFileChangeTempatUsaha = (event) => {
        if (event.target.files.length > 3) {
            setAlertMaxFile(true)
        } else {
            setAlertMaxFile(false)
            const tempArr = [];

            [...event.target.files].forEach(file => {

                if (parseFloat(file.size / 1024).toFixed(2) > 500) {
                    setUploadTempatUsaha(true)
                    tempArr.push({
                        data: file,
                        url: URL.createObjectURL(file),
                        name: file.name
                    });
                } else {
                    setUploadTempatUsaha(false)
                    tempArr.push({
                        data: file,
                        url: URL.createObjectURL(file),
                        name: file.name
                    });
                }
            });

            setImageFileTempatUsaha(tempArr);
        }
    }

    async function getDataKategoriUsaha(businessCategory) {
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
                setDataKategoriUsaha(newArr)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token.length !== 0) {
                setUserSession(getData.data.response_new_token)
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mbuscat_id
                    obj.label = e.mbuscat_name
                    newArr.push(obj)
                })
                setDataKategoriUsaha(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
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

    async function getDataSecondStepInfoUsahaBadanUsaha(profileId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"profile_id": ${profileId}, "business_level": 101}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetSecondStepData", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                const getDataSecStep = getData.data.response_data.results
                setInputHandle({
                    ...getDataSecStep,
                    businessType: getDataSecStep.business_type,
                    namaPerusahaan: getDataSecStep.mprofbus_name === null ? "" : getDataSecStep.mprofbus_name,
                    bentukPerusahaan: getDataSecStep.mprofbus_company_type === null ? 0 : getDataSecStep.mprofbus_company_type,
                    bentukPerusahaanLainnya: getDataSecStep.mprofbus_company_desc === null ? "" : getDataSecStep.mprofbus_company_desc,
                    emailPerusahaan: getDataSecStep.mprofdtl_email === null ? "" : getDataSecStep.mprofdtl_email,
                    namaBrand: getDataSecStep.mprofbus_brand === null ? "" : getDataSecStep.mprofbus_brand,
                    namaYangDicetakQris: getDataSecStep.mprofbus_name_in_Qris === null ? "" : getDataSecStep.mprofbus_name_in_Qris,
                    jumlahKasir: getDataSecStep.mprofbus_cashier_count === null ? 0 : getDataSecStep.mprofbus_cashier_count,
                    pendapatanPertahun: getDataSecStep.mprofbus_mbusinc_id === null ? 0 : getDataSecStep.mprofbus_mbusinc_id,
                    alamatUsaha: getDataSecStep.mprofbus_address === null ? "" : getDataSecStep.mprofbus_address,
                    kodePos: getDataSecStep.mprofbus_postal_code === null ? "" : getDataSecStep.mprofbus_postal_code,
                    onlineShopUrl: getDataSecStep.mprofbus_online_shop_url === null ? "" : getDataSecStep.mprofbus_online_shop_url,
                    kepunyaanQris: getDataSecStep.mprofbus_is_have_QRIS === true ? 1 : getDataSecStep.mprofbus_is_have_QRIS === false ? 0 : 2,
                    nmid: getDataSecStep.mprofbus_NMID_QRIS === null ? "" : getDataSecStep.mprofbus_NMID_QRIS
                })
                getDataPostalCodeHandler(getDataSecStep.mprofbus_postal_code)
                getDataKategoriUsaha(getDataSecStep.mprofbus_mbusinc_id === null ? 0 : getDataSecStep.mprofbus_mbusinc_id)
                let newArrKategoriUsaha = []
                let objKategoriUsaha = {}
                objKategoriUsaha.value = getDataSecStep.mprofbus_buscat_id
                objKategoriUsaha.label = getDataSecStep.mbuscat_name
                newArrKategoriUsaha.push(objKategoriUsaha)
                setSelectedDataKategoriUsaha((objKategoriUsaha.value === null || objKategoriUsaha.value === 0) ? [] : newArrKategoriUsaha)
                setJenisToko((getDataSecStep.mprofbus_shop_type === null || getDataSecStep.mprofbus_shop_type.length === 0) ? [] : getDataSecStep.mprofbus_shop_type.split(","))
                const data1 = getDataSecStep.mprofbus_photos_url_1 === null ? "" : getDataSecStep.mprofbus_photos_url_1.split()
                const data2 = getDataSecStep.mprofbus_photos_url_2 === null ? "" : getDataSecStep.mprofbus_photos_url_2.split()
                const data3 = getDataSecStep.mprofbus_photos_url_3 === null ? "" : getDataSecStep.mprofbus_photos_url_3.split()
                const dataName1 = getDataSecStep.mprofbus_photos_name_1 === null ? "" : getDataSecStep.mprofbus_photos_name_1.split()
                const dataName2 = getDataSecStep.mprofbus_photos_name_2 === null ? "" : getDataSecStep.mprofbus_photos_name_2.split()
                const dataName3 = getDataSecStep.mprofbus_photos_name_3 === null ? "" : getDataSecStep.mprofbus_photos_name_3.split()
                if (data1.length === 0) {
                    setImageFileTempatUsaha([])
                } else {
                    const newData = (data1.concat(data2).concat(data3)).filter((str) => str !== "")
                    const newDataName = (dataName1.concat(dataName2).concat(dataName3)).filter((str) => str !== "")
                    let newArrImage = []
                    newData.forEach(async (item, id) => {
                        const obj = {}
                        const response = await fetch(item)
                        const blob = await response.blob();
                        const file = new File([blob], `image${id+1}.jpg`, {type: blob.type});
                        obj.data = file
                        obj.url = item
                        obj.name = newDataName[id]
                        newArrImage.push(obj)
                    })
                    setImageFileTempatUsaha(newArrImage)
                }
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                const getDataSecStep = getData.data.response_data.results
                setInputHandle({
                    ...getDataSecStep,
                    businessType: getDataSecStep.business_type,
                    namaPerusahaan: getDataSecStep.mprofbus_name === null ? "" : getDataSecStep.mprofbus_name,
                    bentukPerusahaan: getDataSecStep.mprofbus_company_type === null ? 0 : getDataSecStep.mprofbus_company_type,
                    bentukPerusahaanLainnya: getDataSecStep.mprofbus_company_desc === null ? "" : getDataSecStep.mprofbus_company_desc,
                    emailPerusahaan: getDataSecStep.mprofdtl_email === null ? "" : getDataSecStep.mprofdtl_email,
                    namaBrand: getDataSecStep.mprofbus_brand === null ? "" : getDataSecStep.mprofbus_brand,
                    namaYangDicetakQris: getDataSecStep.mprofbus_name_in_Qris === null ? "" : getDataSecStep.mprofbus_name_in_Qris,
                    jumlahKasir: getDataSecStep.mprofbus_cashier_count === null ? 0 : getDataSecStep.mprofbus_cashier_count,
                    pendapatanPertahun: getDataSecStep.mprofbus_mbusinc_id === null ? 0 : getDataSecStep.mprofbus_mbusinc_id,
                    alamatUsaha: getDataSecStep.mprofbus_address === null ? "" : getDataSecStep.mprofbus_address,
                    kodePos: getDataSecStep.mprofbus_postal_code === null ? "" : getDataSecStep.mprofbus_postal_code,
                    onlineShopUrl: getDataSecStep.mprofbus_online_shop_url === null ? "" : getDataSecStep.mprofbus_online_shop_url,
                    kepunyaanQris: getDataSecStep.mprofbus_is_have_QRIS === true ? 1 : getDataSecStep.mprofbus_is_have_QRIS === false ? 0 : 2,
                    nmid: getDataSecStep.mprofbus_NMID_QRIS === null ? "" : getDataSecStep.mprofbus_NMID_QRIS
                })
                getDataPostalCodeHandler(getDataSecStep.mprofbus_postal_code)
                getDataKategoriUsaha(getDataSecStep.mprofbus_mbusinc_id === null ? 0 : getDataSecStep.mprofbus_mbusinc_id)
                let newArrKategoriUsaha = []
                let objKategoriUsaha = {}
                objKategoriUsaha.value = getDataSecStep.mprofbus_buscat_id
                objKategoriUsaha.label = getDataSecStep.mbuscat_name
                newArrKategoriUsaha.push(objKategoriUsaha)
                setSelectedDataKategoriUsaha((objKategoriUsaha.value === null || objKategoriUsaha.value === 0) ? [] : newArrKategoriUsaha)
                setJenisToko((getDataSecStep.mprofbus_shop_type === null || getDataSecStep.mprofbus_shop_type.length === 0) ? [] : getDataSecStep.mprofbus_shop_type.split(","))
                const data1 = getDataSecStep.mprofbus_photos_url_1 === null ? "" : getDataSecStep.mprofbus_photos_url_1.split()
                const data2 = getDataSecStep.mprofbus_photos_url_2 === null ? "" : getDataSecStep.mprofbus_photos_url_2.split()
                const data3 = getDataSecStep.mprofbus_photos_url_3 === null ? "" : getDataSecStep.mprofbus_photos_url_3.split()
                const dataName1 = getDataSecStep.mprofbus_photos_name_1 === null ? "" : getDataSecStep.mprofbus_photos_name_1.split()
                const dataName2 = getDataSecStep.mprofbus_photos_name_2 === null ? "" : getDataSecStep.mprofbus_photos_name_2.split()
                const dataName3 = getDataSecStep.mprofbus_photos_name_3 === null ? "" : getDataSecStep.mprofbus_photos_name_3.split()
                if (data1.length === 0) {
                    setImageFileTempatUsaha([])
                } else {
                    const newData = (data1.concat(data2).concat(data3)).filter((str) => str !== "")
                    const newDataName = (dataName1.concat(dataName2).concat(dataName3)).filter((str) => str !== "")
                    let newArrImage = []
                    newData.forEach(async (item, id) => {
                        const obj = {}
                        const response = await fetch(item)
                        const blob = await response.blob();
                        const file = new File([blob], `image${id+1}.jpg`, {type: blob.type});
                        obj.data = file
                        obj.url = item
                        obj.name = newDataName[id]
                        newArrImage.push(obj)
                    })
                    setImageFileTempatUsaha(newArrImage)
                }
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function formDataSecondStepInfoUsahaBadanUsaha(settleGroup, businessType, businessLevel, profileId, namaPerusahaan, bentukperusahaan, descBentukPerusahaan, emailPerusahaan, namaBrand, namaDiQris, kategoriUsaha, jumlahKasir, pendapatanPerTahun, alamat, kodePos, provinsi, kota, kecamatan, kelurahan, jenisToko, kepunyaanQris, imageOnlineShop, nmid, onlineShopUrl, step) {
        try {
            setIsLoadingInfoUsaha(true)
            const auth = "Bearer " + getToken()
            const formData = new FormData()
            const dataParams = encryptData(`{"business_level": ${businessLevel}, "mprofbus_mprofile_id":${profileId}, "mprofbus_name":"${namaPerusahaan}", "mprofbus_company_type": ${bentukperusahaan}, "mprofbus_company_desc": "${descBentukPerusahaan}", "mprofdtl_email": "${emailPerusahaan}", "mprofbus_brand":"${namaBrand}", "mprofbus_name_in_qris": "${namaDiQris}", "mprofbus_buscat_id": ${kategoriUsaha}, "mprofbus_cashier_count": ${jumlahKasir}, "mprofbus_mbusinc_id": ${pendapatanPerTahun}, "mprofbus_address": "${alamat}", "mprofbus_postal_code": "${kodePos}", "mprofbus_province": "${provinsi}", "mprofbus_city": "${kota}", "mprofbus_district": "${kecamatan}", "mprofbus_village": "${kelurahan}", "mprofbus_shop_type": "${jenisToko}", "mprofbus_is_have_QRIS": ${kepunyaanQris}, "mprofbus_NMID_QRIS": "${nmid}", "mprofbus_online_shop_url": "${onlineShopUrl}", "step": ${step}}`)
            imageOnlineShop.map((item, id) => {
                formData.append(`toko${id+1}_url`, item.data)
            })
            formData.append('Data', dataParams)
            const headers = {
                'Content-Type':'multipart/form-data',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/SecondStepAddMerchantQRISOnboarding", formData, { headers: headers })
            if ((getData.status === 200 || getData.status === 202) && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                if (getData.data.response_data.results !== null) {
                    if (Number(businessType) === 1) {
                        if (step === 3) {
                            history.push(`/form-dokumen-usaha-outlet/${getData.data.response_data.results.mprofbus_mprofile_id}`)
                        } else if (step === 2) {
                            setIsLoadingInfoUsaha(false)
                            history.push('/daftar-merchant-qris')
                        } else {
                            history.push(`/formulir-info-pemilik-outlet/${profileId === undefined ? 0 : profileId}`)
                        }
                    } else {
                        if (step === 200) {
                            history.push(`/pengaturan-merchant/${getData.data.response_data.results.mprofbus_mprofile_id}/${businessLevel}/${businessType}`)
                        } else if (step === 201) {
                            history.push(`/form-info-rekening-outlet/${settleGroup}/${getData.data.response_data.results.mprofile_merchant_id}/${getData.data.response_data.results.mprofile_store_nou}/${profileId}`)
                        } else if (step === 300) {
                            history.push(`/detail-merchant-outlet/${profileId}`)
                        } else if (step === 2) {
                            setIsLoadingInfoUsaha(false)
                            history.push('/daftar-merchant-qris')
                        } else {
                            history.push(`/formulir-info-pemilik-outlet/${profileId === undefined ? 0 : profileId}`)
                        }
                    }
                } else {
                    alert(`${getData.data.response_data.error_text}`)
                }
            } else if ((getData.status === 200 || getData.status === 202) && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                if (getData.data.response_data.results !== null) {
                    if (Number(businessType) === 1) {
                        if (step === 3) {
                            history.push(`/form-dokumen-usaha-outlet/${getData.data.response_data.results.mprofbus_mprofile_id}`)
                        } else if (step === 2) {
                            setIsLoadingInfoUsaha(false)
                            history.push('/daftar-merchant-qris')
                        } else {
                            history.push(`/formulir-info-pemilik-outlet/${profileId === undefined ? 0 : profileId}`)
                        }
                    } else {
                        if (step === 200) {
                            history.push(`/pengaturan-merchant/${getData.data.response_data.results.mprofbus_mprofile_id}/${businessLevel}/${businessType}`)
                        } else if (step === 201) {
                            history.push(`/form-info-rekening-outlet/${settleGroup}/${getData.data.response_data.results.mprofile_merchant_id}/${getData.data.response_data.results.mprofile_store_nou}/${profileId}`)
                        } else if (step === 300) {
                            history.push(`/detail-merchant-outlet/${profileId}`)
                        } else if (step === 2) {
                            setIsLoadingInfoUsaha(false)
                            history.push('/daftar-merchant-qris')
                        } else {
                            history.push(`/formulir-info-pemilik-outlet/${profileId === undefined ? 0 : profileId}`)
                        }
                    }
                } else {
                    alert(`${getData.data.response_data.error_text}`)
                }
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
            if (error.response.data.response_code === 400) {
                alert(error.response.data.response_message)
            }
        }
    }

    async function checkPageSettlementHandler(businessType, businessLevel, profileId, namaPerusahaan, bentukperusahaan, descBentukPerusahaan, emailPerusahaan, namaBrand, namaDiQris, kategoriUsaha, jumlahKasir, pendapatanPerTahun, alamat, kodePos, provinsi, kota, kecamatan, kelurahan, jenisToko, kepunyaanQris, imageOnlineShop, nmid, onlineShopUrl) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"profile_id": ${profileId}, "business_level": ${businessLevel}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/CheckPageSettlement", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                if (getData.data.response_data.results.is_settlement_page === 0) {
                    formDataSecondStepInfoUsahaBadanUsaha(getData.data.response_data.results.settle_group_id, businessType, businessLevel, profileId, namaPerusahaan, bentukperusahaan, descBentukPerusahaan, emailPerusahaan, namaBrand, namaDiQris, kategoriUsaha, jumlahKasir, pendapatanPerTahun, alamat, kodePos, provinsi, kota, kecamatan, kelurahan, jenisToko, kepunyaanQris, imageOnlineShop, nmid, onlineShopUrl, 200)
                } else {
                    if (getData.data.response_data.results.settle_group_id === 103) {
                        formDataSecondStepInfoUsahaBadanUsaha(getData.data.response_data.results.settle_group_id, businessType, businessLevel, profileId, namaPerusahaan, bentukperusahaan, descBentukPerusahaan, emailPerusahaan, namaBrand, namaDiQris, kategoriUsaha, jumlahKasir, pendapatanPerTahun, alamat, kodePos, provinsi, kota, kecamatan, kelurahan, jenisToko, kepunyaanQris, imageOnlineShop, nmid, onlineShopUrl, 201)
                    } else {
                        formDataSecondStepInfoUsahaBadanUsaha(getData.data.response_data.results.settle_group_id, businessType, businessLevel, profileId, namaPerusahaan, bentukperusahaan, descBentukPerusahaan, emailPerusahaan, namaBrand, namaDiQris, kategoriUsaha, jumlahKasir, pendapatanPerTahun, alamat, kodePos, provinsi, kota, kecamatan, kelurahan, jenisToko, kepunyaanQris, imageOnlineShop, nmid, onlineShopUrl, 300)
                    }
                }
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                if (getData.data.response_data.results.is_settlement_page === 0) {
                    formDataSecondStepInfoUsahaBadanUsaha(getData.data.response_data.results.settle_group_id, businessType, businessLevel, profileId, namaPerusahaan, bentukperusahaan, descBentukPerusahaan, emailPerusahaan, namaBrand, namaDiQris, kategoriUsaha, jumlahKasir, pendapatanPerTahun, alamat, kodePos, provinsi, kota, kecamatan, kelurahan, jenisToko, kepunyaanQris, imageOnlineShop, nmid, onlineShopUrl, 200)
                } else {
                    if (getData.data.response_data.results.settle_group_id === 103) {
                        formDataSecondStepInfoUsahaBadanUsaha(getData.data.response_data.results.settle_group_id, businessType, businessLevel, profileId, namaPerusahaan, bentukperusahaan, descBentukPerusahaan, emailPerusahaan, namaBrand, namaDiQris, kategoriUsaha, jumlahKasir, pendapatanPerTahun, alamat, kodePos, provinsi, kota, kecamatan, kelurahan, jenisToko, kepunyaanQris, imageOnlineShop, nmid, onlineShopUrl, 201)
                    } else {
                        formDataSecondStepInfoUsahaBadanUsaha(getData.data.response_data.results.settle_group_id, businessType, businessLevel, profileId, namaPerusahaan, bentukperusahaan, descBentukPerusahaan, emailPerusahaan, namaBrand, namaDiQris, kategoriUsaha, jumlahKasir, pendapatanPerTahun, alamat, kodePos, provinsi, kota, kecamatan, kelurahan, jenisToko, kepunyaanQris, imageOnlineShop, nmid, onlineShopUrl, 300)
                    }
                }
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function backPage () {
        setShowModalSimpanData(true)
    }

    function saveAndGoBack () {
        formDataSecondStepInfoUsahaBadanUsaha(0, inputHandle.businessType, 103, profileId === undefined ? 0 : profileId, inputHandle.namaPerusahaan, inputHandle.bentukPerusahaan, inputHandle.bentukPerusahaanLainnya, inputHandle.emailPerusahaan, inputHandle.namaBrand, inputHandle.namaYangDicetakQris, selectedDataKategoriUsaha.length !== 0 ? selectedDataKategoriUsaha[0].value : 0, Number(inputHandle.jumlahKasir) > 1500 ? 0 : inputHandle.jumlahKasir, inputHandle.pendapatanPertahun, inputHandle.alamatUsaha, inputHandle.kodePos, dataKodePos.mprovince_name === undefined ? "" : dataKodePos.mprovince_name, dataKodePos.mcity_name === undefined ? "" : dataKodePos.mcity_name, dataKodePos.mdistrict_name === undefined ? "" : dataKodePos.mdistrict_name, dataKodePos.mvillage_name === undefined ? "" : dataKodePos.mvillage_name, jenisToko.join(), inputHandle.kepunyaanQris, imageFileTempatUsaha, inputHandle.nmid, inputHandle.onlineShopUrl, 2)
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

    useEffect(() => {
        if (profileId !== undefined) {
            getDataSecondStepInfoUsahaBadanUsaha(profileId)
        }
    }, [])

    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
                <span className='breadcrumbs-span'><span onClick={() => history.push('/')} style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span onClick={() => setShowModalSimpanData(true)} style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah merchant</span></span>
                <div className="d-flex justify-content-start align-items-center head-title">
                    <FontAwesomeIcon onClick={() => backPage()} icon={faChevronLeft} className="me-3 mt-1" style={{cursor: "pointer"}} />
                    <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Formulir data merchant</h2>
                </div>
                <div className='pb-4 pt-3'>
                    <div className='d-flex justify-content-start align-items-center' style={{ marginLeft: 35, marginRight: 35 }}>
                        <div style={{ width: "100%", height: 4, background: "linear-gradient(90deg, #80D8DE 30.14%, #229299 67.94%, #077E86 100%)" }}></div>
                        {
                            (inputHandle.businessType === 1) ?
                            <>
                                <div style={{ borderRadius: "50%", width: 20, height: 10, background: "#077E86" }}></div>
                                <div style={{ width: "100%", height: 4, background: "#F0F0F0" }}></div>
                            </> :
                            <>
                                 <div style={{ borderRadius: "50%", width: 15, height: 15, background: "#077E86" }}></div>
                            </>
                        }
                    </div>
                    <div className='d-flex justify-content-between align-items-center mt-2' style={{ fontSize: 12, color: "#383838", fontFamily: "Nunito" }}>
                        <div>Info pemilik</div>
                        {
                            (inputHandle.businessType === 1) ?
                            <>
                                <div className='ms-3'>Info usaha</div>
                                <div>Dokumen usaha</div>
                            </> :
                            <>
                                <div>Info usaha</div>
                            </>
                        }
                    </div>
                </div>
                <div className='base-content mt-3'>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className=''>Nama perusahaan</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="namaPerusahaan" value={inputHandle.namaPerusahaan} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='Masukan nama perusahaan' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    {
                        (inputHandle.businessType === 1) && (
                            <>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Bentuk perusahaan</div>
                                <Row className='py-2' style={{ marginLeft: "unset", marginRight: "unset" }}>
                                    <Col xs={3} className='form-check form-check-inline'>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="pt"
                                            name='bentukPerusahaan'
                                            value={1}
                                            checked={inputHandle.bentukPerusahaan === 1 && true}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label
                                            className="form-check-label"
                                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                            for="pt"
                                        >
                                            Perseroan terbatas (PT.)
                                        </label>
                                    </Col>
                                    <Col xs={3} className='form-check form-check-inline'>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="cv"
                                            name='bentukPerusahaan'
                                            value={2}
                                            checked={inputHandle.bentukPerusahaan === 2 && true}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label
                                            className="form-check-label"
                                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                            for="cv"
                                        >
                                            Persekutuan Komanditer (CV.)
                                        </label>
                                    </Col>
                                </Row>
                                <Row className='py-2'>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ marginLeft: "unset", marginRight: "unset" }}>
                                        <div className="form-check form-check-inline ">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="lainnya"
                                                name='bentukPerusahaan'
                                                value={3}
                                                checked={inputHandle.bentukPerusahaan === 3 && true}
                                                onChange={(e) => handleChange(e)}
                                            />
                                            <label
                                                className="form-check-label"
                                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                                for="lainnya"
                                            >
                                                Lainnya
                                            </label>
                                        </div>
                                        <input placeholder='Masukkan bentuk usaha' disabled={inputHandle.bentukPerusahaan !== 3} onChange={(e) => handleChange(e)} value={inputHandle.bentukPerusahaanLainnya} name='bentukPerusahaanLainnya' type="text" className='input-text-user' />
                                    </Col>
                                </Row>
                            </>
                        )
                    }
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>E-mail perusahaan</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center'>
                        <input name="emailPerusahaan" value={inputHandle.emailPerusahaan} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='Masukkan e-mail perusahaan' type='text' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838", height: 45 }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama brand/toko</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center'>
                        <input name="namaBrand" value={inputHandle.namaBrand} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='Masukkan nama brand / toko' type='text' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838", height: 45 }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama yang dicetak dalam QRIS</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center'>
                        <input name="namaYangDicetakQris" value={inputHandle.namaYangDicetakQris} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='Masukkan nama yang dicetak dalam QRIS' type='text' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838", height: 45 }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama yang tampil saat di scan</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center'>
                        <input name="namaYangTampil" value={inputHandle.namaYangTampil} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='Masukkan nama yang tampil saat di scan' type='text' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838", height: 45 }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Jumlah kasir (counter pembayaran)</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center' style={{ width:"7%" }}>
                        <input name="jumlahKasir" value={inputHandle.jumlahKasir} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='0' type='number' min={0} onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838", height: 45 }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    {
                        alertMaxJumlahKasir ?
                        <div className='mt-2 d-flex justify-content-start align-items-center' style={{ color: "#B9121B", fontSize: 12, fontFamily: "nUNITO" }}>
                            <img src={noteIconRed} className="me-2" alt="icon notice" />
                            <div>Jumlah kasir tidak boleh lebih dari 1500</div>
                        </div> : ""
                    }
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Pendapatan pertahun</div>
                    <Row className='py-2' style={{ marginLeft: "unset", marginRight: "unset" }}>
                        <Col xs={3} className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="inputA"
                                name='pendapatanPertahun'
                                value={1}
                                checked={inputHandle.pendapatanPertahun === 1 && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="inputA"
                            >
                                {`< Rp 300 juta`}
                            </label>
                        </Col>
                        <Col xs={3} className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="inputB"
                                name='pendapatanPertahun'
                                value={2}
                                checked={inputHandle.pendapatanPertahun === 2 && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="inputB"
                            >
                                Rp 300 juta - Rp 2,5 miliar
                            </label>
                        </Col>
                    </Row>
                    <Row className='py-2' style={{ marginLeft: "unset", marginRight: "unset" }}>
                        <Col xs={3} className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="inputC"
                                name='pendapatanPertahun'
                                value={3}
                                checked={inputHandle.pendapatanPertahun === 3 && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="inputC"
                            >
                                Rp 2,5 miliar - Rp 50 miliar
                            </label>
                        </Col>
                        <Col xs={3} className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="inputD"
                                name='pendapatanPertahun'
                                value={4}
                                checked={inputHandle.pendapatanPertahun === 4 && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="inputD"
                            >
                                {`> Rp 50 miliar`}
                            </label>
                        </Col>
                    </Row>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Kategori usaha</div>
                    <div className='dropdown dropPartnerAddUser pt-2 '>
                        <ReactSelect
                            closeMenuOnSelect={true}
                            hideSelectedOptions={false}
                            options={dataKategoriUsaha}
                            value={selectedDataKategoriUsaha}
                            onChange={(selected) => setSelectedDataKategoriUsaha([selected])}
                            placeholder="Pilih Partner Merchant"
                            components={{ Option }}
                            styles={customStylesSelectedOption}
                        />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Alamat usaha</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center'>
                        <textarea name="alamatUsaha" value={inputHandle.alamatUsaha} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='cth: jln. nama jalan no.01 RT.001 RW 002' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838", height: 100, padding: 12 }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <Row className='pt-3'>
                        <Col xs={6}>
                            <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }}>Kode Pos</div>
                            <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                <input name="kodePos" value={inputHandle.kodePos} onChange={(e) => handleChange(e)} className='input-text-user' placeholder='Masukkan kode pos' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                            </div>
                        </Col>
                    </Row>
                    {
                        ((inputHandle.kodePos.length !== 0 && Object.keys(dataKodePos).length === 0)) ?
                        <div className='mt-1' style={{ fontSize: 12, fontFamily: "Nunito", color: "#B9121B" }}>Kode Pos tidak ditemukan</div> :
                        <div className='mt-1' style={{ fontSize: 12, fontFamily: "Nunito", color: "#888888" }}>Harus sesuai dengan kelurahan pada alamat anda</div>
                    }
                    <Row className='pt-3'>
                        <Col xs={6}>
                            <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }}>Provinsi</div>
                            <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                <input value={Object.keys(dataKodePos).length === 0 ? "" : dataKodePos.mprovince_name} disabled className='input-text-user' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }}>Kabupaten/kota</div>
                            <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                <input value={Object.keys(dataKodePos).length === 0 ? "" : dataKodePos.mcity_name} disabled className='input-text-user' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                            </div>
                        </Col>
                    </Row>
                    <Row className='pt-3'>
                        <Col xs={6}>
                            <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Kecamatan</div>
                            <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                <input value={Object.keys(dataKodePos).length === 0 ? "" : dataKodePos.mdistrict_name} disabled className='input-text-user' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Kelurahan</div>
                            <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                <input value={Object.keys(dataKodePos).length === 0 ? "" : dataKodePos.mvillage_name} disabled className='input-text-user' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                            </div>
                        </Col>
                    </Row>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Jenis Toko <span style={{ fontFamily: "Nunito", fontSize: 12 }}>(bisa pilih lebih dari 1)</span></div>
                    <div className='pt-2 d-flex justify-content-start align-items-center form-jenis-toko-qris'>
                        <input type="checkbox" name="tokoFisik" onChange={(e) => handleChangeJenisToko(e)} checked={(jenisToko === "1,2" && true) || (jenisToko[0] === "1" && true) || (jenisToko[1] === "1" && true)} value="1"  />
                        <label className='form-jenis-toko-qris ms-1' for="tokoFisik">Toko Fisik</label>
                        <input type="checkbox" name="tokoOnline" onChange={(e) => handleChangeJenisToko(e)} checked={(jenisToko === "1,2" && true) || (jenisToko[0] === "2" && true) || (jenisToko[1] === "2" && true)} value="2" className='ms-3' />
                        <label className='form-jenis-toko-qris ms-1' for="tokoOnline">Toko Online</label>
                    </div>
                    {
                        (jenisToko.join() === "1,2" || jenisToko.join() === "2,1" || jenisToko.join() === "1") && (
                            <>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Foto tempat usaha</div>
                                <div className='viewDragDrop mt-2' style={{cursor: "pointer"}} onClick={handleClickTempatUsaha}>
                                    {
                                        imageFileTempatUsaha.length === 0 ?
                                        <>
                                            <div className='pt-4 text-center'>Masukkan foto tempat usaha.</div>
                                            <input
                                                type="file"
                                                onChange={handleFileChangeTempatUsaha}
                                                accept=".jpg"
                                                style={{ display: "none" }}
                                                ref={hiddenFileInputTempatUsaha}
                                                id="image"
                                                name="image"
                                                multiple
                                            />
                                            <div className='pt-3 text-center'>Maks: 3 foto, Maks ukuran satu file: 500kb</div>
                                            <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                                        </>
                                            :
                                        <>
                                            <div className='d-flex justify-content-start' >
                                            {
                                                imageFileTempatUsaha.map((item, id) => {
                                                    return (
                                                        <div className='d-flex flex-column align-items-center' key={id}>
                                                            <img src={item.url} alt="alt" width="180px" height="120px" className='pt-4 ms-4 text-start' />
                                                            <div className='pt-2 text-wrap' style={{ width: 150 }}>{item.name}</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            </div>
                                            <input
                                                type="file"
                                                onChange={handleFileChangeTempatUsaha}
                                                accept=".jpg"
                                                style={{ display: "none" }}
                                                ref={hiddenFileInputTempatUsaha}
                                                id="image"
                                                name="image"
                                                multiple
                                            />
                                            <div className='pt-3 text-center'>Maks: 3 foto, Maks ukuran satu file: 500kb</div>
                                            <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                                        </>
                                    }
                                </div>
                                {
                                    uploadTempatUsaha === true ? (
                                        <div className='mt-2 d-flex justify-content-start align-items-center' style={{ color: "#B9121B", fontSize: 12, fontFamily: "nUNITO" }}>
                                            <img src={noteIconRed} className="me-2" alt="icon notice" />
                                            <div>Salah satu file lebih dari 500kb</div>
                                        </div>
                                    ) : ""
                                }
                                {
                                    alertMaxFile === true ? (
                                        <div className='mt-2 d-flex justify-content-start align-items-center' style={{ color: "#B9121B", fontSize: 12, fontFamily: "nUNITO" }}>
                                            <img src={noteIconRed} className="me-2" alt="icon notice" />
                                            <div>file lebih dari 3</div>
                                        </div>
                                    ) : ""
                                }
                            </>
                        )
                    }
                    {
                        (jenisToko.join() === "1,2" || jenisToko.join() === "2,1" || jenisToko.join() === "2") && (
                            <>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838"}} className='pt-3'>Link / Website toko</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input name="onlineShopUrl" value={inputHandle.onlineShopUrl} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='Masukan link / website toko' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                            </>
                        )
                    }
                    <div style={{ fontFamily: "Nunito", fontSize: 14 }} className='pt-3'>Sudah pernah mendaftar QRIS sebelumnya ?</div>
                    <div className='d-flex justify-content-start align-items-center py-2'>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="Ya"
                                name='kepunyaanQris'
                                value={1}
                                checked={inputHandle.kepunyaanQris === 1 && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="Ya"
                            >
                                Ya
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="Tidak"
                                name='kepunyaanQris'
                                value={0}
                                checked={inputHandle.kepunyaanQris === 0 && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="Tidak"
                            >
                                Tidak
                            </label>
                        </div>
                    </div>
                    {
                        inputHandle.kepunyaanQris === 1 && (
                            <>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>NMID</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input name="nmid" value={inputHandle.nmid} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='Masukan NMID' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                                {
                                    alertMinNmid === true ? (
                                        <div className='mt-2 d-flex justify-content-start align-items-center' style={{ color: "#B9121B", fontSize: 12, fontFamily: "nUNITO" }}>
                                            <img src={noteIconRed} className="me-2" alt="icon notice" />
                                            <div>Minimal 13 digit angka</div>
                                        </div>
                                    ) : (
                                        <div className='mt-1' style={{ fontSize: 12, fontFamily: "Nunito", color: "#888888" }}>Minimal 13 digit angka</div>
                                    )
                                }
                            </>
                        )
                    }
                   <div>
                   <div className='d-flex justify-content-between align-items-center mt-4 pb-4' >
                        <button
                            className='btn-prev-info-usaha me-2'
                            // onClick={() => history.push(`/formulir-info-pemilik-outlet/${profileId === undefined ? 0 : profileId}`)}
                            onClick={() => formDataSecondStepInfoUsahaBadanUsaha(0, inputHandle.businessType, 103, profileId === undefined ? 0 : profileId, inputHandle.namaPerusahaan, inputHandle.bentukPerusahaan, inputHandle.bentukPerusahaanLainnya, inputHandle.emailPerusahaan, inputHandle.namaBrand, inputHandle.namaYangDicetakQris, selectedDataKategoriUsaha.length !== 0 ? selectedDataKategoriUsaha[0].value : 0, Number(inputHandle.jumlahKasir) > 1500 ? 0 : inputHandle.jumlahKasir, inputHandle.pendapatanPertahun, inputHandle.alamatUsaha, inputHandle.kodePos, dataKodePos.mprovince_name === undefined ? "" : dataKodePos.mprovince_name, dataKodePos.mcity_name === undefined ? "" : dataKodePos.mcity_name, dataKodePos.mdistrict_name === undefined ? "" : dataKodePos.mdistrict_name, dataKodePos.mvillage_name === undefined ? "" : dataKodePos.mvillage_name, jenisToko.join(), inputHandle.kepunyaanQris, imageFileTempatUsaha, inputHandle.nmid, inputHandle.onlineShopUrl, 1)}
                        >
                            Sebelumnya
                        </button>
                        <button
                            className={(
                                inputHandle.namaPerusahaan.length !== 0 &&
                                ((inputHandle.businessType === 1 && (inputHandle.bentukPerusahaan === 1 || inputHandle.bentukPerusahaan === 2 || (inputHandle.bentukPerusahaan === 3 && inputHandle.bentukPerusahaanLainnya.length !== 0))) || inputHandle.businessType === 2) &&
                                inputHandle.emailPerusahaan.length !== 0 &&
                                inputHandle.namaBrand.length !== 0 &&
                                inputHandle.namaYangDicetakQris.length !== 0 &&
                                Number(inputHandle.jumlahKasir) !== 0 &&
                                inputHandle.jumlahKasir !== undefined &&
                                Number(inputHandle.jumlahKasir) <= 1500 &&
                                inputHandle.pendapatanPertahun !== 0 &&
                                selectedDataKategoriUsaha.length !== 0 &&
                                inputHandle.alamatUsaha.length !== 0 &&
                                inputHandle.kodePos.length !== 0 &&
                                (inputHandle.kodePos.length === 5 && Object.keys(dataKodePos).length !== 0) &&
                                (jenisToko.length !== 0 && (((jenisToko.join() === "1,2" || jenisToko.join() === "2,1") && (inputHandle.onlineShopUrl.length !== 0 && (imageFileTempatUsaha.length !== 0 && uploadTempatUsaha === false))) || (jenisToko.join() === "1" && (imageFileTempatUsaha.length !== 0 && uploadTempatUsaha === false)) || (jenisToko.join() === "2" && inputHandle.onlineShopUrl.length !== 0))) &&
                                (inputHandle.kepunyaanQris !== 2 && ((inputHandle.kepunyaanQris === 1 && (inputHandle.nmid.length !== 0 && inputHandle.nmid.length >= 13)) || (inputHandle.kepunyaanQris === 0)))
                                ) ? 'btn-next-info-usaha ms-2' : 'btn-next-info-usaha-inactive ms-2'
                            }
                            disabled={(
                                inputHandle.namaPerusahaan.length === 0 ||
                                ((inputHandle.businessType === 1 && ((inputHandle.bentukPerusahaan === 3 && inputHandle.bentukPerusahaanLainnya.length === 0)))) ||
                                inputHandle.emailPerusahaan.length === 0 ||
                                inputHandle.namaBrand.length === 0 ||
                                inputHandle.namaYangDicetakQris.length === 0 ||
                                Number(inputHandle.jumlahKasir) === 0 ||
                                inputHandle.jumlahKasir === undefined ||
                                Number(inputHandle.jumlahKasir) > 1500 ||
                                inputHandle.pendapatanPertahun === 0 ||
                                selectedDataKategoriUsaha.length === 0 ||
                                inputHandle.alamatUsaha.length === 0 ||
                                inputHandle.kodePos.length === 0 ||
                                inputHandle.kodePos.length !== 5 ||
                                (inputHandle.kodePos.length === 5 && Object.keys(dataKodePos).length === 0) ||
                                jenisToko.length === 0 ||
                                (jenisToko.length !== 0 && ((jenisToko.join() === "1,2" || jenisToko.join() === "2,1") && (inputHandle.onlineShopUrl.length === 0 || imageFileTempatUsaha.length === 0))) ||
                                (jenisToko.length !== 0 && (jenisToko.join() === "1" && imageFileTempatUsaha.length === 0)) ||
                                (jenisToko.length !== 0 && (jenisToko.join() === "2" && inputHandle.onlineShopUrl.length === 0)) ||
                                uploadTempatUsaha === true ||
                                inputHandle.kepunyaanQris === 2 || ((inputHandle.kepunyaanQris === 1 && (inputHandle.nmid.length === 0)) || (inputHandle.kepunyaanQris === 1 && (inputHandle.nmid.length !== 0 && inputHandle.nmid.length < 13)))
                            )}
                            onClick={
                                inputHandle.businessType === 1 ?
                                () => formDataSecondStepInfoUsahaBadanUsaha(0, inputHandle.businessType, 103, profileId === undefined ? 0 : profileId, inputHandle.namaPerusahaan, inputHandle.bentukPerusahaan, inputHandle.bentukPerusahaanLainnya, inputHandle.emailPerusahaan, inputHandle.namaBrand, inputHandle.namaYangDicetakQris, selectedDataKategoriUsaha.length !== 0 ? selectedDataKategoriUsaha[0].value : 0, Number(inputHandle.jumlahKasir) > 1500 ? 0 : inputHandle.jumlahKasir, inputHandle.pendapatanPertahun, inputHandle.alamatUsaha, inputHandle.kodePos, dataKodePos.mprovince_name === undefined ? "" : dataKodePos.mprovince_name, dataKodePos.mcity_name === undefined ? "" : dataKodePos.mcity_name, dataKodePos.mdistrict_name === undefined ? "" : dataKodePos.mdistrict_name, dataKodePos.mvillage_name === undefined ? "" : dataKodePos.mvillage_name, jenisToko.join(), inputHandle.kepunyaanQris, imageFileTempatUsaha, inputHandle.nmid, inputHandle.onlineShopUrl, 3) :
                                () => checkPageSettlementHandler(inputHandle.businessType, 103, profileId, inputHandle.namaPerusahaan, inputHandle.bentukPerusahaan, inputHandle.bentukPerusahaanLainnya, inputHandle.emailPerusahaan, inputHandle.namaBrand, inputHandle.namaYangDicetakQris, selectedDataKategoriUsaha.length !== 0 ? selectedDataKategoriUsaha[0].value : 0, Number(inputHandle.jumlahKasir) > 1500 ? 0 : inputHandle.jumlahKasir, inputHandle.pendapatanPertahun, inputHandle.alamatUsaha, inputHandle.kodePos, dataKodePos.mprovince_name === undefined ? "" : dataKodePos.mprovince_name, dataKodePos.mcity_name === undefined ? "" : dataKodePos.mcity_name, dataKodePos.mdistrict_name === undefined ? "" : dataKodePos.mdistrict_name, dataKodePos.mvillage_name === undefined ? "" : dataKodePos.mvillage_name, jenisToko.join(), inputHandle.kepunyaanQris, imageFileTempatUsaha, inputHandle.nmid, inputHandle.onlineShopUrl)
                            }
                        >
                            Selanjutnya
                        </button>
                    </div>
                   </div>
                </div>
                <div className='pt-3'></div>
            </div>

            <Modal
                size="lg"
                centered
                show={showModalSimpanData}
                onHide={() => setShowModalSimpanData(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                className='modal-simpan-data-settlement'
            >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Harap simpan data anda</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 15, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-center">Data anda akan terhapus apabila anda keluar tanpa menyimpan data anda</p>
                    </div>
                    <div className="d-flex justify-content-center mt-2 mb-3">
                        <Button onClick={() => setShowModalSimpanData(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Kembali</Button>
                        <Button onClick={() => saveAndGoBack()} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>
                            {isLoadingInfoUsaha ? (<>Mohon tunggu... <FontAwesomeIcon icon={faSpinner} spin /></>) : `Simpan`}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default FormInfoUsahaOutlet