import os
import sys
import uuid
import shutil
from pathlib import Path

# Set working directory to backend root
backend_dir = Path(__file__).resolve().parent.parent
os.chdir(backend_dir)
sys.path.insert(0, str(backend_dir))

import app.models_registry
from app.core.database import SessionLocal
from app.modules.projects.models import Project
from app.modules.documents.models import ProjectDocument
from app.modules.documents.services import BASE_UPLOAD_DIR

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    HRFlowable,
)


def add_first_page_decorations(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(colors.HexColor("#64748b"))
    canvas.drawString(54, 36, "Confidential — Project Flow Internal System Documentation")
    canvas.drawRightString(558, 36, f"Page {doc.page}")
    canvas.setStrokeColor(colors.HexColor("#e2e8f0"))
    canvas.setLineWidth(0.5)
    canvas.line(54, 48, 558, 48)
    canvas.restoreState()


def add_later_page_decorations(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(colors.HexColor("#64748b"))
    # Header
    canvas.drawString(54, 755, "Project Flow — Comprehensive Project Specification & Architecture")
    canvas.setStrokeColor(colors.HexColor("#e2e8f0"))
    canvas.setLineWidth(0.5)
    canvas.line(54, 747, 558, 747)
    # Footer
    canvas.drawString(54, 36, "Confidential — Project Flow Internal System Documentation")
    canvas.drawRightString(558, 36, f"Page {doc.page}")
    canvas.line(54, 48, 558, 48)
    canvas.restoreState()


def create_pdf(output_path: str):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
    )

    styles = getSampleStyleSheet()

    primary = colors.HexColor("#4338ca")      # Indigo 700
    primary_dark = colors.HexColor("#312e81") # Indigo 900
    text_dark = colors.HexColor("#0f172a")    # Slate 900
    text_muted = colors.HexColor("#475569")   # Slate 600

    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=28,
        textColor=primary_dark,
        spaceAfter=4,
    )
    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=12,
        leading=16,
        textColor=text_muted,
        spaceAfter=12,
    )
    h1_style = ParagraphStyle(
        "H1",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        textColor=primary,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True,
    )
    h2_style = ParagraphStyle(
        "H2",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=14,
        textColor=text_dark,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True,
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=text_dark,
        spaceAfter=5,
    )
    bullet_style = ParagraphStyle(
        "Bullet",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=text_dark,
        leftIndent=12,
        spaceAfter=3,
    )
    table_cell = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=10.5,
        textColor=text_dark,
    )
    table_cell_bold = ParagraphStyle(
        "TableCellBold",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10.5,
        textColor=text_dark,
    )
    table_header = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10.5,
        textColor=colors.white,
    )
    code_style = ParagraphStyle(
        "CodeText",
        parent=styles["Normal"],
        fontName="Courier",
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#7c2d12"),
    )

    story = []

    # Title & Metadata Banner
    story.append(Paragraph("PROJECT FLOW", title_style))
    story.append(Paragraph("The Next-Generation Project Management & Tracking Application", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=primary, spaceAfter=10))

    # Meta Info Table
    meta_data = [
        [
            Paragraph("<b>Document Version:</b> 1.0.0", table_cell),
            Paragraph("<b>Status:</b> Production Ready / Active", table_cell),
        ],
        [
            Paragraph("<b>Author / Lead:</b> Nirav Tandel", table_cell),
            Paragraph("<b>Date:</b> November 2026", table_cell),
        ],
        [
            Paragraph("<b>Repository:</b> project-flow", table_cell),
            Paragraph("<b>Stack:</b> React 18 + FastAPI + PostgreSQL/SQLite", table_cell),
        ],
    ]
    meta_table = Table(meta_data, colWidths=[250, 254])
    meta_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#f1f5f9")),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # 1. Project Details
    story.append(Paragraph("1. Project Details & Objectives", h1_style))
    story.append(Paragraph(
        "<b>Project Flow</b> is an enterprise project tracking and task orchestration platform designed for software teams and engineering managers. "
        "It provides a structured environment to organize projects, break down deliverables into subtask checklists, manage file assets, "
        "monitor team progress metrics in real time, and auto-complete projects when all goals are met.",
        body_style
    ))

    proj_details = [
        [Paragraph("Field", table_header), Paragraph("Details / Value", table_header)],
        [Paragraph("Project Name", table_cell_bold), Paragraph("Project Flow - The Project Management Application", table_cell)],
        [Paragraph("Core Vision", table_cell_bold), Paragraph("High-productivity task & project management with real-time subtask checklists and analytics.", table_cell)],
        [Paragraph("Target Audience", table_cell_bold), Paragraph("Engineering teams, product owners, agile squads, and individual builders.", table_cell)],
        [Paragraph("Current Status", table_cell_bold), Paragraph("In Progress (All core modules functional with 100% test passing)", table_cell)],
        [Paragraph("Priority", table_cell_bold), Paragraph("High", table_cell)],
        [Paragraph("Project Timeline", table_cell_bold), Paragraph("October 25, 2026 – November 20, 2026", table_cell)],
        [Paragraph("Security Model", table_cell_bold), Paragraph("Argon2id password hashing + JWT sessions + strict user_id row-level authorization.", table_cell)],
    ]
    t_proj = Table(proj_details, colWidths=[120, 384])
    t_proj.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), primary),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(t_proj)
    story.append(Spacer(1, 10))

    # 2. Project Requirements
    story.append(Paragraph("2. Project Requirements & Feature Specifications", h1_style))
    story.append(Paragraph("<b>2.1 Functional Requirements:</b>", h2_style))
    story.append(Paragraph("• <b>User Authentication:</b> Secure registration, login, JWT token issuance, session persistence, and strict multi-tenant project separation.", bullet_style))
    story.append(Paragraph("• <b>Project Management:</b> CRUD operations with fields (name, description, start_date, due_date), statuses (Not Started, In Progress, On Hold, Completed), priorities (Low, Medium, High), search, and filtering.", bullet_style))
    story.append(Paragraph("• <b>Task System:</b> Nested tasks inside projects with title, description, priority, due date, status (To Do, In Progress, Done), and one-click completion.", bullet_style))
    story.append(Paragraph("• <b>Subtask Checklists:</b> Dynamic subtasks inside each task, toggleable in one click, without clunky modal round-trips.", bullet_style))
    story.append(Paragraph("• <b>Document Repository:</b> Project-level document storage supporting PDF, docs, images, and spreadsheets with download and delete capabilities.", bullet_style))
    story.append(Paragraph("• <b>Progress Tracking:</b> Task progress: <i>(subtasks done ÷ total subtasks)</i>; Project progress: <i>(tasks done ÷ total tasks)</i>; Automatic status switch to <b>Completed</b> when all tasks finish.", bullet_style))
    story.append(Paragraph("• <b>Executive Dashboard:</b> Live project metrics, status breakdowns, deadlines due today & this week, and overdue task count.", bullet_style))

    story.append(Paragraph("<b>2.2 Non-Functional Requirements:</b>", h2_style))
    story.append(Paragraph("• <b>Performance:</b> Sub-100ms API response latency, debounced search, and optimized indexed database queries.", bullet_style))
    story.append(Paragraph("• <b>Data Integrity:</b> Foreign keys with ON DELETE CASCADE to maintain database hygiene across tasks, subtasks, and files.", bullet_style))
    story.append(Paragraph("• <b>Responsive UX:</b> Fluid Tailwind CSS layouts optimized for smartphones, tablets, and widescreen monitors.", bullet_style))

    story.append(PageBreak())

    # 3. Project Architecture
    story.append(Paragraph("3. System Architecture & Tech Stack", h1_style))
    story.append(Paragraph(
        "Project Flow follows a modular 3-tier architecture ensuring clean separation between presentation, domain logic, and data storage:",
        body_style
    ))

    arch_layers = [
        [Paragraph("Tier", table_header), Paragraph("Technologies", table_header), Paragraph("Key Responsibilities & Components", table_header)],
        [
            Paragraph("<b>Presentation Layer</b>", table_cell_bold),
            Paragraph("React 18, TypeScript, Tailwind CSS, Vite, Lucide Icons, React Router 6", table_cell),
            Paragraph("Client-side routing, responsive UI modals, optimistic checklist updates, progress bars, dropzone file upload, and dashboard cards.", table_cell),
        ],
        [
            Paragraph("<b>Application Layer</b>", table_cell_bold),
            Paragraph("FastAPI, Python 3.12, Pydantic v2, Python-Multipart, PyJWT", table_cell),
            Paragraph("REST routing, JWT auth guards, auto-completion business logic, file stream endpoints, schema validation, exception handlers.", table_cell),
        ],
        [
            Paragraph("<b>Persistence Layer</b>", table_cell_bold),
            Paragraph("SQLAlchemy 2.0 ORM, PostgreSQL / SQLite, Alembic migrations", table_cell),
            Paragraph("User-scoped data queries, cascade relationships, index optimizations on foreign keys (project_id, task_id, user_id).", table_cell),
        ],
        [
            Paragraph("<b>Storage Layer</b>", table_cell_bold),
            Paragraph("Local File System / Scalable Object Store (UUID Hashed)", table_cell),
            Paragraph("Project-isolated file directories (`uploads/project_{id}/`), preventing name collisions and security path-traversal exploits.", table_cell),
        ],
    ]
    t_arch = Table(arch_layers, colWidths=[90, 160, 254])
    t_arch.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), primary),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(t_arch)
    story.append(Spacer(1, 10))

    # 4. Process Flow
    story.append(Paragraph("4. End-to-End Process Flows", h1_style))
    story.append(Paragraph("<b>4.1 Authentication & Multi-Tenancy Isolation:</b>", h2_style))
    story.append(Paragraph("1. User submits credentials to <code>POST /api/v1/auth/login</code>.<br/>"
                           "2. Backend verifies password hash using Argon2id and returns a signed JWT token.<br/>"
                           "3. Frontend stores token in localStorage and attaches it to all HTTP requests via <code>Authorization: Bearer</code>.<br/>"
                           "4. All project queries strictly append <code>where user_id = current_user.id</code>, guaranteeing tenant isolation.", body_style))

    story.append(Paragraph("<b>4.2 Project & Task Lifecycle with Auto-Completion:</b>", h2_style))
    story.append(Paragraph("1. User creates a Project with target dates and priority.<br/>"
                           "2. Tasks are created with checklists of subtasks.<br/>"
                           "3. Checking subtasks updates individual task progress bars in real time.<br/>"
                           "4. When all tasks in a project are marked Done, the backend trigger <code>_check_project_completion()</code> automatically promotes the project status to <b>Completed</b>.", body_style))

    story.append(Paragraph("<b>4.3 Document Management Workflow:</b>", h2_style))
    story.append(Paragraph("1. Client uploads document via <code>multipart/form-data</code> to <code>/api/v1/documents/projects/{id}/upload</code>.<br/>"
                           "2. Backend validates project access and generates a unique UUID stored name.<br/>"
                           "3. File stream is written to <code>uploads/project_{project_id}/</code> and metadata is recorded in the database.<br/>"
                           "4. Files can be streamed with original download filenames or deleted with automatic file cleanup.", body_style))

    story.append(PageBreak())

    # 5. REST API Endpoints Reference
    story.append(Paragraph("5. Comprehensive REST API Endpoints Reference", h1_style))
    story.append(Paragraph("Base URI prefix: <code>/api/v1</code>. All endpoints except registration and login require JWT authentication.", body_style))

    endpoints_data = [
        [Paragraph("Module", table_header), Paragraph("HTTP Method & Path", table_header), Paragraph("Description & Parameters", table_header)],
        # Auth
        [Paragraph("Auth", table_cell_bold), Paragraph("<code>POST /auth/register</code>", code_style), Paragraph("Create a new user account with email, name, password.", table_cell)],
        [Paragraph("Auth", table_cell_bold), Paragraph("<code>POST /auth/login</code>", code_style), Paragraph("OAuth2 password request; returns JWT access token.", table_cell)],
        [Paragraph("Auth", table_cell_bold), Paragraph("<code>GET  /auth/me</code>", code_style), Paragraph("Returns current authenticated user profile.", table_cell)],
        # Projects
        [Paragraph("Projects", table_cell_bold), Paragraph("<code>GET  /projects/</code>", code_style), Paragraph("List user projects with optional <code>status</code> and <code>search</code>.", table_cell)],
        [Paragraph("Projects", table_cell_bold), Paragraph("<code>POST /projects/</code>", code_style), Paragraph("Create project (name, description, priority, dates).", table_cell)],
        [Paragraph("Projects", table_cell_bold), Paragraph("<code>GET  /projects/{id}</code>", code_style), Paragraph("Retrieve project details by ID with calculated stats.", table_cell)],
        [Paragraph("Projects", table_cell_bold), Paragraph("<code>PUT  /projects/{id}</code>", code_style), Paragraph("Update project metadata and target dates.", table_cell)],
        [Paragraph("Projects", table_cell_bold), Paragraph("<code>DELETE /projects/{id}</code>", code_style), Paragraph("Delete project, cascading to tasks, subtasks, and files.", table_cell)],
        # Tasks
        [Paragraph("Tasks", table_cell_bold), Paragraph("<code>GET  /tasks/?project_id={id}</code>", code_style), Paragraph("List tasks belonging to specified project.", table_cell)],
        [Paragraph("Tasks", table_cell_bold), Paragraph("<code>POST /tasks/</code>", code_style), Paragraph("Create task with optional initial subtasks array.", table_cell)],
        [Paragraph("Tasks", table_cell_bold), Paragraph("<code>GET  /tasks/{id}</code>", code_style), Paragraph("Retrieve single task with full subtasks list.", table_cell)],
        [Paragraph("Tasks", table_cell_bold), Paragraph("<code>PUT  /tasks/{id}</code>", code_style), Paragraph("Update task title, description, priority, and due date.", table_cell)],
        [Paragraph("Tasks", table_cell_bold), Paragraph("<code>PATCH /tasks/{id}/status</code>", code_style), Paragraph("Update task status (triggers project auto-completion check).", table_cell)],
        [Paragraph("Tasks", table_cell_bold), Paragraph("<code>DELETE /tasks/{id}</code>", code_style), Paragraph("Delete task and cascade-remove its subtasks.", table_cell)],
        # Subtasks
        [Paragraph("Subtasks", table_cell_bold), Paragraph("<code>POST /subtasks/</code>", code_style), Paragraph("Add checklist item under a task (task_id, title).", table_cell)],
        [Paragraph("Subtasks", table_cell_bold), Paragraph("<code>PATCH /subtasks/{id}/toggle</code>", code_style), Paragraph("Toggle subtask is_done boolean state.", table_cell)],
        [Paragraph("Subtasks", table_cell_bold), Paragraph("<code>DELETE /subtasks/{id}</code>", code_style), Paragraph("Delete subtask item from checklist.", table_cell)],
        # Documents
        [Paragraph("Documents", table_cell_bold), Paragraph("<code>POST /documents/projects/{id}/upload</code>", code_style), Paragraph("Upload file attachment (multipart/form-data).", table_cell)],
        [Paragraph("Documents", table_cell_bold), Paragraph("<code>GET  /documents/projects/{id}</code>", code_style), Paragraph("List all file metadata records attached to project.", table_cell)],
        [Paragraph("Documents", table_cell_bold), Paragraph("<code>GET  /documents/{id}/download</code>", code_style), Paragraph("Stream download file with original filename header.", table_cell)],
        [Paragraph("Documents", table_cell_bold), Paragraph("<code>DELETE /documents/{id}</code>", code_style), Paragraph("Delete document metadata & remove file from disk storage.", table_cell)],
        # Dashboard
        [Paragraph("Dashboard", table_cell_bold), Paragraph("<code>GET  /dashboard/summary</code>", code_style), Paragraph("Executive metrics: projects by status, due today/week, overdue.", table_cell)],
    ]
    t_end = Table(endpoints_data, colWidths=[65, 195, 244])
    t_end.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), primary),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t_end)
    story.append(Spacer(1, 10))

    # 6. Database Schema Entity Relationships
    story.append(Paragraph("6. Database Entity Relationships & Constraints", h1_style))
    db_schema = [
        [Paragraph("Table Name", table_header), Paragraph("Key Columns & Types", table_header), Paragraph("Relationships & Foreign Key Rules", table_header)],
        [
            Paragraph("<b>users</b>", table_cell),
            Paragraph("id (PK), email (UQ, indexed), hashed_password, full_name, created_at", table_cell),
            Paragraph("1-to-Many with projects, project_documents.", table_cell),
        ],
        [
            Paragraph("<b>projects</b>", table_cell),
            Paragraph("id (PK), user_id (FK), name, description, status (Enum), priority (Enum), start_date, due_date, created_at", table_cell),
            Paragraph("Belongs to users. 1-to-Many with tasks and project_documents (CASCADE delete).", table_cell),
        ],
        [
            Paragraph("<b>tasks</b>", table_cell),
            Paragraph("id (PK), project_id (FK), title, description, status (Enum), priority (Enum), due_date, completed_at", table_cell),
            Paragraph("Belongs to projects. 1-to-Many with subtasks (CASCADE delete).", table_cell),
        ],
        [
            Paragraph("<b>subtasks</b>", table_cell),
            Paragraph("id (PK), task_id (FK), title, is_done (Boolean), created_at", table_cell),
            Paragraph("Belongs to tasks. Index on task_id for rapid checklist rendering.", table_cell),
        ],
        [
            Paragraph("<b>project_documents</b>", table_cell),
            Paragraph("id (PK), project_id (FK), user_id (FK), filename, stored_name, file_size, content_type, created_at", table_cell),
            Paragraph("Belongs to projects & users. Maps database records to disk files.", table_cell),
        ],
    ]
    t_db = Table(db_schema, colWidths=[90, 204, 210])
    t_db.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), primary),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t_db)

    # Build PDF with clean page templates
    doc.build(story, onFirstPage=add_first_page_decorations, onLaterPages=add_later_page_decorations)
    print(f"PDF successfully generated at: {output_path}")


