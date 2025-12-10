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
    tags: string[];
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
        tags: ['polarized', '80/20', 'zones', 'intensity', 'training plan'],
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
        tags: ['ai', 'artificial intelligence', 'machine learning', 'future', 'tech'],
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
        tags: ['tss', 'recovery', 'training stress score', 'metrics', 'fatigue'],
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
    },
    {
        id: 4,
        slug: 'science-of-cardiac-drift',
        title: "Heart Rate Drift in LIT: What It Mean & When to Worry",
        excerpt: "You are holding steady power, but your heart rate is climbing. Is it fitness or fatigue? Understanding cardiac drift.",
        date: "December 6, 2025",
        author: "Coach Max",
        category: "Physiology",
        image: "/blog/cardiac_drift.png",
        tags: ['cardiac drift', 'heart rate', 'drift', 'aerobic', 'decoupling'],
        content: `
# Heart Rate Drift: The Silent creeping metric

You are one hour into your Zone 2 ride. Your power is steady at 200 watts. You feel good. But when you look at your computer, your heart rate has crept up from 130 bpm to 142 bpm.

This phenomenon is called **Cardiac Drift** (or Cardiovascular Drift), and it tells a fascinating story about your body's physiology.

## What is Cardiac Drift?

Cardiac drift occurs when your heart rate slowly increases during steady-state exercise, while your workload (power or pace) remains constant.

It typically begins after 10-15 minutes of continuous exercise.

$$ Cardiac Output = Stroke Volume \\times Heart Rate $$

Your body wants to maintain a stable Cardiac Output (blood flow) to fuel your muscles. As your core temperature rises and you sweat (decreasing blood plasma volume), your specific **Stroke Volume** (amount of blood pumped per beat) decreases. To compensate and keep Cardiac Output steady, your heart rate **must increase**.

## Is It Bad?

Not necessarily. Some drift is physiological and expected, especially in:
- Hot conditions.
- Long durations (>90 mins).
- Dehydrated states.

However, excessive drift in a standard LIT (Low Intensity Training) session can signal a lack of aerobic endurance.

## The Decoupling Metric (Pw:HR)

TrainingPeaks and other platforms call this "Decoupling". It compares the first half of your ride to the second half.

- **< 3% Drift**: Excellent aerobic fitness. Your body is handling the stress efficiently.
- **3% - 5% Drift**: Normal/Acceptable range.
- **> 5% Drift**: Aerobic system is struggling. You might be dehydrated or the ride duration is currently beyond your fitness level.

## Practical Application

If you see consistent drift > 5% on your easy rides:
1.  **Check Hydration**: Are you drinking enough electrolytes?
2.  **Check Cooling**: If indoors, get a better fan. Heat accumulation kills performance.
3.  **Reduce Duration**: You might be doing 3-hour rides when your fitness only supports 2 hours efficiently.
4.  **Cap the HR**: In a Zone 2 ride, if your HR drifts into Zone 3, **back off the power**. Stay in the zone physiologically, even if it means riding slower.

Understanding drift turns a simple "easy ride" into a powerful diagnostic tool for your endurance.
`
    },
    {
        id: 5,
        slug: 'nutrition-for-endurance',
        title: "Fueling for Performance: The Basics (Includes Vegan Options)",
        excerpt: "Nutrition is the fourth discipline of triathlon. Learn how to fuel your machine for optimal output, whether you eat meat or plants.",
        date: "December 8, 2025",
        author: "Coach Max",
        category: "Nutrition",
        image: "/blog/nutrition.png",
        tags: ['nutrition', 'diet', 'vegan', 'carbs', 'protein', 'fueling'],
        content: `
# Fueling Your Engine: Nutrition 101

You wouldn't put low-grade fuel in a Ferrari, so why put junk in your body before a big race? Nutrition is often the limiting factor for athletes who train hard but fail to recover or perform.

## The Big Three Architecture

1.  **Carbohydrates (Fuel)**: The primary energy source for high-intensity exercise. 
2.  **Protein (Repair)**: Essential for rebuilding muscle tissue damaged during training.
3.  **Fats (Endurance)**: A virtually limitless fuel source for low-intensity efforts.

## Pre-Ride Fueling

Goal: Top off glycogen stores without causing GI distress.
*   **Timing**: 2-3 hours before a hard session.
*   **What**: Complex carbs, moderate protein, low fat/fiber.
*   **Omnivore**: Oatmeal with eggs, or chicken and rice.
*   **Vegan**: Oatmeal with almond butter and banana, or quinoa bowl with tofu.

## During the Ride

If riding > 90 minutes, you need exogenous carbs.
*   **Aim**: 60-90g of carbs per hour for intense sessions.
*   **Sources**: Gels, chews, or real food like dates and rice cakes.
*   **Hydration**: 500-750ml fluid/hour with electrolytes (sodium is key).

## Post-Ride Recovery

The "Anabolic Window" isn't as narrow as we used to think, but getting nutrients in within 60 mins is smart.
*   **Ratio**: 3:1 or 4:1 Carbs to Protein.
*   **Why?**: Carbs spike insulin, which drives amino acids (protein) into the muscle cells for repair.
*   **Omnivore**: Chocolate milk, whey protein shake with banana, tuna sandwich.
*   **Vegan**: Soy milk smoothie with berries and pea protein, lentil stew with rice, peanut butter toast.

## The Vegan Advantage?

Many elite athletes (Lewis Hamilton, Novak Djokovic) have gone plant-based to reduce inflammation.
*   **Pros**: High fiber, high antioxidant load, generally lower inflammation.
*   **Watch-outs**: Iron, B12, and ensuring *enough* protein. Plant protein is often less bioavailable, so aim for 1.8-2.0g per kg of bodyweight if you are training hard.

## Takeaway

Test your nutrition like you test your legs. Nothing new on race day.
`
    },
    {
        id: 6,
        slug: 'art-of-tapering',
        title: "The Art of Tapering: How to Peak for Race Day",
        excerpt: "You've done the work. Now trust the rest. How to shed fatigue without losing fitness before your big event.",
        date: "December 9, 2025",
        author: "Coach Max",
        category: "Racing",
        image: "/blog/tapering.png",
        tags: ['taper', 'race day', 'peaking', 'recovery', 'form'],
        content: `
# The Taper: Shedding Fatigue, Revealing Fitness

The taper is the most psychologically difficult part of training. You feel antsy, you worry you are losing fitness, and every little ache feels like an injury. Relax. This is normal.

## The Goal

$$ Performance = Fitness - Fatigue $$

To perform at your best, you need to minimize fatigue while maintaining fitness.
- Fitness takes ~30 days to decay significantly.
- Fatigue drops off quickly (5-7 days).

## The Taper Formula

A standard taper lasts 7-14 days depending on the event distance (longer event = longer taper).

### 1. Reduce Volume Exponentially
Cut your duration significantly.
- **2 Weeks out**: 75% of normal volume.
- **Race Week**: 40-50% of normal volume.

### 2. Maintain Intensity
**Crucial**: Do NOT just ride easy for 2 weeks. You will feel "flat" and sluggish.
- Keep the *intensity* of your intervals high (Zone 4/5), but reduce the *number* of intervals.
- *Example*: Instead of 5x5min VO2 max, do 2x3min VO2 max. You keep the engine revved without emptying the tank.

### 3. Sleep Like a Pro
Sleep is the greatest legal performance enhancer. Bank extra sleep in the week leading up to the race.

## The "Taper Tantrums"

Expect to feel weird.
- **Heavy Legs**: Your muscles are storing extra glycogen and water. This is good!
- **Phantom Pains**: Your brain creates noise when it's not occupied with suffering. Ignore it.
- **Doubt**: "Did I train enough?" Yes, you did. It's too late to train more now anyway.

## Race Week Sample (Sunday Race)

- **Mon**: Rest.
- **Tue**: Short Interval session (e.g., 3x3min hard). Total 45m.
- **Wed**: Easy Spin 45m.
- **Thu**: Rest or very light spin 30m.
- **Fri**: Openers (30m with 3x30s bursts).
- **Sat**: Off / Travel.
- **Sun**: RACE DAY.

Trust the process. Better to be 10% undertrained than 1% overtrained.
`
    },
    {
        id: 7,
        slug: 'indoor-training-setup',
        title: "The Perfect Pain Cave: Mastering Indoor Training",
        excerpt: "How to set up your indoor training space for success. Tips for Zwift, cooling, and keeping your mind engaged.",
        date: "December 10, 2025",
        author: "Coach Max",
        category: "Indoor Training",
        image: "/blog/indoor_setup.png",
        tags: ['indoor', 'zwift', 'trainer', 'pain cave', 'fan', 'setup'],
        content: `
# Building the Perfect Pain Cave

Indoor training used to be a punishment. Now, thanks to smart trainers and apps like Zwift and Rouvy, it's a discipline of its own. But to survive (and enjoy) hours of stationary riding, your setup matters.

## The Essentials

### 1. The Fan (Non-Negotiable)
When you ride outside, you have a 30km/h wind cooling you. Inside, you have zero.
- **Overheating** increases cardiac drift and lowers your power output significantly.
- **Tip**: Get a generic "air mover" or blower fan from a hardware store. They move way more air than a standard desk fan. Aim it at your chest/face.

### 2. The Smart Trainer
Direct Drive is king (Wahoo Kickr, Tacx Neo, Zwift Hub).
- **Accuracy**: +/- 1% vs +/- 10% for wheel-on trainers.
- **Feel**: The massive flywheels simulate road momentum.
- **Noise**: Modern ones are silent. Your chain will be the loudest thing in the room.

### 3. Entertainment / Distraction
For Zone 2 (Endurance), distraction is your friend.
- **Movies/Netflix**: Great for long, steady rides.
- **Podcasts**: Perfect for tempo rides where you need to focus a bit more but can still listen.
- **Music**: Mandatory for intervals. Make a specific "Suffering" playlist.

## Comfort Modifications

You are static on a trainer, which increases pressure on your contact points.
- **Rocker Plate**: A board that allows the bike to rock side-to-side. Reduces saddle sores significantly.
- **Bib Shorts**: Wear your *best* bibs indoors. Do not use old, worn-out kit.
- **Towel**: Drape one over your headset/stem to protect the bike from sweat corrosion.

## The Zwift Ecosystem

*   **Racing**: Short, brutal, and addictive. Great for VO2 max work.
*   **Group Rides**: Socialize via the companion app while holding a steady pace.
*   **ERGM Mode**: The trainer forces you to hold the target wattage. Perfect for disciplined interval work (watching Netflix while the trainer holds you at 250W).

## Mental Tips

- **Set everything up beforehand**: Water, towel, shoes, fan remote. If you have to get off the bike, the workout is compromised.
- **Open a window**: Even if it's freezing outside. Fresh air is vital.

The pain cave is where summer speed is earned. Embrace the sweat!
`
    },
    {
        id: 8,
        slug: 'overreaching-vs-burnout',
        title: "Fine Line: Overreaching vs. Overtraining vs. Burnout",
        excerpt: "Feeling tired is normal. Feeling shattered for weeks is not. How to spot the warning signs before you crash.",
        date: "December 11, 2025",
        author: "Coach Max",
        category: "Health",
        image: "/blog/overtraining.png",
        tags: ['overtraining', 'burnout', 'recovery', 'fatigue', 'mental health'],
        content: `
# The Fatigue Spectrum: Bending vs. Breaking

In endurance sports, we intentionally stress the body to force it to adapt. But there is a Razor's edge between "productive fatigue" and "destructive breakdown."

## 1. Functional Overreaching (The Good)
This is the goal of a hard training block.
*   **Symptoms**: Heavy legs, mild fatigue, slight dip in performance.
*   **Recovery**: Bounce back after 2-4 days of rest.
*   **Result**: Supercompensation (you get stronger).

## 2. Non-Functional Overreaching (The Warning)
You pushed too hard for too long without adequate rest.
*   **Symptoms**: Stagnated performance, poor sleep, irritability, high resting heart rate.
*   **Recovery**: Takes weeks to recover.
*   **Result**: Wasted training time. No fitness gain.

## 3. Overtraining Syndrome (The Crash)
A complex neuro-endocrine disorder. Your body's stress response system is broken.
*   **Symptoms**: Depression, insomnia, hormonal imbalances, relentless fatigue, complete loss of performance.
*   **Recovery**: Months to Years.
*   **Result**: Career threatening.

## 4. Burnout (The Mind)
Physical fitness might be fine, but the *desire* to train is gone.
*   **Cause**: Monotony, too much pressure, lack of fun.
*   **Solution**: Ditch the data. Ride without a computer. Switch sports.

## The Canary in the Coal Mine

How do you know where you are?
1.  **Mood**: If you hate the idea of riding, you are likely overreached.
2.  **HRV**: A suppression in Heart Rate Variability often anticipates illness/fatigue.
3.  **Performance**: If you can't hit your heart rate zones (HR stays low despite high effort), STOP. Your autonomic system is fried.

**Rule of Thumb**: If in doubt, take an extra rest day. You can't train if you're broken.
`
    },
    {
        id: 9,
        slug: 'female-physiology-endurance',
        title: "Optimizing Endurance Training for Female Physiology",
        excerpt: "Women are not small men. How to work with your hormonal cycle to maximize performance and avoid RED-S.",
        date: "December 12, 2025",
        author: "Coach Max",
        category: "Physiology",
        image: "/blog/female_physiology.png",
        tags: ['female', 'women', 'period', 'menstrual cycle', 'hormones', 'nutrition'],
        content: `
# Women are Not Small Men

For decades, sports science was based on 70kg college-aged males. We now know that female physiology requires a unique approach, specifically surrounding the menstrual cycle.

## The Cycle Phases

### 1. Low Hormone Phase (Follicular)
*   **When**: Day 1 (Period start) to Day 14 (Ovulation).
*   **Physiology**: Estrogen and Progesterone are low. Similar to male physiology.
*   **Training**: This is your time to **SMASH IT**. High intensity, VO2 max, and heavy lifting. Your body recovers faster and builds muscle easier here.

### 2. High Hormone Phase (Luteal)
*   **When**: Day 15 (Ovulation) to Day 28.
*   **Physiology**: Progesterone rises (increasing body temp and resting HR) and Estrogen fluctuates. Plasma volume decreases.
*   **Training**: Everything feels harder. It's harder to hit top-end power. Focus on steady-state endurance (Zone 2) and technique. Be kind to yourself in the days before your period (PMS).

## Nutrition Needs

Women oxidize fat differently and rely more on blood glucose during the high-hormone phase.
*   **Carbs**: You need MORE carbs during the luteal phase, not less. Cutting carbs here can trigger a stress response (cortisol).
*   **Protein**: Essential post-workout to signal muscle repair, especially as progesterone is catabolic (breaks down muscle).

## The Danger Zone: RED-S

**Relative Energy Deficiency in Sport**.
If you underheat, your body shuts down "non-essential" functions—like reproduction.
*   **Sign**: Loss of period (Amenorrhea). **THIS IS NOT NORMAL OR "PRO".** It is a sign of a body in crisis.
*   **Risk**: Low bone density (stress fractures) and hormonal crash.

## Summary

Track your cycle like you track your FTP. It is a vital vital sign. Work *with* your physiology, not against it.
`
    }
];
