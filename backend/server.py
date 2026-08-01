from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Any

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

from seed_data import DEFAULT_HOMEPAGE, DEFAULT_SETTINGS, DEFAULT_SERVICES, DEFAULT_PORTFOLIO, DEFAULT_FAQS

# ------------------------------------------------------------------ #
# Config
# ------------------------------------------------------------------ #
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="Veyora Creative Studio API")
api_router = APIRouter(prefix="/api")


# ------------------------------------------------------------------ #
# Auth helpers
# ------------------------------------------------------------------ #
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ------------------------------------------------------------------ #
# Models
# ------------------------------------------------------------------ #
class LoginInput(BaseModel):
    email: str
    password: str


class ServiceModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    category: str
    thumbnail: str = ""
    hero_image: str = ""
    short_description: str = ""
    full_description: str = ""
    starting_price: str = ""
    estimated_time: str = ""
    benefits: List[str] = []
    pricing: List[dict] = []
    addons: List[dict] = []
    faqs: List[dict] = []
    related_portfolio: List[str] = []
    seo_title: str = ""
    seo_description: str = ""
    order: int = 0


class PortfolioModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_name: str
    category: str
    thumbnail: str = ""
    gallery: List[str] = []
    overview: str = ""
    challenge: str = ""
    solution: str = ""
    deliverables: List[str] = []
    related_service: str = ""
    seo_title: str = ""
    seo_description: str = ""
    order: int = 0


class FaqModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    category: str = "Umum"
    order: int = 0


class HomepageModel(BaseModel):
    headline: str
    description: str
    hero_image: str = ""
    primary_cta: str = ""
    secondary_cta: str = ""
    statistics: List[dict] = []


class SettingsModel(BaseModel):
    business_name: str
    tagline: str = ""
    whatsapp_number: str
    social_links: dict = {}
    footer_info: str = ""
    default_seo_title: str = ""
    default_seo_description: str = ""


# ------------------------------------------------------------------ #
# Auth endpoints
# ------------------------------------------------------------------ #
@api_router.post("/auth/login")
async def login(data: LoginInput):
    email = data.email.strip().lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email atau password salah")
    token = create_access_token(str(user["_id"]), email)
    return {"token": token, "user": {"email": email, "name": user.get("name", "Admin")}}


@api_router.get("/auth/me")
async def me(current=Depends(get_current_user)):
    return {"email": current["email"], "name": current.get("name", "Admin")}


# ------------------------------------------------------------------ #
# Public content endpoints
# ------------------------------------------------------------------ #
@api_router.get("/")
async def root():
    return {"message": "Veyora Creative Studio API"}


@api_router.get("/homepage")
async def get_homepage():
    doc = await db.homepage.find_one({"_id": "homepage"}, {"_id": 0})
    return doc or DEFAULT_HOMEPAGE


@api_router.get("/settings")
async def get_settings():
    doc = await db.settings.find_one({"_id": "settings"}, {"_id": 0})
    return doc or DEFAULT_SETTINGS


@api_router.get("/services")
async def list_services():
    docs = await db.services.find({}, {"_id": 0}).sort("order", 1).to_list(200)
    return docs


@api_router.get("/services/{slug}")
async def get_service(slug: str):
    doc = await db.services.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Layanan tidak ditemukan")
    return doc


@api_router.get("/portfolio")
async def list_portfolio():
    docs = await db.portfolio.find({}, {"_id": 0}).sort("order", 1).to_list(200)
    return docs


@api_router.get("/faqs")
async def list_faqs():
    docs = await db.faqs.find({}, {"_id": 0}).sort("order", 1).to_list(200)
    return docs


# ------------------------------------------------------------------ #
# Admin write endpoints (protected)
# ------------------------------------------------------------------ #
@api_router.put("/admin/homepage")
async def update_homepage(data: HomepageModel, current=Depends(get_current_user)):
    doc = data.model_dump()
    await db.homepage.update_one({"_id": "homepage"}, {"$set": doc}, upsert=True)
    return doc


@api_router.put("/admin/settings")
async def update_settings(data: SettingsModel, current=Depends(get_current_user)):
    doc = data.model_dump()
    await db.settings.update_one({"_id": "settings"}, {"$set": doc}, upsert=True)
    return doc


# Services CRUD
@api_router.post("/admin/services")
async def create_service(data: ServiceModel, current=Depends(get_current_user)):
    doc = data.model_dump()
    await db.services.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/services/{sid}")
async def update_service(sid: str, data: ServiceModel, current=Depends(get_current_user)):
    doc = data.model_dump()
    doc["id"] = sid
    await db.services.update_one({"id": sid}, {"$set": doc}, upsert=True)
    return doc


@api_router.delete("/admin/services/{sid}")
async def delete_service(sid: str, current=Depends(get_current_user)):
    await db.services.delete_one({"id": sid})
    return {"ok": True}


# Portfolio CRUD
@api_router.post("/admin/portfolio")
async def create_portfolio(data: PortfolioModel, current=Depends(get_current_user)):
    doc = data.model_dump()
    await db.portfolio.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/portfolio/{pid}")
async def update_portfolio(pid: str, data: PortfolioModel, current=Depends(get_current_user)):
    doc = data.model_dump()
    doc["id"] = pid
    await db.portfolio.update_one({"id": pid}, {"$set": doc}, upsert=True)
    return doc


@api_router.delete("/admin/portfolio/{pid}")
async def delete_portfolio(pid: str, current=Depends(get_current_user)):
    await db.portfolio.delete_one({"id": pid})
    return {"ok": True}


# FAQ CRUD
@api_router.post("/admin/faqs")
async def create_faq(data: FaqModel, current=Depends(get_current_user)):
    doc = data.model_dump()
    await db.faqs.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/faqs/{fid}")
async def update_faq(fid: str, data: FaqModel, current=Depends(get_current_user)):
    doc = data.model_dump()
    doc["id"] = fid
    await db.faqs.update_one({"id": fid}, {"$set": doc}, upsert=True)
    return doc


@api_router.delete("/admin/faqs/{fid}")
async def delete_faq(fid: str, current=Depends(get_current_user)):
    await db.faqs.delete_one({"id": fid})
    return {"ok": True}


# ------------------------------------------------------------------ #
# Startup / seeding
# ------------------------------------------------------------------ #
async def seed_admin():
    email = os.environ["ADMIN_EMAIL"].strip().lower()
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "email": email,
            "password_hash": hash_password(password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin seeded")
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})
        logger.info("Admin password updated")


async def seed_content():
    if await db.homepage.find_one({"_id": "homepage"}) is None:
        await db.homepage.insert_one({"_id": "homepage", **DEFAULT_HOMEPAGE})
    if await db.settings.find_one({"_id": "settings"}) is None:
        await db.settings.insert_one({"_id": "settings", **DEFAULT_SETTINGS})
    if await db.services.count_documents({}) == 0:
        await db.services.insert_many([dict(s) for s in DEFAULT_SERVICES])
    if await db.portfolio.count_documents({}) == 0:
        await db.portfolio.insert_many([dict(p) for p in DEFAULT_PORTFOLIO])
    if await db.faqs.count_documents({}) == 0:
        await db.faqs.insert_many([dict(f) for f in DEFAULT_FAQS])


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await seed_admin()
    await seed_content()
    logger.info("Startup complete")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
