import { FormControl } from "@themesberg/react-bootstrap";
import React from "react";
import search from "../assets/icon/search_icon.svg"
import uploadIcon from "../assets/icon/upload_icon.svg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const FilterComponentQrisGrup = ({ filterText, onFilter, onClear, title, placeholder, onClickAddMerchant }) => (
    <div className="d-flex justify-content-between align-items-center" style={{ width: "inherit" }}>
        <div className="d-flex justify-content-center align-items-center mb-4">
            <div style={{fontSize: 16, fontWeight: 400,fontFamily: "Nunito", colr: "#383838"}}>{title} </div>
            <div className="d-flex justify-content-between align-items-center ms-3 position-relative" style={{width: 300}}>
                <div className="position-absolute left-3 px-1"><img src={search} alt="search" /></div>
                <FormControl
                    className="ps-5"
                    id="search"
                    type="text"
                    placeholder={placeholder}
                    aria-label="Search Input"
                    value={filterText}
                    onChange={onFilter}
                />
            </div>
        </div>
        <div className="mb-4">
            <button onClick={onClickAddMerchant} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 254, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Tambah merchant grup
            </button>
        </div>
    </div>
);

export const FilterComponentQris = ({ filterText, onFilter, onClear, title, placeholder, onClickAddMerchant, addMerchant }) => (
    <div className="d-flex justify-content-between align-items-center" style={{ width: "inherit" }}>
        <div className="d-flex justify-content-center align-items-center mb-4">
            <div style={{fontSize: 16, fontWeight: 400,fontFamily: "Nunito", colr: "#383838"}}>{title} </div>
            <div className="d-flex justify-content-between align-items-center ms-3 position-relative" style={{width: 300}}>
                <div className="position-absolute left-3 px-1"><img src={search} alt="search" /></div>
                <FormControl
                    className="ps-5"
                    id="search"
                    type="text"
                    placeholder={placeholder}
                    aria-label="Search Input"
                    value={filterText}
                    onChange={onFilter}
                />
            </div>
        </div>
        <div className="d-flex justify-content-end align-items-center mb-4">
            {/* <button className="me-3" style={{ color: "#077E86", fontFamily: "Exo", fontSize: 14, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 200, height: 48, border: "1px solid var(--contoh-secondary-40-warna-utama, #077E86);", borderRadius: 4 }}>
                <img
                    src={uploadIcon}
                    // onClick={() => editInTableHandler(row.number)}
                    style={{ cursor: "pointer" }}
                    alt="icon edit"
                /> Upload dokumen
            </button> */}
            <button onClick={onClickAddMerchant} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 230, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> {addMerchant}
            </button>
        </div>
    </div>
);

export const FilterComponentQrisBrand = ({ filterText, onFilter, onClear, title, placeholder }) => (
    <div className="d-flex justify-content-between align-items-center" style={{ width: "inherit" }}>
        <div className="d-flex justify-content-center align-items-center mb-4">
            <div style={{fontSize: 16, fontWeight: 400,fontFamily: "Nunito", colr: "#383838"}}>{title} </div>
            <div className="d-flex justify-content-between align-items-center ms-3 position-relative" style={{width: 300}}>
                <div className="position-absolute left-3 px-1"><img src={search} alt="search" /></div>
                <FormControl
                    className="ps-5"
                    id="search"
                    type="text"
                    placeholder={placeholder}
                    aria-label="Search Input"
                    value={filterText}
                    onChange={onFilter}
                />
            </div>
        </div>
        <div className="d-flex justify-content-end align-items-center mb-4">
            <button className="me-3" style={{ color: "#077E86", fontFamily: "Exo", fontSize: 14, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 200, height: 48, border: "1px solid var(--contoh-secondary-40-warna-utama, #077E86);", borderRadius: 4 }}>
                    <img
                        src={uploadIcon}
                        // onClick={() => editInTableHandler(row.number)}
                        style={{ cursor: "pointer" }}
                        alt="icon edit"
                    /> Upload dokumen
            </button>
            <button style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 200, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Tambah brand
            </button>
        </div>
    </div>
);

export const FilterComponentQrisOutlet = ({ filterText, onFilter, onClear, title, placeholder }) => (
    <div className="d-flex justify-content-between align-items-center" style={{ width: "inherit" }}>
        <div className="d-flex justify-content-center align-items-center mb-4">
            <div style={{fontSize: 16, fontWeight: 400,fontFamily: "Nunito", colr: "#383838"}}>{title} </div>
            <div className="d-flex justify-content-between align-items-center ms-3 position-relative" style={{width: 300}}>
                <div className="position-absolute left-3 px-1"><img src={search} alt="search" /></div>
                <FormControl
                    className="ps-5"
                    id="search"
                    type="text"
                    placeholder={placeholder}
                    aria-label="Search Input"
                    value={filterText}
                    onChange={onFilter}
                />
            </div>
        </div>
        <div className="d-flex justify-content-end align-items-center mb-4">
            <button className="me-3" style={{ color: "#077E86", fontFamily: "Exo", fontSize: 14, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 200, height: 48, border: "1px solid var(--contoh-secondary-40-warna-utama, #077E86);", borderRadius: 4 }}>
                    <img
                        src={uploadIcon}
                        // onClick={() => editInTableHandler(row.number)}
                        style={{ cursor: "pointer" }}
                        alt="icon edit"
                    /> Upload dokumen
            </button>
            <button style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 200, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Tambah outlet
            </button>
        </div>
    </div>
);

