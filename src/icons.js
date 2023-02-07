import React from 'react'
import { ReactComponent as DepositIcon } from './media/icons/main-header/deposit.svg'
import { ReactComponent as LinkBankIcon } from './media/icons/main-header/linkbank.svg'
import { ReactComponent as TransferIcon } from './media/icons/main-header/transfer.svg'
import { ReactComponent as WithdrawIcon } from './media/icons/main-header/withdraw.svg'
import { ReactComponent as PaymentIcon } from './media/icons/main-header/mobile-payment.svg'
import { ReactComponent as DepositMmIcon } from './media/icons/main-header/deposit-mm.svg'
import { ReactComponent as WithdrawMmIcon } from './media/icons/main-header/withdraw-mm.svg'

import { ReactComponent as DepositIconBlue } from './media/icons/main-header/depositblue.svg'
import { ReactComponent as LinkBankIconBlue } from './media/icons/main-header/linkbankblue.svg'
import { ReactComponent as TransferIconBlue } from './media/icons/main-header/transferblue.svg'
import { ReactComponent as WithdrawIconBlue } from './media/icons/main-header/withdrawblue.svg'
import { ReactComponent as PaymentIconBlue } from './media/icons/main-header/mobile-paymentblue.svg'

import { ReactComponent as LogoutIcon } from './media/icons/log-out.svg'
import { ReactComponent as SettingIcon } from './media/icons/setting.svg'
import { ReactComponent as IdentityIcon } from './media/icons/identity-icon.svg'
import { ReactComponent as TransferMultiIcon } from './media/icons/transfer-multi.svg'
import { ReactComponent as MobileMoneyIcon } from './media/icons/mobile-money-icon.svg'
import { ReactComponent as HistoryIcon } from './media/icons/history-icon.svg'
import { ReactComponent as TransactionIcon } from './media/icons/transaction-icon.svg'
import { ReactComponent as PolicyIcon } from './media/icons/policy-icon.svg'
import { ReactComponent as SupportIcon } from './media/icons/support-icon.svg'
import { ReactComponent as DownloadFileIcon } from './media/icons/dowload-file-icon.svg'
import { ReactComponent as UploadFileIcon } from './media/icons/upload-file-icon.svg'
import { ReactComponent as CheckFileIcon } from './media/icons/check-file-icon.svg'

