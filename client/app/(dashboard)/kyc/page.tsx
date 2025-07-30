import KycHeaderBtns from "@/components/dashboard/kyc/KycHeaderBtns";
import KycMain from "@/components/dashboard/kyc/KycMain";
import TopPageNavigation from "@/components/shared/TopPageNavigation";



export default async function KycPage() {




    return (
        <>
            <TopPageNavigation />

            <div className="flex justify-end">
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex gap-3">
                        <KycHeaderBtns />
                    </div>
                </div>
            </div>

            <KycMain />
            {/* <KycListTable /> */}
            {/* <KycGridTable /> */}
        </>
    )
}
