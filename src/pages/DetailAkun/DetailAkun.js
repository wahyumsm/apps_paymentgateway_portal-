import React, {useEffect, useState} from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Col, Row} from '@themesberg/react-bootstrap';
import $ from 'jquery'
import axios from 'axios';
import { getToken } from '../../function/helpers';
import encryptData from '../../function/encryptData';
import { useHistory, useParams } from 'react-router-dom';
function DetailAkun() {
    const [isDetailAkun, setIsDetailAkun] = useState(true);
    const [dataAkun, setDataAkun] = useState({})
    const history = useHistory()
    // const { partnerId } = useParams()
    console.log(dataAkun.mpartner_id)
    const [inputHandle, setInputHandle] = useState({
        callbackUrl: dataAkun.callback_url,
    })

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    async function userDetailPartner (url) {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const userDetailPartner = await axios.post(url, { data: "" }, { headers: headers })
            console.log(userDetailPartner, 'ini data user ');
            if (userDetailPartner.data.response_code === 200 && userDetailPartner.status === 200) {
                setDataAkun(userDetailPartner.data.response_data)
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        userDetailPartner('/Account/GetPartnerDetail')
    },[])

    async function updateUrlCallback(id, callbackUrl) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"mpartner_id":"${id}", "callback_url":"${callbackUrl}"}`)
            // console.log(dataParams, 'ini data params');
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const editCallback = await axios.post("/Account/UpdateCallbackUrl", { data: dataParams }, { headers: headers })
            console.log(editCallback, 'ini add Callback');
            if(editCallback.status === 200 && editCallback.data.response_code === 200) {
                history.push("/detailakun")
                // alert("Edit Data Partner Berhasil Ditambahkan")
            }          
            
            alert("Edit URL Berhasil")
        } catch (error) {
            console.log(error)
            if (error.response.status === 401) {
                history.push('/login')
            }
        }
    }


    function detailAkunTabs(isTabs){
        setIsDetailAkun(isTabs)
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

    console.log(dataAkun);

  return (
    <div className='container-content'>
        <span className='breadcrumbs-span'>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Detail Akun</span>
        <div className='detail-akun-menu mt-5' style={{display: 'flex', height: 33}}>
            <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => detailAkunTabs(true)} id="detailakuntab">
                <span className='menu-detail-akun-span menu-detail-akun-span-active' id="detailakunspan">Detail Akun</span>
            </div>
            <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => detailAkunTabs(false)} id="konfigurasitab">
                <span className='menu-detail-akun-span' id="konfigurasispan">Konfigurasi</span>
            </div>
        </div>
        {
            isDetailAkun ? 
            <>
            <div className='detail-akun-section'>        
                <hr className='hr-style' style={{marginTop: -2}}/>
                <br/>
                <span className='head-title'>Profil Perusahaan</span>
                <br/>
                <br/>
                <div className='base-content'>
                    <table style={{width: '100%', marginLeft: 'unset'}} className="table-form">
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td style={{width: 200}}>Status</td>
                                {dataAkun.mpartner_is_active === true ? 
                                    <td><div className='active-box'><span className='active-box-span'>Aktif</span></div></td>
                                    :
                                    <td><div className='inactive-box'><span className='inactive-box-span'>Tidak Aktif</span></div></td>}
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>ID Partner</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_id} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>Nama Perusahaan</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_name} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>Email Perusahaan</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_email} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>Nomor Telepon</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_telp} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>Alamat</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_address} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                        </tbody>
                    </table>
                </div>
                <br/>
                <span className='head-title'>Detail NPWP</span>
                <br/>
                <br/>
                <div className='base-content'>
                    <table style={{width: '100%', marginLeft: 'unset'}} className="table-form">
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td style={{width: 200}}>No NPWP</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_npwp} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>Nama NPWP</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_npwp_name} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                        </tbody>
                    </table>
                </div>
                <br/>
                <span className='head-title'>Profil Direktur Perusahaan</span>
                <br/>
                <br/>
                <div className='base-content'>
                    <table style={{width: '100%', marginLeft: 'unset'}} className="table-form">
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td style={{width: 200}}>Nama Direktur</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_direktur} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>No Hp Direktur</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_direktur_telp} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                        </tbody>
                    </table>
                </div>
                <br/>
                <span className='head-title'>Rekening</span>
                <br/>
                <br/>
                <div className='base-content'>
                    <table style={{width: '100%', marginLeft: 'unset'}} className="table-form">
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td style={{width: 200}}>Nama Bank</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mbank_name} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>No. Rekening</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartnerdtl_account_number} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>Nama Pemilik Rekening</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartnerdtl_account_name} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                        </tbody>
                    </table>
                </div>
            </div>
            </> : 
            <>
                <div className='konfigurasi-section' style={{marginTop: 24}}>
                  <hr className='hr-style' style={{marginTop: -25}}/>
                    <div className='base-content'>
                        <span>You will need to know your <b>Partner ID</b> and <b>Private Key</b> to communicate with Midtrans. Please use the Development server while you are still in development.</span>
                        <br/>
                        <br/>
                        <p className='head-title'>API Keys</p>
                        <div className='sub-base-content'>
                            <table  style={{width: '100%', marginLeft: 'unset'}} className="table-api-keys">
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>Partner ID</td>
                                        <td>:</td>
                                        <td><span><b>{dataAkun.mpartner_id}</b></span></td>
                                    </tr>
                                    <tr>
                                        <td>Public Key</td>
                                        <td>:</td>
                                        <td><span><b>{dataAkun.public_key}</b></span></td>
                                    </tr>
                                    <tr>
                                        <td>Private Key</td>
                                        <td>:</td>
                                        <td><span><b>{dataAkun.private_key}</b></span></td>
                                    </tr>
                                </tbody>
                            </table>
                            <br/>
                        </div>
                        <br/>
                        <div className='base-content' style={{background: 'rgba(255, 214, 0, 0.16)', borderRadius: 4, padding: 12}}>
                            <span>
                                <i>
                                This key is auto generated by system and should not be changed. If you really need to change your key for some reason please contact our <b><u>contact support</u></b>
                                </i>
                            </span>
                        </div>
                        <br/>
                    </div>
                    <br/>
                    <div className="base-content mb-5">
                        <p>Midtrans requires the URL endpoints for for the following scenarios:</p>
                        <br/>
                        <Row>
                            <Col xs={3}>
                                <span>Payment Notification URL*</span>
                            </Col>
                            <Col xs={9}>
                                <div>
                                    <input type='text'className='input-text-ez' onChange={handleChange} defaultValue={dataAkun.callback_url} name="callbackUrl" style={{width: '100%', marginLeft: 'unset'}}/> 
                                    <p>Address where we will send the notification via HTTP Post request. E.g http://yourwebsite.com/notification/handing</p>
                                    <br/>
                                </div>
                            </Col>
                        </Row>
                        <div style={{ display: "flex", justifyContent: "end", marginTop: 16 }}>
                        <button onClick={() => updateUrlCallback(dataAkun.mpartner_id, inputHandle.callbackUrl)} className='mb-5' style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 136, height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                            Update
                        </button>
                    </div>
                    </div>
                </div>
            </>
        } 
    </div>
  )
}

export default DetailAkun