import { useEffect } from "react";

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
        };
    }, [canonicalUrl]);
}
