class DomainError(Exception):
    default_message = "Something went wrong"

    def __init__(self, message: str | None = None):
        self.message = message or self.default_message
        super().__init__(self.message)


class NotFoundError(DomainError):
    default_message = "Resource not found"      # -> HTTP 404


class BusinessRuleError(DomainError):
    default_message = "Business rule violated"  # -> HTTP 422