import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, JSON, Boolean
from sqlalchemy.orm import relationship
from backend.app.database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False, default="demo_user")
    email = Column(String(255), unique=True, index=True, nullable=False, default="demo@transformai.dev")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    transformations = relationship("Transformation", back_populates="user", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(255), nullable=False, default="Default Project")
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="projects")
    documents = relationship("Document", back_populates="project", cascade="all, delete-orphan")
    transformations = relationship("Transformation", back_populates="project", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)  # txt, pdf, docx, pasted
    file_size_bytes = Column(Integer, default=0)
    character_count = Column(Integer, default=0)
    word_count = Column(Integer, default=0)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="documents")
    transformations = relationship("Transformation", back_populates="document", cascade="all, delete-orphan")

class Transformation(Base):
    __tablename__ = "transformations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    
    title = Column(String(255), nullable=False, default="Untitled Transformation")
    source_type = Column(String(50), default="text")  # text, file_upload, template
    selected_outputs = Column(JSON, nullable=False)   # List of strings e.g. ["executive_summary", "security_advisory"]
    
    # Configuration parameters
    audience = Column(String(100), default="Executive")
    tone = Column(String(100), default="Professional")
    language = Column(String(100), default="English")
    detail_level = Column(String(50), default="Detailed")
    custom_instructions = Column(Text, nullable=True)
    
    # AI Engine metadata
    ai_model = Column(String(100), default="OpenAI GPT-5.6")
    is_demo_mode = Column(Boolean, default=False)
    status = Column(String(50), default="completed")  # queued, processing, completed, failed
    execution_duration_sec = Column(Float, default=0.0)
    overall_quality_score = Column(Float, default=94.0)
    validation_summary = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="transformations")
    project = relationship("Project", back_populates="transformations")
    document = relationship("Document", back_populates="transformations")
    outputs = relationship("Output", back_populates="transformation", cascade="all, delete-orphan")

class Output(Base):
    __tablename__ = "outputs"

    id = Column(Integer, primary_key=True, index=True)
    transformation_id = Column(Integer, ForeignKey("transformations.id"), nullable=False)
    format_type = Column(String(100), nullable=False)  # executive_summary, security_advisory, etc.
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    
    # Specific validation metrics
    quality_score = Column(Float, default=95.0)
    consistency_score = Column(Float, default=96.0)
    completeness_score = Column(Float, default=94.0)
    formatting_score = Column(Float, default=98.0)
    tone_score = Column(Float, default=95.0)
    validation_checks = Column(JSON, nullable=True)  # itemized checklist with badges
    
    word_count = Column(Integer, default=0)
    char_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    transformation = relationship("Transformation", back_populates="outputs")

class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), default="General")
    description = Column(Text, nullable=False)
    sample_content = Column(Text, nullable=False)
    recommended_outputs = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
