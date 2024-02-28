import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "../routes";

// pages
import Presentation from "./Presentation";
import Upgrade from "./Upgrade";
import DashboardOverview from "./dashboard/DashboardOverview";
import DaftarPartner from './DaftarPartner/DaftarPartner';
import DaftarAgen from './DaftarAgen/DaftarAgen';
import DetailAkun from './DetailAkun/DetailAkun';
import RiwayatTransaksi from './RiwayatTransaksi/RiwayatTransaksi';
import Transactions from "./Transactions";
import Settings from "./Settings";
import BootstrapTables from "./tables/BootstrapTables";
import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";
import ListPayment from "./PaymentLink/ListPayment"
import DetailPayment from './PaymentLink/DetailPayment';
import AddPayment from './PaymentLink/AddPayment';
import CustomDesignPayment from './PaymentLink/CustomDesignPayment';
import ListRiwayatSubAccount from './RiwayatSubAccount/ListRiwayatSubAccount';

// documentation pages
import DocsOverview from "./documentation/DocsOverview";
import DocsDownload from "./documentation/DocsDownload";
import DocsQuickStart from "./documentation/DocsQuickStart";
import DocsLicense from "./documentation/DocsLicense";
import DocsFolderStructure from "./documentation/DocsFolderStructure";
import DocsBuild from "./documentation/DocsBuild";
import DocsChangelog from "./documentation/DocsChangelog";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";

