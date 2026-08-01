import uuid

# ---- Curated premium image URLs (replaceable via CMS) ----
IMG = {
    "hero": "https://images.unsplash.com/photo-1698376621004-70ce754157d1?w=1400&q=80",
    "packaging": "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=1000&q=80",
    "sticker": "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1000&q=80",
    "logo": "https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?w=1000&q=80",
    "marketplace": "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1000&q=80",
    "landing": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1000&q=80",
    "photo": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1000&q=80",
    "motion": "https://images.unsplash.com/photo-1626868713255-cb0c4640a529?w=1000&q=80",
    "social": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1000&q=80",
    "p1": "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1000&q=80",
    "p2": "https://images.unsplash.com/photo-1620428268482-cf1851a36764?w=1000&q=80",
    "p3": "https://images.unsplash.com/photo-1702479744181-2d6b58941583?w=1000&q=80",
    "p4": "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=1000&q=80",
    "p5": "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1000&q=80",
    "p6": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80",
    "g1": "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=1200&q=80",
    "g2": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1200&q=80",
    "g3": "https://images.unsplash.com/photo-1622542796254-5b9c46ab0d2f?w=1200&q=80",
}

DEFAULT_HOMEPAGE = {
    "headline": "Bantu Produkmu Terlihat Lebih Profesional",
    "description": "Veyora hadir sebagai partner kreatif jangka panjang. Kami bantu UMKM dan brand lokal tampil lebih meyakinkan lewat kemasan, logo, dan visual yang menumbuhkan kepercayaan pelanggan.",
    "hero_image": IMG["hero"],
    "primary_cta": "Konsultasi Gratis",
    "secondary_cta": "Lihat Portfolio",
    "statistics": [
        {"value": "320+", "label": "Proyek Selesai"},
        {"value": "180+", "label": "Brand Terbantu"},
        {"value": "4+", "label": "Tahun Pengalaman"},
        {"value": "97%", "label": "Klien Puas"},
    ],
}

DEFAULT_SETTINGS = {
    "business_name": "Veyora Creative Studio",
    "tagline": "Creative Studio",
    "whatsapp_number": "6285177881357",
    "social_links": {
        "instagram": "https://instagram.com",
        "tiktok": "https://tiktok.com",
        "behance": "https://behance.net",
        "linkedin": "https://linkedin.com",
    },
    "footer_info": "Partner kreatif yang membantu bisnis tampil lebih profesional, dari UMKM baru hingga brand yang sedang berkembang.",
    "default_seo_title": "Veyora Creative Studio — Partner Kreatif untuk Brand Anda",
    "default_seo_description": "Veyora membantu UMKM dan brand lokal tampil profesional lewat desain kemasan, logo, dan visual yang menumbuhkan kepercayaan pelanggan.",
}


def _service(title, slug, category, thumb, hero, short, full, price, time, benefits, pricing, addons, faqs, order):
    return {
        "id": str(uuid.uuid4()),
        "title": title, "slug": slug, "category": category,
        "thumbnail": thumb, "hero_image": hero,
        "short_description": short, "full_description": full,
        "starting_price": price, "estimated_time": time,
        "benefits": benefits, "pricing": pricing, "addons": addons,
        "faqs": faqs, "related_portfolio": [],
        "seo_title": f"{title} — Veyora Creative Studio",
        "seo_description": short, "og_image": "", "status": "published", "order": order,
    }


_PRICING_STD = [
    {"name": "Starter", "price": "Rp75.000", "description": "Pas untuk yang baru mulai dan butuh satu desain solid.", "features": ["1 konsep desain", "2x revisi", "File siap cetak (PDF/PNG)", "Pengerjaan 2-3 hari"]},
    {"name": "Standard", "price": "Rp150.000", "description": "Pilihan paling populer dengan lebih banyak opsi & revisi.", "features": ["3 konsep desain", "5x revisi", "File cetak & digital", "Sumber file editable", "Pengerjaan 3-5 hari"]},
    {"name": "Premium", "price": "Rp300.000", "description": "Paket lengkap untuk hasil maksimal tanpa batas revisi.", "features": ["Unlimited konsep", "Revisi sepuasnya", "Semua format file", "Panduan brand ringkas", "Prioritas pengerjaan"]},
]

