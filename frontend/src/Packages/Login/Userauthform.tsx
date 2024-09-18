import React, { useEffect, useRef, useState } from "react";
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
import { toast, Toaster } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { usePostData } from "@/fetchcomponents/postapi";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

// Importing eye icons
import { Eye, EyeOff } from "lucide-react";

gsap.registerPlugin(useGSAP);

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Manage password visibility
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, isLoading } = useFetchData({
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
    endpoint: "/api/login", // Change to the actual login API

    params: {
      retry: 0,
      onSuccess: (data) => {
        toast.success("Login Successful!");
        navigate("/dashboard");
        localStorage.setItem("user", JSON.stringify(data.data.data));
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
    postData.mutate(formData);
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
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          pointerEvents: "none",
        }}
        toastOptions={{
          duration: 3000,
        }}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
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
                  <div className="relative">
                    <Input
                      isLoading={isLoading}
                      type={isPasswordVisible ? "text" : "password"} // Toggle between text and password
                      placeholder="Enter your password..."
                      disabled={isLoading}
                      {...field}
                    />
                    {/* Toggle button with eye icon */}
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                    >
                      {isPasswordVisible ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isLoading}
            isLoading={isLoading}
            className="ml-auto w-full flex gap-2 "
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
