"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-70" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles size={16} />
                <span>Introducing VorkSpace 2.0</span>
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]"
            >
              The ultimate workspace for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                modern teams
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-[600px]"
            >
              Streamline your workflow, collaborate in real-time, and manage
              projects effortlessly. Everything your team needs to succeed, all
              in one place.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="h-14 px-8 text-base rounded-full"
                asChild
              >
                <Link href="/auth/signup">
                  Start for free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex items-center gap-6 text-sm text-muted-foreground"
            ></motion.div>
          </motion.div>

          {/* Visual/Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" as const }}
            className="relative mx-auto w-full max-w-[600px] lg:max-w-none lg:w-[120%]"
          >
            <div className="relative rounded-2xl md:rounded-[2rem] border border-border/50 bg-background/50 backdrop-blur-sm p-2 md:p-4 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-blue-500/5 rounded-2xl md:rounded-[2rem]" />

              {/* Dashboard Mockup Outline */}
              <div className="relative rounded-xl md:rounded-2xl border border-border bg-card overflow-hidden aspect-[4/3] flex flex-col">
                {/* Mockup Header */}
                <div className="h-12 border-b border-border flex items-center px-4 gap-2 bg-muted/30">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="ml-4 h-6 w-48 bg-muted rounded-md hidden md:block" />
                </div>

                {/* Mockup Body */}
                <div className="flex-1 flex p-4 gap-4 bg-background">
                  {/* Sidebar */}
                  <div className="hidden md:flex flex-col gap-3 w-48 border-r border-border pr-4">
                    <div className="h-8 bg-muted rounded-md w-full" />
                    <div className="h-8 bg-muted/50 rounded-md w-3/4" />
                    <div className="h-8 bg-muted/50 rounded-md w-5/6" />
                    <div className="h-8 bg-muted/50 rounded-md w-full mt-4" />
                    <div className="h-8 bg-muted/50 rounded-md w-2/3" />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="h-8 bg-muted rounded-md w-1/3" />
                      <div className="h-8 bg-primary/20 rounded-md w-24" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="h-24 border border-border rounded-xl bg-card p-3 flex flex-col gap-2">
                        <div className="h-4 bg-muted w-1/2 rounded" />
                        <div className="h-8 bg-primary/10 w-3/4 rounded mt-auto" />
                      </div>
                      <div className="h-24 border border-border rounded-xl bg-card p-3 flex flex-col gap-2">
                        <div className="h-4 bg-muted w-2/3 rounded" />
                        <div className="h-8 bg-blue-500/10 w-1/2 rounded mt-auto" />
                      </div>
                      <div className="hidden md:flex h-24 border border-border rounded-xl bg-card p-3 flex-col gap-2">
                        <div className="h-4 bg-muted w-1/3 rounded" />
                        <div className="h-8 bg-emerald-500/10 w-2/3 rounded mt-auto" />
                      </div>
                    </div>

                    <div className="flex-1 border border-border rounded-xl bg-muted/20 p-4">
                      <div className="space-y-3">
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-5/6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" as const,
              }}
              className="absolute -bottom-6 -left-6 md:bottom-10 md:-left-12 bg-background border border-border rounded-xl p-4 shadow-xl flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="text-green-500 h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">Project Shipped</p>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
