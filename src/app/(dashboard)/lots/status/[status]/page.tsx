import LotStatusDetailPage from "@/features/lots/views/lot-status-detail-page";

export default async function LotStatusPage({ params }: { params: Promise<{ status: string }> }) {
  const { status } = await params;
  return <LotStatusDetailPage status={status} />;
}
