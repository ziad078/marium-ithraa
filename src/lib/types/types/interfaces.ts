import { Child } from "@/features/children"

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