_ADDONS = [
    {"name": "Desain lagi (per item)", "price": "+Rp50.000"},
    {"name": "Percepat pengerjaan (Fast Track)", "price": "+Rp75.000"},
    {"name": "Revisi tambahan (per revisi)", "price": "+Rp25.000"},
    {"name": "Sumber file editable", "price": "+Rp50.000"},
]


def _faqs(topic):
    return [
        {"question": f"Apakah saya bisa memesan hanya satu {topic}?", "answer": "Tentu. Anda bebas memesan satu item saja atau paket lengkap sesuai kebutuhan bisnis Anda."},
        {"question": "Format file apa yang akan saya terima?", "answer": "Anda menerima file siap cetak (PDF/PNG) dan versi digital. Untuk paket Standard ke atas, tersedia juga sumber file editable."},
        {"question": "Apakah desain bisa langsung dipakai di marketplace?", "answer": "Bisa. Semua desain kami siapkan sesuai standar cetak maupun digital, termasuk ukuran yang umum dipakai di marketplace."},
        {"question": "Berapa lama proses pengerjaannya?", "answer": "Rata-rata 2-5 hari kerja tergantung paket. Butuh lebih cepat? Tersedia opsi Fast Track."},
    ]


DEFAULT_SERVICES = [
    _service("Packaging Design", "packaging-design", "Packaging", IMG["packaging"], IMG["hero"],
             "Kemasan yang membuat produkmu terlihat lebih premium dan dipercaya pelanggan.",
             "Kemasan adalah kesan pertama yang menentukan penjualan. Kami merancang packaging yang tidak hanya menarik dilihat, tetapi juga membangun persepsi kualitas dan siap cetak tanpa repot.",
             "Rp75.000", "2-4 hari", 
             ["Kesan pertama yang meyakinkan pembeli", "Persepsi produk lebih premium", "Siap cetak tanpa revisi berulang", "Konsisten dengan identitas brand"],
             _PRICING_STD, _ADDONS, _faqs("desain kemasan"), 0),
    _service("Sticker Label Design", "sticker-label-design", "Sticker", IMG["sticker"], IMG["hero"],
             "Label dan stiker rapi yang membuat produk terlihat resmi dan terpercaya.",
             "Label yang baik membuat produk terlihat legal, profesional, dan mudah dikenali. Kami rancang label yang informatif, rapi, dan sesuai ukuran cetak apapun.",
             "Rp50.000", "1-3 hari",
             ["Produk terlihat resmi & terpercaya", "Informasi produk tersaji rapi", "Siap untuk berbagai ukuran", "Mudah dikenali di rak"],
             _PRICING_STD, _ADDONS, _faqs("desain label"), 1),
    _service("Logo Design", "logo-design", "Logo", IMG["logo"], IMG["hero"],
             "Logo yang kuat dan mudah diingat sebagai fondasi identitas brand-mu.",
             "Logo adalah wajah bisnis Anda. Kami membangun logo yang sederhana, bermakna, dan fleksibel dipakai di berbagai media, dari kemasan hingga media sosial.",
             "Rp150.000", "3-5 hari",
             ["Identitas brand yang kuat", "Mudah diingat pelanggan", "Fleksibel di semua media", "Panduan penggunaan brand"],
             _PRICING_STD, _ADDONS, _faqs("desain logo"), 2),
    _service("Marketplace Design", "marketplace-design", "Marketplace", IMG["marketplace"], IMG["hero"],
             "Foto produk dan banner toko yang bikin lapak marketplace-mu lebih meyakinkan.",
             "Tampilan toko yang rapi meningkatkan kepercayaan dan konversi. Kami siapkan banner, thumbnail, dan visual produk yang konsisten untuk Shopee, Tokopedia, dan lainnya.",
             "Rp100.000", "2-4 hari",
             ["Toko terlihat lebih profesional", "Meningkatkan kepercayaan pembeli", "Konsisten di semua produk", "Siap untuk semua marketplace"],
             _PRICING_STD, _ADDONS, _faqs("desain marketplace"), 3),
    _service("Landing Page Design", "landing-page-design", "Landing Page", IMG["landing"], IMG["hero"],
             "Halaman promosi yang menjelaskan produkmu dengan jelas dan mengajak pembeli bertindak.",
             "Landing page yang baik mengubah pengunjung menjadi pelanggan. Kami rancang halaman yang fokus, mudah dipahami, dan mengarahkan calon pembeli untuk menghubungi Anda.",
             "Rp300.000", "5-7 hari",
             ["Pesan produk tersampaikan jelas", "Mengarahkan pengunjung untuk membeli", "Tampilan modern & responsif", "Mudah diakses di mobile"],
             _PRICING_STD, _ADDONS, _faqs("desain landing page"), 4),
    _service("Product Photo Editing", "product-photo-editing", "Marketplace", IMG["photo"], IMG["hero"],
             "Editing foto produk agar tampak bersih, tajam, dan siap dipajang di mana saja.",
             "Foto produk yang bersih meningkatkan daya tarik jual. Kami rapikan background, warna, dan pencahayaan agar produk Anda tampil maksimal.",
             "Rp25.000", "1-2 hari",
             ["Foto bersih & profesional", "Warna produk akurat", "Background rapi dan konsisten", "Siap untuk marketplace & sosmed"],
             _PRICING_STD, _ADDONS, _faqs("editing foto"), 5),
    _service("Motion Graphic", "motion-graphic", "Motion", IMG["motion"], IMG["hero"],
             "Video pendek dinamis untuk memperkenalkan produk dan menarik perhatian di sosial media.",
             "Konten bergerak lebih mudah menarik perhatian. Kami buat motion graphic singkat yang menjelaskan produk atau promo Anda dengan gaya yang modern dan rapi.",
             "Rp250.000", "4-6 hari",
             ["Menarik perhatian di sosial media", "Pesan tersampaikan cepat", "Terlihat modern & profesional", "Cocok untuk promo & launching"],
             _PRICING_STD, _ADDONS, _faqs("motion graphic"), 6),
    _service("Social Media Design", "social-media-design", "Marketplace", IMG["social"], IMG["hero"],
             "Feed dan konten sosial media yang konsisten dan enak dipandang untuk membangun brand.",
             "Feed yang konsisten membuat brand Anda mudah diingat. Kami siapkan template dan konten visual yang seragam agar sosial media Anda terlihat rapi dan profesional.",
             "Rp100.000", "2-4 hari",
             ["Feed rapi & konsisten", "Brand mudah dikenali", "Template siap pakai", "Meningkatkan engagement"],
             _PRICING_STD, _ADDONS, _faqs("desain sosial media"), 7),
]


