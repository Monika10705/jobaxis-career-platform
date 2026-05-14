import { motion } from "framer-motion"
import { Briefcase } from "lucide-react"

const LoadingSpinner = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="relative mx-auto mb-4 w-16 h-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Briefcase className="w-6 h-6 text-blue-600" />
          </motion.div>
        </div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-gray-600 font-medium"
        >
          Finding amazing opportunities...
        </motion.p>
      </div>
    </motion.div>
  )
}

export default LoadingSpinner
