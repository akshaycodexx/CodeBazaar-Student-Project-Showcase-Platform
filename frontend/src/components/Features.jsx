import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, DollarSign, Crown } from 'lucide-react';

function Features() {
  const features = [
    {
      title: 'Upload Projects',
      description: 'Drag & drop your GitHub repos. We extract readme, stack, and stats automatically.',
      icon: <UploadCloud className="w-8 h-8 text-indigo-500" />,
      color: 'bg-indigo-50',
    },
    {
      title: 'Monetize Code',
      description: 'Set a price or license for your source code. Earn 90% revenue share instantly.',
      icon: <DollarSign className="w-8 h-8 text-green-500" />,
      color: 'bg-green-50',
    },
    {
      title: 'Get Hired',
      description: 'Recruiters view your live deployments and code quality. Get verified badges.',
      icon: <Crown className="w-8 h-8 text-orange-500" />,
      color: 'bg-orange-50',
    },
  ];

  return (
    <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute top-0 left-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-900 to-neutral-900 transform -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Why CodeBazaar?</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">The only platform that values your student projects as much as you do.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors"
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-neutral-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
