import TopPageNavigation from '@/app/components/TopPageNavigation'
import CoparateHeaderBtns from './components/CoparateHeaderBtns'
import CoparateListTable from './components/CoparateListTable'
import CoparateGridTable from './components/CoparateGridTable'

// export const metadata = { title: 'Coparates' }



export default async function CoparatePage() {




  return (
    <>
      <TopPageNavigation />

      <div className="flex justify-end">
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <div className="flex gap-3">
            <CoparateHeaderBtns />
          </div>
        </div>
      </div>

      <CoparateListTable />
      <CoparateGridTable />
    </>
  )
}
