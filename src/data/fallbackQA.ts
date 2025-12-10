export interface QAItem {
    keywords: string[];
    category: 'Training' | 'Recovery' | 'Nutrition';
    answer: string;
}

export const fallbackQA: QAItem[] = [
    // TRAINING
    {
        keywords: ['zone 2', 'easy ride', 'endurance pace'],
        category: 'Training',
        answer: "## Zone 2 Training\n\nZone 2 is your endurance foundation. It should feel easy—you should be able to hold a conversation. \n\n**Benefits**: Increases mitochondrial density and fat oxidation. \n**Guideline**: Keep it under 75% of your MAX HR."
    },
    {
        keywords: ['vo2 max', 'intervals', 'hard effort'],
        category: 'Training',
        answer: "## VO2 Max Intervals\n\nThese are maximal efforts designed to increase your aerobic ceiling. \n\n**Protocol**: Typically 3-8 minute intervals at 110-120% of FTP. These should hurt!"
    },
    {
        keywords: ['ftp', 'threshold'],
        category: 'Training',
        answer: "## Functional Threshold Power (FTP)\n\nFTP is the highest power you can sustain for approximately one hour. It's the anchor for all your training zones."
    },

    // RECOVERY
    {
        keywords: ['recovery', 'rest day', 'tired', 'sore'],
        category: 'Recovery',
        answer: "## Recovery is Key\n\nYou only get faster when you recover. \n\n**Tips**:\n- **Sleep**: Aim for 8+ hours.\n- **Active Recovery**: A 30 min spin in Zone 1 promotes blood flow.\n- **Protein**: Ensure 20-30g of protein within 30 mins of a hard workout."
    },
    {
        keywords: ['hrv', 'heart rate variability'],
        category: 'Recovery',
        answer: "## Heart Rate Variability (HRV)\n\nHRV measures the variation in time between heartbeats. \n\n- **High HRV**: You are recovered and ready to train.\n- **Low HRV**: You are stressed or fatigued. Consider an easy day."
    },

    // NUTRITION
    {
        keywords: ['eat', 'food', 'nutrition', 'fuel', 'carbs'],
        category: 'Nutrition',
        answer: "## Nutrition Basics\n\nFueling is the 4th discipline of endurance sports.\n\n- **Before**: Complex carbs (Oats, Rice) 2-3 hours prior.\n- **During**: 60-90g carbs/hour for rides > 90 mins.\n- **After**: Carbs + Protein (4:1 ratio) to replenish glycogen and repair muscle."
    },
    {
        keywords: ['hydration', 'drink', 'water'],
        category: 'Nutrition',
        answer: "## Hydration Strategy\n\nDehydration kills performance. \n\n**Guideline**: Drink 500-750ml per hour. Add electrolytes (Sodium) if sweating heavily or riding > 2 hours."
    }
];
