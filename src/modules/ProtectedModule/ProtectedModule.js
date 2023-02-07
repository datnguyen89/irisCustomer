import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import DefaultLayout from '../../layouts/DefaultLayout'
import { PAGES } from '../../utils/constant'
// Pages
import HomePage from '../../pages/HomePage/HomePage'
import IdentityInfoPage from '../../pages/IdentityInfoPage/IdentityInfoPage'
import TransactionManagePage from '../../pages/TransactionManagePage'
import TransactionHistoryPage from '../../pages/TransactionHistoryPage'
import TermsOfUsePage from '../../pages/TermsOfUsePage'
import SupportPage from '../../pages/SupportPage'
import AboutUsPage from '../../pages/AboutUsPage'
import ContactPage from '../../pages/ContactPage'
import PolicyPage from '../../pages/PolicyPage'
import PhoneCardPage from '../../pages/PhoneCardPage/PhoneCardPage'
import PrepaidPage from '../../pages/PrepaidPage/PrepaidPage'
import PostpaidPage from '../../pages/PostpaidPage/PostpaidPage'
import PhoneDataPage from '../../pages/PhoneDataPage/PhoneDataPage'
import CardDataPage from '../../pages/CardDataPage/CardDataPage'
import DepositPage from '../../pages/DepositPage/DepositPage'
import TransferWalletPage from '../../pages/TransferWalletPage/TransferWalletPage'
import TransferMultiplePage from '../../pages/TransferMultiplePage/TransferMultiplePage'
import WithdrawFromMmPage from '../../pages/WithdrawFromMmPage/WithdrawFromMmPage'
import DepositToMmPage from '../../pages/DepositToMmPage/DepositToMmPage'
import LinkBankPage from '../../pages/LinkBankPage/LinkBankPage'
import AddLinkPage from '../../pages/AddLinkPage/AddLinkPage'
import WithdrawPage from '../../pages/WithdrawPage/WithdrawPage'
import ReportSummaryPage from '../../pages/ReportSummaryPage'
import ReportDetailPage from '../../pages/ReportDetailPage'
import LimitSettingPage from '../../pages/LimitSettingPage'
import ResultTransactionPage from '../../pages/ResultTransactionPage'
import DepositEditPage from '../../pages/DepositPage/DepositEditPage'
import WithdrawEditPage from '../../pages/WithdrawPage/WithdrawEditPage'
import TransferWalletEditPage from '../../pages/TransferWalletPage/TransferWalletEditPage'
import DepositToMmEditPage from '../../pages/DepositToMmPage/DepositToMmEditPage'
import WithdrawFromMmEditPage from '../../pages/WithdrawFromMmPage/WithdrawFromMmEditPage'
import TransferMultipleEditPage from '../../pages/TransferMultipleEditPage'
import PackDataPage from '../../pages/PackDataPage'
import PayBillPage from '../../pages/PayBillPage'
import WaterBillPage from '../../pages/WaterBillPage'
import ReportStatementPage from '../../pages/ReportStatementPage'

