# Backend Backlog

## High Priority

- Add a global exception filter so all API errors return one consistent JSON shape.
- Finish appointment relation responses, including reminders and event logs in the details query.
- Standardize `BaseService` method contracts so all services return consistent types and not-found behavior.
- Add integration tests for users, patients, appointments, reminders, and event-log routes.
- Fix remaining Prisma workflow rough edges, especially migration helper scripting and Prisma Studio startup.

## Data And Domain

- Decide whether event logs should remain split by entity or move to one generic event log model later.
- Add richer reminder fields if needed, such as status, type, scheduled time, and delivery result.
- Review whether patients should stay separate from users or eventually be linked more explicitly.
- Add billing lifecycle fields if invoicing becomes more advanced.
- Deepen PostgreSQL understanding with more explicit SQL usage, indexing, joins, constraints, and query tuning practice.

## API Improvements

- Add delete endpoints where they still make sense for the domain.
- Add filtering, pagination, and sorting for list endpoints.
- Add DTOs and validation consistently to every module.
- Add route-specific response types instead of returning raw Prisma model types everywhere.

## Security And Reliability

- Add authentication and authorization guards.
- Add role-based access rules for admin, dentist, receptionist, and patient users.
- Add request logging, audit logging strategy, and rate limiting.
- Add environment validation on startup.
- Introduce Redis deliberately and learn it through one real use case first, such as caching, short-lived sessions, or queue-backed reminder processing.
- Add a simple async workflow and later compare Redis-based queues with SQS for reliability and retry handling.

## Developer Experience

- Clean up helper scripts for migrations, seeds, and local database workflows.
- Add seed scenarios for more realistic linked data.
- Add Swagger or another API reference tool for quick endpoint inspection.
- Add a small set of Postman or PowerShell request examples for each module.

## Nice To Have Later

- Background jobs for reminders and notifications.
- File uploads and storage support.
- Metrics and observability dashboards.
- Caching for read-heavy endpoints.
- Learn Docker packaging for web, api, and worker services.
- Learn AWS building blocks relevant to this app: RDS, ECS/Fargate, S3, CloudFront, Redis/ElastiCache, and SQS.
- Learn infrastructure as code with Terraform or CDK after the local architecture is stable.
