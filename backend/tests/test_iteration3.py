"""Iteration 3: portfolio slugs, reorder endpoints, draft preview by slug."""
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


@pytest.fixture(scope="module")
def auth_headers():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['token']}"}


# ---------- Portfolio slug ----------
class TestPortfolioSlug:
    def test_all_portfolio_have_unique_nonempty_slug(self):
        r = requests.get(f"{API}/portfolio")
        assert r.status_code == 200
        items = r.json()
        assert len(items) >= 1
        slugs = [p.get("slug") for p in items]
        assert all(isinstance(s, str) and s.strip() for s in slugs), f"empty slugs: {slugs}"
        assert len(set(slugs)) == len(slugs), f"duplicate slugs: {slugs}"

    def test_get_portfolio_by_slug(self):
        items = requests.get(f"{API}/portfolio").json()
        slug = items[0]["slug"]
        r = requests.get(f"{API}/portfolio/{slug}")
        assert r.status_code == 200
        data = r.json()
        assert data["slug"] == slug
        assert data["project_name"]

    def test_get_portfolio_nonexistent(self):
        r = requests.get(f"{API}/portfolio/does-not-exist-xyz-123")
        assert r.status_code == 404


# ---------- Reorder ----------
class TestReorder:
    def _reorder_and_check(self, collection_url, list_url, auth_headers):
        items = requests.get(list_url).json()
        ids = [x["id"] for x in items]
        assert len(ids) >= 2, f"Need at least 2 items in {list_url}"
        reversed_ids = list(reversed(ids))
        try:
            # Unauth
            r_unauth = requests.put(collection_url, json={"ids": reversed_ids})
            assert r_unauth.status_code == 401

            # Authed reorder
            r = requests.put(collection_url, json={"ids": reversed_ids}, headers=auth_headers)
            assert r.status_code == 200, f"reorder failed: {r.status_code} {r.text}"
            assert r.json().get("ok") is True

            # Verify order changed
            items2 = requests.get(list_url).json()
            ids2 = [x["id"] for x in items2]
            assert ids2[0] == reversed_ids[0], f"first item should change; got {ids2[:3]} vs {reversed_ids[:3]}"
        finally:
            # Restore original order
            requests.put(collection_url, json={"ids": ids}, headers=auth_headers)

    def test_reorder_faqs(self, auth_headers):
        self._reorder_and_check(f"{API}/admin/reorder/faqs", f"{API}/faqs", auth_headers)

    def test_reorder_services(self, auth_headers):
        # CRITICAL: must not mis-route to /admin/services/{sid}
        items = requests.get(f"{API}/services").json()
        ids = [x["id"] for x in items]
        reversed_ids = list(reversed(ids))
        try:
            r = requests.put(f"{API}/admin/reorder/services",
                             json={"ids": reversed_ids}, headers=auth_headers)
            assert r.status_code == 200, f"got {r.status_code}: {r.text}"
            assert r.status_code != 422, "reorder mis-routed to update handler"
            items2 = requests.get(f"{API}/services").json()
            assert [x["id"] for x in items2][0] == reversed_ids[0]
        finally:
            requests.put(f"{API}/admin/reorder/services",
                         json={"ids": ids}, headers=auth_headers)

    def test_reorder_portfolio(self, auth_headers):
        self._reorder_and_check(f"{API}/admin/reorder/portfolio",
                                f"{API}/portfolio", auth_headers)

    def test_reorder_unauth_all(self):
        for path in ["services", "portfolio", "faqs"]:
            r = requests.put(f"{API}/admin/reorder/{path}", json={"ids": []})
            assert r.status_code == 401, f"{path} → {r.status_code}"


# ---------- Draft still hidden but visible via slug detail ----------
class TestDraftPreview:
    def test_draft_service_hidden_visible_by_slug(self, auth_headers):
        slug = f"test-draft-svc-{uuid.uuid4().hex[:6]}"
        payload = {"title": "TEST_Draft_Preview_Svc", "slug": slug, "category": "Test", "status": "draft"}
        r = requests.post(f"{API}/admin/services", json=payload, headers=auth_headers)
        assert r.status_code == 200
        sid = r.json()["id"]
        try:
            pub = requests.get(f"{API}/services").json()
            assert not any(s["slug"] == slug for s in pub)
            # visible via slug detail (preview)
            r_det = requests.get(f"{API}/services/{slug}")
            assert r_det.status_code == 200
            assert r_det.json()["status"] == "draft"
            # visible in admin list
            admin = requests.get(f"{API}/admin/services", headers=auth_headers).json()
            assert any(s["id"] == sid for s in admin)
        finally:
            requests.delete(f"{API}/admin/services/{sid}", headers=auth_headers)

    def test_draft_portfolio_hidden_visible_by_slug(self, auth_headers):
        payload = {"project_name": "TEST_Draft_Preview_Proj", "category": "Test", "status": "draft"}
        r = requests.post(f"{API}/admin/portfolio", json=payload, headers=auth_headers)
        assert r.status_code == 200
        pid = r.json()["id"]
        slug = r.json()["slug"]
        assert slug, "portfolio slug must be auto-generated"
        try:
            pub = requests.get(f"{API}/portfolio").json()
            assert not any(p["id"] == pid for p in pub)
            # visible via slug (preview)
            r_det = requests.get(f"{API}/portfolio/{slug}")
            assert r_det.status_code == 200
            assert r_det.json()["status"] == "draft"
        finally:
            requests.delete(f"{API}/admin/portfolio/{pid}", headers=auth_headers)
