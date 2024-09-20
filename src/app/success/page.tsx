'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import Image from 'next/image'

export default function AccountCreated() {
    const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 })
    const [showConfetti, setShowConfetti] = useState(true)

    useEffect(() => {
        setWindowDimension({ width: window.innerWidth, height: window.innerHeight })
        setShowConfetti(true)
        const timeoutId = setTimeout(() => setShowConfetti(false), 5000)
        return () => clearTimeout(timeoutId)
    }, [])

    const checkVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1, ease: "easeInOut" }
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg md:shadow-lg p-8 max-w-md w-full text-center">
                <div className="mb-8 relative">
                    <motion.div
                        className="w-24 h-24  mx-auto flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <Image priority={true} src="/sticker.png" width={450} height={450} alt="success" className="mx-auto" />

                    </motion.div>
                </div>
                <motion.h1
                    className="text-2xl font-bold mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    Account Created
                </motion.h1>
                <motion.p
                    className="text-2xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                >
                    Successfully
                </motion.p>
            </div>
            {showConfetti && (
                <Confetti
                    width={windowDimension.width}
                    height={windowDimension.height}
                    recycle={false}
                    numberOfPieces={200}
                />
            )}
        </div>
    )
}