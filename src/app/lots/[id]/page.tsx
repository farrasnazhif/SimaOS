import LotDetailPage from "@/features/lots/components/lot-detail-page";

export default async function LotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LotDetailPage lotId={id} />;
}
