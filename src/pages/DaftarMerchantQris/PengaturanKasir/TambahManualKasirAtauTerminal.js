import React, { useEffect, useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import ReactSelect, { components } from 'react-select';
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import encryptData from '../../../function/encryptData';

const TambahManualKasirAtauTerminal = (props) => {
    console.log(props);
    const pengaturanKasirPathname = props.location.pathname
    const history = useHistory()
    const [dataListGrup, setDataListGrup] = useState([])
    const [selectedDataGrup, setSelectedDataGrup] = useState([])

    function handleChangeGrup(e) {
        setSelectedDataBrand([])
        setSelectedDataOutlet([])
        setSelectedDataGrup(e)
        getDataBrandHandler(e.value)
    }

    console.log(selectedDataGrup, "selectedDataGrup");
    
    async function getDataGrupHandler() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetListMerchant", { data: "" }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mmerchant_nou
                    obj.label = e.mmerchant_name
                    newArr.push(obj)
                })
                setDataListGrup(newArr)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mmerchant_nou
                    obj.label = e.mmerchant_name
                    newArr.push(obj)
                })
                setDataListGrup(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    
    const [dataListBrand, setDataListBrand] = useState([])
    const [selectedDataBrand, setSelectedDataBrand] = useState([])

    function handleChangeBrand(e) {
        setSelectedDataOutlet([])
        setSelectedDataBrand(e)
        getDataOutletHandler(selectedDataGrup.value, e.value)
    }

    async function getDataBrandHandler(merchantNou) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"merchant_nou": ${merchantNou}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetListOutletForTerminal", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.moutlet_nou
                    obj.label = e.moutlet_name
                    newArr.push(obj)
                })
                setDataListBrand(newArr)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.moutlet_nou
                    obj.label = e.moutlet_name
                    newArr.push(obj)
                })
                setDataListBrand(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    const [dataListOutlet, setDataListOutlet] = useState([])
    const [selectedDataOutlet, setSelectedDataOutlet] = useState([])
    console.log(String(selectedDataOutlet.map(item => item.value)), "selectedDataOutlet");

    async function getDataOutletHandler(merchantNou, outletNou) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"merchant_nou": ${merchantNou}, "outlet_nou": ${outletNou}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetListStore", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mstore_id
                    obj.label = e.mstore_name
                    newArr.push(obj)
                })
                setDataListOutlet(newArr)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mstore_id
                    obj.label = e.mstore_name
                    newArr.push(obj)
                })
                setDataListOutlet(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function handleClick(pathname) {
        if (pathname === "Kasir") {
            history.push('/tambah-manual-data-kasir');
            sessionStorage.setItem("storeId", String(selectedDataOutlet.map(item => item.value)))
            console.log("masuk1");
        } else {
            history.push('/tambah-manual-data-terminal');
            sessionStorage.setItem("storeId", String(selectedDataOutlet.map(item => item.value)))
            console.log("masuk2");
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

    useEffect(() => {
        getDataGrupHandler()
    }, [])
    

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Pengaturan Kasir</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar Kasir</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah {pengaturanKasirPathname === "/tambah-manual-kasir" ? "Kasir" : "Terminal"} Manual</span></span>
            <div className="head-title"> 
                <h2 className="h5 mt-4" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Tambah {pengaturanKasirPathname === "/tambah-manual-kasir" ? "Kasir" : "Terminal"} Manual</h2>
            </div>
            <div className='mt-4'>Grup</div>
            <div className="dropdown dropPartnerAddUser mt-2">
                <ReactSelect
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    options={dataListGrup}
                    value={selectedDataGrup}
                    onChange={(selected) => handleChangeGrup(selected)}
                    placeholder="Pilih Grup"
                    components={{ Option }}
                    styles={customStylesSelectedOption}
                />
            </div>
            <div className='mt-4'>Brand</div>
            <div className="dropdown dropPartnerAddUser mt-2">
                <ReactSelect
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    options={dataListBrand}
                    value={selectedDataBrand}
                    onChange={(selected) => handleChangeBrand(selected)}
                    placeholder="Pilih Brand"
                    components={{ Option }}
                    styles={customStylesSelectedOption}
                />
            </div>
            <div className='mt-4'>Outlet</div>
            <div className="dropdown dropPartnerAddUser mt-2">
                <ReactSelect
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    options={dataListOutlet}
                    value={selectedDataOutlet}
                    onChange={(selected) => setSelectedDataOutlet([selected])}
                    placeholder="Pilih Outlet"
                    components={{ Option }}
                    styles={customStylesSelectedOption}
                />
            </div>
            <button 
                className='btn-ez-transfer mt-4'
                onClick={() => handleClick(pengaturanKasirPathname === "/tambah-manual-kasir" ? "Kasir" : "Terminal")}
            >
                Tambah {pengaturanKasirPathname === "/tambah-manual-kasir" ? "Kasir" : "Terminal"}
            </button>
        </div>
    )
}

export default TambahManualKasirAtauTerminal