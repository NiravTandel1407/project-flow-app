from app.shared.exceptions import NotFoundError


class SubtaskNotFoundError(NotFoundError):
    default_message = "Subtask not found"