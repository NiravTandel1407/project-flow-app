from app.shared.exceptions import BusinessRuleError, NotFoundError


class ProjectNotFoundError(NotFoundError):
    default_message = "Project not found"


class InvalidDateRangeError(BusinessRuleError):
    default_message = "due_date cannot be before start_date"