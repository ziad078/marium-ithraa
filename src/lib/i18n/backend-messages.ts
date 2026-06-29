import { useTranslations } from "next-intl"

export const backendMessageMap: Record<string, string> = {
  "Child created successfully": "Backend.childCreated",
  "Child already exists in another school. Transfer requested.": "Backend.transferRequested",
  "Deleted successfully": "Backend.deleted",
  "Logged out": "Backend.loggedOut",
  "Email verified successfully": "Backend.emailVerified",
  "file uploaded successfully": "Backend.fileUploaded",
  "Reminder sent successfully": "Backend.reminderSent",
  "Verification email queued successfully": "Backend.verificationEmailQueued",
  "child asigned successfully": "Backend.childAssigned",
  "Child already exists in your school": "Backend.childExists",
  "Child limit reached": "Backend.childLimitReached",
  "Parent has reached the child limit": "Backend.parentChildLimitReached",
  "Cannot transfer private child - only organization children can be transferred": "Backend.cannotTransferPrivate",
  "Cannot approve transfer for private child": "Backend.cannotApprovePrivateTransfer",
  "Transfer request is already resolved": "Backend.transferAlreadyResolved",
  "User already exists": "Backend.userAlreadyExists",
  "Email already in use": "Backend.emailInUse",
  "Phone number already in use": "Backend.phoneInUse",
  "teacher already exits": "Backend.teacherAlreadyExists",
  "Maximum attempts reached": "Backend.maxAttemptsReached",
  "Attempt already approved": "Backend.attemptAlreadyApproved",
  "Only submitted attempts can be approved": "Backend.onlySubmittedCanBeApproved",
  "Attempt is locked": "Backend.attemptLocked",
  "Finish or submit the current attempt before starting another": "Backend.finishCurrentAttempt",
  "Retake is not allowed after approval": "Backend.retakeNotAllowed",
  "No evaluation slot is available": "Backend.noSlotAvailable",
  "Main attempt already started or completed for this child": "Backend.mainAttemptStarted",
  "Complete the main attempt before retake": "Backend.completeMainAttempt",
  "Retake already used": "Backend.retakeAlreadyUsed",
  "Both free attempts must be completed before": "Backend.freeAttemptsRequired",
  "An extra attempt is already in progress or awaiting payment": "Backend.extraAttemptInProgress",
  "Extra attempt already awaiting approval": "Backend.extraAttemptAwaitingApproval",
  "Extra attempt does not require approval": "Backend.extraAttemptNoApproval",
  "Payment is not required for this attempt": "Backend.paymentNotRequired",
  "No payment record linked to this attempt": "Backend.noPaymentRecord",
  "This deal is closed": "Backend.dealClosed",
  "Deal deadline has passed": "Backend.dealDeadlinePassed",
  "Only selected proposals can be approved": "Backend.onlySelectedProposals",
  "Organization is already approved": "Backend.orgAlreadyApproved",
  "Organization is already rejected": "Backend.orgAlreadyRejected",
  "Organization must be approved before performing this operation": "Backend.orgMustBeApproved",
  "Duplicate dimension codes": "Backend.duplicateDimensionCodes",
  "Dimension code not found": "Backend.dimensionCodeNotFound",
  "Only SAR currency is supported": "Backend.onlySARSupported",
  "Only failed or expired payments can be retried": "Backend.onlyFailedCanRetry",
  "Maximum retries exceeded": "Backend.maxRetriesExceeded",
  "Activity already has a start time": "Backend.activityHasStartTime",
  "Insufficient role": "Backend.insufficientRole",
  "you aren't allowed to access these data": "Backend.noAccessToData",
  "Refresh token missing": "Backend.refreshTokenMissing",
  "Session compromised": "Backend.sessionCompromised",
  "Cannot logout this session": "Backend.cannotLogoutSession",
  "Invalid token type": "Backend.invalidTokenType",
  "Payment does not belong to this user": "Backend.paymentNotOwned",
  "Something went wrong. Please try again.": "Backend.somethingWentWrong",
  "Your organization must be approved before you can perform this action.": "Backend.orgApprovalRequired",
  "Your session has expired. Please sign in again.": "Backend.sessionExpired",
  "You do not have permission to perform this action.": "Backend.noPermission",
  "The requested resource was not found.": "Backend.notFound",
  "This organization status has already changed. Please refresh.": "Backend.orgStatusChanged",
  "This flow is no longer available. Please use evaluations instead.": "Backend.flowNotAvailable",
  "Unable to create child": "Backend.unableToCreateChild",
  "Unable to search parent": "Backend.unableToSearchParent",
  "Unable to load child": "Backend.unableToLoadChild",
  "Unable to request transfer": "Backend.unableToRequestTransfer",
}

type TranslateFn = (key: string, values?: Record<string, string | number>) => string

const dynamicPatterns: { pattern: RegExp; keyTemplate: (match: RegExpMatchArray) => { key: string; params: Record<string, string> } }[] = [
  {
    pattern: /^Parent has reached the child limit \((\d+)\)/,
    keyTemplate: (m) => ({ key: "Backend.parentChildLimitReachedWithMax", params: { max: m[1] } }),
  },
  {
    pattern: /^Duplicate dimension codes: (.+)$/,
    keyTemplate: (m) => ({ key: "Backend.duplicateDimensionCodesWithValue", params: { codes: m[1] } }),
  },
  {
    pattern: /^Dimension code "(.+)" not found$/,
    keyTemplate: (m) => ({ key: "Backend.dimensionCodeNotFoundWithValue", params: { code: m[1] } }),
  },
]

export function translateBackendMessage(msg: string, t: TranslateFn): string {
  const exact = backendMessageMap[msg]
  if (exact) return t(exact)

  for (const { pattern, keyTemplate } of dynamicPatterns) {
    const match = msg.match(pattern)
    if (match) {
      const { key, params } = keyTemplate(match)
      return t(key, params)
    }
  }

  return msg
}

export function useTranslateBackend() {
  const t = useTranslations("Backend")
  return (msg: string) => translateBackendMessage(msg, t)
}
