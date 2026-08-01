"""Iteration 2: image upload, draft status filtering, admin lists, related_services, og_image."""
import io
import os
import struct
import zlib
import uuid
import pytest
import requests
from dotenv import load_dotenv

load_dotenv("/app/frontend/.env")
BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@veyora.studio"
ADMIN_PASSWORD = "veyora2025"


def _tiny_png_bytes():
    # 1x1 red PNG constructed by hand
    def chunk(tag, data):
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = chunk(b"IHDR", struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, 0))
    raw = b"\x00\xff\x00\x00"
    idat = chunk(b"IDAT", zlib.compress(raw))
    iend = chunk(b"IEND", b"")
    return sig + ihdr + idat + iend


@pytest.fixture(scope="module")
def auth_headers():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['token']}"}


# ---------- Image upload ----------
class TestUpload:
    def test_upload_no_auth(self):
        r = requests.post(f"{API}/admin/upload",
                          files={"file": ("t.png", _tiny_png_bytes(), "image/png")})
        assert r.status_code == 401

    def test_upload_non_image(self, auth_headers):
        r = requests.post(f"{API}/admin/upload",
                          files={"file": ("t.txt", b"hello", "text/plain")},
                          headers=auth_headers)
        assert r.status_code == 400

    def test_upload_png_ok_and_serves(self, auth_headers):
        png = _tiny_png_bytes()
        r = requests.post(f"{API}/admin/upload",
                          files={"file": ("t.png", png, "image/png")},
                          headers=auth_headers)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "url" in data and "path" in data
        assert data["url"].startswith("http")
        # GET the URL back
        g = requests.get(data["url"])
        assert g.status_code == 200
        assert g.headers.get("content-type", "").startswith("image/")
        assert len(g.content) == len(png)


# ---------- Draft filtering ----------
class TestDraftFiltering:
    def test_admin_list_services_auth(self, auth_headers):
        assert requests.get(f"{API}/admin/services").status_code == 401
        r = requests.get(f"{API}/admin/services", headers=auth_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_list_portfolio_auth(self, auth_headers):
        assert requests.get(f"{API}/admin/portfolio").status_code == 401
        r = requests.get(f"{API}/admin/portfolio", headers=auth_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_draft_service_hidden_from_public(self, auth_headers):
        slug = f"test-draft-svc-{uuid.uuid4().hex[:6]}"
        payload = {"title": "TEST_Draft_Svc", "slug": slug, "category": "Test", "status": "draft"}
        r = requests.post(f"{API}/admin/services", json=payload, headers=auth_headers)
        assert r.status_code == 200
        sid = r.json()["id"]
        try:
            public = requests.get(f"{API}/services").json()
            assert not any(s["slug"] == slug for s in public), "draft service leaked to public"
            admin = requests.get(f"{API}/admin/services", headers=auth_headers).json()
            assert any(s["id"] == sid for s in admin), "draft service missing in admin list"

            # Flip to published → should appear publicly
            payload_pub = {**r.json(), "status": "published"}
            requests.put(f"{API}/admin/services/{sid}", json=payload_pub, headers=auth_headers)
            public2 = requests.get(f"{API}/services").json()
            assert any(s["slug"] == slug for s in public2)
        finally:
            requests.delete(f"{API}/admin/services/{sid}", headers=auth_headers)

    def test_draft_portfolio_hidden_from_public(self, auth_headers):
        payload = {"project_name": "TEST_Draft_Proj", "category": "Test", "status": "draft"}
        r = requests.post(f"{API}/admin/portfolio", json=payload, headers=auth_headers)
        assert r.status_code == 200
        pid = r.json()["id"]
        try:
            public = requests.get(f"{API}/portfolio").json()
            assert not any(p["id"] == pid for p in public)
            admin = requests.get(f"{API}/admin/portfolio", headers=auth_headers).json()
            assert any(p["id"] == pid for p in admin)
        finally:
            requests.delete(f"{API}/admin/portfolio/{pid}", headers=auth_headers)


# ---------- Portfolio related_services / og_image / status persistence ----------
class TestPortfolioRelated:
    def test_persist_related_services_and_og(self, auth_headers):
        payload = {
            "project_name": "TEST_RelProj",
            "category": "Test",
            "related_services": ["packaging-design", "logo-design"],
            "og_image": "https://example.com/og.png",
            "seo_title": "TEST_SEO",
            "seo_description": "TEST_desc",
            "status": "published",
        }
        r = requests.post(f"{API}/admin/portfolio", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        pid = r.json()["id"]
        try:
            items = requests.get(f"{API}/portfolio").json()
            found = next((p for p in items if p["id"] == pid), None)
            assert found is not None
            assert found["related_services"] == ["packaging-design", "logo-design"]
            assert found["og_image"] == "https://example.com/og.png"
            assert found["seo_title"] == "TEST_SEO"

            # Update related_services
            payload_u = {**found, "related_services": ["motion-graphic"]}
            r2 = requests.put(f"{API}/admin/portfolio/{pid}", json=payload_u, headers=auth_headers)
            assert r2.status_code == 200
            items2 = requests.get(f"{API}/portfolio").json()
            found2 = next(p for p in items2 if p["id"] == pid)
            assert found2["related_services"] == ["motion-graphic"]
        finally:
            requests.delete(f"{API}/admin/portfolio/{pid}", headers=auth_headers)
