import { Camera, ChevronRight, Video } from "lucide-react";
import Link from "next/link";

import { AppPageBackground } from "@/components/app-page-background";

/** 斜向排线阴影（手绘素描感） */
function DiagonalHatch({
  lines,
  opacity = 0.48,
}: {
  lines: readonly { x1: number; y1: number; x2: number; y2: number }[];
  opacity?: number;
}) {
  return (
    <g
      opacity={opacity}
      stroke="#1a1a1a"
      strokeWidth={0.85}
      strokeLinecap="round"
    >
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
      ))}
    </g>
  );
}

function BoltHole({ cx, cy, r = 1.35 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="#1a1a1a" />;
}

/** 大 jug / 腰豆形 */
function HoldJugBlob({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 34" fill="none" aria-hidden>
      <path
        d="M17.5 3.2c4.8-.4 9.2 1.8 11.4 5.6 1.1 1.9 1.3 4 .6 6-.8 2.3-2.6 4-4.8 4.8 2.2 1.4 3.6 3.8 3.4 6.4-.2 4-4.6 7-10.2 6.8-5.2-.2-9.4-2.8-10.4-6.4-.6-2 .2-4 1.4-5.6-2.4-1.4-3.8-4-3.4-6.8.4-3.6 5.6-6.4 11.8-6.8z"
        fill="#f0eeea"
        stroke="#1a1a1a"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <BoltHole cx={14} cy={12} />
      <BoltHole cx={22} cy={18} r={1.15} />
      <DiagonalHatch
        lines={[
          { x1: 8, y1: 22, x2: 12, y2: 17 },
          { x1: 10, y1: 25, x2: 15, y2: 19 },
          { x1: 12, y1: 28, x2: 17, y2: 22 },
          { x1: 9, y1: 19, x2: 13, y2: 14 },
        ]}
      />
    </svg>
  );
}

/** 窄 crimp 条 */
function HoldCrimpStrip({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 34 14" fill="none" aria-hidden>
      <path
        d="M4 9.5c5-2.2 12-3 22-1.8 2.8.4 4.6 2.4 4.2 4.6-.3 1.6-1.8 2.8-3.8 3-6.8.8-14.8 1-21-.2-2.2-.4-4.2-1.6-4.6-3.4-.4-2 1.4-4 4.2-4.4z"
        fill="#f0eeea"
        stroke="#1a1a1a"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <BoltHole cx={17} cy={6.5} />
      <DiagonalHatch
        lines={[
          { x1: 7, y1: 11, x2: 10, y2: 7 },
          { x1: 10, y1: 11.5, x2: 13, y2: 7.5 },
          { x1: 13, y1: 12, x2: 16, y2: 8 },
        ]}
      />
    </svg>
  );
}

/** 浅 sloper 扁圆 */
function HoldSloperDome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 26" fill="none" aria-hidden>
      <path
        d="M16 4c7.6.2 13 4.6 12.8 10-.1 3.2-2.4 5.8-5.8 7-2.8 1-6.2 1.2-9.4.4-4.6-1-7.8-4-7.6-7.4.2-5.2 5.8-9.4 10-10z"
        fill="#f0eeea"
        stroke="#1a1a1a"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <BoltHole cx={16} cy={11} />
      <DiagonalHatch
        lines={[
          { x1: 9, y1: 18, x2: 13, y2: 13 },
          { x1: 11, y1: 20, x2: 15, y2: 15 },
          { x1: 13, y1: 21.5, x2: 17, y2: 16.5 },
        ]}
      />
    </svg>
  );
}

/** 三角 volume（三面透视） */
function HoldVolumeFace({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 34 32" fill="none" aria-hidden>
      <path
        d="M17 3L5 24l11 5 17-4L17 3z"
        fill="#f0eeea"
        stroke="#1a1a1a"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M17 3l17 21-6 4-11-16"
        fill="#f5f4f0"
        stroke="#1a1a1a"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <path
        d="M5 24l6 4 11-16"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <BoltHole cx={17} cy={14} />
      <DiagonalHatch
        lines={[
          { x1: 10, y1: 22, x2: 14, y2: 17 },
          { x1: 12, y1: 24, x2: 16, y2: 19 },
        ]}
      />
    </svg>
  );
}

