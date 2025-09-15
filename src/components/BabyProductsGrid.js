// components/BabyProductsGrid.jsx
"use client";
import React, { useMemo } from "react";
import styled from "styled-components";

/* ---------- Styles ---------- */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
  padding: 24px;
  background: #fafafa;

  @media (max-width: 768px) {
    gap: 14px;
    padding: 16px;
  }
`;

const Card = styled.div`
  position: relative;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 220ms ease, box-shadow 220ms ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
  }
`;

/* Use a transient prop ($variant) so styled-components does NOT forward it to the DOM */
const Visual = styled.div`
  position: relative;
  width: 100%;
  height: ${({ $variant }) =>
    $variant === "tall"
      ? "380px"
      : $variant === "large"
      ? "300px"
      : $variant === "medium"
      ? "240px"
      : "180px"};
  background: #f4f4f4;
  overflow: hidden;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 320ms ease;
  display: block;

  /* secondary images (if rendered) can use the 'secondary' class */
  &.secondary {
    position: absolute;
    inset: 0;
    top: 0;
    opacity: 0;
    transform: scale(1.02);
    transition: opacity 260ms ease, transform 320ms ease;
  }

  ${Card}:hover & {
    transform: scale(1.05);
  }
  ${Card}:hover &.secondary {
    opacity: 1;
    transform: scale(1.03);
  }
`;

/* Buy Now button styles */
const BuyNowBtn = styled.a`
  position: absolute;
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%) translateY(10px);
  display: inline-block;
  padding: 10px 16px;
  background: #25d366;
  color: #fff;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  box-shadow: 0 6px 18px rgba(37, 211, 102, 0.18);
  opacity: 0;
  transition: opacity 220ms ease, transform 220ms ease, box-shadow 220ms ease;

  ${Card}:hover & {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  @media (max-width: 720px) {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    width: calc(100% - 32px);
    text-align: center;
    padding: 12px 16px;
  }
`;

/* sr-only helper */
const SrOnly = styled.span`
  border: 0 !important;
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px !important;
  margin: -1px !important;
  overflow: hidden !important;
  padding: 0 !important;
  position: absolute !important;
  width: 1px !important;
`;

/* ---------- Helpers ---------- */
const VARIANTS = ["small", "medium", "large", "tall"];

function pickVariant(seed) {
  const s = String(seed || Math.random());
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  h = Math.abs(h);
  return VARIANTS[h % VARIANTS.length];
}

/** Build WhatsApp link including an absolute product image URL so WhatsApp can preview it.
 *  It requires the SITE_URL to be set in NEXT_PUBLIC_SITE_URL and images to be publicly accessible.
 */
function buildWhatsAppLink(phone, productUrl, productLabel) {
  if (!phone) return "#";
  const digits = String(phone).replace(/\D/g, "");
  if (!digits) return "#";
  const message = `Hi, I'm interested in this product: ${productLabel}. ${productUrl}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/* ---------- Component ---------- */
/**
 * props:
 * - products: array of strings (paths in /public) or objects { id, src, src2, alt }
 * - ownerPhone: international phone e.g. "2348012345678" (optional)
 */
export default function BabyProductsGrid({ products = [], ownerPhone }) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const phone = ownerPhone || process.env.NEXT_PUBLIC_OWNER_PHONE || "";

  const normalized = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    return list.map((p, i, arr) => {
      if (typeof p === "string") {
        const raw = p.trim();
        const src = raw.startsWith("/") ? raw : `/${raw}`;
        const id = raw;
        const file = raw.substring(raw.lastIndexOf("/") + 1);
        const alt = decodeURI(
          file.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ")
        );
        const nextRaw =
          typeof arr[(i + 1) % arr.length] === "string"
            ? arr[(i + 1) % arr.length]
            : raw;
        const src2 = nextRaw
          ? nextRaw.startsWith("/")
            ? nextRaw
            : `/${nextRaw}`
          : src;
        return { id, src, src2, alt };
      }
      return {
        id: p.id ?? p.src ?? i,
        src: p.src ? (p.src.startsWith("/") ? p.src : `/${p.src}`) : "",
        src2: p.src2
          ? p.src2.startsWith("/")
            ? p.src2
            : `/${p.src2}`
          : p.src
          ? p.src.startsWith("/")
            ? p.src
            : `/${p.src}`
          : "",
        alt: p.alt ?? "",
      };
    });
  }, [products]);

  if (!normalized.length) return null;

  return (
    <Grid>
      {normalized.map((p, i) => {
        const variant = pickVariant(p.id || p.src || i);
        const productAbsoluteUrl = `${SITE_URL}${p.src}`;
        const waLink = buildWhatsAppLink(
          phone,
          productAbsoluteUrl,
          p.alt || `product ${i + 1}`
        );

        return (
          <Card key={p.id || i} aria-label={p.alt || `product-${i + 1}`}>
            {/* transient prop $variant prevents forwarding to DOM */}
            <Visual $variant={variant}>
              <Img
                src={p.src}
                alt={p.alt || ""}
                loading="lazy"
                decoding="async"
              />
              {p.src2 && (
                <Img
                  className="secondary"
                  src={p.src2}
                  alt={`${p.alt || ""} alt`}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <BuyNowBtn
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Buy ${p.alt || `product ${i + 1}`}`}
              >
                Buy Now
              </BuyNowBtn>

              <div style={{ height: 1, overflow: "hidden" }}>
                <SrOnly>{p.alt || `Product ${i + 1}`}</SrOnly>
              </div>
            </Visual>
          </Card>
        );
      })}
    </Grid>
  );
}
