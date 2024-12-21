import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/models/User'
import { ApiResponse } from '@/types/apiresponse'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'
type messageDeleteProps ={
    message:Message,
    onMessageDelete:(messageId:string)=>void
 }
 
  
 
const MessageCard= ({message,onMessageDelete}:messageDeleteProps)=> {
    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
        toast({
          title: response.data.message,
        });
        onMessageDelete(message._id as string);
      };
  return (
    <Card>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <AlertDialog>
  <AlertDialogTrigger asChild><Button variant="destructive"><X className='h-5 w-5'/></Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

      <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Card Content</p>
    </CardContent>
    <CardFooter>
    
    </CardFooter>
  </Card>
  
  )
}
export default MessageCard