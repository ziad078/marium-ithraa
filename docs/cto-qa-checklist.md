# CTO QA Checklist

Automated tests are not configured in this project yet. Use this checklist as
the minimum smoke coverage for the organization approval hardening pass.

## Organization Approval Flow

- Organization signup completes and shows the pending approval success state.
- Pending organization owner can sign in but sees the blocked dashboard message.
- Pending organization owner cannot access direct operational URLs:
  - `/dashboards/organization/grades`
  - `/dashboards/organization/classes`
  - `/dashboards/organization/children`
  - `/dashboards/organization/teachers`
  - `/dashboards/organization/employees`
  - `/dashboards/organization/child-transfers`
- Header navigation hides operational organization links for pending and rejected organizations.
- Admin organizations page loads pending organizations from `GET /api/organizations?status=pending`.
- Admin organizations page loads approved organizations from `GET /api/organizations?status=approved`.
- Admin organizations page loads rejected organizations from `GET /api/organizations?status=rejected`.
- Admin approve action calls `PATCH /api/organizations/:id/approve`.
- Admin reject action requires a rejection reason before submission.
- Admin reject action calls `PATCH /api/organizations/:id/reject` with `rejectionReason`.
- Rejected organization owner sees the rejection reason on the blocked dashboard.
- Approved organization owner can access the operational dashboard and operational routes.
- Any backend `403` from organization mutations shows a friendly approval/access message.

## Legacy Tests Flow

- Active admin and parent dashboards do not call `/api/tests`.
- Visiting `/tests` shows: "This tests flow is no longer available. Please use evaluations."
- Any legacy tests API wrapper returns a graceful deprecated 410-style error locally instead of calling `/api/tests`.
