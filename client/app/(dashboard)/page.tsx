
import TopPageNavigation from "@/components/shared/TopPageNavigation";
import DashboardMain from "@/components/dashboard/DashboardMain";
import { auth } from "@/auth";

export const metadata = {
  title: "Client Link Dashboard",
  description: "Client Link Dashboard",
};

export default async function Home() {
  // const session = await auth();
  // console.log(session);

  return (
    <>
      <TopPageNavigation />
      <DashboardMain />
    </>
  );
}
