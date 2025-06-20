import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginLoading() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center font-bold">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
        </CardTitle>
        <CardDescription className="text-center">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-full mx-auto" />
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
          </div>
          
          <div className="h-10 bg-blue-100 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
} 