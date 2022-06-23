import React, {useState} from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Col, Row} from '@themesberg/react-bootstrap';
import $ from 'jquery'
function DetailAkun() {

    const [isDetailAkun, setIsDetailAkun] = useState(true);

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
                                <td><div className='active-box'><span className='active-box-span'>Aktif</span></div></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>ID Partner</td>
                                <td><input type='text'className='input-text-ez' placeholder='98123913' disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>Nama Perusahaan</td>
                                <td><input type='text'className='input-text-ez' placeholder='PT Agung Sejahtera' disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>Email Perusahaan</td>
                                <td><input type='text'className='input-text-ez' placeholder='agungsejahtera@gmail.com'disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>Nomor Telepon</td>
                                <td><input type='text'className='input-text-ez' placeholder='021 - 984934'disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>Alamat</td>
                                <td><input type='text'className='input-text-ez' placeholder='JL. AM Sangaji'disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
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
                                <td><input type='text'className='input-text-ez' placeholder='0829392323' disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>Nama NPWP</td>
                                <td><input type='text'className='input-text-ez' placeholder='Agung' disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
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
                                <td><input type='text'className='input-text-ez' placeholder='Agung Wirawan' disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>No Hp Direktur</td>
                                <td><input type='text'className='input-text-ez' placeholder='08271817321' disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
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
                                <td><input type='text'className='input-text-ez' placeholder='BCA' disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>No. Rekening</td>
                                <td><input type='text'className='input-text-ez' placeholder='3283131' disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>Nama Pemilik Rekening</td>
                                <td><input type='text'className='input-text-ez' placeholder='Agung Wirawan' disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
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
                        <span>You will need to know your <b>Merchant ID</b> and <b>Server Key</b> to communicate with Midtrans. Please use the Development server while you are still in development.</span>
                        <br/>
                        <br/>
                        <p className='head-title'>API Keys</p>
                        <div className='sub-base-content'>
                            <table  style={{width: '100%', marginLeft: 'unset'}} className="table-api-keys">
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>Merchant ID</td>
                                        <td>:</td>
                                        <td><span><b>G960040526</b></span></td>
                                    </tr>
                                    <tr>
                                        <td>Client Key</td>
                                        <td>:</td>
                                        <td><span><b>Mid-client-GbmkuVCiTsvAiKc</b></span></td>
                                    </tr>
                                    <tr>
                                        <td>Server Key</td>
                                        <td>:</td>
                                        <td><span><b>Mid-server-A6Ap5gxgUdZuPX_570lwSyiR</b></span></td>
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
                    <div className="base-content">
                        <p>Midtrans requires the URL endpoints for for the following scenarios:</p>
                        <br/>
                        <Row>
                            <Col xs={3}>
                                <span>Payment Notification URL*</span>
                            </Col>
                            <Col xs={9}>
                                <div>
                                    <input type='text'className='input-text-ez' placeholder='https://api.ezeepasar.com/mobile-amaranthus/midtrans/notification' disabled style={{width: '100%', marginLeft: 'unset'}}/> 
                                    <p>Address where we will send the notification via HTTP Post request. E.g http://yourwebsite.com/notification/handing</p>
                                    <p><b><u>See History</u></b></p>
                                    <br/>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </>
        } 
    </div>
  )
}

export default DetailAkun