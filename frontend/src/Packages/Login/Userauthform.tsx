import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/customButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/custominput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useFetchData } from "@/fetchcomponents/Fetchapi";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { usePostData } from "@/fetchcomponents/postapi";
import { useNavigate } from "react-router-dom"; // Use for redirection after successful login
import { Toaster } from "sonner";

import * as z from "zod";

gsap.registerPlugin(useGSAP);

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Use navigate to redirect after login
  const { data, isLoading, isFetching, isError } = useFetchData({
    endpoint: "https://66d59c0ff5859a704266c935.mockapi.io/api/todo/todo",
    params: {
      queryKey: "todos",
      retry: 5,
      refetchOnWindowFocus: true,
      onSuccess: () => {
        toast.success("Successfully Fetched Data");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  });

  const postData = usePostData({
    endpoint: "http://localhost:8000/api/login", // Change to the actual login API
    params: {
      retry: 0,
      onSuccess: () => {
        toast.success("Login Successful!");
        navigate("/dashboard");
      },
      onError: (error: AxiosError) => {
        toast.error(error.response?.data?.message || "Login failed");
      },
    },
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  const container = useRef<SVGSVGElement | null>(null);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formData: UserFormValue) => {
    console.log("Form Data:", formData);
    queryClient.invalidateQueries({ queryKey: ["todos"] });
    postData.mutate(formData); // Submit the form data for login
  };

  useGSAP(() => {
    gsap.to(container.current!, {
      rotate: 360,
      repeat: -1,
      delay: 0,
      repeatDelay: 0,
      duration: 0.3,
    });
  }, [isLoading]);

  return (
    <>
      <Toaster
        position="top-center"
        richColors
        style={{
          position: "fixed", // Ensure it's fixed and doesn't affect layout
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999, // High z-index so it appears above other content
          pointerEvents: "none", // Allow interactions through the toaster
        }}
        toastOptions={{
          duration: 3000,
        }}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2 "
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="">
                <Label>Email</Label>
                <FormControl>
                  <div className="min-h-10 mb-[8rem]">
                    <Input
                      isLoading={isLoading}
                      type="email"
                      placeholder="Enter your email..."
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    isLoading={isLoading}
                    type="password"
                    placeholder="Enter your password..."
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isLoading}
            isLoading={isLoading}
            className="ml-auto w-full flex gap-2"
            type="submit"
            variant="primaryAccent"
          >
            {isLoading && (
              <svg
                ref={container}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-loader-circle rotate-0"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}

            <span>Sign In</span>
          </Button>
        </form>
      </Form>
    </>
  );
}
