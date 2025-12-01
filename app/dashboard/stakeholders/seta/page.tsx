"use Client"

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { IconFileExport, IconPlus } from '@tabler/icons-react'
import React from 'react'

const contractPage = () => {
  return (
    <div className="container mx-auto py-5">
      <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Stakeholders Management</h2>
        </div>

        <div className="flex flex-row gap-2">
          <Button variant="outline" className="text-black">
            <IconFileExport className="mr-2 h-4 w-4" /> Download All
          </Button>
          <Button>
            <IconPlus className="mr-2 h-4 w-4" /> Upload
          </Button>
        </div>
      </div>

      <Separator className="mt-4" />

    </div>
  )
}

export default contractPage