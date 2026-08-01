"""Veyora Creative Studio - Backend API tests."""
import os
import uuid
import pytest
import requests
from dotenv import load_dotenv

load_dotenv("/app/frontend/.env")
BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@veyora.studio"
ADMIN_PASSWORD = "veyora2025"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    data = r.json()
    assert "token" in data and "user" in data
    return data["token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- Public content endpoints ----------
class TestPublic:
    def test_homepage(self):
        r = requests.get(f"{API}/homepage")
        assert r.status_code == 200
        d = r.json()
        assert d["headline"]
        assert isinstance(d["statistics"], list) and len(d["statistics"]) >= 1

    def test_settings(self):
        r = requests.get(f"{API}/settings")
        assert r.status_code == 200
        d = r.json()
        assert d["business_name"] == "Veyora Creative Studio"
        assert d["whatsapp_number"] == "6285177881357"

    def test_services_list(self):
        r = requests.get(f"{API}/services")
        assert r.status_code == 200
        d = r.json()
        assert isinstance(d, list) and len(d) == 8
        slugs = [s["slug"] for s in d]
        assert "packaging-design" in slugs

    def test_service_detail(self):
        r = requests.get(f"{API}/services/packaging-design")
        assert r.status_code == 200
        d = r.json()
        assert d["slug"] == "packaging-design"
        assert d["title"] == "Packaging Design"
        assert isinstance(d["pricing"], list) and len(d["pricing"]) >= 1

    def test_service_not_found(self):
        r = requests.get(f"{API}/services/no-such-slug")
        assert r.status_code == 404

    def test_portfolio(self):
        r = requests.get(f"{API}/portfolio")
        assert r.status_code == 200
        d = r.json()
        assert isinstance(d, list) and len(d) == 6

    def test_faqs(self):
        r = requests.get(f"{API}/faqs")
        assert r.status_code == 200
        d = r.json()
        assert isinstance(d, list) and len(d) == 6


# ---------- Auth ----------
class TestAuth:
    def test_login_ok(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        d = r.json()
        assert d["user"]["email"] == ADMIN_EMAIL
        assert isinstance(d["token"], str)

    def test_login_wrong_pwd(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401
        assert "detail" in r.json()

    def test_me_no_token(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_token(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL


# ---------- Admin CRUD ----------
class TestAdminHomepage:
    def test_unauthorized(self):
        r = requests.put(f"{API}/admin/homepage", json={"headline": "x", "description": "y"})
        assert r.status_code == 401

    def test_update_and_persist(self, auth_headers):
        r = requests.get(f"{API}/homepage")
        original = r.json()
        payload = {**original, "headline": "TEST_HEADLINE_" + uuid.uuid4().hex[:6]}
        r = requests.put(f"{API}/admin/homepage", json=payload, headers=auth_headers)
        assert r.status_code == 200
        # verify persisted
        r2 = requests.get(f"{API}/homepage")
        assert r2.json()["headline"] == payload["headline"]
        # restore
        requests.put(f"{API}/admin/homepage", json=original, headers=auth_headers)


class TestAdminSettings:
    def test_unauthorized(self):
        r = requests.put(f"{API}/admin/settings", json={"business_name": "x", "whatsapp_number": "y"})
        assert r.status_code == 401

    def test_update_and_persist(self, auth_headers):
        original = requests.get(f"{API}/settings").json()
        payload = {**original, "tagline": "TEST_TAG_" + uuid.uuid4().hex[:6]}
        r = requests.put(f"{API}/admin/settings", json=payload, headers=auth_headers)
        assert r.status_code == 200
        assert requests.get(f"{API}/settings").json()["tagline"] == payload["tagline"]
        requests.put(f"{API}/admin/settings", json=original, headers=auth_headers)


class TestAdminServices:
    def test_unauthorized_create(self):
        r = requests.post(f"{API}/admin/services", json={"title": "x", "slug": "y", "category": "z"})
        assert r.status_code == 401

    def test_crud_service(self, auth_headers):
        slug = f"test-svc-{uuid.uuid4().hex[:6]}"
        payload = {"title": "TEST_Service", "slug": slug, "category": "Test"}
        r = requests.post(f"{API}/admin/services", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        created = r.json()
        sid = created["id"]

        # verify GET
        r = requests.get(f"{API}/services/{slug}")
        assert r.status_code == 200 and r.json()["title"] == "TEST_Service"

        # update
        payload_u = {**created, "title": "TEST_Service_Updated"}
        r = requests.put(f"{API}/admin/services/{sid}", json=payload_u, headers=auth_headers)
        assert r.status_code == 200
        assert requests.get(f"{API}/services/{slug}").json()["title"] == "TEST_Service_Updated"

        # delete
        r = requests.delete(f"{API}/admin/services/{sid}", headers=auth_headers)
        assert r.status_code == 200
        assert requests.get(f"{API}/services/{slug}").status_code == 404


class TestAdminPortfolio:
    def test_unauthorized(self):
        r = requests.post(f"{API}/admin/portfolio", json={"project_name": "x", "category": "y"})
        assert r.status_code == 401

    def test_crud(self, auth_headers):
        payload = {"project_name": "TEST_Proj", "category": "Test"}
        r = requests.post(f"{API}/admin/portfolio", json=payload, headers=auth_headers)
        assert r.status_code == 200
        pid = r.json()["id"]

        payload_u = {**r.json(), "project_name": "TEST_Proj_Updated"}
        r = requests.put(f"{API}/admin/portfolio/{pid}", json=payload_u, headers=auth_headers)
        assert r.status_code == 200

        items = requests.get(f"{API}/portfolio").json()
        assert any(x["id"] == pid and x["project_name"] == "TEST_Proj_Updated" for x in items)

        r = requests.delete(f"{API}/admin/portfolio/{pid}", headers=auth_headers)
        assert r.status_code == 200
        items = requests.get(f"{API}/portfolio").json()
        assert not any(x["id"] == pid for x in items)


class TestAdminFaq:
    def test_unauthorized(self):
        r = requests.post(f"{API}/admin/faqs", json={"question": "x", "answer": "y"})
        assert r.status_code == 401

    def test_crud(self, auth_headers):
        payload = {"question": "TEST_Q?", "answer": "TEST_A"}
        r = requests.post(f"{API}/admin/faqs", json=payload, headers=auth_headers)
        assert r.status_code == 200
        fid = r.json()["id"]

        payload_u = {**r.json(), "answer": "TEST_A_Updated"}
        r = requests.put(f"{API}/admin/faqs/{fid}", json=payload_u, headers=auth_headers)
        assert r.status_code == 200

        items = requests.get(f"{API}/faqs").json()
        assert any(x["id"] == fid and x["answer"] == "TEST_A_Updated" for x in items)

        r = requests.delete(f"{API}/admin/faqs/{fid}", headers=auth_headers)
        assert r.status_code == 200
        items = requests.get(f"{API}/faqs").json()
        assert not any(x["id"] == fid for x in items)