def _portfolio(name, category, thumb, gallery, overview, challenge, solution, deliverables, order, related=None):
    cat_slug = {
        "Packaging": "packaging-design", "Logo": "logo-design", "Sticker": "sticker-label-design",
        "Landing Page": "landing-page-design", "Marketplace": "marketplace-design", "Motion": "motion-graphic",
    }
    rel = related or ([cat_slug[category]] if category in cat_slug else [])
    return {
        "id": str(uuid.uuid4()),
        "project_name": name, "category": category, "thumbnail": thumb,
        "gallery": gallery, "overview": overview, "challenge": challenge,
        "solution": solution, "deliverables": deliverables,
        "related_service": rel[0] if rel else "", "related_services": rel,
        "seo_title": f"{name} — Portfolio Veyora", "seo_description": overview,
        "og_image": "", "status": "published", "order": order,
    }


_GAL = [IMG["g1"], IMG["g2"], IMG["g3"]]

DEFAULT_PORTFOLIO = [
    _portfolio("Kopi Nusantara", "Packaging", IMG["packaging"], [IMG["packaging"]] + _GAL,
               "Rebranding kemasan untuk brand kopi lokal agar tampil lebih premium di rak toko dan marketplace.",
               "Kemasan lama terlihat generik dan sulit bersaing dengan brand kopi lain di marketplace.",
               "Kami rancang ulang kemasan dengan identitas warna khas dan tipografi yang tegas, menonjolkan asal biji kopi.",
               ["Desain kemasan primer", "Label informasi produk", "Mockup 3D untuk marketplace"], 0),
    _portfolio("Batik Larasati", "Logo", IMG["logo"], [IMG["logo"]] + _GAL,
               "Pembuatan logo dan identitas visual untuk brand fashion batik modern.",
               "Brand butuh logo yang menggabungkan kesan tradisional sekaligus modern.",
               "Kami padukan elemen motif batik yang disederhanakan dengan tipografi bersih dan elegan.",
               ["Logo utama & variasi", "Palet warna brand", "Panduan penggunaan logo"], 1),
    _portfolio("Snack Ceria", "Sticker", IMG["sticker"], [IMG["sticker"]] + _GAL,
               "Desain label stiker untuk lini produk camilan rumahan agar terlihat lebih resmi.",
               "Produk belum memiliki label yang meyakinkan sehingga sulit masuk ke reseller.",
               "Kami buat sistem label konsisten dengan informasi lengkap dan tampilan cerah yang menggugah selera.",
               ["Desain label 5 varian rasa", "Format siap cetak", "Ukuran fleksibel"], 2),
    _portfolio("Glow Skincare", "Marketplace", IMG["p3"], [IMG["p3"]] + _GAL,
               "Penataan visual toko marketplace dan foto produk untuk brand skincare lokal.",
               "Tampilan toko kurang rapi dan foto produk tidak konsisten sehingga menurunkan kepercayaan.",
               "Kami seragamkan seluruh visual toko, banner promo, dan editing foto produk agar tampak profesional.",
               ["Banner toko & promo", "Editing 20 foto produk", "Template thumbnail"], 3),
    _portfolio("Fresh Juice Landing", "Landing Page", IMG["landing"], [IMG["landing"]] + _GAL,
               "Landing page promo untuk brand minuman sehat yang sedang launching produk baru.",
               "Brand butuh halaman promo yang jelas dan mengarahkan pengunjung untuk memesan via WhatsApp.",
               "Kami buat landing page fokus dengan alur yang mengarahkan pengunjung dari kenal produk hingga memesan.",
               ["Desain landing page responsif", "Copywriting promo", "Integrasi tombol WhatsApp"], 4),
    _portfolio("Launch Teaser", "Motion", IMG["motion"], [IMG["motion"]] + _GAL,
               "Motion graphic pendek untuk teaser peluncuran produk gadget lokal.",
               "Brand ingin membuat penasaran audiens sebelum produk resmi dirilis.",
               "Kami produksi video teaser 15 detik dengan animasi rapi dan ritme yang membangun antisipasi.",
               ["Video teaser 15 detik", "Versi vertikal & horizontal", "File siap unggah"], 5),
]

