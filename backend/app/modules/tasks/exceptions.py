from app.shared.exceptions import NotFoundError


class TaskNotFoundError(NotFoundError):
    default_message = "Task not found"