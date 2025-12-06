export interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    category: string;
    image: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: 1,
        slug: 'science-of-polarized-training',
        title: "The Science Behind Polarized Training",
        excerpt: "Why spending 80% of your time going slow makes you faster. We dive deep into the physiology of zone 1 and zone 3 training.",
        date: "December 5, 2025",
        author: "Coach Max",
        category: "Training Theory",
        image: "/blog/polarized-training.png",
        content: `
# The Science Behind Polarized Training

In the world of endurance sports, "no pain, no gain" has been the mantra for decades. Athletes believed that to get faster, every workout had to be hard. But modern sports science has turned this idea on its head with **Polarized Training**.

## What is Polarized Training?

Polarized training is often referred to as the **80/20 rule**. The concept is simple but counterintuitive:
- **80%** of your training sessions should be at **low intensity** (Zone 1 or Zone 2).
- **20%** of your sessions should be at **very high intensity** (Zone 3 or above in a 3-zone model).
- virtually **0%** of your training should be in the "moderate" or "threshold" zone (often called the "black hole" of training).

## Why Go Slow to Get Fast?

When you ride at a low intensity (below your aerobic threshold), you trigger specific physiological adaptations without accumulating excessive fatigue:
1. **Mitochondrial Density**: You build more "power plants" in your muscle cells.
2. **Capillary Density**: You improve blood flow to working muscles.
3. **Fat Oxidation**: You teach your body to burn fat as a primary fuel source.

If you ride too hard during these easy sessions, you accumulate autonomic stress that prevents you from going truly hard on your hard days.

## The High Intensity Factor

The remaining 20% of your training needs to be **hard**. We're talking intervals at 90-95% of your VO2 max. These sessions signal your heart to increase its stroke volume and your muscles to improve their lactate clearing capacity.

## Conclusion

By avoiding the "middle ground" of moderately hard training, you stay fresh enough to crush your interval sessions while building a massive aerobic engine on your easy days. It requires discipline to go slow, but the results speak for themselves.
`
    },
    {
        id: 2,
        slug: 'ai-in-endurance-sports',
        title: "AI in Endurance Sports: The Future is Here",
        excerpt: "How machine learning models are predicting fatigue and optimizing recovery better than human intuition alone.",
        date: "November 28, 2025",
        author: "Gemini Coach",
        category: "Technology",
        image: "/blog/ai-coach.png",
        content: `
# AI in Endurance Sports: The Future is Here

The days of generic "couch to 5k" PDFs are numbered. We are entering an era where **Artificial Intelligence** acts as a hyper-personalized coach that knows your physiology better than you do.

## Beyond Simple Algorithms

Traditional training apps use static algorithms. If you miss a workout, they might just shift everything by a day. AI models, like the one powering **Juno Coach**, analyze complex patterns:
- **Heart Rate Variability (HRV)** trends to assess nervous system recovery.
- **Sleep quality** data from wearables.
- **Subjective feedback** ("I feel tired") combined with objective data ("Your power is down 5%").

## Predicting the Unpredictable

One of the most powerful applications of AI is **fatigue prediction**. By analyzing your historical training load (TSS) and your response to it, AI can predict when you are at risk of non-functional overreaching or injury *before* it happens.

> "The goal of AI isn't to replace the human element, but to augment it with data-driven objectivity."

## Adaptive Training Plans

Imagine a plan that changes *during* your ride. If your heart rate is abnormally high for a given power output within the first 20 minutes, an AI coach could alert you: *"Your body is fighting an infection or fatigue. Switch to recovery zone immediately."* This real-time adaptability is the holy grail of endurance coaching.

## The Road Ahead

As we integrate more sensors—continuous glucose monitors, core body temperature sensors, and smart insoles—the AI's picture of the athlete becomes higher resolution. The future isn't just about working harder; it's about working smarter, powered by intelligence.
`
    },
    {
        id: 3,
        slug: 'understanding-tss-recovery',
        title: "Understanding TSS & Recovery Metrics",
        excerpt: "Training Stress Score is a useful metric, but it has flaws. Learn how to interpret your numbers correctly.",
        date: "November 15, 2025",
        author: "Coach Max",
        category: "Metrics",
        image: "/blog/recovery.png",
        content: `
# Understanding TSS: Not All Stress is Created Equal

**Training Stress Score (TSS)** has become the gold standard for quantifying training load in cycling. It essentially answers the question: *"How hard and how long did I work?"* relative to your threshold power (FTP).

## The Formula

$$ TSS = (sec x NP x IF) / (FTP x 3600) x 100 $$

While the math is solid, the interpretation is often flawed.

## The Flaw: Not All Points Are Equal

A 3-hour ride at Zone 2 might generate **150 TSS**.
A 1-hour race simulation might also generate **100 TSS**.

Are they the same? **Absolutely not.**
- The long ride depletes glycogen reserves and causes structural musculoskeletal fatigue.
- The intense hour taxes the central nervous system and creates high acidity in the muscles.

## Recovery Kinetics

Recovery from these two efforts looks different. This is why following TSS blindly can lead to burnout. You might chase a weekly TSS goal by doing "junk miles," accumulating a number without stimulating the specific physiological system you need to improve.

## Listen to Your Body

Metrics like TSS, CTL (Chronic Training Load), and TSB (Training Stress Balance) are **models**, not reality. They map the territory, but they are not the terrain.
- **Sleep** is your best recovery tool.
- **HRV** gives you a morning snapshot of your readiness.

Use TSS as a guide, but let your body be the master. If you are "green" on the chart but feel "red" in real life, rest.
`
    }
];
