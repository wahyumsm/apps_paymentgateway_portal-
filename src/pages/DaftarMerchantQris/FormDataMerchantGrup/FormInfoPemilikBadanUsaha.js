import React, { useRef, useState } from 'react'
import alertIconYellow from '../../../assets/icon/note_icon_grey.svg'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const FormInfoPemilikBadanUsaha = () => {
    const hiddenFileInputKtp = useRef(null)
    const [imageFileKtp, setImageFileKtp] = useState(null)
    const [imageKtp, setImageKtp] = useState(null)
    const [nameImageKtp, setNameImageKtp] = useState("")
    const [uploadKtp, setUploadKtp] = useState(false)

    const handleClickKtp = () => {
        hiddenFileInputKtp.current.click();
    };

    const handleFileChangeKtp = (event) => {
        if(event.target.files[0]) {
            setImageKtp(event.target.files[0])
            setNameImageKtp(event.target.files[0].name)
            if (parseFloat(event.target.files[0].size / 1024).toFixed(2) > 500) {
                setUploadKtp(true)
                setImageFileKtp(imageFileKtp)
            }
            else {
                setUploadKtp(false)
                const reader = new FileReader()
                reader.addEventListener("load", () => {
                    setImageFileKtp(reader.result)
                })
                reader.readAsDataURL(event.target.files[0])
            }
        }
    }
    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah merchant</span></span>
            <div className="d-flex justify-content-start align-items-center head-title"> 
                <FontAwesomeIcon className="me-3 mt-1" style={{cursor: "pointer"}} />
                <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Formulir data merchant</h2>
            </div>
            <div className='pb-4 pt-3'>
                <div className='d-flex justify-content-start align-items-center' style={{ marginLeft: 25, marginRight: 25 }}>
                    <div style={{ borderRadius: "50%", width: 15, height: 15, background: "#077E86" }}></div>
                    <div style={{ width: "100%", height: 4, background: "#F0F0F0" }}></div>
                </div>
                <div className='d-flex justify-content-between align-items-center mt-2' style={{ fontSize: 12, color: "#383838", fontFamily: "Nunito" }}>
                    <div>Info pemilik</div>
                    <div>Info usaha</div>
                    <div>Dokumen usaha</div>
                </div>
            </div>
            <div className='alert-form-info-pemilik py-4'>
                <img src={alertIconYellow} alt="icon" />
                <div className='ms-2'>Semua data pada setiap form harus diisi</div>
            </div>
            <div className='base-content my-4'>
                <div className='my-1' style={{ fontFamily: "Nunito", fontSize: 14}}>Kewarganegaraan pemilik usaha</div>
                <div className='d-flex justify-content-start align-items-center py-2'>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="wni"
                            name='kewarganegaraan'
                            value={100}
                            // checked={kewarganegaraan === 100 && true}
                            // onChange={(e) => handleOnChangeCheckBoxKewarganegaraan(e)}
                        />
                        <label
                            className="form-check-label"
                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                            for="wni"
                        >
                            Pemilik usaha / Direktur
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="wna"
                            name='kewarganegaraan'
                            value={101}
                            // checked={kewarganegaraan === 101 && true}
                            // onChange={(e) => handleOnChangeCheckBoxKewarganegaraan(e)}
                        />
                        <label
                            className="form-check-label"
                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                            for="wna"
                        >
                            Staff perwakilan
                        </label>
                    </div>
                </div>
                <div className='my-1' style={{ fontFamily: "Nunito", fontSize: 14}}>Kewarganegaraan pemilik usaha</div>
                <div className='d-flex justify-content-start align-items-center py-2'>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="wni"
                            name='kewarganegaraan'
                            value={100}
                            // checked={kewarganegaraan === 100 && true}
                            // onChange={(e) => handleOnChangeCheckBoxKewarganegaraan(e)}
                        />
                        <label
                            className="form-check-label"
                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                            for="wni"
                        >
                            Warga Negara Indonesia
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="wna"
                            name='kewarganegaraan'
                            value={101}
                            // checked={kewarganegaraan === 101 && true}
                            // onChange={(e) => handleOnChangeCheckBoxKewarganegaraan(e)}
                        />
                        <label
                            className="form-check-label"
                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                            for="wna"
                        >
                            Warga Negara Asing
                        </label>
                    </div>
                </div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama pemilik usaha sesuai akta pendirian / perubahan terakhir</div>
                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                    <input name="userName" className='input-text-form' placeholder='Masukan nama lengkap' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                </div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nomor eKTP pemilik usaha sesuai akta pendirian / perubahan terakhir</div>
                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                    <input name="numberId" className='input-text-form' placeholder='Masukan nomor eKTP pemilik' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                </div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Foto eKTP pemilik usaha sesuai akta pendirian / perubahan terakhir</div>
                <div className='viewDragDrop mt-2' onClick={handleClickKtp}  style={{cursor: "pointer"}}>
                    {
                        !imageFileKtp ?
                        <>
                            <div className='pt-4 text-center'>Masukkan foto eKTP.</div>
                            <input
                                type="file"
                                onChange={handleFileChangeKtp}
                                accept=".jpg"
                                style={{ display: "none" }}
                                ref={hiddenFileInputKtp}
                                id="image"
                                name="image"
                            />
                        </>
                            :
                        <>
                            <img src={imageFileKtp} alt="alt" width="auto" height="120px" className='pt-4 ms-4 text-start' />
                            <input
                                type="file"
                                onChange={handleFileChangeKtp}
                                accept=".jpg"
                                style={{ display: "none" }}
                                ref={hiddenFileInputKtp}
                                id="image"
                                name="image"
                            />
                            <div className='mt-2 ms-3'>{nameImageKtp}</div>
                        </>
                    }
                    <div className='pt-3 text-center'>Maks ukuran satu file: 500kb, Format .jpg</div>
                    <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                </div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>No telepon pemilik usaha</div>
                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                    <input name="numberId" className='input-text-form' placeholder='Masukan no telepon' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                </div>
                <div className='text-end mt-4'>
                    <button 
                        className="btn-next-active mb-4"
                    >
                        Selanjutnya
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FormInfoPemilikBadanUsaha