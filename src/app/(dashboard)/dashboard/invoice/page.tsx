import { PageContainer } from '@/components/PageContainer/PageContainer';
import { InvoiceTable } from '@/components/Table/InvoiceTable';
import { Button } from '@mantine/core';
import React from 'react'

function InvoicePage() {
	return (
		<PageContainer title="">
			{/* <ProductCreateModel opened={opened} close={close} /> */}
			<InvoiceTable />
		</PageContainer>
	);
}

export default InvoicePage
