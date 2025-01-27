'use client'

import { ExploreUploadForm } from '@/components/admin/explore/ExploreUploadForm'
import { ExploreCollectionList } from '@/components/admin/explore/ExploreCollectionList'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { prisma } from '@/lib/prisma'

export default function ExploreAdminPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Explore 内容管理</CardTitle>
          <CardDescription>
            管理展示板块的作品集和作品
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upload">上传新作品集</TabsTrigger>
              <TabsTrigger value="manage">管理作品集</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <ExploreUploadForm />
            </TabsContent>
            
            <TabsContent value="manage">
              <ExploreCollectionList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 