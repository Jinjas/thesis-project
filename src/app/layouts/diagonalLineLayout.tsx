import React from "react";

type Props = {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
};

export default function DiagonalLineLayout({
  leftContent,
  rightContent,
}: Props) {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <section className="absolute inset-0 z-0 bg-gray-200" />

      <section className="absolute inset-y-0 left-0 z-20 w-5/8">
        {leftContent}
      </section>

      <section className="absolute inset-y-0 right-0 z-20 w-3/8">
        {rightContent}
      </section>

      <svg
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        viewBox="0 0 900 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 0 H560 C520 330 460 150 440 500 C420 850 340 730 320 1000 H0 Z"
          className="fill-gray-800"
        />
      </svg>
    </main>
  );
}