export const FilterComponentQrisOutletDetail = ({ filterText, onFilter, onClear, title, placeholder, onClickAddMerchantDeatil }) => (
    <div className="d-flex justify-content-between align-items-center" style={{ width: "inherit" }}>
        <div className="h5 mb-4" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Info Outlet</div>
        <div className="d-flex justify-content-end align-items-center mb-4">
            {/* <button className="me-3" style={{ color: "#077E86", fontFamily: "Exo", fontSize: 14, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 200, height: 48, border: "1px solid var(--contoh-secondary-40-warna-utama, #077E86);", borderRadius: 4 }}>
                    <img
                        src={uploadIcon}
                        // onClick={() => editInTableHandler(row.number)}
                        style={{ cursor: "pointer" }}
                        alt="icon edit"
                    /> Upload dokumen
            </button> */}
            <button onClick={onClickAddMerchantDeatil} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 200, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Tambah outlet
            </button>
        </div>
    </div>
);

export const FilterComponentQrisSettlementMerchant = ({ filterText, onFilter, onClear, title, placeholder }) => (
    <div className="d-flex justify-content-between align-items-center" style={{ width: "inherit" }}>
        <div className="d-flex justify-content-center align-items-center mb-4">
            <div style={{fontSize: 16, fontWeight: 400,fontFamily: "Nunito", colr: "#383838"}}>{title} </div>
            <div className="d-flex justify-content-between align-items-center ms-3 position-relative" style={{width: 300}}>
                <div className="position-absolute left-3 px-1"><img src={search} alt="search" /></div>
                <FormControl
                    className="ps-5"
                    id="search"
                    type="text"
                    placeholder={placeholder}
                    aria-label="Search Input"
                    value={filterText}
                    onChange={onFilter}
                />
            </div>
        </div>
        <div className="d-flex justify-content-end align-items-center mb-4">
            <button className="me-3" style={{ color: "#077E86", fontFamily: "Exo", fontSize: 14, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 200, height: 48, border: "1px solid var(--contoh-secondary-40-warna-utama, #077E86);", borderRadius: 4 }}>
                    <img
                        src={uploadIcon}
                        // onClick={() => editInTableHandler(row.number)}
                        style={{ cursor: "pointer" }}
                        alt="icon edit"
                    /> Upload dokumen
            </button>
            <button style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 225, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Tambah settlement
            </button>
        </div>
    </div>
);

export const FilterComponentQrisTerminal = ({ filterText, onFilter, onClear, title, placeholder }) => (
    <div className="d-flex justify-content-center align-items-center mb-4">
        <div style={{fontSize: 16, fontWeight: 400,fontFamily: "Nunito", colr: "#383838"}}>{title} </div>
        <div className="d-flex justify-content-between align-items-center ms-3 position-relative" style={{width: 300}}>
            <div className="position-absolute left-3 px-1"><img src={search} alt="search" /></div>
            <FormControl
                className="ps-5"
                id="search"
                type="text"
                placeholder={placeholder}
                aria-label="Search Input"
                value={filterText}
                onChange={onFilter}
            />
        </div>
    </div>
);
export const FilterComponentQrisTerminalDanKasir = ({ filterText, onFilter, onClear, title, placeholder, onClickAddMerchant, addMerchant }) => (
    <div className="d-flex justify-content-between align-items-center pt-4" style={{ width: "inherit", backgroundColor: "#F3F4F5" }}>
        <div className="d-flex justify-content-center align-items-center mb-4">
            <div style={{fontSize: 16, fontWeight: 400,fontFamily: "Nunito", colr: "#383838"}}>{title} </div>
            <div className="d-flex justify-content-between align-items-center ms-3 position-relative" style={{width: 300}}>
                <div className="position-absolute left-3 px-1"><img src={search} alt="search" /></div>
                <FormControl
                    className="ps-5"
                    id="search"
                    type="text"
                    placeholder={placeholder}
                    aria-label="Search Input"
                    value={filterText}
                    onChange={onFilter}
                />
            </div>
        </div>
        <div className="d-flex justify-content-end align-items-center mb-4">
            <button className="me-3" style={{ color: "#077E86", fontFamily: "Exo", fontSize: 14, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 200, height: 48, border: "1px solid #077E86", borderRadius: 6 }}>
                <img
                    src={uploadIcon}
                    // onClick={() => editInTableHandler(row.number)}
                    style={{ cursor: "pointer" }}
                    alt="icon edit"
                /> Upload dokumen
            </button>
            <button onClick={onClickAddMerchant} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 230, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> {addMerchant}
            </button>
        </div>
    </div>
);