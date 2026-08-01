import { useEffect } from "react";

// Analytics readiness: injects GA4 / GTM / Microsoft Clarity ONLY when the
// corresponding environment variable is provided. Leave them unset to disable.
//   REACT_APP_GTM_ID     e.g. GTM-XXXXXXX
//   REACT_APP_GA_ID      e.g. G-XXXXXXXXXX
//   REACT_APP_CLARITY_ID e.g. abcdefghij
export default function Analytics() {
  useEffect(() => {
    const { REACT_APP_GTM_ID, REACT_APP_GA_ID, REACT_APP_CLARITY_ID } = process.env;

    if (REACT_APP_GTM_ID) {
      const s = document.createElement("script");
      s.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${REACT_APP_GTM_ID}');`;
      document.head.appendChild(s);
    }

    if (REACT_APP_GA_ID) {
      const g = document.createElement("script");
      g.async = true;
      g.src = `https://www.googletagmanager.com/gtag/js?id=${REACT_APP_GA_ID}`;
      document.head.appendChild(g);
      const inline = document.createElement("script");
      inline.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${REACT_APP_GA_ID}');`;
      document.head.appendChild(inline);
    }

    if (REACT_APP_CLARITY_ID) {
      const c = document.createElement("script");
      c.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${REACT_APP_CLARITY_ID}");`;
      document.head.appendChild(c);
    }
  }, []);

  return null;
}

// Fire a lightweight conversion event to whichever analytics tool is present.
// Safe to call even when no analytics is configured.
export function trackWhatsApp(context) {
  try {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "whatsapp_click", wa_context: context || "general" });
    if (typeof window.gtag === "function") {
      window.gtag("event", "whatsapp_click", { wa_context: context || "general" });
    }
    if (typeof window.clarity === "function") {
      window.clarity("event", "whatsapp_click");
    }
  } catch (e) {
    /* no-op */
  }
}