DEFAULT_FAQS = [
    {"id": str(uuid.uuid4()), "question": "Apakah Veyora cocok untuk usaha yang baru mulai?", "answer": "Sangat cocok. Kami banyak membantu UMKM yang baru merintis untuk tampil lebih profesional sejak awal, dengan pilihan paket yang ramah di kantong.", "category": "Umum", "order": 0},
    {"id": str(uuid.uuid4()), "question": "Apakah file desain langsung bisa dicetak?", "answer": "Ya. Semua desain kami siapkan sesuai standar cetak (resolusi tinggi, format PDF/PNG) sehingga bisa langsung Anda bawa ke percetakan.", "category": "Umum", "order": 1},
    {"id": str(uuid.uuid4()), "question": "Berapa kali revisi yang saya dapatkan?", "answer": "Tergantung paket yang dipilih, mulai dari 2x revisi hingga revisi sepuasnya. Kami ingin memastikan Anda benar-benar puas dengan hasilnya.", "category": "Proses", "order": 2},
    {"id": str(uuid.uuid4()), "question": "Bagaimana cara memulai kerja sama dengan Veyora?", "answer": "Cukup hubungi kami lewat WhatsApp untuk konsultasi gratis. Kami akan diskusikan kebutuhan Anda sebelum masuk ke proses desain.", "category": "Proses", "order": 3},
    {"id": str(uuid.uuid4()), "question": "Apakah Veyora bisa membantu foto produk untuk marketplace?", "answer": "Bisa. Kami menyediakan layanan editing foto produk agar tampak bersih, tajam, dan konsisten untuk kebutuhan marketplace maupun sosial media.", "category": "Layanan", "order": 4},
    {"id": str(uuid.uuid4()), "question": "Berapa lama waktu pengerjaan rata-rata?", "answer": "Umumnya 2-5 hari kerja tergantung jenis layanan dan paket. Jika Anda membutuhkan lebih cepat, tersedia opsi Fast Track.", "category": "Proses", "order": 5},
]


def _cat(name, order):
    return {"id": str(uuid.uuid4()), "name": name,
            "slug": name.lower().replace(" ", "-"), "visible": True, "order": order}


DEFAULT_CATEGORIES = [
    _cat("Packaging", 0), _cat("Logo", 1), _cat("Sticker", 2),
    _cat("Landing Page", 3), _cat("Marketplace", 4), _cat("Motion", 5),
]
