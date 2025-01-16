'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Explore',
    description: 'Discover mindful artworks created by our community',
    href: '/explore',
    linkText: 'Browse Gallery'
  },
  {
    title: 'Create',
    description: 'Generate your own mindful art using AI',
    href: '/create',
    linkText: 'Start Creating'
  },
  {
    title: 'Connect',
    description: 'Join our community of mindful creators',
    href: '/pricing',
    linkText: 'View Plans'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-bg-subtle">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="bg-white rounded-lg p-6 shadow-sm border border-secondary/10"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-heading mb-4">{feature.title}</h2>
              <p className="text-text-secondary mb-6 font-body">
                {feature.description}
              </p>
              <Link 
                href={feature.href}
                className="inline-flex items-center text-primary hover:text-primary/80 font-mono"
              >
                {feature.linkText}
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 