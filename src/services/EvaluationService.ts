import { api } from "@/lib/api/api"
import { Endpoint, Methods } from "@/lib/types/enums"
import {
  AvailableEvaluationsResponse,
  CreateEvaluationPayload,
  Evaluation,
  EvaluationAttempt,
  EvaluationSlot,
  SaveAttemptProgressPayload,
  StartEvaluationPayload,
  SubmitAttemptPayload,
  AttemptsResponse,
} from "@/lib/types/types/interfaces"
import type {
  OwnerClassEvaluationStatus,
  OwnerClassEvaluationSummary,
  OwnerEvaluationFiltersResponse,
  OwnerEvaluationReportsResponse,
} from "@/features/evaluations/api"
import { normalizeEvaluationAttempt } from "@/lib/helpers/data-normalizers"

const buildQueryString = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value)
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ""
}

export const EvaluationService = {
  async getEvaluations(): Promise<Evaluation[]> {
    return api.client<Evaluation[]>(`/${Endpoint.EVALUATIONS}`)
  },

  async getEvaluationDetails(evaluationId: string): Promise<Evaluation> {
    return api.client<Evaluation>(
      `/${Endpoint.EVALUATIONS}/${encodeURIComponent(evaluationId)}/${Endpoint.DETAILS}`,
    )
  },

  async getEvaluationForm(evaluationId: string): Promise<Evaluation> {
    return api.client<Evaluation>(
      `/${Endpoint.EVALUATIONS}/${encodeURIComponent(evaluationId)}/${Endpoint.FORM}`,
    )
  },

  async getAvailableEvaluationsForChild(childId: string) {
    return api.client<AvailableEvaluationsResponse>(
      `/${Endpoint.EVALUATIONS}/${Endpoint.AVAILABLE}/${encodeURIComponent(childId)}`,
    )
  },

  async startEvaluation(
    evaluationId: string,
    data: StartEvaluationPayload,
  ): Promise<EvaluationAttempt> {
    const result = await api.client<EvaluationAttempt>(
      `/${Endpoint.EVALUATIONS}/${encodeURIComponent(evaluationId)}/${Endpoint.START}`,
      {
        method: Methods.POST,
        body: JSON.stringify(data),
      },
    )
    return normalizeEvaluationAttempt(result)
  },

  async getAttempts(filters?: {
    status?: string
    evaluationId?: string
    childId?: string
  }): Promise<AttemptsResponse> {
    const query = buildQueryString({
      status: filters?.status,
      evaluationId: filters?.evaluationId,
      childId: filters?.childId,
    })

    return api.client<AttemptsResponse>(`/${Endpoint.ATTEMPTS}${query}`)
  },

  async getAttemptById(attemptId: string): Promise<EvaluationAttempt> {
    const result = await api.client<EvaluationAttempt>(
      `/${Endpoint.ATTEMPTS}/${encodeURIComponent(attemptId)}`,
    )
    return normalizeEvaluationAttempt(result)
  },

  async getAttemptsForChild(childId: string): Promise<AttemptsResponse> {
    return api.client<AttemptsResponse>(
      `/${Endpoint.ATTEMPTS}/${Endpoint.CHILD}/${encodeURIComponent(childId)}`,
    )
  },

  async saveAttemptProgress(
    attemptId: string,
    data: SaveAttemptProgressPayload,
  ): Promise<EvaluationAttempt> {
    const result = await api.client<EvaluationAttempt>(
      `/${Endpoint.ATTEMPTS}/${encodeURIComponent(attemptId)}/${Endpoint.SAVE}`,
      {
        method: Methods.PATCH,
        body: JSON.stringify(data),
      },
    )
    return normalizeEvaluationAttempt(result)
  },

  async submitAttempt(
    attemptId: string,
    data: SubmitAttemptPayload,
  ): Promise<EvaluationAttempt> {
    const result = await api.client<EvaluationAttempt>(
      `/${Endpoint.ATTEMPTS}/${encodeURIComponent(attemptId)}/${Endpoint.SUBMIT}`,
      {
        method: Methods.POST,
        body: JSON.stringify(data),
      },
    )
    return normalizeEvaluationAttempt(result)
  },

  async approveAttempt(attemptId: string): Promise<EvaluationAttempt> {
    const result = await api.client<EvaluationAttempt>(
      `/${Endpoint.ATTEMPTS}/${encodeURIComponent(attemptId)}/${Endpoint.APPROVE}`,
      {
        method: Methods.POST,
      },
    )
    return normalizeEvaluationAttempt(result)
  },

  async openPrivateMainSlot(childId: string): Promise<EvaluationSlot> {
    return api.client<EvaluationSlot>(
      `/${Endpoint.ATTEMPTS}/${encodeURIComponent(childId)}/${Endpoint.START}`,
      {
        method: Methods.POST,
      },
    )
  },

  async requestPrivateRetake(childId: string): Promise<EvaluationSlot> {
    return api.client<EvaluationSlot>(
      `/${Endpoint.ATTEMPTS}/${encodeURIComponent(childId)}/${Endpoint.RETAKE}`,
      {
        method: Methods.POST,
      },
    )
  },

  async requestPrivateExtraAttempt(childId: string): Promise<EvaluationSlot> {
    return api.client<EvaluationSlot>(
      `/${Endpoint.ATTEMPTS}/${encodeURIComponent(childId)}/${Endpoint.REQUEST_EXTRA}`,
      {
        method: Methods.POST,
      },
    )
  },

  async createEvaluation(
    payload: CreateEvaluationPayload,
  ): Promise<Evaluation> {
    return api.client<Evaluation>(`/${Endpoint.EVALUATIONS}`, {
      method: Methods.POST,
      body: JSON.stringify(payload),
    })
  },

  async getOwnerEvaluationFilters(): Promise<OwnerEvaluationFiltersResponse> {
    return api.client<OwnerEvaluationFiltersResponse>(
      `/${Endpoint.EVALUATIONS}/${Endpoint.OWNER}/${Endpoint.FILTERS}`,
    )
  },

  async getOwnerEvaluationReports(
    evaluationId?: string,
  ): Promise<OwnerEvaluationReportsResponse> {
    const query = evaluationId ? `?evaluationId=${encodeURIComponent(evaluationId)}` : ""

    return api.client<OwnerEvaluationReportsResponse>(
      `/${Endpoint.EVALUATIONS}/${Endpoint.OWNER}/${Endpoint.REPORTS}${query}`,
    )
  },

  async getOwnerClassEvaluationSummary(
    classId: string,
    evaluationId: string,
  ): Promise<OwnerClassEvaluationSummary> {
    return api.client<OwnerClassEvaluationSummary>(
      `/${Endpoint.EVALUATIONS}/${Endpoint.OWNER}/${Endpoint.CLASSES}/${encodeURIComponent(
        classId,
      )}/${Endpoint.EVALUATIONS}/${encodeURIComponent(evaluationId)}/${Endpoint.SUMMARY}`,
    )
  },

  async getOwnerClassEvaluationStatus(
    classId: string,
    evaluationId: string,
  ): Promise<OwnerClassEvaluationStatus> {
    return api.client<OwnerClassEvaluationStatus>(
      `/${Endpoint.EVALUATIONS}/${Endpoint.OWNER}/${Endpoint.CLASSES}/${encodeURIComponent(
        classId,
      )}/${Endpoint.EVALUATIONS}/${encodeURIComponent(evaluationId)}/${Endpoint.STATUS}`,
    )
  },

  async sendOwnerEvaluationReminder(childId: string) {
    return api.client(`/${Endpoint.EVALUATIONS}/${Endpoint.OWNER}/${Endpoint.CHILDREN}/${encodeURIComponent(
      childId,
    )}/${Endpoint.REMINDER}`, {
      method: Methods.POST,
    })
  },
}
