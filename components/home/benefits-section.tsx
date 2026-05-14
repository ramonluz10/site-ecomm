'use client'

import { motion } from 'framer-motion'
import { Truck, Shield, CreditCard, Headphones } from 'lucide-react'

const benefits = [
  {
    icon: Truck,
    title: 'Frete Grátis',
    description: 'Em compras acima de R$ 299 para todo o Brasil'
  },
  {
    icon: Shield,
    title: 'Garantia Estendida',
    description: 'Até 3 anos de garantia em produtos selecionados'
  },
  {
    icon: CreditCard,
    title: 'Parcelamento',
    description: 'Em até 12x sem juros no cartão de crédito'
  },
  {
    icon: Headphones,
    title: 'Suporte 24/7',
    description: 'Atendimento especializado a qualquer hora'
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function BenefitsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={item}
              className="glass-card rounded-2xl p-6 text-center hover:border-primary/30 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