/** 环形 pocket */
function HoldPocket({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none" aria-hidden>
      <ellipse
        cx={15}
        cy={15}
        rx={11}
        ry={10.5}
        fill="#f0eeea"
        stroke="#1a1a1a"
        strokeWidth={1.5}
      />
      <ellipse
        cx={15}
        cy={15}
        rx={5.2}
        ry={4.8}
        fill="#f5f4f0"
        stroke="#1a1a1a"
        strokeWidth={1.2}
      />
      <BoltHole cx={15} cy={9.5} r={1.2} />
      <DiagonalHatch
        lines={[
          { x1: 7, y1: 20, x2: 11, y2: 15 },
          { x1: 9, y1: 22, x2: 13, y2: 17 },
        ]}
      />
    </svg>
  );
}

/** 小侧拉 / pinchy */
function HoldPinch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 20" fill="none" aria-hidden>
      <path
        d="M5 14c2-4 5.5-7 10-7.5 3.2-.4 6 1.2 6.8 3.8.6 1.8 0 3.6-1.4 4.8-2 1.8-5.4 2.4-9 1.4C8 15.6 5.4 15.2 5 14z"
        fill="#f0eeea"
        stroke="#1a1a1a"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <BoltHole cx={12} cy={8} r={1.15} />
      <DiagonalHatch
        lines={[
          { x1: 7, y1: 15, x2: 10, y2: 11 },
          { x1: 8.5, y1: 16.5, x2: 11.5, y2: 12.5 },
        ]}
      />
    </svg>
  );
}

/** 圆形 jug（略不规则） */
function HoldJugRound({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M16 4.5c6.2.3 11.2 4.1 11.5 9.8.2 3.1-1.4 5.8-3.8 7.2 1.1 1.4 1.7 3.1 1.5 5-.4 4.5-5.6 7.8-12.2 7.5-6-.3-10.8-3.5-11.5-7.8-.3-1.8.2-3.5 1.2-4.8-2.8-1.6-4.5-4.5-4.2-7.8.4-5.2 6-9.2 12.5-9.1z"
        fill="#f0eeea"
        stroke="#1a1a1a"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <BoltHole cx={15.2} cy={14} />
      <DiagonalHatch
        lines={[
          { x1: 8, y1: 22, x2: 12, y2: 17 },
          { x1: 10, y1: 25, x2: 14, y2: 20 },
          { x1: 12, y1: 27, x2: 16, y2: 22 },
        ]}
      />
    </svg>
  );
}

/** 歪三角薄片 */
function HoldTriangle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 26" fill="none" aria-hidden>
      <path
        d="M13.2 4.2L4.8 20.5c-.6 1.1.2 2.4 1.5 2.5l15.8 1.2c1.4.1 2.5-1.1 2-2.4L15.5 4.1c-.5-1.1-2-1.2-2.3-.1z"
        fill="#f0eeea"
        stroke="#1a1a1a"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <BoltHole cx={12} cy={14} r={1.15} />
      <DiagonalHatch
        lines={[
          { x1: 10, y1: 18, x2: 13, y2: 14 },
          { x1: 11.5, y1: 20, x2: 14.5, y2: 16 },
        ]}
      />
    </svg>
  );
}

/**
 * 坐姿黑猫（参考吉卜力式 Jiji）：梨形身、长颈、大尖耳、
 * 白椭圆眼 + 小黑瞳孔、白鼻尖、黑色胡须；轮廓略不规则偏手绘。
 * 整体略转向左，像在「看」Route Analysis 卡片。
 */
function CatIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 84 118"
      width={84}
      height={118}
      aria-hidden
    >
      <g transform="rotate(-7 42 70)">
        {/* 尾巴：细长，向观者左侧上方卷起 */}
        <path
          d="M22 78 C9 70 5.5 52 10.5 36 C13 26 19.5 19 27.5 17.5"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 剪影：尖耳、长颈、梨形身、圆臀坐姿；控制点略歪 → 手绘感 */}
        <path
          fill="#1a1a1a"
          stroke="#1a1a1a"
          strokeWidth={0.5}
          strokeLinejoin="round"
          d="M41 99.5
             C30 100.5 22.5 95 23.5 86
             C24.5 76 28 68 31 61
             C32.5 54 31 48 29.5 43
             C28 38 27.5 33 29 28.5
             C27.5 24 27 19 28.5 14.5
             L26.5 10
             C25.5 6.5 28 3.5 32 2.8
             L34.8 0.5
             L40 7.2
             L45.2 0.5
             L48 2.8
             C52 3.5 54.5 6.5 53.5 10
             L51.5 14.5
             C53 19 52.5 24 51 28.5
             C52.5 33 52 38 50.5 43
             C49 48 47.5 54 49 61
             C52 68 55.5 76 56.5 86
             C57.5 95 50 100.5 39 99.5
             C40 97.8 41.2 96.5 42.5 95.8
             C43.8 96.5 45 97.8 46 99.5
             C44.5 100.2 43 100.4 41 99.5 Z"
        />

        {/* 白椭圆眼 + 小黑点瞳孔 */}
        <ellipse cx={34.5} cy={26.5} rx={4.2} ry={6.2} fill="white" />
        <ellipse cx={49.5} cy={26.5} rx={4.2} ry={6.2} fill="white" />
        <circle cx={35} cy={26.5} r={1.25} fill="#1a1a1a" />
        <circle cx={50} cy={26.5} r={1.25} fill="#1a1a1a" />

        {/* 鼻尖：小白点 */}
        <ellipse cx={42} cy={35.5} rx={1.15} ry={1.05} fill="white" />

        {/* 胡须：黑色细线，伸向浅色背景 */}
        <g
          stroke="#1a1a1a"
          strokeWidth={1.05}
          strokeLinecap="round"
          fill="none"
        >
          <line x1={26} y1={28} x2={4} y2={24.5} />
          <line x1={25.5} y1={30.5} x2={3} y2={31} />
          <line x1={26.5} y1={33} x2={5} y2={37} />
          <line x1={58} y1={28} x2={80} y2={24.5} />
          <line x1={58.5} y1={30.5} x2={81} y2={31} />
          <line x1={57.5} y1={33} x2={79} y2={37} />
        </g>
      </g>
    </svg>
  );
}

