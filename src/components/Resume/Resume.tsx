"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Footer from "../Footer/Footer";

interface ResumeData {
  name: string;
  title: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    duration: string;
    details?: string;
  }>;
  skills: {
    technical: string[];
    languages: string[];
    tools: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}

const resumeData: ResumeData = {
  name: "Abel Blanco",
  title: "Full Stack Developer & Creative Technologist",
  contact: {
    email: "blake@tonyhawklover.com",
    phone: "N/A",
    location: "Anywhere, USA",
    linkedin: "linkedin.com/in/blakeabel",
    github: "github.com/tonyhawklover",
  },
  summary:
    "Passionate full-stack developer with a love for creative coding and interactive experiences. Skilled in building modern web applications with a focus on user experience and innovative solutions. Currently exploring AI and machine learning applications in web development.",
  experience: [
    {
      company: "Tech Innovators Inc.",
      position: "Senior Frontend Developer",
      duration: "2022 - Present",
      description: [
        "Led development of interactive web applications using React and Next.js",
        "Implemented AI-powered features that increased user engagement by 40%",
        "Collaborated with design teams to create immersive user experiences",
        "Mentored junior developers and conducted code reviews",
      ],
    },
    {
      company: "Creative Digital Agency",
      position: "Full Stack Developer",
      duration: "2020 - 2022",
      description: [
        "Built responsive web applications for diverse clients",
        "Developed custom CMS solutions using Node.js and MongoDB",
        "Integrated third-party APIs and services",
        "Optimized application performance and SEO",
      ],
    },
    {
      company: "Startup Labs",
      position: "Junior Developer",
      duration: "2019 - 2020",
      description: [
        "Contributed to early-stage product development",
        "Worked with React, TypeScript, and GraphQL",
        "Participated in agile development processes",
        "Learned and implemented best practices in software development",
      ],
    },
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor of Science in Computer Science",
      duration: "2015 - 2019",
      details: "Focus on Software Engineering and Human-Computer Interaction",
    },
  ],
  skills: {
    technical: [
      "JavaScript/TypeScript",
      "React/Next.js",
      "Node.js",
      "Python",
      "SQL/NoSQL",
      "GraphQL",
      "HTML/CSS",
      "Git/GitHub",
    ],
    languages: ["English (Native)", "Spanish (Fluent)", "French (Basic)"],
    tools: [
      "VS Code",
      "Figma",
      "Docker",
      "AWS",
      "Vercel",
      "MongoDB",
      "PostgreSQL",
    ],
  },
  projects: [
    {
      name: "AI-Powered Resume with Line Rider",
      description:
        "Interactive resume website featuring an AI that learns to play Line Rider in real-time",
      technologies: ["Next.js", "TypeScript", "Matter.js", "Machine Learning"],
      link: "https://github.com/tonyhawklover/line-rider-resume",
    },
    {
      name: "Creative Portfolio Platform",
      description:
        "Full-stack platform for artists to showcase their work with interactive galleries",
      technologies: ["React", "Node.js", "MongoDB", "WebGL"],
      link: "https://github.com/tonyhawklover/creative-portfolio",
    },
    {
      name: "Real-time Collaboration Tool",
      description:
        "Web application for real-time collaborative editing and project management",
      technologies: ["React", "Socket.io", "Express", "PostgreSQL"],
      link: "https://github.com/tonyhawklover/collab-tool",
    },
  ],
};

export default function Resume() {
  const [activeSection, setActiveSection] = useState("about");

  const sections = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <motion.header
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
            {resumeData.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            {resumeData.title}
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{resumeData.contact.email}</span>
            <span>•</span>
            <span>{resumeData.contact.phone}</span>
            <span>•</span>
            <span>{resumeData.contact.location}</span>
          </div>
        </motion.header>

        {/* Navigation */}
        <nav className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* About Section */}
          {activeSection === "about" && (
            <motion.section
              className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                About Me
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {resumeData.summary}
              </p>
              <div className="mt-6 flex space-x-4">
                <a
                  href={`https://${resumeData.contact.linkedin}`}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://${resumeData.contact.github}`}
                  className="text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
                >
                  GitHub
                </a>
              </div>
            </motion.section>
          )}

          {/* Experience Section */}
          {activeSection === "experience" && (
            <motion.section
              className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                Experience
              </h2>
              <div className="space-y-6">
                {resumeData.experience.map((job, index) => (
                  <motion.div
                    key={index}
                    className="border-l-4 border-blue-500 pl-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {job.position}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {job.company}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                      {job.duration}
                    </p>
                    <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                      {job.description.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Education Section */}
          {activeSection === "education" && (
            <motion.section
              className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                Education
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <motion.div
                    key={index}
                    className="border-l-4 border-green-500 pl-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {edu.degree}
                    </h3>
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      {edu.institution}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {edu.duration}
                    </p>
                    {edu.details && (
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {edu.details}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Skills Section */}
          {activeSection === "skills" && (
            <motion.section
              className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                Skills
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                    Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.technical.map((skill, index) => (
                      <motion.span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.languages.map((lang, index) => (
                      <motion.span
                        key={index}
                        className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        {lang}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                    Tools & Platforms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.tools.map((tool, index) => (
                      <motion.span
                        key={index}
                        className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        {tool}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Projects Section */}
          {activeSection === "projects" && (
            <motion.section
              className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                Projects
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {resumeData.projects.map((project, index) => (
                  <motion.div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                      {project.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-blue-500 hover:text-blue-600 transition-colors text-sm"
                      >
                        View Project →
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