import Accordion from "./components/Accordion";
import Alerts from "./components/Alerts";
import Badges from "./components/Badges";
import Breadcrumbs from "./components/Breadcrumbs";
import Buttons from "./components/Buttons";
import Forms from "./components/Forms";
import Modals from "./components/Modals";
import Navs from "./components/Navs";
import Navbars from "./components/Navbars";
import Pagination from "./components/Pagination";
import Popovers from "./components/Popovers";
import Progress from "./components/Progress";
import Tables from "./components/Tables";
import Tabs from "./components/Tabs";
import Tooltips from "./components/Tooltips";
import Toasts from "./components/Toasts";
import TambahAgen from './DaftarAgen/TambahAgen';
import DetailAgen from './DaftarAgen/DetailAgen';
import TambahPartner from './DaftarPartner/TambahPartner';
import DetailPartner from './DaftarPartner/DetailPartner';
import EditPartner from './DaftarPartner/EditPartner';
import EditAgen from './DaftarAgen/EditAgen';
import ListUser from './ManagementUser/ListUser';
import UpdateUser from './ManagementUser/UpdateUser';
import AddUser from './ManagementUser/AddUser';
import ListMenuAccess from './ManagementUser/ListMenuAccess';
import RiwayatTopUp from './TopUp/RiwayatTopUp';
import InvoiceVA from './Invoice/InvoiceVA';
import InvoiceDisbursement from './Invoice/InvoiceDisbursement';
import DetailSettlement from './RiwayatTransaksi/DetailSettlement';
import ReNotifyVA from './HelpDesk/ReNotifyVA';
import DisbursementReport from './Disbursement/DishbursmentReport';
// import AlokasiSaldo from './TopUp/AlokasiSaldo';
import InfoSaldoDanMutasi from './RiwayatSubAccount/InfoSaldoDanMutasi';
import TransferSubAccount from './RiwayatSubAccount/TransferSubAccount';
import SaldoPartner from './RiwayatTransaksi/SaldoPartner';
import DisbursementPage from './Disbursement/DisbursementPage';
import RiwayatDirectDebit from './Riwayat/DirectDebit';
import VaDanPaymentLink from './Riwayat/VaDanPaymentLink';
import Disbursement from './Riwayat/Disbursement';
import InfoSaldoMutasi from './Riwayat/InfoSaldoDanMutasi';
import SettlementPage from './Settlement/SettlementPage';
import DaftarUserDirectDebit from './DirectDebit/DaftarUserDirectDebit';
import EWallet from './RiwayatTransaksi/EWallet';
import DisbursementTimeout from './RiwayatTransaksi/DisbursementTimeout';
import SettlementManual from './Settlement/SettlementManual';
import RiwayatBalance from './RiwayatBalance/RiwayatBalance';
import ExcludeSettlementManual from './Settlement/ExcludeSettlementManual';
import ProsesSettlementManual from './Settlement/ProsesSettlementManual';
import GetBalance from './Transfer/GetBalance';
import TransaksiTopUp from './TopUp/TransaksiTopUp';
import ReNotifyEwallet from './HelpDesk/ReNotifyEwallet';
import QrisTransaksi from './Riwayat/QrisTransaksi';
import QrisSettlement from './Settlement/QrisSettlement';
import RiwayatInvoice from './Invoice/RiwayatInvoice';
import CreateVAUSD from './VAUSD/CreateVAUSD';
import RiwayatVAUSD from './RiwayatTransaksi/RiwayatVAUSD';
import RiwayatFileSFTP from './VAUSD/RiwayatFileSFTP';
import SettlementVAUSDPartner from './Settlement/SettlementVAUSDPartner';
import TransaksiQrisApi from './Riwayat/TransaksiQrisApi';
import ReNotifyQris from './HelpDesk/ReNotifyQris';
import UnSettledTransaction from './Settlement/UnSettledTransaction';
import DaftarMerchantQris from './DaftarMerchantQris/DaftarMerchantQris';
import PilihJenisUsaha from './DaftarMerchantQris/PilihJenisUsaha';
import FormInfoPemilikPerseorangan from './DaftarMerchantQris/FormDataMerchantGrup/FormInfoPemilikPerseorangan';
import FormInfoUsahaPerseorangan from './DaftarMerchantQris/FormDataMerchantGrup/FormInfoUsahaPerseorangan';
import PengaturanMerchant from './DaftarMerchantQris/PengaturanMerchant';
import FormDaftarSettlement from './DaftarMerchantQris/FormDataMerchantGrup/FormDaftarSettlement';
import DetailMerchantGrup from './DaftarMerchantQris/FormDataMerchantGrup/DetailMerchantGrup';
import FormTidakBerbadanHukum from './DaftarMerchantQris/FormDataMerchantGrup/FormTidakBerbadanHukum';
import FormInfoPemilikBadanUsaha from './DaftarMerchantQris/FormDataMerchantGrup/FormInfoPemilikBadanUsaha';
import FormInfoUsahaBadanUsaha from './DaftarMerchantQris/FormDataMerchantGrup/FormInfoUsahaBadanUsaha';
import FormDokumenUsahaBadanUsaha from './DaftarMerchantQris/FormDataMerchantGrup/FormDokumenUsahaBadanUsaha';
import FormInfoPemilik from './DaftarMerchantQris/FormDataMerchantBrand/FormInfoPemilik';
import FormInfoUsaha from './DaftarMerchantQris/FormDataMerchantBrand/FormInfoUsaha';
import FormInfoPemilikOutlet from './DaftarMerchantQris/FormDataMerchantOutlet/FormInfoPemilik';
import FormDokumenUsahaBrandBadanUsaha from './DaftarMerchantQris/FormDataMerchantBrand/FormDokumenUsahaBrandBadanUsaha';
import FormInfoRekeningBrand from './DaftarMerchantQris/FormDataMerchantBrand/FormInfoRekeningBrand';
import DetailMerchantBrand from './DaftarMerchantQris/FormDataMerchantBrand/DetailMerchantBrand';
import FormInfoUsahaOutlet from './DaftarMerchantQris/FormDataMerchantOutlet/FormInfoUsaha';
import FormDokumenUsahaOutletBadanUsaha from './DaftarMerchantQris/FormDataMerchantOutlet/FormDokumenUsahaOutletBadanUsaha';
import FormInfoRekeningOutlet from './DaftarMerchantQris/FormDataMerchantOutlet/FormInfoRekeningOutlet';
import DetailMerchantOutlet from './DaftarMerchantQris/FormDataMerchantOutlet/DetailMerchantOutlet';
import FormTambahSettlement from './DaftarMerchantQris/FormDataMerchantGrup/FormTambahSettlement';
import DetailSettlementGrup from './DaftarMerchantQris/FormDataMerchantGrup/DetailSettlementGrup';

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route {...rest} render={props => ( <> <Preloader show={loaded ? false : true} /> <Component {...props} /> </> ) } />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  return (
    <Route {...rest} render={props => (
      <>
        <Preloader show={loaded ? false : true} />
        <Sidebar />

        <main className="content">
          <Navbar />
          <Component {...props} />
          {/* <Footer toggleSettings={toggleSettings} showSettings={showSettings} /> */}
        </main>
      </>
    )}
    />
  );
};

