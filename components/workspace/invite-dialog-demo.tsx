'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InviteDialog } from './invite-dialog';

export default function InviteDialogDemo() {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">邀请好友对话框演示</h1>
        
        <Button onClick={() => setOpen(true)}>打开邀请对话框</Button>
        
        <InviteDialog 
          open={open} 
          onOpenChange={setOpen} 
        />
      </div>
    </div>
  );
}