def add_pdf_to_project(pdf_path: str, project_id: int, user_id: int):
    db = SessionLocal()
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            print(f"Error: Project ID {project_id} not found!")
            return

        file_stat = os.stat(pdf_path)
        file_size = file_stat.st_size
        original_filename = Path(pdf_path).name
        extension = Path(pdf_path).suffix
        unique_stored_name = f"{uuid.uuid4().hex}{extension}"

        # Target directory
        project_folder = BASE_UPLOAD_DIR / f"project_{project_id}"
        project_folder.mkdir(parents=True, exist_ok=True)
        destination_path = project_folder / unique_stored_name

        # Copy file to project folder
        shutil.copy2(pdf_path, destination_path)

        # Create Document record in DB
        doc_record = ProjectDocument(
            project_id=project_id,
            user_id=user_id,
            filename=original_filename,
            stored_name=unique_stored_name,
            file_size=file_size,
            content_type="application/pdf",
        )
        db.add(doc_record)
        db.commit()
        db.refresh(doc_record)
        print(f"Successfully added document ID {doc_record.id} ('{doc_record.filename}') to Project ID {project_id} ({file_size} bytes)!")
    finally:
        db.close()


if __name__ == "__main__":
    pdf_filename = "Project_Flow_Specification_and_Architecture.pdf"
    output_pdf = str(backend_dir.parent / pdf_filename)
    
    # 1. Generate PDF
    create_pdf(output_pdf)

    # 2. Add to Project Flow (project_id=3, user_id=1)
    add_pdf_to_project(output_pdf, project_id=3, user_id=1)