const ProtectedModule = (props) => {
  return (
    <DefaultLayout>
      <Switch>
        <Route
          exact path={PAGES.HOME.PATH}
          component={HomePage} />
        <Route
          exact path={PAGES.IDENTITY.PATH}
          component={IdentityInfoPage} /> {/*Thông tin định danh*/}
        <Route
          exact path={PAGES.TRANSACTION_MANAGE.PATH}
          component={TransactionManagePage} /> {/*Quản lý yêu cầu*/}
        <Route
          exact path={PAGES.TRANSACTION_HISTORY.PATH}
          component={TransactionHistoryPage} /> {/*Lịch sử giao dịch*/}
        <Route
          exact path={PAGES.TERM_OF_USE.PATH}
          component={TermsOfUsePage} /> {/*Điều khoản sử dụng*/}
        <Route
          exact path={PAGES.SUPPORT.PATH}
          component={SupportPage} /> {/*Trợ giúp*/}
        <Route
          exact path={PAGES.ABOUT_US.PATH}
          component={AboutUsPage} /> {/*Giới thiệu*/}
        <Route
          exact path={PAGES.CONTACT.PATH}
          component={ContactPage} /> {/*Liên hệ*/}
        <Route
          exact path={PAGES.POLICY.PATH}
          component={PolicyPage} /> {/*Chính sách*/}


        <Route
          exact path={`${PAGES.PAY_BILL.PATH}/:ProductServiceID`}
          component={PayBillPage} /> {/*Thanh toán hóa đơn*/}
        <Route
          exact path={`${PAGES.PREPAID.PATH}/:ProductServiceID`}
          component={PrepaidPage} /> {/*Nạp tiền điện thoại trả trước*/}
        <Route
          exact path={`${PAGES.POSTPAID.PATH}/:ProductServiceID`}
          component={PostpaidPage} /> {/*Nạp tiền điện thoại trả sau*/}
        <Route
          exact path={`${PAGES.PHONE_CARD.PATH}/:ProductServiceID`}
          component={PhoneCardPage} /> {/*Mã thẻ*/}
        <Route
          exact path={`${PAGES.PACK_DATA.PATH}/:ProductServiceID`}
          component={PackDataPage} /> {/*Gói data*/}


        <Route
          exact path={PAGES.PHONE_DATA.PATH}
          component={PhoneDataPage} /> {/*Nạp data*/}
        <Route
          exact path={PAGES.CARD_DATA.PATH}
          component={CardDataPage} /> {/*Mã thẻ data*/}
        <Route
          exact path={PAGES.WATER_BILL.PATH}
          component={WaterBillPage} /> {/*Thanh toán hóa đơn*/}

        <Route
          exact path={PAGES.DEPOSIT.PATH}
          component={DepositPage} /> {/*Nạp tiền*/}
        <Route
          exact path={PAGES.TRANSFER_WALLET.PATH}
          component={TransferWalletPage} /> {/*Chuyển tiền ví*/}
        <Route
          exact path={PAGES.TRANSFER_MULTIPLE.PATH}
          component={TransferMultiplePage} /> {/*Chuyển tiền theo lô*/}
        <Route
          exact path={PAGES.WITHDRAW_FROM_MM.PATH}
          component={WithdrawFromMmPage} /> {/*Nhận chuyển tiền từ MM*/}
        <Route
          exact path={PAGES.DEPOSIT_TO_MM.PATH}
          component={DepositToMmPage} /> {/*Chuyển tiền tới MM*/}
        <Route
          exact path={PAGES.LINK_BANK.PATH}
          component={LinkBankPage} /> {/*Liên kết*/}
        <Route
          exact path={PAGES.ADD_LINK.PATH}
          component={AddLinkPage} /> {/*Thêm liên kết*/}
        <Route
          exact path={PAGES.WITHDRAW.PATH}
          component={WithdrawPage} /> {/*Rút tiền*/}
        <Route
          exact path={PAGES.REPORT_SUMMARY.PATH}
          component={ReportSummaryPage} /> {/*Báo cáo tổng hợp*/}
        <Route
          exact path={PAGES.REPORT_DETAIL.PATH}
          component={ReportDetailPage} /> {/*Báo cáo chi tiết*/}
        <Route
          exact path={PAGES.REPORT_STATEMENT.PATH}
          component={ReportStatementPage} /> {/*Báo cáo sao kê*/}
        <Route
          exact path={PAGES.LIMIT_SETTING.PATH}
          component={LimitSettingPage} /> {/*Cài đặt hạn mức*/}
        <Route
          exact path={PAGES.RESULT_TRANSACTION.PATH}
          component={ResultTransactionPage} /> {/*Kết quả giao dịch*/}

        <Route
          exact path={PAGES.DEPOSIT_EDIT.PATH}
          component={DepositEditPage} />
        <Route
          exact path={PAGES.WITHDRAW_EDIT.PATH}
          component={WithdrawEditPage} />
        <Route
          exact path={PAGES.TRANSFER_WALLET_EDIT.PATH}
          component={TransferWalletEditPage} />
        <Route
          exact path={PAGES.DEPOSIT_MM_EDIT.PATH}
          component={DepositToMmEditPage} />
        <Route
          exact path={PAGES.WITHDRAW_MM_EDIT.PATH}
          component={WithdrawFromMmEditPage} />
        <Route
          exact path={PAGES.TRANSFER_MULTIPLE_EDIT.PATH}
          component={TransferMultipleEditPage} />


      </Switch>
    </DefaultLayout>
  )

}

ProtectedModule.propTypes = {}

export default ProtectedModule