const ICONS = {
  NOTIFY_BELL: require('./media/icons/notify-bell.svg'),
  WHITE_ARROW_DOWN: require('./media/icons/white-arrow-down.svg'),
  LOGOUT: <LogoutIcon />,
  SETTING: <SettingIcon />,
  IDENTITY_ICON: <IdentityIcon />,
  TRANSFER_MULTI_ICON: <TransferMultiIcon />,
  MOBILE_MONEY_ICON: <MobileMoneyIcon />,
  TRANSACTION_ICON: <TransactionIcon />,
  HISTORY_ICON: <HistoryIcon />,
  POLICY_ICON: <PolicyIcon />,
  SUPPORT_ICON: <SupportIcon />,
  //
  FACEBOOK: require('./media/icons/facebook.svg'),
  INSTAGRAM: require('./media/icons/instagram.svg'),
  YOUTUBE: require('./media/icons/youtube.svg'),
  SUCCESS: require('./media/icons/approved-white.svg'),
  WAITING: require('./media/icons/waiting-white.svg'),
  REJECT: require('./media/icons/rejected-white.svg'),
  SERVICE1: require('./media/icons/services/s1.svg'),
  SERVICE2: require('./media/icons/services/s2.svg'),
  SERVICE3: require('./media/icons/services/s3.svg'),
  SERVICE4: require('./media/icons/services/s4.svg'),
  SERVICE5: require('./media/icons/services/s5.svg'),
  SERVICE6: require('./media/icons/services/s6.svg'),
  SERVICE7: require('./media/icons/services/s7.svg'),
  SERVICE8: require('./media/icons/services/s8.svg'),
  SERVICE9: require('./media/icons/services/s9.svg'),
  SERVICE10: require('./media/icons/services/s10.svg'),
  SERVICE11: require('./media/icons/services/s11.svg'),
  SERVICE12: require('./media/icons/services/s12.svg'),
  SERVICE_SMALL1: require('./media/icons/services/sm1.svg'),
  SERVICE_SMALL2: require('./media/icons/services/sm2.svg'),
  SERVICE_SMALL3: require('./media/icons/services/sm3.svg'),
  SERVICE_SMALL4: require('./media/icons/services/sm4.svg'),
  SERVICE_SMALL5: require('./media/icons/services/sm5.svg'),
  SERVICE_SMALL6: require('./media/icons/services/sm6.svg'),
  SERVICE_SMALL7: require('./media/icons/services/sm7.svg'),
  SERVICE_SMALL8: require('./media/icons/services/sm8.svg'),
  SERVICE_SMALL9: require('./media/icons/services/sm9.svg'),
  SERVICE_SMALL10: require('./media/icons/services/sm10.svg'),
  SERVICE_SMALL11: require('./media/icons/services/sm11.svg'),
  SERVICE_SMALL12: require('./media/icons/services/sm12.svg'),
  TRANSFER1: require('./media/icons/transfer/tf1.svg'),
  TRANSFER2: require('./media/icons/transfer/tf2.svg'),
  TRANSFER3: require('./media/icons/transfer/tf3.svg'),
  TRANSFER4: require('./media/icons/transfer/tf4.svg'),
  WAITING_ICON: require('./media/icons/waiting.svg'),
  REJECTED_ICON: require('./media/icons/order/rejected.svg'),
  APPROVED_ICON: require('./media/icons/order/approved.svg'),
  REVIEWED_ICON: require('./media/icons/order/confirmed.svg'),
  WAIT_APPROVING_ICON: require('./media/icons/order/approving.svg'),
  DEFAULT_ICON: require('./media/icons/order/default.svg'),


  IN_PROGRESS_ICON: require('./media/icons/order/in-progress1.gif'),
  ICON_CARD: require('./media/icons/icon-card.svg'),

  DEPOSIT_ICON: <DepositIcon />,
  LINK_BANK_ICON: <LinkBankIcon />,
  TRANSFER_ICON: <TransferIcon />,
  WITHDRAW_ICON: <WithdrawIcon />,
  PAYMENT_ICON: <PaymentIcon />,
  DEPOSIT_MM_ICON: <DepositMmIcon />,
  WITHDRAW_MM_ICON: <WithdrawMmIcon />,

  DEPOSIT_ICON_BLUE: <DepositIconBlue />,
  LINK_BANK_ICON_BLUE: <LinkBankIconBlue />,
  TRANSFER_ICON_BLUE: <TransferIconBlue />,
  WITHDRAW_ICON_BLUE: <WithdrawIconBlue />,
  PAYMENT_ICON_BLUE: <PaymentIconBlue />,
  USER_APPROVED: require('./media/icons/order/user-approved.svg'),
  USER_REVIEWED: require('./media/icons/order/user-reviewed.svg'),
  USER_REJECTED: require('./media/icons/order/user-rejected.svg'),
  TRANSACTION_FAIL: require('./media/icons/transaction-fail.svg'),
  TRANSACTION_SUCCESS: require('./media/icons/transaction-success.svg'),
  TRANSACTION_WAITING: require('./media/icons/transaction-waiting.svg'),
  TRASH_RED: require('./media/icons/trash-icon.svg'),
  EDIT_BLUE: require('./media/icons/edit-icon.svg'),
  DOWNLOAD_FILE_ICON: <DownloadFileIcon />,
  UPLOAD_FILE_ICON: <UploadFileIcon />,
  CHECK_FILE_ICON: <CheckFileIcon />,
  // Side menu
  TTDD_ICON: require('./media/icons/side-menu/ttdd.svg'),
  QLGD_ICON: require('./media/icons/side-menu/qlgd.svg'),
  LSGD_ICON: require('./media/icons/side-menu/lsgd.svg'),
  BCTH_ICON: require('./media/icons/side-menu/bcth.svg'),
  BCCT_ICON: require('./media/icons/side-menu/bcct.svg'),
  BCSC_ICON: require('./media/icons/side-menu/report-statement-icon.svg'),
  CDHM_ICON: require('./media/icons/side-menu/cdhm.svg'),
  APPROVING_ICON: require('./media/icons/order/approving-icon.svg'),
  CONFIRMING_ICON: require('./media/icons/order/confirming-icon.svg'),
  REJECTING_ICON: require('./media/icons/order/rejecting-icon.svg'),

  RESULT_ERROR_ICON: require('./media/icons/result/result-error-icon.svg'),
  RESULT_SUCCESS_ICON: require('./media/icons/result/result-success-icon.svg'),
  RESULT_WARNING_ICON: require('./media/icons/result/result-warning-icon.svg'),

  TRANSFER_MULTI_DOWNLOAD: require('./media/icons/transfer-multiple/download-template.svg'),
  TRANSFER_MULTI_UPLOAD: require('./media/icons/transfer-multiple/upload-file-transfer.svg'),
  TRANSFER_MULTI_VALIDATE: require('./media/icons/transfer-multiple/validate-file.svg'),
  TRANSFER_MULTI_NOT_VALID: require('./media/icons/transfer-multiple/not-valid.svg'),
  TRANSFER_MULTI_VALID: require('./media/icons/transfer-multiple/valid.svg'),
  TRANSFER_MULTI_WARNING: require('./media/icons/transfer-multiple/exclamation.svg'),

  SAMPLE_PROVIDER: require('./media/icons/payment/sample-provider.png'),
  CUSTOMER_SEARCH: require('./media/icons/payment/customer-search.svg'),
  SAMPLE_BANK: require('./media/icons/payment/sacom.svg'),
  EWALLET: require('./media/images/logo/logo-small.svg'),
  PACK_DATA: require('./media/icons/payment/pack-data.svg'),
  PACK_INFO: require('./media/icons/payment/pack-info.svg'),
  PACK_DETAIL_INFO: require('./media/icons/payment/pack-detail-info.svg'),
  DEFAULT_TELCO: require('./media/icons/payment/default-telco.jpg'),
}
export default ICONS
