"""Iteration 4 backend tests: sitemap.xml, robots.txt, categories public + admin CRUD, cascade rename, visibility, reorder."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://design-studio-2154.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@veyora.studio"
ADMIN_PASSWORD = "veyora2025"


@pytest.fixture(scope="module")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def auth(token):
    return {"Authorization": f"Bearer {token}"}


# ---------------- SEO: sitemap & robots ----------------
class TestSitemap:
    def test_sitemap_xml(self):
        r = requests.get(f"{API}/sitemap.xml", timeout=30)
        assert r.status_code == 200
        assert "application/xml" in r.headers.get("content-type", "")
        xml = r.text
        assert xml.startswith("<?xml")
        assert "<urlset" in xml
        # Homepage present
        base = os.environ.get("PUBLIC_BASE_URL", BASE_URL).rstrip("/")
        assert f"<loc>{base}/</loc>" in xml
        # Count published services and portfolio
        pubs = requests.get(f"{API}/services", timeout=30).json()
        pubp = requests.get(f"{API}/portfolio", timeout=30).json()
        for s in pubs:
            assert f"/services/{s['slug']}" in xml, f"missing service {s['slug']}"
        for p in pubp:
            assert f"/portfolio/{p['slug']}" in xml, f"missing portfolio {p['slug']}"
        # count urls
        loc_count = xml.count("<loc>")
        assert loc_count == 1 + len(pubs) + len(pubp), f"loc={loc_count}, expected {1 + len(pubs) + len(pubp)}"

    def test_sitemap_excludes_drafts(self, auth):
        # Create a draft service, ensure not in sitemap
        payload = {
            "title": "TEST_DraftService", "slug": "test-draft-service-it4",
            "category": "Logo", "status": "draft",
        }
        r = requests.post(f"{API}/admin/services", json=payload, headers=auth, timeout=30)
        assert r.status_code == 200
        sid = r.json()["id"]
        try:
            xml = requests.get(f"{API}/sitemap.xml", timeout=30).text
            assert "test-draft-service-it4" not in xml
        finally:
            requests.delete(f"{API}/admin/services/{sid}", headers=auth, timeout=30)

    def test_robots_txt(self):
        r = requests.get(f"{API}/robots.txt", timeout=30)
        assert r.status_code == 200
        assert "text/plain" in r.headers.get("content-type", "")
        body = r.text
        assert "Disallow: /admin" in body
        assert "Sitemap:" in body and "/api/sitemap.xml" in body


# ---------------- Categories ----------------
class TestCategoriesPublic:
    def test_default_categories(self):
        r = requests.get(f"{API}/categories", timeout=30)
        assert r.status_code == 200
        data = r.json()
        names = [c["name"] for c in data]
        for expected in ["Packaging", "Logo", "Sticker", "Landing Page", "Marketplace", "Motion"]:
            assert expected in names, f"missing default category {expected}"
        # sorted by order asc
        orders = [c.get("order", 0) for c in data]
        assert orders == sorted(orders)
        # only visible
        for c in data:
            assert c.get("visible", True) is True


class TestCategoriesAdminCRUD:
    def test_unauthorized(self):
        assert requests.get(f"{API}/admin/categories", timeout=30).status_code == 401
        assert requests.post(f"{API}/admin/categories", json={"name": "X"}, timeout=30).status_code == 401
        assert requests.put(f"{API}/admin/categories/x", json={"name": "X"}, timeout=30).status_code == 401
        assert requests.delete(f"{API}/admin/categories/x", timeout=30).status_code == 401
        assert requests.put(f"{API}/admin/reorder/categories", json={"ids": []}, timeout=30).status_code == 401

    def test_admin_list_includes_all(self, auth):
        r = requests.get(f"{API}/admin/categories", headers=auth, timeout=30)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_cascade_rename(self, auth):
        # Create a temp category
        cat_r = requests.post(f"{API}/admin/categories",
                              json={"name": "TestCat_IT4", "visible": True, "order": 99},
                              headers=auth, timeout=30)
        assert cat_r.status_code == 200
        cat = cat_r.json()
        cid = cat["id"]

        # Create a portfolio item in TestCat_IT4
        port_r = requests.post(f"{API}/admin/portfolio",
                               json={"project_name": "TEST_IT4_Cascade", "category": "TestCat_IT4",
                                     "status": "draft"},
                               headers=auth, timeout=30)
        assert port_r.status_code == 200
        pid = port_r.json()["id"]
        pslug = port_r.json()["slug"]

        try:
            # Rename category
            upd = requests.put(f"{API}/admin/categories/{cid}",
                               json={"name": "TestCatRenamed_IT4", "visible": True, "order": 99},
                               headers=auth, timeout=30)
            assert upd.status_code == 200
            assert upd.json()["name"] == "TestCatRenamed_IT4"

            # Verify portfolio cascade
            got = requests.get(f"{API}/portfolio/{pslug}", timeout=30).json()
            assert got["category"] == "TestCatRenamed_IT4", f"cascade failed: category is {got['category']}"
        finally:
            requests.delete(f"{API}/admin/portfolio/{pid}", headers=auth, timeout=30)
            requests.delete(f"{API}/admin/categories/{cid}", headers=auth, timeout=30)

    def test_visibility_toggle(self, auth):
        # Find Motion category
        cats = requests.get(f"{API}/admin/categories", headers=auth, timeout=30).json()
        motion = next(c for c in cats if c["name"] == "Motion")
        cid = motion["id"]
        original_order = motion.get("order", 0)
        try:
            # Hide
            requests.put(f"{API}/admin/categories/{cid}",
                         json={"name": "Motion", "visible": False, "order": original_order,
                               "slug": motion.get("slug", "")},
                         headers=auth, timeout=30).raise_for_status()
            public = [c["name"] for c in requests.get(f"{API}/categories", timeout=30).json()]
            assert "Motion" not in public
            adm = [c["name"] for c in requests.get(f"{API}/admin/categories", headers=auth, timeout=30).json()]
            assert "Motion" in adm
        finally:
            # Restore
            requests.put(f"{API}/admin/categories/{cid}",
                         json={"name": "Motion", "visible": True, "order": original_order,
                               "slug": motion.get("slug", "")},
                         headers=auth, timeout=30)

    def test_reorder(self, auth):
        cats = requests.get(f"{API}/categories", timeout=30).json()
        original_ids = [c["id"] for c in cats]
        reversed_ids = list(reversed(original_ids))
        try:
            r = requests.put(f"{API}/admin/reorder/categories",
                             json={"ids": reversed_ids}, headers=auth, timeout=30)
            assert r.status_code == 200
            assert r.json().get("ok") is True
            new_ids = [c["id"] for c in requests.get(f"{API}/categories", timeout=30).json()]
            assert new_ids == reversed_ids
        finally:
            requests.put(f"{API}/admin/reorder/categories",
                         json={"ids": original_ids}, headers=auth, timeout=30)
