/**
 * 与首页一致的岩点平铺 + 径向渐变（fixed，不参与文档流高度）。
 */
export function AppPageBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-repeat opacity-[0.11]"
        style={{
          backgroundImage: "url(/holds.png)",
          backgroundSize: "220px auto",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_92%_72%_at_50%_38%,rgba(26,26,26,0.045),transparent_58%)]"
      />
    </>
  );
}
