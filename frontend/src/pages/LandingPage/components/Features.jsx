import { motion } from 'framer-motion'
import { employerFeatures, jobSeekerFeatures } from '../../../utils/data'

const Features = () => {
  return (
    <section className='py-20 bg-white relative overflow-hidden'>
      <div className='container mx-auto px-6 lg:px-20 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
            Everything You Need to
            <span className='block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Succeed</span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Whether you're looking for your next opportunity or the perfect candidate, we have the tools to make it happen.
          </p>
        </motion.div>

        <div className='grid md:grid-cols-2 gap-16 lg:gap-24'>
          {/* Job Seekers */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <div className='text-center mb-12'>
              <h3 className='text-3xl font-bold text-gray-900 mb-4'>For Job Seekers</h3>
              <div className='w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full' />
            </div>
            <div className='space-y-6'>
              {jobSeekerFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 6, backgroundColor: '#eff6ff' }}
                  className='group flex items-start space-x-4 p-6 rounded-2xl transition-all duration-300 cursor-pointer'
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className='flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors'
                  >
                    <feature.icon className='w-6 h-6 text-blue-600' />
                  </motion.div>
                  <div>
                    <h4 className='text-xl font-semibold text-gray-900 mb-2'>{feature.title}</h4>
                    <p className='text-gray-600 leading-relaxed'>{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Employers */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <div className='text-center mb-12'>
              <h3 className='text-3xl font-bold text-gray-900 mb-4'>For Employers</h3>
              <div className='w-24 h-1 bg-gradient-to-r from-purple-500 to-purple-600 mx-auto rounded-full' />
            </div>
            <div className='space-y-6'>
              {employerFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ x: -6, backgroundColor: '#faf5ff' }}
                  className='group flex items-start space-x-4 p-6 rounded-2xl transition-all duration-300 cursor-pointer'
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: -5 }}
                    className='flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors'
                  >
                    <feature.icon className='w-6 h-6 text-purple-600' />
                  </motion.div>
                  <div>
                    <h4 className='text-xl font-semibold text-gray-900 mb-2'>{feature.title}</h4>
                    <p className='text-gray-600 leading-relaxed'>{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Features
