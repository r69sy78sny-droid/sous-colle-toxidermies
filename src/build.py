"""Assemble index.html (vrai jeu) et demo.html (page de test) à partir des morceaux de src/.

Usage : python3 src/build.py   (réécrit index.html et demo.html à la racine)
"""
import json, re, sys, os

B = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(B, "..")
rd = lambda n: open(os.path.join(B, n), encoding="utf-8").read()

head = rd("head.html")
fx, app = rd("fx.js"), rd("app.js")
imgs = json.load(open(os.path.join(B, "images.json"), encoding="utf-8"))
data = rd("data.js").replace("__IMAGES__", json.dumps(imgs, ensure_ascii=False, indent=2))


def page(h, data_js):
    return h + "\n<script>\n" + fx + "\n</script>\n<script>\n" + data_js + "\n</script>\n<script>\n" + app + "\n</script>\n</body>\n</html>\n"


def region(h, tag, new):
    pat = re.compile(r"<!--%s-->.*?<!--/%s-->" % (tag, tag), re.S)
    assert pat.search(h), tag
    return pat.sub(lambda m: new, h, count=1)


# vrai jeu : on retire seulement les marqueurs
real = re.sub(r"<!--/?(TITLE|BANNER|COURSE|FOOT|FOOTLINK)-->\n?", "", head)
open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(page(real, data))

# page de test
demo = head
demo = region(demo, "TITLE", "ToxiQuest · Page de test")
demo = demo.replace("<!--BANNER-->", '<div class="demo-banner"><div class="wrap">🧪 PAGE DE TEST · contenu fictif, aucune vraie question · la progression est enregistrée à part<a href="./">← Revenir au vrai jeu</a></div></div>')
demo = region(demo, "COURSE", rd("course_demo.html"))
demo = region(demo, "FOOT", "    <p><b>Page de test</b> : même moteur que le vrai jeu (sons, animations, fiches interactives, Trivial, cas, bilan), avec un contenu inventé pour ne rien dévoiler.</p>\n    <details><summary>Crédits des photographies (Wikimedia Commons)</summary><ul id=\"credits\"></ul></details>\n")
demo = region(demo, "FOOTLINK", '<a href="./">← Revenir au vrai jeu</a>')
demo = demo.replace('<small>Item 115 (LiSA 2026) · Toxidermies — sous-colle EDN à trois</small>', '<small>Page de test · contenu fictif</small>')
open(os.path.join(OUT, "demo.html"), "w", encoding="utf-8").write(page(demo, rd("data_demo.js")))
print("index.html", os.path.getsize(os.path.join(OUT, "index.html")), "· demo.html", os.path.getsize(os.path.join(OUT, "demo.html")))
