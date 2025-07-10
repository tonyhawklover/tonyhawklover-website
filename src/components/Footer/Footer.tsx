"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="py-4 text-center text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="text-xs">
            © 2025 Blake Abel. Built with Next.js, TypeScript, and Tailwind
          </div>
          <div className="flex space-x-4 text-xs">
            <a
              href="https://github.com/tonyhawklover"
              className="hover:text-blue-500 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/Blake-Abel-"
              className="hover:text-blue-500 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:blake@tonyhawklover.com"
              className="hover:text-blue-500 transition-colors"
            >
              Email
            </a>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <span>🎮 AI learns Line Rider in real-time</span>
        </div>
      </div>
    </motion.footer>
  );
}
