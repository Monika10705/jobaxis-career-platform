import { motion } from 'framer-motion'
import { TrendingUp, Users, Briefcase, Target } from 'lucide-react'

const stats = [
  { icon: Users, title: 'Active Users', value: '2.4M+', growth: '+15%', color: 'blue' },
  { icon: Briefcase, title: 'Jobs Posted', value: '150k+', growth: '+22%', color: 'purple' },
  { icon: Target, title: 'Successful Hires', value: '89k+', growth: '+18%', color: 'green' },
  { icon: TrendingUp, title: 'Match Rate', value: '94%', growth: '+8%', color: 'orange' },
]

const colorMap = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', glow: 'shadow-blue-100' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', glow: 'shadow-purple-100' },
  green: { bg: 'bg-green-100', text: 'text-green-600', glow: 'shadow-green-100' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', glow: 'shadow-orange-100' },
}

const Analytics = () => {
  return (
    <section className='py-20 bg-white relative overflow-hidden'>
      <div className='container mx-auto px-6 lg:px-20'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
            Platform
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'> Analytics</span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Real-time insights and data-driven results that showcase the power of our platform.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {stats.map((stat, index) => {
            const c = colorMap[stat.color]
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.07, duration: 0.35, type: 'spring', stiffness: 120 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 cursor-default`}
              >
                <div className='flex items-center justify-between mb-4'>
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 ${c.text}`} />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.07 + 0.15, duration: 0.25 }}
                    viewport={{ once: true }}
                    className='text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded-full'
                  >
                    {stat.growth}
                  </motion.span>
                </div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.07 + 0.1, duration: 0.25 }}
                  viewport={{ once: true }}
                  className='text-3xl font-bold text-gray-900 mb-2'
                >
                  {stat.value}
                </motion.h3>
                <p className='text-gray-600'>{stat.title}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Analytics
