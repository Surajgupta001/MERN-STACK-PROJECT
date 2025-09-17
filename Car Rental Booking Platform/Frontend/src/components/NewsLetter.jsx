import React from 'react'
import { motion } from 'framer-motion';

function NewsLetter() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col items-center justify-center my-10 mb-40 space-y-2 text-center max-md:px-4">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl font-semibold md:text-4xl">Never Miss a Deal!</motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="pb-8 md:text-lg text-gray-500/70">
                Subscribe to get the latest offers, new arrivals, and exclusive discounts
            </motion.p>
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center justify-between w-full h-12 max-w-2xl md:h-13">
                <input
                    className="w-full h-full px-3 text-gray-500 border border-r-0 border-gray-300 rounded-md rounded-r-none outline-none"
                    type="text"
                    placeholder="Enter your email id"
                    required
                />
                <button type="submit" className="h-full px-8 text-white transition-all rounded-md rounded-l-none cursor-pointer bg-primary md:px-12 hover:bg-primary-dull">
                    Subscribe
                </button>
            </motion.form>
        </motion.div>
    )
}

export default NewsLetter
