import styles from "./logo.module.scss";

interface LogoProps {
  className?: string;
  /** Height in pixels — width follows automatically (the source SVGs are a fixed 280:68 ratio). */
  height?: number;
}

/**
 * The StudyLoop wordmark+icon lockup, swapped between the light/dark SVG
 * variants purely via CSS (`:global(.dark)` toggling which `<img>` is
 * visible) — no theme-detection JS or mount guard needed, since next-themes
 * already stamps the `.dark` class on `<html>` before first paint (see
 * ThemeProvider's no-flash boot script). Both images are always in the DOM;
 * only one is ever visible.
 */
export function Logo({ className, height = 36 }: LogoProps) {
  return (
    <span className={`${styles.logo} ${className ?? ""}`} style={{ height }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static local SVG, swapped by theme via CSS; next/image adds no value here */}
      <img src="/studyloop-logo-light.svg" alt="StudyLoop" className={styles.light} />
      {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
      <img src="/studyloop-logo-dark.svg" alt="StudyLoop" className={styles.dark} />
    </span>
  );
}
