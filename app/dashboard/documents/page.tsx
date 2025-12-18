
import RecentlyModified from '@/components/recently-modified'
import React from 'react'
import FilesPage from './data-table'
import { Button } from '@/components/ui/button'
import { IconPlus } from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { UploadModal } from '@/components/upload-modal'
import { InviteModal } from '@/components/invite-modal'

const documentspage = () => {
  return (
    <div>
      <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">All Files</h2>
          <p className="text-[16px] text-gray-500">View and manage files uploaded which will display here with easy search, filter, and bulk action options.</p>
        </div>
      
        <div className="flex flex-row xs:flex-row gap-2">
          <InviteModal />
          <UploadModal />
        </div>
      </div>

      <Separator className='mb-6 mt-3.5'/>

      {/* <h2 className='text-lg font-semibold'>Recently Modified</h2>
      <div className='p-6'>
        <RecentlyModified />
      </div> */}
      <h2 className='text-lg font-semibold'>All files</h2>
      
      <FilesPage />
    </div>
  )
}

export default documentspage