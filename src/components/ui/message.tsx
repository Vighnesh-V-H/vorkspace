export function Message({
  children,
  type,
}: {
  children: React.ReactNode;
  type?: "success" | "error";
}) {
  return (
    <div
      className={`${type === "success" ? "text-emerald-500" : "text-red-500"} m-2 `}
    >
      {children}
    </div>
  );
}
