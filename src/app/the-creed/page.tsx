'use client';

import { motion } from 'framer-motion';

const OATH_TEXT = `I stand before the Order as one of the Oathbound, sworn to carry the name of SephyrOath with pride, honor, and unwavering loyalty.

I vow to remain active and steadfast, and to answer the call of my brothers and sisters whenever the Order has need of me.

I pledge to uphold respect in word and deed—toward my fellow members, our leaders, and every opponent we face.

I will honor boundaries, protect the dignity of the Brotherhood, and keep our halls free from harassment, discord, and dishonor.

I will fight with discipline, teamwork, and courage, placing the strength of the Order above personal glory.

I will welcome new Oathbound as family, guide them with kindness, and help forge them into worthy knights.

I will accept counsel, learn from correction, and walk the path of the Creed with humility and resolve.

I will guard the legacy of SephyrOath and bear its banner in my name and in my actions.

Should I falter, I will rise.
Should I be tested, I will endure.
Should my brothers call, I will answer.

By this oath, I bind my honor to the Order.

⚔️ I am Oathbound.
⚔️ I am a Knight of the Creed.
⚔️ I am SephyrOath.`;

const CREED_RULES = [
  {
    tier: 'Tier 1: Loyalty Mandates',
    rules: [
      'Compulsory application of the structural identifier prefix tag (SO) inside connected gaming account client profiles',
      'Continuous active platform engagement required',
      'Mandatory maintenance of valid social communication channel link states',
    ],
  },
  {
    tier: 'Tier 2: Honor Protocol System',
    rules: [
      'Strict sportsmanship requirements during matchmaking environments',
      'Zero-tolerance framework for filtering explicit content',
      'Prohibition of toxic behavioral outbursts and targeted harassment',
      'No discriminatory comments or actions',
    ],
  },
  {
    tier: 'Tier 3: Conduct Matrix Enforcement',
    rules: [
      'Incidents Tier 1-3: Automated warnings logged to user profiles',
      'Incident Tier 4: Automatic exile routines, shifting to visitor restriction levels',
      'Zero-Tolerance Violations: Immediate lifetime banning for data cheating, game hacking, scamming, intelligence leaks, or reputational damage',
    ],
  },
];

export default function ThCreedPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 border-b border-so-primary/10">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-so-primary/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          className="container-primary text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="text-so-gold">The Creed</span>
            </h1>
            <p className="text-xl text-so-gray-300 max-w-2xl mx-auto">
              Bound by Oath. Guided by Honor. United as One.
            </p>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-so-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            The Creed is not merely a set of rules—it is the living breath of SephyrOath. It is the covenant that binds us together, the code that defines our character, and the oath we swear upon our honor.
          </motion.p>
        </motion.div>
      </section>

      {/* Main Oath Section */}
      <section className="py-20 md:py-32 border-b border-so-primary/10">
        <motion.div
          className="container-primary max-w-4xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="card-glassmorphism border-2 border-so-gold/30 relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="absolute -top-4 left-8 bg-so-dark px-4">
              <span className="text-so-gold text-sm font-semibold">THE OATH OF THE KNIGHTS</span>
            </div>

            <div className="mt-8 space-y-4 text-so-gray-100 leading-relaxed whitespace-pre-line font-light">
              {OATH_TEXT}
            </div>

            <div className="mt-8 pt-8 border-t border-so-gold/20 text-center">
              <p className="text-so-gold-light font-semibold italic">
                "By oath, we become more than players—we become family."
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Creed Rules Section */}
      <section className="py-20 md:py-32 border-b border-so-primary/10">
        <motion.div className="container-primary">
          <motion.h2
            className="section-title mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Code & <span className="text-gradient">Conduct</span>
          </motion.h2>

          <div className="space-y-12">
            {CREED_RULES.map((section, idx) => (
              <motion.div
                key={idx}
                className="card-glassmorphism border-l-4 border-so-primary"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-so-gold mb-6">{section.tier}</h3>
                <ul className="space-y-3">
                  {section.rules.map((rule, ruleIdx) => (
                    <li key={ruleIdx} className="flex gap-4">
                      <span className="text-so-primary font-bold mt-1">→</span>
                      <span className="text-so-gray-200">{rule}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Principles Section */}
      <section className="py-20 md:py-32 border-b border-so-primary/10">
        <motion.div className="container-primary">
          <motion.h2
            className="section-title mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Core <span className="text-gradient">Principles</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏰',
                title: 'Honor',
                description: 'We conduct ourselves with integrity in victory and defeat, treating all with respect.',
              },
              {
                icon: '⚔️',
                title: 'Loyalty',
                description: 'We stand by our brothers and sisters, answering the call whenever needed.',
              },
              {
                icon: '🛡️',
                title: 'Discipline',
                description:
                  'We master ourselves before we master our opponents, placing teamwork above personal glory.',
              },
              {
                icon: '🔥',
                title: 'Excellence',
                description: 'We pursue greatness in all aspects, striving to be worthy of the SephyrOath name.',
              },
              {
                icon: '🤝',
                title: 'Brotherhood',
                description: 'We build a family bound by oath, welcoming all with kindness and guidance.',
              },
              {
                icon: '👑',
                title: 'Legacy',
                description: 'We guard the legacy of SephyrOath and carry its banner with pride in our actions.',
              },
            ].map((principle, idx) => (
              <motion.div
                key={idx}
                className="card-glassmorphism text-center hover:border-so-primary/50 transition-all group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {principle.icon}
                </div>
                <h3 className="text-xl font-bold text-so-gold mb-3">{principle.title}</h3>
                <p className="text-so-gray-300 text-sm leading-relaxed">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Motto Section */}
      <section className="py-20 md:py-32">
        <motion.div
          className="container-primary text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="text-so-gold-light">Our Motto</span>
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <p className="text-3xl md:text-4xl font-bold text-gradient">
              "Bound by Oath. Guided by Honor. Living by the Creed."
            </p>
            <p className="text-xl text-so-gray-300">
              Alternative Induction & Event Motto
            </p>
            <p className="text-3xl md:text-4xl font-bold text-so-gold">
              "Bound by Oath. Guided by Honor. United as One."
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
