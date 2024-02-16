import React, { useEffect, useRef, useState } from 'react'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import filePdfQris from "../../../assets/icon/file_pdf_qris.svg";
import { useHistory, useParams } from 'react-router-dom';
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import { Button, Modal } from '@themesberg/react-bootstrap';

const FormDokumenUsahaBadanUsaha = () => {
    const history = useHistory()
    const { profileId } = useParams()
    const [showModalSimpanData, setShowModalSimpanData] = useState(false)

    const hiddenFileInputNpwp = useRef(null)
    const [imageFileNpwp, setImageFileNpwp] = useState(null)
    const [nameNpwp, setNameNpwp] = useState(null)
    const [imageNpwp, setImageNpwp] = useState(null)
    const [uploadPdfNpwp, setUploadPdfNpwp] = useState(false)

    const hiddenFileInputNib = useRef(null)
    const [imageFileNib, setImageFileNib] = useState(null)
    const [nameNib, setNameNib] = useState(null)
    const [imageNib, setImageNib] = useState(null)
    const [uploadPdfNib, setUploadPdfNib] = useState(false)

    const hiddenFileInputAktaPerusahaan = useRef(null)
    const [imageFileAktaPerusahaan, setImageFileAktaPerusahaan] = useState(null)
    const [nameAktaPerusahaan, setNameAktaPerusahaan] = useState(null)
    const [imageAktaPerusahaan, setImageAktaPerusahaan] = useState(null)
    const [uploadPdfAktaPerusahaan, setUploadPdfAktaPerusahaan] = useState(false)

    const hiddenFileInputSkKementrian = useRef(null)
    const [imageFileSkKementrian, setImageFileSkKementrian] = useState(null)
    const [nameSkKementrian, setNameSkKementrian] = useState(null)
    const [imageSkKementrian, setImageSkKementrian] = useState(null)
    const [uploadPdfSkKementrian, setUploadPdfSkKementrian] = useState(false)

    const handleClick = (param) => {
        if (param === "npwp") {
            hiddenFileInputNpwp.current.click();
        } else if (param === "nib") {
            hiddenFileInputNib.current.click();
        } else if (param === "aktaPerusahaan") {
            hiddenFileInputAktaPerusahaan.current.click()
        } else {
            hiddenFileInputSkKementrian.current.click()
        }
    };

    const handleFileChange = (event, param) => {
        if (param === "npwp") {
            setNameNpwp(event.target.files[0].name)
            if ((event.target.files[0].name).slice(-3) === "pdf") {
                setImageNpwp(event.target.files[0])
                setImageFileNpwp(null)
                setUploadPdfNpwp(true)
            } else {
                setUploadPdfNpwp(false)
                if(event.target.files[0]) {
                    setImageNpwp(event.target.files[0])
                    if (parseFloat(event.target.files[0].size / 1024).toFixed(2) > 500) {
                        setImageFileNpwp(imageFileNpwp)
                    }
                    else {
                        const reader = new FileReader()
                        reader.addEventListener("load", () => {
                            console.log(reader.result, "reader.result");
                            setImageFileNpwp(reader.result)
                        })
                        reader.readAsDataURL(event.target.files[0])
                    }
                }
            }
        } else if (param === "nib") {
            setNameNib(event.target.files[0].name)
            if ((event.target.files[0].name).slice(-3) === "pdf") {
                setImageNib(event.target.files[0])
                setImageFileNib(null)
                setUploadPdfNib(true)
            } else {
                setUploadPdfNib(false)
                if(event.target.files[0]) {
                    setImageNib(event.target.files[0])
                    if (parseFloat(event.target.files[0].size / 1024).toFixed(2) > 500) {
                        setImageFileNib(imageFileNib)
                    }
                    else {
                        const reader = new FileReader()
                        reader.addEventListener("load", () => {
                            console.log(reader.result, "reader.result");
                            setImageFileNib(reader.result)
                        })
                        reader.readAsDataURL(event.target.files[0])
                    }
                }
            }
        } else if (param === "aktaPerusahaan") {
            setNameAktaPerusahaan(event.target.files[0].name)
            if ((event.target.files[0].name).slice(-3) === "pdf") {
                setImageAktaPerusahaan(event.target.files[0])
                setImageFileAktaPerusahaan(null)
                setUploadPdfAktaPerusahaan(true)
            } else {
                setUploadPdfAktaPerusahaan(false)
                if(event.target.files[0]) {
                    setImageAktaPerusahaan(event.target.files[0])
                    if (parseFloat(event.target.files[0].size / 1024).toFixed(2) > 500) {
                        setImageFileAktaPerusahaan(imageFileAktaPerusahaan)
                    }
                    else {
                        const reader = new FileReader()
                        reader.addEventListener("load", () => {
                            console.log(reader.result, "reader.result");
                            setImageFileAktaPerusahaan(reader.result)
                        })
                        reader.readAsDataURL(event.target.files[0])
                    }
                }
            }
        } else {
            setNameSkKementrian(event.target.files[0].name)
            if ((event.target.files[0].name).slice(-3) === "pdf") {
                setImageSkKementrian(event.target.files[0])
                setImageFileSkKementrian(null)
                setUploadPdfSkKementrian(true)
            } else {
                setUploadPdfSkKementrian(false)
                if(event.target.files[0]) {
                    setImageSkKementrian(event.target.files[0])
                    if (parseFloat(event.target.files[0].size / 1024).toFixed(2) > 500) {
                        setImageFileSkKementrian(imageFileSkKementrian)
                    }
                    else {
                        const reader = new FileReader()
                        reader.addEventListener("load", () => {
                            console.log(reader.result, "reader.result");
                            setImageFileSkKementrian(reader.result)
                        })
                        reader.readAsDataURL(event.target.files[0])
                    }
                }
            }
        }
    }

    async function getDataThirdStepHandler(profileId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"profile_id": ${profileId}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetBussinessFileDocument", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                const data = getData.data.response_data.results
                if (data.mprofdoc_npwp_url.slice(-3) === "pdf") {
                    setImageFileNpwp(null)
                    setUploadPdfNpwp(true)
                } else {
                    setUploadPdfNpwp(false)
                    setImageFileNpwp(data.mprofdoc_npwp_url)
                }

                if (data.mprofdoc_NIB_url.slice(-3) === "pdf") {
                    setImageFileNib(null)
                    setUploadPdfNib(true)
                } else {
                    setUploadPdfNib(false)
                    setImageFileNib(data.mprofdoc_NIB_url)
                }

                if (data.mprofdoc_akta_pendirian_url.slice(-3) === "pdf") {
                    setImageFileAktaPerusahaan(null)
                    setUploadPdfAktaPerusahaan(true)
                } else {
                    setUploadPdfAktaPerusahaan(false)
                    setImageFileAktaPerusahaan(data.mprofdoc_akta_pendirian_url)
                }

                if (data.mprofdoc_SK_url.slice(-3) === "pdf") {
                    setImageFileSkKementrian(null)
                    setUploadPdfSkKementrian(true)
                } else {
                    setUploadPdfSkKementrian(false)
                    setImageFileSkKementrian(data.mprofdoc_SK_url)
                }
                
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                const data = getData.data.response_data.results
                if (data.mprofdoc_npwp_url.slice(-3) === "pdf") {
                    setImageFileNpwp(null)
                    setUploadPdfNpwp(true)
                } else {
                    setUploadPdfNpwp(false)
                    setImageFileNpwp(data.mprofdoc_npwp_url)
                }

                if (data.mprofdoc_NIB_url.slice(-3) === "pdf") {
                    setImageFileNib(null)
                    setUploadPdfNib(true)
                } else {
                    setUploadPdfNib(false)
                    setImageFileNib(data.mprofdoc_NIB_url)
                }

                if (data.mprofdoc_akta_pendirian_url.slice(-3) === "pdf") {
                    setImageFileAktaPerusahaan(null)
                    setUploadPdfAktaPerusahaan(true)
                } else {
                    setUploadPdfAktaPerusahaan(false)
                    setImageFileAktaPerusahaan(data.mprofdoc_akta_pendirian_url)
                }

                if (data.mprofdoc_SK_url.slice(-3) === "pdf") {
                    setImageFileSkKementrian(null)
                    setUploadPdfSkKementrian(true)
                } else {
                    setUploadPdfSkKementrian(false)
                    setImageFileSkKementrian(data.mprofdoc_SK_url)
                }
                
                
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function formDataThirdStepBusenessDocument(profileId, businessType, step, imageNpwp, imageNib, imageAktaPerusahaan, imageSkKementrian) {
        try {
            console.log(imageNpwp, "imageNpwp");
            const auth = "Bearer " + getToken()
            const formData = new FormData()
            const dataParams = encryptData(`{"profile_id": ${profileId}, "bussiness_type": ${businessType}, "step": ${step}}`)
            formData.append('NPWP', imageNpwp)
            formData.append('NIB', imageNib)
            formData.append('Akta_Perusahaan', imageAktaPerusahaan)
            formData.append('SK_Kementrian', imageSkKementrian)
            formData.append('Data', dataParams)
            const headers = {
                'Content-Type':'multipart/form-data',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/AddBussinessFileDocument", formData, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                if (profileId === 0) {
                    if (step === 200) {
                        history.push(`/pengaturan-merchant`)
                    } else {
                        history.push(`/daftar-merchant-qris`)
                    }
                } else {
                    if (step === 200) {
                        history.push(`/pengaturan-merchant/${profileId}/101/${businessType}`)
                    } else {
                        history.push(`/daftar-merchant-qris`)
                    }
                }
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                if (profileId === 0) {
                    if (step === 200) {
                        history.push(`/pengaturan-merchant`)
                    } else {
                        history.push(`/daftar-merchant-qris`)
                    }
                } else {
                    if (step === 200) {
                        history.push(`/pengaturan-merchant/${profileId}/101/${businessType}`)
                    } else {
                        history.push(`/daftar-merchant-qris`)
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

    useEffect(() => {
        if (profileId !== undefined) {
            getDataThirdStepHandler(profileId)
        }
    }, [])
    
    
    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
                <span className='breadcrumbs-span'><span onClick={() => history.push('/')} style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span onClick={() => history.push('/daftar-merchant-qris')} style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah merchant</span></span>
                <div className="d-flex justify-content-start align-items-center head-title"> 
                    <FontAwesomeIcon onClick={() => backPage()} icon={faChevronLeft} className="me-3 mt-1" style={{cursor: "pointer"}} />
                    <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Formulir data merchant</h2>
                </div>
                <div className='pb-4 pt-3'>
                    <div className='d-flex justify-content-start align-items-center' style={{ marginLeft: 35, marginRight: 35 }}>
                        <div style={{ width: "100%", height: 4, background: "linear-gradient(90deg, #80D8DE 30.14%, #229299 67.94%, #077E86 100%)" }}></div>
                        <div style={{ borderRadius: "50%", width: 10, height: 10, background: "#077E86" }}></div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mt-2' style={{ fontSize: 12, color: "#383838", fontFamily: "Nunito" }}>
                        <div>Info pemilik</div>
                        <div className='ms-3'>Info usaha</div>
                        <div>Dokumen usaha</div>
                    </div>
                </div>
                <div className='base-content mt-3'>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className=''>Dokumen NPWP perusahaan</div>
                    <div className='viewDragDrop mt-2' style={{cursor: "pointer"}} onClick={() => handleClick("npwp")}>
                        {
                            (!imageFileNpwp && uploadPdfNpwp === false) ? 
                            <>
                                <div className='pt-4 text-center'>Masukkan dokumen npwp perusahaan.</div>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, "npwp")}
                                    accept=".jpg, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputNpwp}
                                    id="image"
                                    name="image"
                                />
                            </> : (imageFileNpwp) ?
                            <>
                                <img src={imageFileNpwp} alt="alt" width="auto" height="120px" className='pt-4 ms-4 text-start' />
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, "npwp")}
                                    accept=".jpg, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputNpwp}
                                    id="image"
                                    name="image"
                                />
                                <div className='mt-2 ms-4'>{nameNpwp}</div>
                            </> : (uploadPdfNpwp === true) &&
                            <>
                                <img src={filePdfQris} alt="alt" width="auto" height="120px" className='pt-4 ms-4 text-start' />
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, "npwp")}
                                    accept=".jpg, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputNpwp}
                                    id="image"
                                    name="image"
                                />
                                <div className='mt-2 ms-4'>{nameNpwp}</div>
                            </>
                        }
                        <div className='pt-3 text-center'>Maks ukuran satu file: 500kb, Format: .jpg atau .pdf</div>
                        <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='mt-3'>Dokumen NIB perusahaan</div>
                    <div className='viewDragDrop mt-2' style={{cursor: "pointer"}} onClick={() => handleClick("nib")}>
                        {
                            (!imageFileNib && uploadPdfNib === false) ? 
                            <>
                                <div className='pt-4 text-center'>Masukkan dokumen nib perusahaan.</div>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, "nib")}
                                    accept=".jpg, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputNib}
                                    id="image"
                                    name="image"
                                />
                            </> : (imageFileNib) ?
                            <>
                                <img src={imageFileNib} alt="alt" width="auto" height="120px" className='pt-4 ms-4 text-start' />
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, "nib")}
                                    accept=".jpg, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputNib}
                                    id="image"
                                    name="image"
                                />
                                <div className='mt-2 ms-4'>{nameNib}</div>
                            </> : (uploadPdfNib === true) &&
                            <>
                                <img src={filePdfQris} alt="alt" width="auto" height="120px" className='pt-4 ms-4 text-start' />
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, "nib")}
                                    accept=".jpg, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputNib}
                                    id="image"
                                    name="image"
                                />
                                <div className='mt-2 ms-4'>{nameNib}</div>
                            </>
                        }
                        <div className='pt-3 text-center'>Maks ukuran satu file: 500kb, Format: .jpg atau .pdf</div>
                        <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='mt-3'>Akta pendirian perusahaan atau perubahan terakhir</div>
                    <div className='viewDragDrop mt-2' style={{cursor: "pointer"}} onClick={() => handleClick("aktaPerusahaan")}>
                        {
                            (!imageFileAktaPerusahaan && uploadPdfAktaPerusahaan === false) ? 
                            <>
                                <div className='pt-4 text-center'>Masukkan Akta pendirian perusahaan atau perubahan terakhir.</div>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, "aktaPerusahaan")}
                                    accept=".jpg, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputAktaPerusahaan}
                                    id="image"
                                    name="image"
                                />
                            </> : (imageFileAktaPerusahaan) ?
                            <>
                                <img src={imageFileAktaPerusahaan} alt="alt" width="auto" height="120px" className='pt-4 ms-4 text-start' />
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, "aktaPerusahaan")}
                                    accept=".jpg, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputAktaPerusahaan}
                                    id="image"
                                    name="image"
                                />
                                <div className='mt-2 ms-4'>{nameAktaPerusahaan}</div>
                            </> : (uploadPdfAktaPerusahaan === true) &&
                            <>
                                <img src={filePdfQris} alt="alt" width="auto" height="120px" className='pt-4 ms-4 text-start' />
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, "aktaPerusahaan")}
                                    accept=".jpg, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputAktaPerusahaan}
                                    id="image"
                                    name="image"
                                />
                                <div className='mt-2 ms-4'>{nameAktaPerusahaan}</div>
                            </>
                        }
                        <div className='pt-3 text-center'>Maks ukuran satu file: 500kb, Format: .jpg atau .pdf</div>
                        <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='mt-3'>SK Kementerian Kehakiman</div>
                    <div className='viewDragDrop mt-2' style={{cursor: "pointer"}} onClick={() => handleClick("skKementrian")}>
                        {
                            (!imageFileSkKementrian && uploadPdfSkKementrian === false) ? 
                            <>
                                <div className='pt-4 text-center'>Masukan SK Kementerian Kehakiman.</div>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, "skKementrian")}
                                    accept=".jpg, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputSkKementrian}
                                    id="image"
                                    name="image"
                                />
                            </> : (imageFileSkKementrian) ?
                            <>
                                <img src={imageFileSkKementrian} alt="alt" width="auto" height="120px" className='pt-4 ms-4 text-start' />
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, "skKementrian")}
                                    accept="jpg, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputSkKementrian}
                                    id="image"
                                    name="image"
                                />
                                <div className='mt-2 ms-4'>{nameSkKementrian}</div>
                            </> : (uploadPdfSkKementrian === true) &&
                            <>
                                <img src={filePdfQris} alt="alt" width="auto" height="120px" className='pt-4 ms-4 text-start' />
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, "skKementrian")}
                                    accept=".jpg, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputSkKementrian}
                                    id="image"
                                    name="image"
                                />
                                <div className='mt-2 ms-4'>{nameSkKementrian}</div>
                            </>
                        }
                        <div className='pt-3 text-center'>Maks ukuran satu file: 500kb, Format: .jpg atau .pdf</div>
                        <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mt-4 pb-4' >
                        <button className='btn-prev-info-usaha me-2'>Sebelumnya</button>
                        <button className='btn-next-info-usaha ms-2' onClick={() => formDataThirdStepBusenessDocument(profileId === undefined ? 0 : profileId, 1, 200, imageNpwp, imageNib, imageAktaPerusahaan, imageSkKementrian)}>Selanjutnya</button>
                    </div>
                </div>
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
                        <Button onClick={() => formDataThirdStepBusenessDocument(profileId === undefined ? 0 : profileId, 1, 3, imageNpwp, imageNib, imageAktaPerusahaan, imageSkKementrian)} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Simpan</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default FormDokumenUsahaBadanUsaha