export default () => (
  <Switch>
    {/* <RouteWithLoader exact path={Routes.Presentation.path} component={Presentation} /> */}
    <RouteWithLoader exact path={Routes.Login.path} component={Signin} />
    {/* <RouteWithLoader exact path={Routes.Signup.path} component={Signup} /> */}
    <RouteWithLoader exact path={Routes.ForgotPassword.path} component={ForgotPassword} />
    <RouteWithLoader exact path={Routes.ResetPassword.path} component={ResetPassword} />
    {/* <RouteWithLoader exact path={Routes.Lock.path} component={Lock} /> */}
    <RouteWithLoader exact path={Routes.NotFound.path} component={NotFoundPage} />
    {/* <RouteWithLoader exact path={Routes.ServerError.path} component={ServerError} /> */}

    {/* pages */}
    <RouteWithSidebar exact path={Routes.DashboardOverview.path} component={DashboardOverview} />
    {/* <RouteWithSidebar exact path={Routes.Upgrade.path} component={Upgrade} /> */}
    <RouteWithSidebar exact path={Routes.Transactions.path} component={Transactions} />
    <RouteWithSidebar exact path={Routes.RiwayatTransaksi.path} component={RiwayatTransaksi} />
    <RouteWithSidebar exact path={Routes.SaldoPartner.path} component={SaldoPartner} />
    <RouteWithSidebar exact path={Routes.DetailSettlement.path} component={DetailSettlement} />
    <RouteWithSidebar exact path={Routes.DaftarPartner.path} component={DaftarPartner}/>
    <RouteWithSidebar exact path={Routes.TambahPartner.path} component={TambahPartner}/>
    <RouteWithSidebar exact path={Routes.DaftarAgen.path} component={DaftarAgen}/>
    <RouteWithSidebar exact path={Routes.TambahAgen.path} component={TambahAgen}/>
    <RouteWithSidebar exact path={Routes.DetailAgen.path} component={DetailAgen}/>
    <RouteWithSidebar exact path={Routes.EditAgen.path} component={EditAgen}/>
    <RouteWithSidebar exact path={Routes.DetailPartner.path} component={DetailPartner}/>
    <RouteWithSidebar exact path={Routes.EditPartner.path} component={EditPartner}/>
    <RouteWithSidebar exact path={Routes.DetailAkun.path} component={DetailAkun}/>
    <RouteWithSidebar exact path={Routes.ListUser.path} component={ListUser}/>
    <RouteWithSidebar exact path={Routes.UpdateUser.path} component={UpdateUser} />
    <RouteWithSidebar exact path={Routes.ListMenuAccess.path} component={ListMenuAccess}/>
    <RouteWithSidebar exact path={Routes.RiwayatTopUp.path} component={RiwayatTopUp}/>
    {/* <RouteWithSidebar exact path={Routes.AlokasiSaldo.path} component={AlokasiSaldo}/> */}
    <RouteWithSidebar exact path={Routes.InvoiceVA.path} component={InvoiceVA}/>
    <RouteWithSidebar exact path={Routes.InvoiceDisbursement.path} component={InvoiceDisbursement}/>
    <RouteWithSidebar exact path={Routes.ReNotifyVA.path} component={ReNotifyVA}/>
    <RouteWithSidebar exact path={Routes.ReNotifyEwallet.path} component={ReNotifyEwallet}/>
    <RouteWithSidebar exact path={Routes.ReNotifyQris.path} component={ReNotifyQris}/>
    <RouteWithSidebar exact path={Routes.RiwayatDisbursement.path} component={DisbursementReport}/>
    {/* <RouteWithSidebar exact path={Routes.DisbursementReport.path} component={DisbursementReport}/> */}
    {/* <RouteWithSidebar exact path={Routes.Settings.path} component={Settings} /> */}
    {/* <RouteWithSidebar exact path={Routes.BootstrapTables.path} component={BootstrapTables} /> */}
    <RouteWithSidebar exact path={Routes.AddUser.path} component={AddUser}/>
    <RouteWithSidebar exact path={Routes.ListPayment.path} component={ListPayment} />
    <RouteWithSidebar exact path={Routes.DetailPayment.path} component={DetailPayment} />
    <RouteWithSidebar exact path={Routes.AddPayment.path} component={AddPayment} />
    <RouteWithSidebar exact path={Routes.CustomDesignPayment.path} component={CustomDesignPayment} />
    <RouteWithSidebar exact path={Routes.ListRiwayatSubAccountAdmin.path} component={ListRiwayatSubAccount} />
    <RouteWithSidebar exact path={Routes.ListRiwayatSubAccount.path} component={ListRiwayatSubAccount} />
    <RouteWithSidebar exact path={Routes.InfoSaldoDanMutasi.path} component={InfoSaldoDanMutasi} />
    {/* revamp menu */}
    <RouteWithSidebar exact path={Routes.Settlement.path} component={SettlementPage} />
    <RouteWithSidebar exact path={Routes.UserDirectDebit.path} component={DaftarUserDirectDebit} />
    <RouteWithSidebar exact path={Routes.InvoiceVASubMenu.path} component={InvoiceVA}/>
    <RouteWithSidebar exact path={Routes.InvoiceDisbursementSubMenu.path} component={InvoiceDisbursement}/>
    <RouteWithSidebar exact path={Routes.RiwayatInvoice.path} component={RiwayatInvoice}/>
    <RouteWithSidebar exact path={Routes.SaldoPartnerMenu.path} component={SaldoPartner} />
    <RouteWithSidebar exact path={Routes.DisbursementPage.path} component={DisbursementPage}/>
    <RouteWithSidebar exact path={Routes.SubAccountTransfer.path} component={TransferSubAccount} />
    {/* admin */}
    <RouteWithSidebar exact path={Routes.VaDanPaymentLinkAdmin.path} component={VaDanPaymentLink} />
    <RouteWithSidebar exact path={Routes.RiwayatDirectDebitAdmin.path} component={RiwayatDirectDebit} />
    <RouteWithSidebar exact path={Routes.DisbursementAdmin.path} component={Disbursement} />
    <RouteWithSidebar exact path={Routes.SubAccountAdmin.path} component={InfoSaldoMutasi} />
    <RouteWithSidebar exact path={Routes.DisbursementTimeout.path} component={DisbursementTimeout} />
    <RouteWithSidebar exact path={Routes.QrisTransaksiAdmin.path} component={QrisTransaksi} />
    <RouteWithSidebar exact path={Routes.TransaksiQrisApiAdmin.path} component={TransaksiQrisApi} />
    <RouteWithSidebar exact path={Routes.ExcludeSettlementManual.path} component={ExcludeSettlementManual} />
    <RouteWithSidebar exact path={Routes.ProsesSettlementManual.path} component={ProsesSettlementManual} />
    <RouteWithSidebar exact path={Routes.VAUSD.path} component={CreateVAUSD} />
    <RouteWithSidebar exact path={Routes.RiwayatFileSFTP.path} component={RiwayatFileSFTP} />
    <RouteWithSidebar exact path={Routes.SettlementVAUSDAdmin.path} component={SettlementVAUSDPartner} />
    <RouteWithSidebar exact path={Routes.UnsettledTransaction.path} component={UnSettledTransaction} />

    <RouteWithSidebar exact path={Routes.DaftarMerchantQris.path} component={DaftarMerchantQris} />
    <RouteWithSidebar exact path={Routes.PilihJenisUsahaQris.path} component={PilihJenisUsaha} />
    <RouteWithSidebar exact path={Routes.FormInfoPemilikPerseorangan.path} component={FormInfoPemilikPerseorangan} />
    <RouteWithSidebar exact path={Routes.FormInfoPemilikPerseoranganFirstStep.path} component={FormInfoPemilikPerseorangan} />
    <RouteWithSidebar exact path={Routes.FormInfoUsahaPerseorangan.path} component={FormInfoUsahaPerseorangan} />
    <RouteWithSidebar exact path={Routes.FormInfoUsahaPerseoranganSecondStep.path} component={FormInfoUsahaPerseorangan} />
    <RouteWithSidebar exact path={Routes.FormInfoPemilikBadanUsaha.path} component={FormInfoPemilikBadanUsaha} />
    <RouteWithSidebar exact path={Routes.FormInfoPemilikBadanUsahaFirstStep.path} component={FormInfoPemilikBadanUsaha} />
    <RouteWithSidebar exact path={Routes.FormDokumenUsahaBadanUsaha.path} component={FormDokumenUsahaBadanUsaha} />
    <RouteWithSidebar exact path={Routes.FormDokumenUsahaBadanUsahaThirdStep.path} component={FormDokumenUsahaBadanUsaha} />
    <RouteWithSidebar exact path={Routes.FormInfoUsahaBadanUsaha.path} component={FormInfoUsahaBadanUsaha} />
    <RouteWithSidebar exact path={Routes.FormInfoUsahaBadanUsahaSecondStep.path} component={FormInfoUsahaBadanUsaha} />
    <RouteWithSidebar exact path={Routes.FormTidakBerbadanHukum.path} component={FormTidakBerbadanHukum} />
    <RouteWithSidebar exact path={Routes.FormTidakBerbadanHukumFirstStep.path} component={FormTidakBerbadanHukum} />
    <RouteWithSidebar exact path={Routes.PengaturanMerchant.path} component={PengaturanMerchant} />
    <RouteWithSidebar exact path={Routes.PengaturanMerchantEdit.path} component={PengaturanMerchant} />
    <RouteWithSidebar exact path={Routes.FormDaftarSettlementEditData.path} component={FormDaftarSettlement} />
    <RouteWithSidebar exact path={Routes.DetailMerchantGrup.path} component={DetailMerchantGrup} />
    <RouteWithSidebar exact path={Routes.FormTambahSettlement.path} component={FormTambahSettlement} />
    <RouteWithSidebar exact path={Routes.FormTambahSettlementEdit.path} component={FormTambahSettlement} />
    <RouteWithSidebar exact path={Routes.DetailSettlementGrupQris.path} component={DetailSettlementGrup} />
    <RouteWithSidebar exact path={Routes.FormInfoPemilikBrand.path} component={FormInfoPemilik} />
    <RouteWithSidebar exact path={Routes.FormInfoPemilikBrandFirstStep.path} component={FormInfoPemilik} />
    <RouteWithSidebar exact path={Routes.FormInfoUsahaBrandSecondStep.path} component={FormInfoUsaha} />
    <RouteWithSidebar exact path={Routes.FormDokumenUsahaBrandThirdStep.path} component={FormDokumenUsahaBrandBadanUsaha} />
    <RouteWithSidebar exact path={Routes.FormInfoRekeningBrand.path} component={FormInfoRekeningBrand} />
    <RouteWithSidebar exact path={Routes.FormInfoRekeningBrandEditStep.path} component={FormInfoRekeningBrand} />
    <RouteWithSidebar exact path={Routes.DetailMerchantBrand.path} component={DetailMerchantBrand} />
    <RouteWithSidebar exact path={Routes.FormInfoPemilikOutlet.path} component={FormInfoPemilikOutlet} />
    <RouteWithSidebar exact path={Routes.FormInfoPemilikOutletFirstStep.path} component={FormInfoPemilikOutlet} />
    <RouteWithSidebar exact path={Routes.FormInfoUsahaOutletSecondStep.path} component={FormInfoUsahaOutlet} />
    <RouteWithSidebar exact path={Routes.FormDokumenUsahaOutletThirdStep.path} component={FormDokumenUsahaOutletBadanUsaha} />
    <RouteWithSidebar exact path={Routes.FormInfoRekeningOutletFourthStep.path} component={FormInfoRekeningOutlet} />
    <RouteWithSidebar exact path={Routes.DetailMerchantOutlet.path} component={DetailMerchantOutlet} />
    {/* partner */}
    <RouteWithSidebar exact path={Routes.VaDanPaymentLink.path} component={VaDanPaymentLink} />
    <RouteWithSidebar exact path={Routes.RiwayatDirectDebit.path} component={RiwayatDirectDebit} />
    <RouteWithSidebar exact path={Routes.Disbursement.path} component={Disbursement} />
    <RouteWithSidebar exact path={Routes.SubAccount.path} component={InfoSaldoMutasi} />
    <RouteWithSidebar exact path={Routes.SettlementVAUSDPartner.path} component={SettlementVAUSDPartner} />
    <RouteWithSidebar exact path={Routes.QrisTransaksi.path} component={QrisTransaksi} />
    <RouteWithSidebar exact path={Routes.TransaksiQrisApi.path} component={TransaksiQrisApi} />

    <RouteWithSidebar exact path={Routes.eWalletAdmin.path} component={EWallet} />
    <RouteWithSidebar exact path={Routes.eWallet.path} component={EWallet} />
    <RouteWithSidebar exact path={Routes.RiwayatVAUSDAdmin.path} component={RiwayatVAUSD} />
    <RouteWithSidebar exact path={Routes.RiwayatVAUSDPartner.path} component={RiwayatVAUSD} />
    <RouteWithSidebar exact path={Routes.SettlementManual.path} component={SettlementManual} />
    <RouteWithSidebar exact path={Routes.RiwayatBalance.path} component={RiwayatBalance} />
    <RouteWithSidebar exact path={Routes.GetBalance.path} component={GetBalance} />
    <RouteWithSidebar exact path={Routes.TransaksiTopup.path} component={TransaksiTopUp} />
    <RouteWithSidebar exact path={Routes.QrisSettlement.path} component={QrisSettlement} />

    {/* components */}
    {/* <RouteWithSidebar exact path={Routes.Accordions.path} component={Accordion} /> */}
    {/* <RouteWithSidebar exact path={Routes.Alerts.path} component={Alerts} /> */}
    {/* <RouteWithSidebar exact path={Routes.Badges.path} component={Badges} /> */}
    {/* <RouteWithSidebar exact path={Routes.Breadcrumbs.path} component={Breadcrumbs} /> */}
    {/* <RouteWithSidebar exact path={Routes.Buttons.path} component={Buttons} /> */}
    {/* <RouteWithSidebar exact path={Routes.Forms.path} component={Forms} /> */}
    {/* <RouteWithSidebar exact path={Routes.Modals.path} component={Modals} /> */}
    {/* <RouteWithSidebar exact path={Routes.Navs.path} component={Navs} /> */}
    {/* <RouteWithSidebar exact path={Routes.Navbars.path} component={Navbars} /> */}
    {/* <RouteWithSidebar exact path={Routes.Pagination.path} component={Pagination} /> */}
    {/* <RouteWithSidebar exact path={Routes.Popovers.path} component={Popovers} /> */}
    {/* <RouteWithSidebar exact path={Routes.Progress.path} component={Progress} /> */}
    {/* <RouteWithSidebar exact path={Routes.Tables.path} component={Tables} /> */}
    {/* <RouteWithSidebar exact path={Routes.Tabs.path} component={Tabs} /> */}
    {/* <RouteWithSidebar exact path={Routes.Tooltips.path} component={Tooltips} /> */}
    {/* <RouteWithSidebar exact path={Routes.Toasts.path} component={Toasts} /> */}

    {/* documentation */}
    {/* <RouteWithSidebar exact path={Routes.DocsOverview.path} component={DocsOverview} /> */}
    {/* <RouteWithSidebar exact path={Routes.DocsDownload.path} component={DocsDownload} /> */}
    {/* <RouteWithSidebar exact path={Routes.DocsQuickStart.path} component={DocsQuickStart} /> */}
    {/* <RouteWithSidebar exact path={Routes.DocsLicense.path} component={DocsLicense} /> */}
    {/* <RouteWithSidebar exact path={Routes.DocsFolderStructure.path} component={DocsFolderStructure} /> */}
    {/* <RouteWithSidebar exact path={Routes.DocsBuild.path} component={DocsBuild} /> */}
    {/* <RouteWithSidebar exact path={Routes.DocsChangelog.path} component={DocsChangelog} /> */}

    <Redirect to={Routes.NotFound.path} />
  </Switch>
);
