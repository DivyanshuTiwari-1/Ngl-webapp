import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Message } from '@/models/User';
import { ApiResponse } from '@/types/apiresponse';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

type MessageDeleteProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageDeleteProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
      toast({
        title: response.data.message,
        variant: 'default',
      });
      onMessageDelete(message._id as string);
    } catch (error) {
      const errorMessage = (error as any).response?.data.message || 'Failed to delete message';
      toast({
        title: "Error",
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className='h-7 w-7'>
              <X className='h-5' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <p>{message.content}</p>
      </CardContent>
      <CardFooter>
        {/* You can add any footer content here if necessary */}
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
