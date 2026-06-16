"use client"

import { useState } from "react"
import { showErrorToast, showSuccessToast } from "@/lib/toast/app-toast"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import {
  useApproveCapacityRequest,
  useCapacityRequests,
  useRejectCapacityRequest,
} from "@/features/capacity-requests"
import type { CapacityRequest } from "@/features/capacity-requests"
const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
}

export default function AdminCapacityRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("pending")
  const { data, isLoading } = useCapacityRequests(statusFilter || undefined)

  const capacityRequests = data?.capacityRequests ?? []

  return (
    <>
      <SiteHeader titleKey="Features.CapacityRequests.title" />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : capacityRequests.length === 0 ? (
          <p className="text-muted-foreground">No capacity requests found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Child Name</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {capacityRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.childName}</TableCell>
                  <TableCell>{req.parentName}</TableCell>
                  <TableCell>{req.parentPhone}</TableCell>
                  <TableCell>{req.childGrade ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant[req.status]}>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {req.status === "pending" && (
                      <CapacityRequestActions request={req} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  )
}

function CapacityRequestActions({ request }: { request: CapacityRequest }) {
  const approveMutation = useApproveCapacityRequest()
  const rejectMutation = useRejectCapacityRequest()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync({ id: request.id })
      showSuccessToast({ raw: "Capacity request approved" })
    } catch {
      showErrorToast({ raw: "Failed to approve" })
    }
  }

  const handleReject = async () => {
    try {
      await rejectMutation.mutateAsync({ id: request.id, reason: rejectReason || undefined })
      setRejectOpen(false)
      setRejectReason("")
      showSuccessToast({ raw: "Capacity request rejected" })
    } catch {
      showErrorToast({ raw: "Failed to reject" })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={handleApprove} disabled={approveMutation.isPending}>
        Approve
      </Button>
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="destructive">
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Reason for rejection (optional)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <Button
              onClick={handleReject}
              variant="destructive"
              disabled={rejectMutation.isPending}
            >
              Confirm Reject
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
