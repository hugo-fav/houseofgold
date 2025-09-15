// app/page.jsx
import ProductImages from "@/components/ProductImages";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  // pass phone via env or fallback (use international digits, e.g. 2348012345678)
  const ownerPhone = process.env.NEXT_PUBLIC_OWNER_PHONE || "2348012345678";

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Link href="/">Baby Store</Link>
        </div>

        <nav className={styles.nav}>
          <Link href="#products">Shop</Link>
          <Link href="#new">New</Link>
          <Link href="#about">About</Link>
          <Link href="#contact">Contact</Link>
        </nav>

        <div className={styles.headerActions}>
          <button className={styles.searchBtn} aria-label="Search">
            🔎
          </button>
          <Link className={styles.cart} href="#" aria-label="Cart">
            🛒
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1>Welcome to Baby Store</h1>
            <p>
              Curated essentials for little ones — soft, safe and stylish. Shop
              our featured picks below.
            </p>
            <Link className={styles.heroCta} href="#products">
              Shop Featured
            </Link>
            <div className={styles.heroSub}>
              Free shipping on orders over ₦10,000 • 30-day returns
            </div>
          </div>

          {/* Visual/Collage — uses decorative images from /public (or replace with background image) */}
          <div className={styles.heroVisual} aria-hidden>
            <div className={styles.collage}>
              <div className={styles.collageLarge}></div>
              <div className={styles.collageStack}>
                <div className={styles.collageItem}></div>
                <div className={styles.collageItem}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className={styles.section}>
        <h2 className={styles.sectionTitle}>Featured products</h2>
        {/* pass ownerPhone so Buy Now whatsapp link works */}
        <ProductImages ownerPhone={ownerPhone} />
      </section>

      <section className={styles.infoStrip}>
        <div>🚚 Fast shipping</div>
        <div>🔁 30-day returns</div>
        <div>🔒 Secure checkout</div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <strong>Baby Store</strong> — © {new Date().getFullYear()}
        </div>
        <div className={styles.footerRight}>
          <Link href="#contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </footer>
    </main>
  );
}
