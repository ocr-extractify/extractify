export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-6">
      <img
        src="/placeholder.svg"
        alt="Empty State"
        className="w-30 h-30"
        width="120"
        height="120"
        style={{ aspectRatio: "120/120", objectFit: "cover" }}
      />
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold">No Data Available</h3>
        <p className="text-muted-foreground">
          It looks like there is no data to display at the moment. Try adding some data to see it here.
        </p>
      </div>
    </div>
  )
}