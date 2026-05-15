"use client";

import { Eye, Hexagon, ChevronRight, EyeOff, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/toast";
import { signIn } from "next-auth/react";

export const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const defaultValues: FormValues = {
  username: "admin",
  password: "Pass1234!",
};

export type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsLoading(true);
        const result = await signIn("credentials", {
          username: value.username,
          password: value.password,
          redirect: false,
        });

        if (result?.error) {
          showToast(
            "Incorrect details. Please check your information and try again.",
            "error",
          );
        } else {
          const session = await fetch("/api/auth/session").then((res) =>
            res.json(),
          );
          setIsLoading(false);
          const userType = session.user.type;
          if (userType === "admin") {
            router.push("/admin/me");
          } else if (userType === "store") {
            router.push("/store/me");
          }
          router.refresh();
        }
      } catch {
        showToast("Something went wrong. Please try again.", "error");
      }
    },
  });

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[#020817] text-foreground">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:35px_35px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      </div>

      <div className="relative hidden h-screen w-[55%] overflow-hidden lg:block">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <Image
          src="https://images.unsplash.com/photo-1514565131-fce0801e5785?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="City Scenery"
          fill
          priority
          className="object-cover opacity-40 mix-blend-luminosity scale-105 transition-transform duration-[10s] hover:scale-100"
          sizes="55vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/40 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#020817]" />

        <div className="absolute bottom-20 left-20 z-20 space-y-6">
          <div className="inline-flex items-center gap-4 rounded-2xl bg-white/5 p-4 backdrop-blur-md border border-white/10">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-[0_0_30px_rgba(251,191,36,0.3)]">
              <Hexagon
                className="text-primary-foreground fill-primary-foreground"
                size={32}
              />
            </div>
            <div>
              <h1 className="font-russo text-4xl uppercase tracking-[0.2em] text-white">
                City <span className="text-primary">Cipher</span>
              </h1>
              <p className="text-xs font-bold tracking-[0.3em] text-primary/80 uppercase">
                Established 2026
              </p>
            </div>
          </div>
          <div className="space-y-2 border-l-2 border-primary/30 pl-6">
            <p className="text-xl font-medium text-white/90 tracking-wide">
              Control Center
            </p>
            <p className="max-w-md text-sm text-muted-foreground/80 leading-relaxed font-light">
              Manage your local store presence, track reward programs, and
              connect with customers across the city.
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[440px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-8 flex flex-col items-center lg:items-start space-y-2">
              <div className="h-1 w-12 bg-primary rounded-full mb-4" />
              <h2 className="font-russo text-3xl tracking-tight text-white uppercase">
                Sign <span className="text-primary/90">In</span>
              </h2>
              <p className="text-muted-foreground text-sm">
                Please enter your account details to continue.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-1 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[22px] bg-[#020817]/80 p-8 border border-white/5">
                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                  }}
                >
                  <form.Field name="username">
                    {(field) => (
                      <Field className="space-y-2">
                        <FieldLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                          Account Username
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            maxLength={11}
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. yourname"
                            className="h-13 px-4 rounded-xl bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                          />
                        </div>
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="password">
                    {(field) => (
                      <Field className="space-y-2">
                        <FieldLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                          Security Password
                        </FieldLabel>
                        <div className="relative group/input">
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type={passwordVisibility ? "text" : "password"}
                            placeholder="Enter your password"
                            className="h-13 px-4 rounded-xl bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setPasswordVisibility(!passwordVisibility)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-primary transition-colors"
                          >
                            {passwordVisibility ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </Field>
                    )}
                  </form.Field>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-primary font-russo text-sm uppercase tracking-[0.2em] text-primary-foreground transition-all hover:shadow-[0_0_25px_rgba(251,191,36,0.4)] active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full transition-transform group-hover:translate-y-0" />
                    <span className="relative z-10 flex items-center gap-3">
                      {isLoading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Go to Dashboard
                          <ChevronRight
                            size={18}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </div>

            <p className="mt-8 text-center text-[10px] text-muted-foreground/40 uppercase tracking-[0.3em]">
              Secure Access Protocol
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
