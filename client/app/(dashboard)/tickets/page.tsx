import TicketTable from '@/components/dashboard/ticket/TicketTable';
import { getAllData } from '@/lib/features/shared/actionUtils';
import { PageSearchParams } from '@/types'
import React from 'react'

export default async function page({ searchParams }: PageSearchParams) {


  const params = await searchParams;
  const query = params.q || '';
  const page = params.p || '1';
  const limit = params.pl || '20';
  const sortBy = params.sb || 'first_name';
  const sort = params.s || 'asc';

  const tickets = await getAllData({
    url: 'tickets/',
    searchQueries: { 'title': query },
    customQuery: { page, limit },
    sortQueries: { [sortBy]: sort }
  });

  return (
    <div className="panel mt-5 border-white-light px-0 dark:border-[#1b2e4b]">

      <TicketTable tickets={tickets} />
    </div>
  )
}
