"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AdminSkeletonContentProps = {
  currentView: string;
};

export default function AdminSkeletonContent({ currentView }: AdminSkeletonContentProps) {
  switch (currentView) {
    case "dashboard":
      return (
        <div className="space-y-6 pb-20 md:pb-0">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-8 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card
                key={i}
                className="bg-white border border-gray-200 shadow-sm rounded-3xl xl:col-span-2"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
            <Card className="flex flex-col  overflow-hidden text-black bg-[#080322]  px-0 pb-0 border-none shadow-sm rounded-xl xl:col-span-4 min-h-[300px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32 bg-white/50" />
                <Skeleton className="h-4 w-4 rounded bg-white/50" />
              </CardHeader>
              <CardContent className="flex-1 px-0 bg-white">
                <div className="space-y-3 p-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-32 flex-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="flex flex-col  overflow-hidden text-black bg-[#080322]  px-0 pb-0 border-none shadow-sm rounded-xl xl:col-span-4 min-h-[300px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32 bg-white/50" />
                <Skeleton className="h-4 w-4 rounded bg-white/50" />
              </CardHeader>
              <CardContent className="flex-1 px-0 bg-white">
                <div className="space-y-3 p-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-32 flex-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="flex flex-col  overflow-hidden text-black bg-[#080322]  px-0 pb-0 border-none shadow-sm rounded-xl xl:col-span-6 min-h-[300px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-48 bg-white/50" />
                <Skeleton className="h-4 w-4 rounded bg-white/50" />
              </CardHeader>
              <CardContent className="flex-1 px-0 bg-white">
                <div className="space-y-3 p-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32 flex-1" />
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="flex flex-col  overflow-hidden text-black bg-[#080322]  px-0 pb-0 border-none shadow-sm rounded-xl xl:col-span-2 min-h-[300px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-28 bg-white/50" />
                <Skeleton className="h-4 w-4 rounded bg-white/50" />
              </CardHeader>
              <CardContent className="flex-1 px-0">
                <div className="space-y-3 p-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-full bg-white/30" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    case "businesses":
      return (
        <div className="space-y-6 pb-20 md:pb-0">
          <div className="mb-6">
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28 rounded-xl" />
              <Skeleton className="h-10 w-28 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="bg-white rounded-md  overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#080322]">
                  <TableRow>
                    <TableHead className="w-12"><Skeleton className="h-4 w-4 bg-white/50" /></TableHead>
                    <TableHead className="w-14"><Skeleton className="h-4 w-8 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                    <TableHead className="text-center"><Skeleton className="h-4 w-16 bg-white/50 mx-auto" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-16 bg-white/50" /></TableHead>
                    <TableHead className="text-right w-32"><Skeleton className="h-4 w-16 bg-white/50 ml-auto" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-lg" /></TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-1">
                          <Skeleton className="h-8 w-8 rounded-lg" />
                          <Skeleton className="h-8 w-8 rounded-lg" />
                          <Skeleton className="h-8 w-8 rounded-lg" />
                          <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      );
    case "professionals":
      return (
        <div className="space-y-6 pb-20 md:pb-0">
          <div className="mb-6">
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28 rounded-xl" />
              <Skeleton className="h-10 w-28 rounded-xl" />
              <Skeleton className="h-10 w-36 rounded-xl" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="bg-white rounded-md  overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#080322]">
                  <TableRow>
                    <TableHead className="w-12"><Skeleton className="h-4 w-4 bg-white/50" /></TableHead>
                    <TableHead className="w-14"><Skeleton className="h-4 w-8 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                    <TableHead className="text-center"><Skeleton className="h-4 w-16 bg-white/50 mx-auto" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-16 bg-white/50" /></TableHead>
                    <TableHead className="text-right w-32"><Skeleton className="h-4 w-16 bg-white/50 ml-auto" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Skeleton className="h-3 w-3" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-1">
                          <Skeleton className="h-8 w-8 rounded-lg" />
                          <Skeleton className="h-8 w-8 rounded-lg" />
                          <Skeleton className="h-8 w-8 rounded-lg" />
                          <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      );
    case "categories":
      return (
        <div className="space-y-6 pb-20 md:pb-0">
          <div className="mb-6">
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="bg-white rounded-md  overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#080322]">
                  <TableRow>
                    <TableHead className="w-14"><Skeleton className="h-4 w-8 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-32 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-28 bg-white/50" /></TableHead>
                    <TableHead className="text-center"><Skeleton className="h-4 w-20 bg-white/50 mx-auto" /></TableHead>
                    <TableHead className="text-right w-32"><Skeleton className="h-4 w-16 bg-white/50 ml-auto" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-32" />
                          {i === 1 && <Skeleton className="h-5 w-10 rounded-full" />}
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-6 w-10 rounded-full mx-auto" />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-1">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      );
    case "inquiries":
      return (
        <div className="space-y-6 pb-20 md:pb-0">
          <div className="mb-6">
            <Skeleton className="h-7 w-56 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="bg-white rounded-md  overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#080322]">
                  <TableRow>
                    <TableHead className="w-14"><Skeleton className="h-4 w-8 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-32 bg-white/50" /></TableHead>
                    <TableHead className="text-center"><Skeleton className="h-4 w-16 bg-white/50 mx-auto" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-16 bg-white/50" /></TableHead>
                    <TableHead className="text-right w-32"><Skeleton className="h-4 w-16 bg-white/50 ml-auto" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-1">
                          <Skeleton className="h-8 w-8 rounded-lg" />
                          <Skeleton className="h-8 w-8 rounded-lg" />
                          <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      );
    case "registration-requests":
      return (
        <div className="space-y-6 pb-20 md:pb-0">
          <div className="mb-6">
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
          <div className="bg-white rounded-md  overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#080322]">
                  <TableRow>
                    <TableHead className="w-14"><Skeleton className="h-4 w-8 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-16 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-28 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                    <TableHead className="text-center"><Skeleton className="h-4 w-16 bg-white/50 mx-auto" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-16 bg-white/50" /></TableHead>
                    <TableHead className="text-right w-32"><Skeleton className="h-4 w-16 bg-white/50 ml-auto" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-1">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      );
    case "business-listings":
      return (
        <div className="space-y-6 pb-20 md:pb-0">
          <div className="mb-6">
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="bg-white rounded-md  overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#080322]">
                  <TableRow>
                    <TableHead className="w-12"><Skeleton className="h-4 w-4 bg-white/50" /></TableHead>
                    <TableHead className="w-14"><Skeleton className="h-4 w-8 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-32 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                    <TableHead className="text-center"><Skeleton className="h-4 w-16 bg-white/50 mx-auto" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-16 bg-white/50" /></TableHead>
                    <TableHead className="text-right w-32"><Skeleton className="h-4 w-16 bg-white/50 ml-auto" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-36" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-28" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-1">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      );
    case "analytics":
      return (
        <div className="space-y-6 pb-20 md:pb-0">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-6 w-64" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-white border border-gray-200 shadow-sm rounded-3xl p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-40 w-full" />
              </Card>
            ))}
          </div>
        </div>
      );
    case "settings":
      return (
        <div className="space-y-6 pb-20 md:pb-0">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-6 w-64" />
          </div>
          <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl p-6">
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full rounded-2xl" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full rounded-2xl" />
              </div>
              <Skeleton className="h-10 w-32 rounded-2xl" />
            </div>
          </Card>
        </div>
      );
    default:
      return (
        <div className="space-y-6 pb-20 md:pb-0">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
        </div>
      );
  }
}