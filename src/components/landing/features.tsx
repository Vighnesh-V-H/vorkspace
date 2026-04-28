"use client";

import { motion, Variants } from "framer-motion";
import { Zap, Shield, Users, BarChart3, Globe2, Layers } from "lucide-react";

const features = [
  {
    title: "Lightning Fast",
    description:
      "Built for speed and performance. Experience real-time updates and seamless interactions across your entire workspace.",
    icon: Zap,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "Enterprise Security",
    description:
      "Your data is protected with bank-grade encryption, role-based access control, and comprehensive audit logs.",
    icon: Shield,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Team Collaboration",
    description:
      "Work together in real-time. Share documents, leave comments, and communicate effectively without switching apps.",
    icon: Users,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Advanced Analytics",
    description:
      "Gain powerful insights into your team's productivity with custom dashboards and automated reporting.",
    icon: BarChart3,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Global Scale",
    description:
      "Distributed infrastructure ensures low latency and high availability for your team, no matter where they are.",
    icon: Globe2,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    title: "Seamless Integrations",
    description:
      "Connect your favorite tools. We integrate effortlessly with Slack, GitHub, Jira, and hundreds of other platforms.",
    icon: Layers,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything you need to ship faster
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed to help your team stay organized,
              focused, and moving forward.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative flex flex-col p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.bgColor}`}
              >
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed flex-1">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
