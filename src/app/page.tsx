import DiagonalLineLayout from "./layouts/diagonalLineLayout";

export default function Home() {
  return (
    <DiagonalLineLayout
      leftContent={<div>Child 1</div>}
      rightContent={<h2 className="text-2xl font-bold">Child 2</h2>}
    />
  );
}
