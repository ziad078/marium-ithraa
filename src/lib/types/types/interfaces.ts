import { Child } from "@/features/children"
import { ChildTransferRequest } from "@/features/children/types/interfaces"

export type EvaluationType =
  | "multiple_intelligences"
  | "pride"
  | "renzulli"
  | "holland"
  | "learning_styles"
  | "torrance"

export type EvaluationAttemptStatus =
  | "in_progress"
  | "submitted"
  | "approved"

export interface EvaluationDimension {
  id: string
  evaluationId?: string
  name: string
  code: string
  minScore: number
  maxScore: number
  interpretationRules?: Record<string, unknown> | null
}

export interface EvaluationQuestionAnswer {
  id: string
  questionId?: string
  text: string
  code?: string | null
  order?: number
  scoreValue?: number
}

export interface EvaluationQuestion {
  id: string
  evaluationId?: string
  evaluationDimensionId?: string
  content: string
  order: number
  dimension?: {
    id: string
    code: string
    name: string
  }
  evaluationDimension?: EvaluationDimension
  answers: EvaluationQuestionAnswer[]
}

export interface Evaluation {
  id: string
  title: string
  type: EvaluationType
  institutionId: string
  ageFrom?: number | null
  ageTo?: number | null
  evaluatorTypes?: string[]
  dimensions?: EvaluationDimension[]
  questions?: EvaluationQuestion[]
}

export interface EvaluationAnswer {
  id: string
  attemptId: string
  questionId: string
  selectedAnswerId: string
  evaluationDimensionId: string
  scoreValue?: number
  selectedAnswer?: EvaluationQuestionAnswer
  evaluationDimension?: EvaluationDimension
}

export interface EvaluationAttempt {
  id: string
  parentId: string
  childId: string
  evaluationId: string
  attemptNumber: number
  status: EvaluationAttemptStatus
  score?: number | null
  result?: Record<string, unknown> | null
  startedAt: string
  expiresAt?: string | null
  submittedAt?: string | null
  evaluation?: Evaluation
  child?: Child
  parent?: unknown
  approval?: unknown | null
  answers?: EvaluationAnswer[]
  parentUserId?: string
}

export interface ParentProfile {
  id: string
  userId: string
  phone?: string
  email?: string
  children?: Child[]
  createdAt: string
  updatedAt: string
}

export interface PaymentResponse {
  id: string
  checkoutUrl: string
  expiresAt: string
  status: string
}

export interface CreatePaymentPayload {
  attemptId: string
  amount: number
  currency: string
  returnUrl?: string
}

export interface EvaluationSlot {
  id: string
  childId: string
  status: string
  expiresAt?: string | null
  paymentId?: string | null
  requestType?: string
  createdAt?: string
  updatedAt?: string
  attemptId?: string | null
  payment?: PaymentResponse | null
}

export interface TransferRequestPayload {
  childId: string
  toOrganizationId: string
}

export interface Organization {
  id: string
  name?: string
  organizationName?: string
  type?: string
  createdAt?: string
  updatedAt?: string
}

export interface Class {
  id: string
  name?: string
  gradeId?: string
  organizationId?: string
}

export interface TransferRequest {
  id: string
  childId: string
  fromOrganizationId?: string
  toOrganizationId?: string
  status: string
  message?: string
  createdAt?: string
  updatedAt?: string
  child?: Child
  fromOrganization?: Organization
  toOrganization?: Organization
  requestedBy?: ParentProfile
}

export interface CreateEvaluationDimensionPayload {
  name: string
  code: string
  minScore: number
  maxScore: number
  interpretationRules?: Record<string, unknown> | null
}

export interface CreateEvaluationQuestionAnswerPayload {
  text: string
  scoreValue: number
  code?: string | null
}

export interface CreateEvaluationQuestionPayload {
  content: string
  dimensionCode: string
  order?: number
  answers: CreateEvaluationQuestionAnswerPayload[]
}

export interface CreateEvaluationPayload {
  title: string
  type: EvaluationType
  institutionId: string
  ageFrom?: number | null
  ageTo?: number | null
  evaluatorTypes?: string[]
  dimensions: CreateEvaluationDimensionPayload[]
  questions: CreateEvaluationQuestionPayload[]
}

export interface StartEvaluationPayload {
  childId: string
  expiresAt?: string
  expiresInSeconds?: number
}

export interface AttemptAnswerPayload {
  questionId: string
  selectedAnswerId: string
}

export interface SaveAttemptProgressPayload {
  answers?: AttemptAnswerPayload[]
}

export interface SubmitAttemptPayload {
  answers: AttemptAnswerPayload[]
}

export interface AvailableEvaluationsResponse {
  childId: string
  age: number
  evaluations: Evaluation[]
}

export interface AttemptsResponse {
  attempts: EvaluationAttempt[]
  count: number
}