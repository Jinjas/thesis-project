import React from "react";
import { Sidebar, VizBar } from "../components";

type Props = {
  children: React.ReactNode;
  withViz?: boolean;
};

export default function BaseLayout({ children, withViz }: Props) {
  return (
    <div className="flex h-screen w-full cursor-default">
      <Sidebar />

      <main className="flex flex-1">{children}</main>

      {withViz && <VizBar />}
    </div>
  );
}
