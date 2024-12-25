"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MessageSchema } from "@/schemas/messageSchema";


type SendMessageForm = z.infer<typeof MessageSchema>;

export default function ProfilePage() {
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams(); // Use this for dynamic route params
  const { userName } = params; // Destructure `userName` from route params
 console.log(userName);
  const form = useForm<SendMessageForm>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    if (!userName) {
      toast({
        title: "Error",
        description: "Username is missing. Redirecting to homepage...",
        variant: "destructive",
      });
      setTimeout(() => router.push("/"), 2000); // Delay redirect
    }
  }, [userName]);

  const onSubmit = async (data: SendMessageForm) => {
    try {
      const response = await axios.post("/api/send-message", {
        userName,
        content: data.content,
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Message sent successfully!",
        });
        form.reset(); // Reset form after success
      } else {
        toast({
          title: "Error",
          description: "Failed to send the message.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending the message.",
        variant: "destructive",
      });
    }
  };

  const fetchStreamingResponse = async () => {
    setLoading(true);
    setResponses([]);

    try {
      const response = await axios.get("/api/suggest-message", {
        responseType: "stream",
      });
      const reader = response.data.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setResponses((prev) => [...prev, chunk]);
      }

      toast({
        title: "Success",
        description: "Responses received successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch responses.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!userName) {
    return (
      <div className="text-center mt-10">
        <p className="text-xl text-red-500">Redirecting to the homepage...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center text-black">Welcome, send messages to {userName}</h1>

      {/* Write Message Section */}
      <div className="mt-8">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Write a Message</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Type your message here..."
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800 mt-4"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Send"
              )}
            </Button>
          </form>
        </FormProvider>
      </div>

      {/* Suggested Messages Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Suggested Messages</h2>
          <Button
            onClick={fetchStreamingResponse}
            className="bg-black text-white hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Get Suggestions"}
          </Button>
        </div>
        <div className="border border-gray-200 p-4 bg-gray-50 rounded-md h-96 overflow-y-auto mt-4">
          {responses.length === 0 && !loading && (
            <p className="text-gray-500 text-center">No suggestions yet.</p>
          )}
          {responses.map((response, index) => (
            <div key={index} className="mb-2 p-3 bg-white border border-gray-300 rounded shadow-sm">
              {response}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