function HeroDivider({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 280 8"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 4.2c18-1.2 36-.8 54 .4 22 1.4 44 1 66-.2 38-2.2 76-2.4 114-.2 22 1.2 44 1.6 66 .2 18-1.2 36-1.6 54-.4"
        stroke="#1a1a1a"
        strokeWidth={1.15}
        strokeLinecap="round"
        opacity={0.35}
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <AppPageBackground />

      <main className="relative mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col justify-center px-4 py-3 sm:px-6 sm:py-6">
        {/* 标题 + 卡片作为一整块垂直居中；装饰岩点相对此块定位 */}
        <div className="relative z-10 w-full shrink-0">
          <HoldPinch className="pointer-events-none absolute -left-1 -top-2 h-[18px] w-[22px] -rotate-[12deg] sm:-left-2 sm:-top-3 sm:h-[22px] sm:w-[26px]" />
          <HoldCrimpStrip className="pointer-events-none absolute -right-1 -top-1 h-[14px] w-[28px] rotate-[8deg] opacity-95 sm:right-0 sm:top-0" />
          <HoldSloperDome className="pointer-events-none absolute -right-2 top-8 h-[20px] w-[24px] -rotate-[6deg] sm:top-12 sm:h-[24px] sm:w-[30px]" />

          <header className="relative mb-4 text-center sm:mb-6 sm:text-left">
            <h1 className="text-[2.05rem] font-bold leading-[1.05] tracking-tight text-[#1a1a1a] sm:text-[2.75rem]">
              No Beta
            </h1>
            <p className="mx-auto mt-2 max-w-[18rem] text-[0.95rem] font-medium leading-snug tracking-wide text-[#1a1a1a]/75 sm:mx-0 sm:mt-2.5 sm:max-w-none sm:text-lg">
              find your own way up
            </p>
            <HeroDivider className="mx-auto mt-4 h-2 w-[min(14rem,70vw)] sm:mx-0 sm:mt-5" />
          </header>

          <div className="relative">
            <HoldJugBlob className="pointer-events-none absolute -left-2 top-0 h-[26px] w-[28px] -rotate-[10deg] sm:-left-3 sm:top-2 sm:h-[32px] sm:w-[34px]" />
            <HoldPocket className="pointer-events-none absolute -left-2 top-[32%] h-[22px] w-[22px] rotate-[14deg] sm:top-[36%] sm:h-[28px] sm:w-[28px]" />
            <HoldVolumeFace className="pointer-events-none absolute -right-2 top-2 h-[24px] w-[26px] rotate-[18deg] sm:top-4 sm:h-[30px] sm:w-[32px]" />
            <HoldJugRound className="pointer-events-none absolute -right-1 top-[40%] h-[20px] w-[20px] -rotate-[22deg] sm:top-[44%] sm:h-[26px] sm:w-[26px]" />
            <HoldTriangle className="pointer-events-none absolute bottom-8 left-0 h-[20px] w-[22px] rotate-[10deg] sm:bottom-10 sm:h-[24px] sm:w-[26px]" />
            <HoldCrimpStrip className="pointer-events-none absolute bottom-20 right-0 h-[12px] w-[26px] -rotate-[25deg] opacity-90 sm:bottom-28 sm:h-[14px] sm:w-[32px]" />
            <HoldSloperDome className="pointer-events-none absolute bottom-2 right-1 h-[18px] w-[22px] rotate-[12deg] sm:bottom-4 sm:right-2 sm:h-[22px] sm:w-[28px]" />
            <HoldPinch className="pointer-events-none absolute bottom-24 left-0 h-[16px] w-[20px] -rotate-[8deg] sm:bottom-32 sm:h-[20px] sm:w-[24px]" />
            <HoldJugBlob className="pointer-events-none absolute top-[48%] -right-3 h-[20px] w-[22px] rotate-[24deg] opacity-88 max-sm:hidden sm:top-[52%] sm:h-[24px] sm:w-[26px]" />
            <HoldPocket className="pointer-events-none absolute bottom-0 left-4 h-[18px] w-[18px] -rotate-[16deg] sm:left-6 sm:h-[22px] sm:w-[22px]" />

            <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
              <div className="relative shrink-0">
                <CatIllustration className="pointer-events-none absolute -top-1 right-0 z-20 h-[72px] w-[52px] -translate-y-[calc(100%-2px)] sm:-top-2 sm:right-2 sm:h-[118px] sm:w-[84px] sm:-translate-y-[calc(100%-4px)]" />
                <Link
                  href="/analyze"
                  className="group flex items-start gap-3.5 rounded-[6px] border-2 border-[#1a1a1a] bg-[#fffefc] p-3.5 text-[#1a1a1a] shadow-[4px_4px_0_0_#1a1a1a] transition-[transform,box-shadow,background-color] duration-150 hover:bg-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#1a1a1a] sm:gap-4 sm:p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded border-2 border-[#1a1a1a] bg-[#f5f4f0] sm:h-12 sm:w-12">
                    <Camera
                      className="h-[1.35rem] w-[1.35rem] opacity-90 sm:h-6 sm:w-6"
                      strokeWidth={1.65}
                      aria-hidden
                    />
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                      Route Analysis
                    </h2>
                    <p className="mt-1 text-xs leading-snug text-[#1a1a1a]/68 sm:mt-1.5 sm:text-sm sm:leading-relaxed">
                      Upload a wall photo, get AI breakdown of holds and movement
                    </p>
                  </div>
                  <ChevronRight
                    className="mt-1 h-5 w-5 shrink-0 text-[#1a1a1a]/35 transition-transform duration-150 group-hover:translate-x-0.5 sm:mt-1.5 sm:h-5 sm:w-5"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </Link>
              </div>

              <Link
                href="/library"
                className="group flex shrink-0 items-start gap-3.5 rounded-[6px] border-2 border-[#1a1a1a] bg-[#fffefc] p-3.5 text-[#1a1a1a] shadow-[4px_4px_0_0_#1a1a1a] transition-[transform,box-shadow,background-color] duration-150 hover:bg-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#1a1a1a] sm:gap-4 sm:p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded border-2 border-[#1a1a1a] bg-[#f5f4f0] sm:h-12 sm:w-12">
                  <Video
                    className="h-[1.35rem] w-[1.35rem] opacity-90 sm:h-6 sm:w-6"
                    strokeWidth={1.65}
                    aria-hidden
                  />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                    Beta Library
                  </h2>
                  <p className="mt-1 text-xs leading-snug text-[#1a1a1a]/68 sm:mt-1.5 sm:text-sm sm:leading-relaxed">
                    Upload and review your climbing session videos
                  </p>
                </div>
                <ChevronRight
                  className="mt-1 h-5 w-5 shrink-0 text-[#1a1a1a]/35 transition-transform duration-150 group-hover:translate-x-0.5 sm:mt-1.5 sm:h-5 sm:w-5"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
