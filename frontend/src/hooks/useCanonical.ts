import { useEffect } from "react";

/**
 * Ajoute dynamiquement une balise canonique dans le <head> pour le SEO.
 * @param canonicalUrl L'URL canonique complète (ex: https://www.fearlogapp.com/forum)
 */
export function useCanonical(canonicalUrl: string) {
  useEffect(() => {
    if (!canonicalUrl) return;
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);
    return () => {
      // Optionnel : nettoyer la balise canonique si besoin
      // link?.parentNode?.removeChild(link);
    };
  }, [canonicalUrl]);
}
