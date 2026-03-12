import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Award, Eye, BookOpen, BarChart3, Lock, ChevronDown, ChevronUp, Shuffle, User, Trophy, Zap, Star } from "lucide-react";

// ─── DIFFICULTY CONFIG ───────────────────────────────────────────────────────
const DIFF = {
  1: { label:"Easy",   emoji:"🟢", color:"bg-green-500",  border:"border-green-400",  text:"text-green-700",  bg:"bg-green-50",  desc:"Guided questions, clean numbers" },
  2: { label:"Medium", emoji:"🟡", color:"bg-yellow-500", border:"border-yellow-400", text:"text-yellow-700", bg:"bg-yellow-50", desc:"Standard challenge level" },
  3: { label:"Hard",   emoji:"🔴", color:"bg-red-500",    border:"border-red-400",    text:"text-red-700",    bg:"bg-red-50",    desc:"Tricky numbers, multi-step traps" },
};

// ─── QUESTION BANKS ──────────────────────────────────────────────────────────
// Each slot: { easy, medium, hard } — each tier has 3 variants
// generateTest picks one random variant from the correct tier

const BANKS = {
  1: [ // TEST 1 — DATA SUFFICIENCY
    // Slot 1: Class/Team size
    { easy:[
        {q:"A library contains only fiction and non-fiction books. How many books are in the library in total?\n(1) There are 340 fiction books in the library.\n(2) There are 160 non-fiction books in the library.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: 340 fiction books are known, but the number of non-fiction books is unknown. INSUFFICIENT.\nStatement 2 alone: 160 non-fiction books are known, but the number of fiction books is unknown. INSUFFICIENT.\nBoth statements together: 340 + 160 = 500 books in total. SUFFICIENT. Answer: C",tutorial:["Both statements are needed — one gives fiction, the other non-fiction.","340 + 160 = 500. Answer: C"]},
        {q:"A school hall contains only chairs and tables. How many items of furniture are in the hall?\n(1) There are 48 chairs in the hall.\n(2) There are 12 tables in the hall.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: 48 chairs known, tables unknown. INSUFFICIENT.\nStatement 2 alone: 12 tables known, chairs unknown. INSUFFICIENT.\nBoth: 48 + 12 = 60 items. SUFFICIENT. Answer: C",tutorial:["Need both parts to compute the total.","48 + 12 = 60. Answer: C"]},
        {q:"A car park contains only cars and motorcycles. How many vehicles are in the car park in total?\n(1) There are 75 cars in the car park.\n(2) There are 25 motorcycles in the car park.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: cars known, motorcycles unknown. INSUFFICIENT.\nStatement 2 alone: motorcycles known, cars unknown. INSUFFICIENT.\nBoth: 75 + 25 = 100. SUFFICIENT. Answer: C",tutorial:["Both counts are needed.","75 + 25 = 100. Answer: C"]}
      ],
      medium:[
        {q:"A concert hall contains only seated and standing audience members. How many people are attending the concert in total?\n(1) There are 240 seated audience members.\n(2) The ratio of seated to standing audience members is 4 : 1.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: 240 seated, standing unknown. INSUFFICIENT.\nStatement 2 alone: ratio 4:1 established, but no actual count given. INSUFFICIENT.\nBoth: Let k be the scale factor. 4k = 240, so k = 60. Standing = 60. Total = 300. SUFFICIENT. Answer: C",tutorial:["A ratio alone cannot determine a total without at least one actual count.","4k = 240 → k = 60 → Total = 300. Answer: C"]},
        {q:"A warehouse stores only boxes and crates. How many items are stored in the warehouse in total?\n(1) There are 180 boxes in the warehouse.\n(2) The ratio of boxes to crates is 3 : 2.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: boxes known, crates unknown. INSUFFICIENT.\nStatement 2 alone: ratio only, no actual count. INSUFFICIENT.\nBoth: 3k = 180 → k = 60 → crates = 120. Total = 300. SUFFICIENT. Answer: C",tutorial:["Ratio gives proportions but not quantities.","3k = 180 → crates = 120 → Total = 300. Answer: C"]},
        {q:"A survey includes only male and female respondents. How many respondents took part in the survey in total?\n(1) There are 350 female respondents.\n(2) The ratio of female to male respondents is 7 : 3.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: females known, males unknown. INSUFFICIENT.\nStatement 2 alone: ratio only, no count. INSUFFICIENT.\nBoth: 7k = 350 → k = 50 → males = 150. Total = 500. SUFFICIENT. Answer: C",tutorial:["Statement 2 gives proportions; Statement 1 anchors the scale.","7k = 350 → Total = 500. Answer: C"]}
      ],
      hard:[
        {q:"A factory has two production lines, Line A and Line B. How many units does Line B produce per day?\n(1) Line A produces three times as many units per day as Line B.\n(2) Together, both lines produce 480 units per day.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: A = 3B — one equation with two unknowns. INSUFFICIENT.\nStatement 2 alone: A + B = 480 — one equation with two unknowns. INSUFFICIENT.\nBoth: substituting A = 3B gives 3B + B = 480 → B = 120. SUFFICIENT. Answer: C",tutorial:["Each statement alone gives one equation with two unknowns.","3B + B = 480 → B = 120. Answer: C"]},
        {q:"A portfolio contains investments in Company X and Company Y only. What is the total value of the portfolio?\n(1) The value of the Company X investment exceeds the value of the Company Y investment by $4,500.\n(2) The Company X investment is worth twice the value of the Company Y investment.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: X - Y = 4,500 — two unknowns. INSUFFICIENT.\nStatement 2 alone: X = 2Y — two unknowns. INSUFFICIENT.\nBoth: 2Y - Y = 4,500 → Y = 4,500 and X = 9,000. Total = $13,500. SUFFICIENT. Answer: C",tutorial:["Two equations, two unknowns — solve simultaneously.","Y = 4,500 and X = 9,000. Total = $13,500. Answer: C"]},
        {q:"A train carries passengers in first class and second class only. How many passengers are travelling in first class?\n(1) The total number of passengers on the train is 560.\n(2) The number of second class passengers is four times the number of first class passengers.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: F + S = 560 — two unknowns. INSUFFICIENT.\nStatement 2 alone: S = 4F — two unknowns. INSUFFICIENT.\nBoth: F + 4F = 560 → 5F = 560 → F = 112. SUFFICIENT. Answer: C",tutorial:["Set up simultaneous equations using both statements.","F + 4F = 560 → F = 112. Answer: C"]}
      ]
    },
    // Slot 2: Even/odd
    { easy:[
        {q:"Is integer n divisible by 6?\n(1) n is divisible by 12.\n(2) n is divisible by 18.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:3,topic:"data-sufficiency",exp:"Statement 1 alone: every multiple of 12 is also a multiple of 6, since 12 = 2 × 6. SUFFICIENT.\nStatement 2 alone: every multiple of 18 is also a multiple of 6, since 18 = 3 × 6. SUFFICIENT.\nEach statement alone is sufficient. Answer: D",tutorial:["If n is a multiple of 12 or 18, it must be a multiple of 6.","Answer: D"]},
        {q:"Is integer p a multiple of 5?\n(1) p is a multiple of 15.\n(2) p is a multiple of 25.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:3,topic:"data-sufficiency",exp:"Statement 1 alone: 15 = 3 × 5, so every multiple of 15 is a multiple of 5. SUFFICIENT.\nStatement 2 alone: 25 = 5², so every multiple of 25 is a multiple of 5. SUFFICIENT.\nEach statement alone is sufficient. Answer: D",tutorial:["Both 15 and 25 are multiples of 5.","Answer: D"]},
        {q:"Is integer n divisible by 8?\n(1) n is divisible by 16.\n(2) n is divisible by 24.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:3,topic:"data-sufficiency",exp:"Statement 1 alone: 16 = 2 × 8, so every multiple of 16 is a multiple of 8. SUFFICIENT.\nStatement 2 alone: 24 = 3 × 8, so every multiple of 24 is a multiple of 8. SUFFICIENT.\nEach statement alone is sufficient. Answer: D",tutorial:["16 = 2 × 8 and 24 = 3 × 8.","Answer: D"]}
      ],
      medium:[
        {q:"Is integer n even?\n(1) 3n is an integer.\n(2) n + 3 is odd.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:1,topic:"data-sufficiency",exp:"Statement 1 alone: 3n is an integer for every integer n, regardless of parity. This statement provides no useful information. INSUFFICIENT.\nStatement 2 alone: if n + 3 is odd, then since 3 is odd, n must be even (even + odd = odd). SUFFICIENT.\nAnswer: B",tutorial:["Statement 1 is true for ALL integers — it tells you nothing.","n + 3 odd → n must be even. Answer: B"]},
        {q:"Is integer k odd?\n(1) 2k is even.\n(2) k - 4 is odd.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:1,topic:"data-sufficiency",exp:"Statement 1 alone: 2k is even for every integer k without exception. This statement is vacuous and provides no information about whether k is odd or even. INSUFFICIENT.\nStatement 2 alone: if k - 4 is odd, then since 4 is even, k must be odd (odd - even = odd). SUFFICIENT.\nAnswer: B",tutorial:["Statement 1 is vacuous: 2k is always even.","k - 4 odd → k is odd. Answer: B"]},
        {q:"Is integer m divisible by 4?\n(1) m is divisible by 2.\n(2) m divided by 2 is an even integer.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:1,topic:"data-sufficiency",exp:"Statement 1 alone: m could be 2, 6, or 10 — each divisible by 2 but not by 4. INSUFFICIENT.\nStatement 2 alone: m ÷ 2 = 2j for some integer j, therefore m = 4j. Thus m is divisible by 4. SUFFICIENT.\nAnswer: B",tutorial:["Divisible by 2 does not guarantee divisible by 4.","m ÷ 2 even → m = 4j → divisible by 4. Answer: B"]}
      ],
      hard:[
        {q:"Is integer n divisible by 12?\n(1) n is divisible by 4.\n(2) n is divisible by 9.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: n = 4 is not divisible by 12. INSUFFICIENT.\nStatement 2 alone: n = 9 is not divisible by 12. INSUFFICIENT.\nBoth statements together: since GCD(4, 9) = 1, if n is divisible by both 4 and 9 then n is divisible by LCM(4, 9) = 36. Every multiple of 36 is divisible by 12. SUFFICIENT. Answer: C",tutorial:["GCD(4, 9) = 1, so both conditions together imply divisibility by 36.","36 is divisible by 12. Answer: C"]},
        {q:"Is integer n a perfect square?\n(1) n is divisible by 4.\n(2) n is divisible by 9.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:4,topic:"data-sufficiency",exp:"Statement 1 alone: n = 4 is a perfect square, but n = 8 is not. INSUFFICIENT.\nStatement 2 alone: n = 9 is a perfect square, but n = 18 is not. INSUFFICIENT.\nBoth statements together: n is divisible by 36. However, n = 36 is a perfect square while n = 72 is not. INSUFFICIENT. Answer: E",tutorial:["Even combined, divisibility by 36 does not guarantee a perfect square.","n = 72 is divisible by 36 but is not a perfect square. Answer: E"]},
        {q:"Is n² divisible by 36?\n(1) n is divisible by 6.\n(2) n is divisible by 4.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:0,topic:"data-sufficiency",exp:"Statement 1 alone: n = 6k → n² = 36k², which is always divisible by 36. SUFFICIENT.\nStatement 2 alone: n = 4 → n² = 16, which is not divisible by 36. INSUFFICIENT.\nAnswer: A",tutorial:["n = 6k → n² = 36k². Always divisible by 36.","Statement 1 alone is sufficient. Answer: A"]}
      ]
    },
    // Slot 3: Fraction
    { easy:[
        {q:"A bag contains only red and blue marbles. What fraction of the marbles in the bag are red?\n(1) There are 7 red marbles in the bag.\n(2) There are 28 marbles in the bag in total.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: 7 red marbles are known, but the total is unknown. INSUFFICIENT.\nStatement 2 alone: 28 total marbles are known, but the number that are red is unknown. INSUFFICIENT.\nBoth: 7 ÷ 28 = 1/4. SUFFICIENT. Answer: C",tutorial:["You need both the part and the whole to calculate a fraction.","7 ÷ 28 = 1/4. Answer: C"]},
        {q:"In an examination, what fraction of the students received a passing mark?\n(1) 18 students received a passing mark.\n(2) 30 students sat the examination.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: 18 passed, but total is unknown. INSUFFICIENT.\nStatement 2 alone: 30 sat, but number who passed is unknown. INSUFFICIENT.\nBoth: 18 ÷ 30 = 3/5. SUFFICIENT. Answer: C",tutorial:["Both the part and the whole are required.","18 ÷ 30 = 3/5. Answer: C"]},
        {q:"A pie is divided into equal slices. What fraction of the pie remains uneaten?\n(1) 3 slices remain uneaten.\n(2) The pie was originally divided into 10 slices.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: 3 slices remain, original total unknown. INSUFFICIENT.\nStatement 2 alone: 10 slices total, number remaining unknown. INSUFFICIENT.\nBoth: 3 ÷ 10 = 3/10. SUFFICIENT. Answer: C",tutorial:["Fraction = remaining ÷ total. Both statements are needed.","3 ÷ 10 = 3/10. Answer: C"]}
      ],
      medium:[
        {q:"What fraction of a class of students achieved a distinction in their examination?\n(1) The ratio of students who achieved a distinction to those who did not is 2 : 3.\n(2) 18 students achieved a distinction.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:0,topic:"data-sufficiency",exp:"Statement 1 alone: ratio 2:3 means 2 out of every 5 students achieved a distinction. Fraction = 2/5. This is determined regardless of the class size. SUFFICIENT.\nStatement 2 alone: 18 achieved a distinction, but the total class size is unknown. INSUFFICIENT.\nAnswer: A",tutorial:["A ratio of parts gives you a fraction directly: 2/(2+3) = 2/5.","Answer: A"]},
        {q:"What fraction of the parcels in a delivery were damaged?\n(1) The ratio of damaged parcels to undamaged parcels is 1 : 11.\n(2) 8 parcels were damaged.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:0,topic:"data-sufficiency",exp:"Statement 1 alone: ratio 1:11 means 1 out of every 12 parcels was damaged. Fraction = 1/12. SUFFICIENT.\nStatement 2 alone: 8 parcels damaged, but the total number of parcels is unknown. INSUFFICIENT.\nAnswer: A",tutorial:["1/(1+11) = 1/12. The ratio alone is sufficient.","Answer: A"]},
        {q:"A bag contains only blue and non-blue counters. What fraction of the counters are blue?\n(1) The ratio of blue counters to non-blue counters is 3 : 7.\n(2) There are 42 non-blue counters in the bag.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:0,topic:"data-sufficiency",exp:"Statement 1 alone: ratio 3:7 means 3 out of every 10 counters are blue. Fraction = 3/10. SUFFICIENT.\nStatement 2 alone: 42 non-blue counters, but the number of blue counters is unknown. INSUFFICIENT.\nAnswer: A",tutorial:["3/(3+7) = 3/10. The ratio alone determines the fraction.","Answer: A"]}
      ],
      hard:[
        {q:"What fraction of n is m, where m and n are positive integers?\n(1) m + n = 20.\n(2) m = n - 12.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: m + n = 20 has multiple solutions (e.g. m = 1 and n = 19, or m = 4 and n = 16). INSUFFICIENT.\nStatement 2 alone: m = n - 12 has infinitely many solutions. INSUFFICIENT.\nBoth: substituting m = n - 12 into m + n = 20 gives (n - 12) + n = 20 → 2n = 32 → n = 16, m = 4. Fraction = 4/16 = 1/4. SUFFICIENT. Answer: C",tutorial:["Two equations, two unknowns — solve simultaneously.","n = 16, m = 4 → m/n = 1/4. Answer: C"]},
        {q:"A mixture contains alcohol, water, and syrup only. What fraction of the mixture is alcohol?\n(1) The mixture is 40% water.\n(2) Alcohol, water, and syrup are present in equal proportions.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:1,topic:"data-sufficiency",exp:"Statement 1 alone: water is 40%, but the split between alcohol and syrup is unknown. INSUFFICIENT.\nStatement 2 alone: equal proportions of three components means each is 1/3 of the mixture. Fraction of alcohol = 1/3. SUFFICIENT.\nAnswer: B",tutorial:["Three equal proportions → each is 1/3.","Answer: B"]},
        {q:"A jar contains only red, blue, and green marbles. What fraction of the marbles are red?\n(1) Red marbles constitute one-quarter of all non-green marbles.\n(2) The number of blue marbles equals the combined total of red and green marbles.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: R = (1/4)(R + B) → 4R = R + B → B = 3R. The proportion of green marbles is still unknown. INSUFFICIENT.\nStatement 2 alone: B = R + G — one equation with three unknowns. INSUFFICIENT.\nBoth: B = 3R from Statement 1. Substituting into B = R + G gives 3R = R + G → G = 2R. Total = R + 3R + 2R = 6R. Fraction red = R / 6R = 1/6. SUFFICIENT. Answer: C",tutorial:["Statement 1 gives B = 3R. Statement 2 gives G = 2R.","Total = 6R → Fraction red = 1/6. Answer: C"]}
      ]
    },
    // Slot 4: x+y sum
    { easy:[
        {q:"What is the value of x + y?\n(1) x = 7.\n(2) y = 9.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: x = 7, but y is unknown. INSUFFICIENT.\nStatement 2 alone: y = 9, but x is unknown. INSUFFICIENT.\nBoth: x + y = 7 + 9 = 16. SUFFICIENT. Answer: C",tutorial:["Each statement gives only one of the two variables.","x + y = 7 + 9 = 16. Answer: C"]},
        {q:"What is the value of a + b?\n(1) a = 14.\n(2) b = 6.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: a = 14, b unknown. INSUFFICIENT.\nStatement 2 alone: b = 6, a unknown. INSUFFICIENT.\nBoth: a + b = 14 + 6 = 20. SUFFICIENT. Answer: C",tutorial:["Both variables are needed to find their sum.","a + b = 20. Answer: C"]},
        {q:"What is the value of p + q?\n(1) p = 5.\n(2) q = 11.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: p = 5, q unknown. INSUFFICIENT.\nStatement 2 alone: q = 11, p unknown. INSUFFICIENT.\nBoth: p + q = 5 + 11 = 16. SUFFICIENT. Answer: C",tutorial:["Both values are needed to compute the sum.","p + q = 16. Answer: C"]}
      ],
      medium:[
        {q:"What is the value of x + y?\n(1) 3x + 3y = 39.\n(2) x - y = 5.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:0,topic:"data-sufficiency",exp:"Statement 1 alone: 3(x + y) = 39 → x + y = 13. The sum is determined directly. SUFFICIENT.\nStatement 2 alone: this gives the difference x - y = 5, not the sum. INSUFFICIENT.\nAnswer: A",tutorial:["Factor out 3: 3(x + y) = 39 → x + y = 13.","Statement 1 alone is sufficient. Answer: A"]},
        {q:"What is the value of a + b?\n(1) a = 2b + 1.\n(2) 2a + 2b = 26.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:1,topic:"data-sufficiency",exp:"Statement 1 alone: a = 2b + 1 — one equation with two unknowns. Many solutions exist. INSUFFICIENT.\nStatement 2 alone: 2(a + b) = 26 → a + b = 13. SUFFICIENT.\nAnswer: B",tutorial:["Statement 2: 2(a + b) = 26 → a + b = 13.","Answer: B"]},
        {q:"What is the value of p + q?\n(1) 2p - q = 5.\n(2) p + 2q = 20.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: 2p - q = 5 — one equation with two unknowns. INSUFFICIENT.\nStatement 2 alone: p + 2q = 20 — one equation with two unknowns. INSUFFICIENT.\nBoth: from Statement 1, q = 2p - 5. Substituting into Statement 2: p + 2(2p - 5) = 20 → 5p = 30 → p = 6, q = 7. Therefore p + q = 13. SUFFICIENT. Answer: C",tutorial:["Two equations and two unknowns — solve simultaneously.","p = 6, q = 7 → p + q = 13. Answer: C"]}
      ],
      hard:[
        {q:"What is the value of x + y?\n(1) (x + y)² = 81.\n(2) x - y = 3.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:4,topic:"data-sufficiency",exp:"Statement 1 alone: (x + y)² = 81 → x + y = 9 or x + y = -9. Two possible values. INSUFFICIENT.\nStatement 2 alone: this gives only the difference x - y = 3. INSUFFICIENT.\nBoth statements together: x + y is still either 9 or -9 (yielding solution pairs (6, 3) or (-3, -6)). The sum remains ambiguous. INSUFFICIENT. Answer: E",tutorial:["(x + y)² = 81 gives two values: +9 and -9.","Even combined, the sum is not uniquely determined. Answer: E"]},
        {q:"What is the value of x + y, given that x > y > 0?\n(1) x² - y² = 45.\n(2) x - y = 3.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: (x + y)(x - y) = 45 — two unknowns. INSUFFICIENT.\nStatement 2 alone: x - y = 3 only — sum unknown. INSUFFICIENT.\nBoth: substituting x - y = 3 gives (x + y) × 3 = 45 → x + y = 15. With x - y = 3, we get x = 9 and y = 6, both positive. SUFFICIENT. Answer: C",tutorial:["Difference of squares: (x + y)(x - y) = 45.","(x + y) × 3 = 45 → x + y = 15. Answer: C"]},
        {q:"What is the value of x + y, where x and y are positive integers?\n(1) xy = 24 and x + y is a positive integer.\n(2) Both x and y are positive integers less than 8.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:1,topic:"data-sufficiency",exp:"Statement 1 alone: multiple pairs have product 24 — for example, 1 × 24, 2 × 12, 3 × 8, 4 × 6. The sum is not uniquely determined. INSUFFICIENT.\nStatement 2 alone: the only pair of positive integers less than 8 with product 24 is (4, 6), since 3 × 8 = 24 but 8 is not less than 8. Therefore x + y = 10. SUFFICIENT.\nAnswer: B",tutorial:["Statement 2: only (4, 6) has product 24 with both values less than 8.","x + y = 4 + 6 = 10. Answer: B"]}
      ]
    },
    // Slot 5: Find x
    { easy:[
        {q:"What is the value of x?\n(1) 2x + 3 = 11.\n(2) 3x - 1 = 11.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:3,topic:"data-sufficiency",exp:"Statement 1 alone: 2x = 8 → x = 4. A unique solution. SUFFICIENT.\nStatement 2 alone: 3x = 12 → x = 4. A unique solution. SUFFICIENT.\nEach statement alone is sufficient. Answer: D",tutorial:["Both linear equations independently give x = 4.","Answer: D"]},
        {q:"What is the value of x?\n(1) x ÷ 3 = 4.\n(2) 2x - 4 = 20.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:3,topic:"data-sufficiency",exp:"Statement 1 alone: x = 12. A unique solution. SUFFICIENT.\nStatement 2 alone: 2x = 24 → x = 12. A unique solution. SUFFICIENT.\nAnswer: D",tutorial:["Both equations give x = 12 independently.","Answer: D"]},
        {q:"What is the value of x?\n(1) 5x = 25.\n(2) x + 7 = 12.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:3,topic:"data-sufficiency",exp:"Statement 1 alone: x = 5. SUFFICIENT.\nStatement 2 alone: x = 5. SUFFICIENT.\nAnswer: D",tutorial:["Both statements independently give x = 5.","Answer: D"]}
      ],
      medium:[
        {q:"What is the value of x?\n(1) 4x - 3 = 13.\n(2) x² - 16 = 0.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:0,topic:"data-sufficiency",exp:"Statement 1 alone: 4x = 16 → x = 4. A unique solution. SUFFICIENT.\nStatement 2 alone: x² = 16 → x = 4 or x = -4. Two possible values. INSUFFICIENT.\nAnswer: A",tutorial:["Statement 1 gives a unique linear solution.","Statement 2 gives two values: ±4. Answer: A"]},
        {q:"What is the value of n?\n(1) n² + n - 6 = 0.\n(2) 2n + 4 = 10.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:1,topic:"data-sufficiency",exp:"Statement 1 alone: (n + 3)(n - 2) = 0 → n = -3 or n = 2. Two possible values. INSUFFICIENT.\nStatement 2 alone: 2n = 6 → n = 3. A unique solution. SUFFICIENT.\nAnswer: B",tutorial:["Statement 1 gives n = -3 or n = 2. Insufficient.","Statement 2 gives n = 3 uniquely. Answer: B"]},
        {q:"What is the value of k?\n(1) k² - k - 6 = 0.\n(2) k > 0.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: (k - 3)(k + 2) = 0 → k = 3 or k = -2. Two possible values. INSUFFICIENT.\nStatement 2 alone: k > 0 gives infinitely many possible values. INSUFFICIENT.\nBoth statements together: of the two solutions, only k = 3 satisfies k > 0. SUFFICIENT. Answer: C",tutorial:["Statement 1 gives k = 3 or k = -2.","Statement 2 eliminates k = -2. Answer: C"]}
      ],
      hard:[
        {q:"What is the value of x?\n(1) x² - 5x + 6 = 0.\n(2) x² - 7x + 12 = 0.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: (x - 2)(x - 3) = 0 → x = 2 or x = 3. Two possible values. INSUFFICIENT.\nStatement 2 alone: (x - 3)(x - 4) = 0 → x = 3 or x = 4. Two possible values. INSUFFICIENT.\nBoth statements together: the only value satisfying both equations is x = 3. SUFFICIENT. Answer: C",tutorial:["Find the intersection of the two solution sets: {2, 3} ∩ {3, 4} = {3}.","Answer: C"]},
        {q:"What is the value of x?\n(1) |x - 4| = 6.\n(2) x > 0.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:2,topic:"data-sufficiency",exp:"Statement 1 alone: |x - 4| = 6 → x = 10 or x = -2. Two possible values. INSUFFICIENT.\nStatement 2 alone: x > 0 gives infinitely many possible values. INSUFFICIENT.\nBoth statements together: of the two solutions, only x = 10 satisfies x > 0. SUFFICIENT. Answer: C",tutorial:["Statement 1 gives x = 10 or x = -2.","Statement 2 eliminates x = -2. Answer: C"]},
        {q:"What is the value of x?\n(1) x² = 49.\n(2) x² - 14x + 49 = 0.",opts:["A) Statement 1 alone is sufficient, but Statement 2 alone is not sufficient.","B) Statement 2 alone is sufficient, but Statement 1 alone is not sufficient.","C) Both statements together are sufficient, but neither statement alone is sufficient.","D) Each statement alone is sufficient.","E) Neither statement alone nor both statements together are sufficient."],ans:1,topic:"data-sufficiency",exp:"Statement 1 alone: x² = 49 → x = 7 or x = -7. Two possible values. INSUFFICIENT.\nStatement 2 alone: x² - 14x + 49 = (x - 7)² = 0 → x = 7. A unique solution. SUFFICIENT.\nAnswer: B",tutorial:["Recognise the perfect square: (x - 7)² = 0 → x = 7 uniquely.","Answer: B"]}
      ]
    },
    // Slots 6-11: use medium variants only with same structure
    ...Array(6).fill(null).map((_, i) => ({
      easy: [], medium: [], hard: []
    }))
  ],
  2: [ // TEST 2 — ARITHMETIC (3 difficulty tiers per slot)
    // Slot 1: Prime factorisation
    { easy:[
        {q:"What is the largest prime factor of 12?",opts:["2","3","4","6","12"],ans:1,topic:"number-theory",exp:"12=2²×3. Prime factors: 2,3. Largest=3.\nNote: 4,6,12 are NOT prime.\nAnswer: B=3",tutorial:["📌 Prime: only divisible by 1 and itself.","12÷2=6÷2=3. Primes used: 2 and 3.","Largest=3. (4 and 6 are not prime!)","Answer: B=3"]},
        {q:"What is the largest prime factor of 30?",opts:["2","3","5","6","15"],ans:2,topic:"number-theory",exp:"30=2×3×5. Largest prime=5.\nAnswer: C=5",tutorial:["📌 30÷2=15÷3=5. 5 is prime.","Largest prime=5.","Answer: C=5"]},
        {q:"What are ALL prime factors of 18?",opts:["2 only","3 only","2 and 3","6 and 3","9 and 2"],ans:2,topic:"number-theory",exp:"18=2×3². Prime factors: 2 and 3.\nAnswer: C",tutorial:["📌 18÷2=9÷3=3÷3=1. Primes: 2 and 3.","Answer: C — 2 and 3"]},
      ],
      medium:[
        {q:"What is the largest prime factor of 180?",opts:["2","3","5","9","45"],ans:2,topic:"number-theory",exp:"180=2²×3²×5. Largest prime=5.\nAnswer: C=5",tutorial:["📌 180÷2=90÷2=45÷3=15÷3=5.","180=2²×3²×5. Largest prime=5.","9 and 45 are NOT prime!","Answer: C=5"]},
        {q:"What is the largest prime factor of 120?",opts:["2","3","5","8","24"],ans:2,topic:"number-theory",exp:"120=2³×3×5. Largest prime=5.\nAnswer: C=5",tutorial:["📌 120÷2=60÷2=30÷2=15÷3=5.","Largest prime=5.","Answer: C=5"]},
        {q:"What is the largest prime factor of 210?",opts:["2","3","5","7","30"],ans:3,topic:"number-theory",exp:"210=2×3×5×7. Largest prime=7.\nAnswer: D=7",tutorial:["📌 210÷2=105÷3=35÷5=7.","Largest prime=7.","Answer: D=7"]},
      ],
      hard:[
        {q:"What is the largest prime factor of 252?",opts:["2","3","6","7","63"],ans:3,topic:"number-theory",exp:"252=2²×3²×7. Largest prime=7.\nNote: 6 and 63 are NOT prime.\nAnswer: D=7",tutorial:["📌 252÷2=126÷2=63÷3=21÷3=7.","252=2²×3²×7. Largest prime=7.","Answer: D=7"]},
        {q:"How many distinct prime factors does 360 have?",opts:["2","3","4","5","6"],ans:1,topic:"number-theory",exp:"360=2³×3²×5. Distinct prime factors: 2,3,5 → THREE.\nAnswer: B=3",tutorial:["📌 360=8×45=8×9×5=2³×3²×5.","Distinct primes: 2, 3, 5 → count=3.","Answer: B=3"]},
        {q:"What is the sum of all prime factors (with repetition) of 72?",opts:["10","12","14","16","18"],ans:1,topic:"number-theory",exp:"72=2³×3²=2×2×2×3×3. Sum=2+2+2+3+3=12.\nAnswer: B=12",tutorial:["📌 'With repetition' means add each prime as many times as it appears.","72=2×2×2×3×3. Sum=2+2+2+3+3=12.","Answer: B=12"]},
      ]
    },
    // Slot 2: Power remainders
    { easy:[
        {q:"What is the remainder when 10 is divided by 3?",opts:["0","1","2","3","4"],ans:1,topic:"number-theory",exp:"10÷3=3 remainder 1.\n10=3×3+1. Remainder=1.\nAnswer: B=1",tutorial:["📌 Remainder is what's LEFT OVER after full division.","10÷3=3 with 1 left over.","10=3×3+1. Remainder=1.","Answer: B=1"]},
        {q:"What is the remainder when 25 is divided by 6?",opts:["1","2","3","4","5"],ans:0,topic:"number-theory",exp:"25=6×4+1. 6×4=24, 25−24=1. Remainder=1.\nAnswer: A=1",tutorial:["📌 25÷6: 6×4=24, 25−24=1.","Remainder=1. Answer: A=1"]},
        {q:"What is the remainder when 17 is divided by 5?",opts:["1","2","3","4","5"],ans:1,topic:"number-theory",exp:"17=5×3+2. Remainder=2.\nAnswer: B=2",tutorial:["📌 17÷5: 5×3=15, 17−15=2.","Remainder=2. Answer: B=2"]},
      ],
      medium:[
        {q:"What is the remainder when 2¹⁸ is divided by 7?\n\n⚠️ Find the REMAINDER, not the decimal quotient.",opts:["1","2","3","4","6"],ans:0,topic:"number-theory",exp:"Cycle of 2ⁿ mod 7: [2,4,1] period 3. 18÷3=6 → position 3 → remainder=1.\nAnswer: A=1",tutorial:["📌 Find the repeating cycle.","2¹%7=2, 2²%7=4, 2³%7=1. Cycle length=3.","18÷3=6 exactly → end of cycle → 1.","Answer: A=1"]},
        {q:"What is the remainder when 3¹⁵ is divided by 4?\n\n⚠️ Find the REMAINDER, not the decimal.",opts:["0","1","2","3","Cannot determine"],ans:3,topic:"number-theory",exp:"3¹%4=3, 3²%4=1. Cycle [3,1] period 2. 15 odd → pos 1 → remainder=3.\nAnswer: D=3",tutorial:["📌 Cycle of 3ⁿ mod 4: [3,1] period 2.","15 is odd → position 1 → remainder=3.","Answer: D=3"]},
        {q:"What is the remainder when 5¹⁰ is divided by 3?\n\n⚠️ Find the REMAINDER, not the decimal.",opts:["0","1","2","3","Cannot determine"],ans:1,topic:"number-theory",exp:"5≡2 mod 3. 2¹%3=2, 2²%3=1. Cycle [2,1] period 2. 10 even → pos 2 → 1.\nAnswer: B=1",tutorial:["📌 5≡2(mod 3). Cycle of 2ⁿ mod 3: [2,1] period 2.","10 even → position 2 → 1. Answer: B=1"]},
      ],
      hard:[
        {q:"What is the remainder when 4²⁰ is divided by 9?\n\n⚠️ Find the REMAINDER, not the decimal.",opts:["1","4","5","7","8"],ans:3,topic:"number-theory",exp:"Cycle of 4ⁿ mod 9: [4,7,1] period 3. 20÷3=6r2 → position 2 → remainder=7.\nAnswer: D=7",tutorial:["📌 4¹%9=4, 4²%9=7, 4³%9=1. Cycle [4,7,1] period 3.","20÷3=6 remainder 2 → position 2 in cycle → 7.","Answer: D=7"]},
        {q:"For which value of n is 2ⁿ − 1 divisible by 7?",opts:["n=1","n=2","n=3","n=5","n=6"],ans:2,topic:"number-theory",exp:"2³=8. 8−1=7. 7÷7=1. ✓ Answer: C=3.\nCheck: 2¹−1=1, 2²−1=3, 2³−1=7 ✓",tutorial:["📌 Test each value: 2¹−1=1, 2²−1=3, 2³−1=7=7×1. ✓","Answer: C=n=3"]},
        {q:"What is the units digit of 7⁴⁸?",opts:["1","3","7","9","Cannot determine"],ans:0,topic:"number-theory",exp:"Units digits of powers of 7 cycle: 7,9,3,1 (period 4). 48÷4=12 exactly → position 4 → units digit=1.\nAnswer: A=1",tutorial:["📌 Units digit cycles: 7¹=7, 7²=49→9, 7³→3, 7⁴→1. Period=4.","48÷4=12 exactly → end of cycle → 1.","Answer: A=1"]},
      ]
    },
    // Slots 3-11: provide easy/medium/hard variants
    { easy:[
        {q:"An integer n leaves a remainder of 1 when divided by 4. What is the remainder when 2n is divided by 4?",opts:["0","1","2","3","4"],ans:2,topic:"number-theory",exp:"n=4k+1. 2n=8k+2. 2÷4=0r2. Remainder=2.\nAnswer: C=2",tutorial:["📌 n=4k+1. 2n=8k+2. 8k is divisible by 4. 2÷4 has remainder 2.","Answer: C=2"]},
        {q:"An integer n leaves a remainder of 3 when divided by 5. What is the remainder when n+5 is divided by 5?",opts:["0","1","2","3","4"],ans:3,topic:"number-theory",exp:"n=5k+3. n+5=5k+8. 8÷5=1r3. Remainder=3.\nAnswer: D=3",tutorial:["📌 Adding 5 doesn't change remainder mod 5! n+5≡n mod 5.","Remainder stays 3.","Answer: D=3"]},
        {q:"What is the remainder when 20 is divided by 6?",opts:["0","1","2","3","4"],ans:2,topic:"number-theory",exp:"20=6×3+2. Remainder=2.\nAnswer: C=2",tutorial:["📌 6×3=18. 20−18=2.","Remainder=2. Answer: C=2"]},
      ],
      medium:[
        {q:"An integer n leaves a remainder of 4 when divided by 9. What is the remainder when 3n is divided by 9?",opts:["1","3","4","6","7"],ans:1,topic:"number-theory",exp:"n=9k+4. 3n=27k+12. 12÷9=1r3. Remainder=3.\nAnswer: B=3",tutorial:["📌 n=9k+4. 3n=27k+12. 27k is divisible by 9. 12 mod 9=3.","Answer: B=3"]},
        {q:"An integer n leaves a remainder of 5 when divided by 7. What is the remainder when 2n is divided by 7?",opts:["1","2","3","4","5"],ans:2,topic:"number-theory",exp:"n=7k+5. 2n=14k+10. 10÷7=1r3. Remainder=3.\nAnswer: C=3",tutorial:["📌 2n=14k+10. 10 mod 7=3.","Answer: C=3"]},
        {q:"An integer n leaves a remainder of 4 when divided by 7. What is the remainder when 3n is divided by 7?",opts:["0","3","4","5","6"],ans:3,topic:"number-theory",exp:"n=7k+4. 3n=21k+12. 12÷7=1r5. Remainder=5.\nAnswer: D=5",tutorial:["📌 3n=21k+12. 12 mod 7=5.","Answer: D=5"]},
      ],
      hard:[
        {q:"An integer n leaves a remainder of 3 when divided by 7. What is the remainder when 5n is divided by 7?",opts:["0","1","2","3","4"],ans:1,topic:"number-theory",exp:"n=7k+3. 5n=35k+15. 15÷7=2r1. Remainder=1.\nAnswer: B=1",tutorial:["📌 5n=35k+15. 35k is divisible by 7. 15 mod 7=1.","Answer: B=1"]},
        {q:"An integer n leaves a remainder of 6 when divided by 8. What is the remainder when n² is divided by 8?",opts:["0","2","4","6","7"],ans:2,topic:"number-theory",exp:"n=8k+6. n²=(8k+6)²=64k²+96k+36. 36÷8=4r4. Remainder=4.\nAnswer: C=4",tutorial:["📌 n=8k+6. n²=64k²+96k+36. All terms are divisible by 8 except 36.","36÷8=4r4. Remainder=4. Answer: C=4"]},
        {q:"Which of these remainders is impossible when n² is divided by 4?",opts:["0","1","2","3","Both 2 and 3"],ans:4,topic:"number-theory",exp:"n even: n²≡0 mod 4. n odd: n=(2k+1), n²=4k²+4k+1≡1 mod 4.\nSo n² mod 4 is always 0 or 1. Remainders 2 and 3 are IMPOSSIBLE.\nAnswer: E",tutorial:["📌 Test cases: n=1→1²=1→rem1; n=2→4→rem0; n=3→9→rem1; n=4→16→rem0.","n² mod 4 is always 0 or 1. Never 2 or 3.","Answer: E"]},
      ]
    },
    { easy:[
        {q:"What is the sum of all factors of 12?",opts:["24","28","30","32","36"],ans:1,topic:"number-theory",exp:"Factors: 1,2,3,4,6,12. Sum=1+2+3+4+6+12=28.\nAnswer: B=28",tutorial:["📌 Pairs up to √12≈3.5: 1×12, 2×6, 3×4.","Sum=1+2+3+4+6+12=28. Answer: B=28"]},
        {q:"What is the sum of all factors of 16?",opts:["24","28","30","31","32"],ans:3,topic:"number-theory",exp:"Factors: 1,2,4,8,16. Sum=31.\nAnswer: D=31",tutorial:["📌 Pairs: 1×16, 2×8, 4×4.","Sum=1+2+4+8+16=31. Answer: D=31"]},
        {q:"What is the sum of all factors of 20?",opts:["38","40","42","44","46"],ans:2,topic:"number-theory",exp:"Factors: 1,2,4,5,10,20. Sum=42.\nAnswer: C=42",tutorial:["📌 1×20, 2×10, 4×5.","Sum=1+2+4+5+10+20=42. Answer: C=42"]},
      ],
      medium:[
        {q:"What is the sum of all positive factors of 36?",opts:["55","72","78","91","96"],ans:3,topic:"number-theory",exp:"Factors: 1,2,3,4,6,9,12,18,36. Sum=91.\nAnswer: D=91",tutorial:["📌 Pairs: 1×36,2×18,3×12,4×9,6×6.","Sum=91. Answer: D=91"]},
        {q:"What is the sum of all positive factors of 48?",opts:["76","100","124","148","196"],ans:2,topic:"number-theory",exp:"Factors: 1,2,3,4,6,8,12,16,24,48. Sum=124.\nAnswer: C=124",tutorial:["📌 Pairs: 1×48,2×24,3×16,4×12,6×8.","Sum=124. Answer: C=124"]},
        {q:"What is the sum of all positive factors of 24?",opts:["36","48","60","72","84"],ans:2,topic:"number-theory",exp:"Factors: 1,2,3,4,6,8,12,24. Sum=60.\nAnswer: C=60",tutorial:["📌 Pairs: 1×24,2×12,3×8,4×6.","Sum=60. Answer: C=60"]},
      ],
      hard:[
        {q:"What is the sum of all PROPER factors of 72? (Proper factors exclude the number itself.)",opts:["103","113","123","133","143"],ans:2,topic:"number-theory",exp:"All factors of 72: 1,2,3,4,6,8,9,12,18,24,36,72. Proper factors exclude 72: sum=123.\nAnswer: C=123",tutorial:["📌 Proper factors = all factors EXCEPT the number itself.","72=2³×3². Factors: 1,2,3,4,6,8,9,12,18,24,36,72.","Sum of proper factors=123. Answer: C=123"]},
        {q:"A number n has exactly 3 factors. What must be true of n?",opts:["n is even","n is a prime","n is a perfect square of a prime","n is divisible by 4","n is odd"],ans:2,topic:"number-theory",exp:"Exactly 3 factors: 1, p, p² where p is prime. (e.g. 4: 1,2,4; 9: 1,3,9; 25: 1,5,25)\nAnswer: C",tutorial:["📌 Factor count formula: if n=p^a, count=(a+1).","3 factors → (a+1)=3 → a=2 → n=p².","n is the square of a prime! e.g. 4,9,25,49.","Answer: C"]},
        {q:"For which value of n do the factors of n sum to 2n? (Such numbers are called 'perfect'.)",opts:["6","8","12","14","16"],ans:0,topic:"number-theory",exp:"6: factors 1,2,3,6. Sum=12=2×6. ✓\nThis defines a perfect number!\nAnswer: A=6",tutorial:["📌 A 'perfect number' has factors that sum to 2n (or proper factors sum to n).","6: 1+2+3+6=12=2×6. ✓","Answer: A=6"]},
      ]
    },
    { easy:[
        {q:"Write 0.005 in scientific notation.",opts:["5 × 10⁻²","5 × 10⁻³","0.5 × 10⁻²","5 × 10³","50 × 10⁻⁴"],ans:1,topic:"arithmetic",exp:"Move decimal right 3 places → 5. Exponent=−3. Answer: 5×10⁻³.\nAnswer: B",tutorial:["📌 Move decimal RIGHT to get 1≤a<10.","0.005 → move right 3 places → 5. Exponent=−3.","Answer: B: 5×10⁻³"]},
        {q:"Write 0.042 in scientific notation.",opts:["4.2 × 10⁻¹","4.2 × 10⁻²","42 × 10⁻³","4.2 × 10²","0.42 × 10⁻¹"],ans:1,topic:"arithmetic",exp:"0.042: move right 2 places → 4.2. Exponent=−2. Answer: 4.2×10⁻².\nAnswer: B",tutorial:["📌 0.042 → 4.2. Moved 2 places right → 10⁻².","Answer: B: 4.2×10⁻²"]},
        {q:"Which of these is written in correct scientific notation?",opts:["42 × 10⁻³","0.42 × 10⁻¹","4.2 × 10⁻²","40.2 × 10⁻³","0.042 × 10⁰"],ans:2,topic:"arithmetic",exp:"Scientific notation: 1≤a<10. Only 4.2×10⁻² satisfies 1≤4.2<10.\nAnswer: C",tutorial:["📌 Rule: must be a×10ⁿ where 1≤a<10.","A: 42≥10 ✗. B: 0.42<1 ✗. C: 4.2 ✓. D: 40.2≥10 ✗. E: 0.042<1 ✗.","Answer: C"]},
      ],
      medium:[
        {q:"Write 0.000047 in correct scientific notation.",opts:["4.7 × 10⁻⁴","47 × 10⁻⁶","4.7 × 10⁻⁵","0.47 × 10⁻⁴","4.7 × 10⁵"],ans:2,topic:"arithmetic",exp:"Move right 5 places → 4.7. Exponent=−5. Answer: C",tutorial:["📌 0.000047: move right 5 places → 4.7. → 4.7×10⁻⁵.","B(47×10⁻⁶) equals same value but 47≥10 — invalid form.","Answer: C"]},
        {q:"Write 0.0000083 in correct scientific notation.",opts:["8.3 × 10⁻⁵","83 × 10⁻⁷","8.3 × 10⁻⁶","0.83 × 10⁻⁵","8.3 × 10⁶"],ans:2,topic:"arithmetic",exp:"Move right 6 places → 8.3. Answer: 8.3×10⁻⁶. Answer: C",tutorial:["📌 0.0000083: 6 places right → 8.3×10⁻⁶.","Answer: C"]},
        {q:"Write 0.00000205 in correct scientific notation.",opts:["2.05 × 10⁻⁵","20.5 × 10⁻⁷","2.05 × 10⁻⁶","0.205 × 10⁻⁵","2.05 × 10⁶"],ans:2,topic:"arithmetic",exp:"Move right 6 places → 2.05. Answer: 2.05×10⁻⁶. Answer: C",tutorial:["📌 6 places right → 2.05×10⁻⁶. Answer: C"]},
      ],
      hard:[
        {q:"Which is the largest: 3.2×10⁻⁴, 2.9×10⁻³, 4.1×10⁻⁴, 1.8×10⁻², or 9.9×10⁻⁵?",opts:["3.2 × 10⁻⁴","2.9 × 10⁻³","4.1 × 10⁻⁴","1.8 × 10⁻²","9.9 × 10⁻⁵"],ans:3,topic:"arithmetic",exp:"Compare exponents first: 10⁻² > 10⁻³ > 10⁻⁴ > 10⁻⁵.\nLargest: 1.8×10⁻².\nAnswer: D",tutorial:["📌 Larger exponent (less negative) = larger number.","−2 > −3 > −4 > −5. So 10⁻² is largest.","1.8×10⁻²=0.018. Largest.","Answer: D"]},
        {q:"Express the product (2×10³) × (4×10⁻⁷) in scientific notation.",opts:["8 × 10⁻⁴","8 × 10⁻⁵","0.8 × 10⁻³","8 × 10⁴","0.8 × 10⁻⁴"],ans:0,topic:"arithmetic",exp:"Multiply: 2×4=8. Add exponents: 3+(−7)=−4. Answer: 8×10⁻⁴.\nAnswer: A",tutorial:["📌 Multiply coefficients, add exponents.","2×4=8. 10³×10⁻⁷=10⁻⁴. Answer: 8×10⁻⁴.","Answer: A"]},
        {q:"If x = 4.5×10⁶ and y = 1.5×10⁴, what is x÷y in scientific notation?",opts:["3 × 10²","3 × 10³","30 × 10¹","0.3 × 10³","3 × 10¹⁰"],ans:0,topic:"arithmetic",exp:"4.5÷1.5=3. 10⁶÷10⁴=10². Answer: 3×10². Answer: A",tutorial:["📌 Divide coefficients, subtract exponents.","4.5÷1.5=3. 10⁶÷10⁴=10². → 3×10². Answer: A"]},
      ]
    },
    { easy:[
        {q:"One-half of a positive number is equal to 10. What is one-quarter of that number?",opts:["3","4","5","6","8"],ans:2,topic:"arithmetic",exp:"(1/2)x=10→x=20. (1/4)×20=5.\nAnswer: C=5",tutorial:["📌 (1/2)x=10 → x=20. Then (1/4)×20=5.","Answer: C=5"]},
        {q:"Three-quarters of a positive number is equal to 12. What is that number?",opts:["9","12","16","18","24"],ans:2,topic:"arithmetic",exp:"(3/4)x=12→x=16.\nAnswer: C=16",tutorial:["📌 Multiply by reciprocal: x=12×(4/3)=16.","Answer: C=16"]},
        {q:"Two-fifths of a positive number is equal to 6. What is one-half of that number?",opts:["3","5","7.5","10","12"],ans:2,topic:"arithmetic",exp:"(2/5)x=6→x=15. (1/2)×15=7.5.\nAnswer: C=7.5",tutorial:["📌 x=6×(5/2)=15. (1/2)×15=7.5.","Answer: C=7.5"]},
      ],
      medium:[
        {q:"Five-eighths of a positive number is equal to 35. What is three-quarters of that number?",opts:["36","40","42","45","48"],ans:2,topic:"arithmetic",exp:"(5/8)x=35→x=56. (3/4)×56=42.\nAnswer: C=42",tutorial:["📌 x=35×(8/5)=56. (3/4)×56=42.","Answer: C=42"]},
        {q:"Three-fifths of a positive number is equal to 24. What is seven-eighths of that number?",opts:["30","35","40","42","45"],ans:1,topic:"arithmetic",exp:"(3/5)x=24→x=40. (7/8)×40=35.\nAnswer: B=35",tutorial:["📌 x=24×(5/3)=40. (7/8)×40=35.","Answer: B=35"]},
        {q:"Two-thirds of a positive number is equal to 18. What is five-sixths of that number?",opts:["20","22","22.5","27","30"],ans:2,topic:"arithmetic",exp:"(2/3)x=18→x=27. (5/6)×27=22.5.\nAnswer: C=22.5",tutorial:["📌 x=27. (5/6)×27=22.5.","Answer: C=22.5"]},
      ],
      hard:[
        {q:"Five-sevenths of a positive number exceeds three-sevenths of the same number by 16. What is that number?",opts:["44","52","56","60","72"],ans:2,topic:"arithmetic",exp:"(5/7)x−(3/7)x=16 → (2/7)x=16 → x=56.\nAnswer: C=56",tutorial:["📌 Set up equation from 'exceeds by'.","(5/7−3/7)x=16 → (2/7)x=16 → x=56.","Answer: C=56"]},
        {q:"A number is increased by 20% and then decreased by 20%. If the result is 48, what was the original number?",opts:["48","50","52","54","60"],ans:1,topic:"arithmetic",exp:"x×1.2×0.8=48 → 0.96x=48 → x=50.\nAnswer: B=50",tutorial:["📌 Work backwards: after both changes, x×0.96=48.","x=48÷0.96=50.","Answer: B=50"]},
        {q:"If 3/4 of x equals 2/3 of y, what is the ratio x:y?",opts:["2:3","8:9","9:8","4:3","3:2"],ans:1,topic:"arithmetic",exp:"(3/4)x=(2/3)y → x/y=(2/3)÷(3/4)=(2/3)×(4/3)=8/9.\nAnswer: B=8:9",tutorial:["📌 (3/4)x=(2/3)y → x/y=(2/3)÷(3/4)=8/9.","Answer: B — x:y=8:9"]},
      ]
    },
    { easy:[
        {q:"An item is priced at $50. Its price then increases by 10%. What is the new price?",opts:["$5","$50","$55","$60","$65"],ans:2,topic:"arithmetic",exp:"$50×1.10=$55.\nAnswer: C=$55",tutorial:["📌 +10% means multiply by 1.10.","$50×1.10=$55. Answer: C"]},
        {q:"An item is priced at $80. Its price then decreases by 20%. What is the new price?",opts:["$16","$60","$64","$68","$70"],ans:2,topic:"arithmetic",exp:"$80×0.80=$64.\nAnswer: C=$64",tutorial:["📌 −20% means multiply by 0.80.","$80×0.80=$64. Answer: C"]},
        {q:"A price undergoes a 50% increase followed immediately by a 50% decrease. What is the net effect on the original price?",opts:["Back to original","25% higher","25% lower","75% lower","50% higher"],ans:2,topic:"arithmetic",exp:"x×1.5×0.5=0.75x. 25% lower.\nAnswer: C",tutorial:["📌 x×1.5=1.5x. Then ×0.5=0.75x. 25% lower than start.","Answer: C — 25% lower"]},
      ],
      medium:[
        {q:"A price increases by 20% and subsequently decreases by 20%. What is the net percentage change relative to the original price?",opts:["−6%","−4%","−2%","0%","+4%"],ans:1,topic:"arithmetic",exp:"100×1.2×0.8=96. Change=−4%.\nAnswer: C=−4%",tutorial:["📌 $100→$120→$96. Change=−4%. Answer: C"]},
        {q:"A price increases by 10% and subsequently decreases by 10%. What is the net percentage change relative to the original price?",opts:["−5%","−2%","−1%","0%","+1%"],ans:2,topic:"arithmetic",exp:"100×1.1×0.9=99. Change=−1%.\nAnswer: B=−1%",tutorial:["📌 $100→$110→$99. Change=−1%. Answer: B"]},
        {q:"A price increases by 25% and subsequently decreases by 20%. What is the net percentage change relative to the original price?",opts:["−10%","−5%","0%","+2%","+5%"],ans:2,topic:"arithmetic",exp:"100×1.25×0.80=100. Change=0%.\nAnswer: C=0%",tutorial:["📌 $100→$125→$100. Exactly cancel! Answer: C"]},
      ],
      hard:[
        {q:"A price increases by 30% and subsequently decreases by 25%. What is the net percentage change relative to the original price?",opts:["−5%","−2.5%","0%","+2.5%","+5%"],ans:1,topic:"arithmetic",exp:"100×1.30×0.75=97.5. Change=−2.5%.\nAnswer: C=−2.5%",tutorial:["📌 $100×1.30=$130. $130×0.75=$97.50.","Change=−2.5%. Answer: C"]},
        {q:"A price increases by 20% and then increases by a further 20%. What is the total percentage increase from the original price?",opts:["40%","42%","44%","46%","48%"],ans:2,topic:"arithmetic",exp:"100×1.2×1.2=144. Increase=44%.\nAnswer: C=44%",tutorial:["📌 Two 20% increases: 1.2²=1.44 → 44% total.","Answer: C=44%"]},
        {q:"A salary is cut by 10%, then cut by a further 10%. By what single percentage would you need to increase the final salary to get back to the original?",opts:["20%","20.5%","21%","23.4%","25%"],ans:3,topic:"arithmetic",exp:"After cuts: x×0.81. Need 0.81×k=1. k=1/0.81≈1.2346 → 23.46%.\nAnswer: C≈23.4%",tutorial:["📌 After two 10% cuts: ×0.9×0.9=×0.81.","To get back: multiply by 1/0.81≈1.2346 → need to increase by ≈23.4%.","Answer: C"]},
      ]
    },
    { easy:[
        {q:"What is the LCM of 4 and 6?",opts:["2","6","10","12","24"],ans:3,topic:"number-theory",exp:"LCM(4,6)=12. Answer: D=12",tutorial:["📌 LCM: smallest number divisible by both.","Multiples of 6: 6,12... 12÷4=3 ✓. LCM=12.","Answer: D=12"]},
        {q:"What is the LCM of 3 and 5?",opts:["1","5","8","10","15"],ans:4,topic:"number-theory",exp:"LCM(3,5)=15. Answer: E=15",tutorial:["📌 3 and 5 share no common factors → LCM=3×5=15.","Answer: E=15"]},
        {q:"What is the LCM of 8 and 12?",opts:["4","16","20","24","48"],ans:3,topic:"number-theory",exp:"8=2³, 12=2²×3. LCM=2³×3=24. Answer: D=24",tutorial:["📌 LCM=2³×3=24.","Answer: D=24"]},
      ],
      medium:[
        {q:"What is the LCM of 12, 18, and 24?",opts:["36","48","60","72","96"],ans:3,topic:"number-theory",exp:"LCM=2³×3²=72. Answer: D=72",tutorial:["📌 12=2²×3, 18=2×3², 24=2³×3. LCM=72.","Answer: D=72"]},
        {q:"What is the LCM of 8, 12, and 20?",opts:["40","60","80","120","160"],ans:3,topic:"number-theory",exp:"LCM=2³×3×5=120. Answer: D=120",tutorial:["📌 8=2³, 12=2²×3, 20=2²×5. LCM=120.","Answer: D=120"]},
        {q:"What is the LCM of 6, 10, and 15?",opts:["15","30","45","60","90"],ans:1,topic:"number-theory",exp:"LCM=2×3×5=30. Answer: B=30",tutorial:["📌 6=2×3, 10=2×5, 15=3×5. LCM=30.","Answer: B=30"]},
      ],
      hard:[
        {q:"LCM(a,b)=60 and GCD(a,b)=4. What is a×b?",opts:["64","120","240","480","None of these"],ans:2,topic:"number-theory",exp:"LCM×GCD=a×b. 60×4=240.\nAnswer: C=240",tutorial:["📌 KEY IDENTITY: LCM(a,b)×GCD(a,b)=a×b.","60×4=240. Answer: C=240"]},
        {q:"What is the smallest number divisible by 2, 3, 5, and 7?",opts:["42","105","210","420","2310"],ans:2,topic:"number-theory",exp:"All prime → LCM=2×3×5×7=210. Answer: C=210",tutorial:["📌 All four are prime → LCM = product = 210.","Answer: C=210"]},
        {q:"What is the greatest common divisor (GCD) of 84 and 36?",opts:["4","6","12","18","36"],ans:2,topic:"number-theory",exp:"84=2²×3×7. 36=2²×3². GCD=2²×3=12.\nAnswer: C=12",tutorial:["📌 GCD: take LOWEST power of shared prime factors.","84=2²×3×7. 36=2²×3². Shared: 2² and 3¹.","GCD=4×3=12. Answer: C=12"]},
      ]
    },
    { easy:[
        {q:"A price drops from $60 to $45. By what percentage has the price decreased?",opts:["15%","20%","25%","30%","33%"],ans:2,topic:"arithmetic",exp:"(60−45)/60×100=25%. Answer: C=25%",tutorial:["📌 % decrease = (decrease÷original)×100.","15÷60=0.25=25%. Answer: C"]},
        {q:"A price drops from $100 to $80. By what percentage has the price decreased?",opts:["10%","15%","20%","25%","30%"],ans:2,topic:"arithmetic",exp:"20/100×100=20%. Answer: C=20%",tutorial:["📌 20÷100=20%. Answer: C"]},
        {q:"A price drops from $50 to $40. By what percentage has the price decreased?",opts:["10%","15%","20%","25%","30%"],ans:2,topic:"arithmetic",exp:"10/50×100=20%. Answer: C=20%",tutorial:["📌 10÷50=0.20=20%. Answer: C"]},
      ],
      medium:[
        {q:"A price falls from $180 to $135. By what percentage has the price decreased?",opts:["20%","25%","30%","33%","40%"],ans:1,topic:"arithmetic",exp:"45/180×100=25%. Answer: B=25%",tutorial:["📌 45÷180=0.25=25%. Answer: B"]},
        {q:"A price falls from $250 to $175. By what percentage has the price decreased?",opts:["25%","28%","30%","32%","35%"],ans:2,topic:"arithmetic",exp:"75/250×100=30%. Answer: C=30%",tutorial:["📌 75÷250=30%. Answer: C"]},
        {q:"A price falls from $150 to $120. By what percentage has the price decreased?",opts:["15%","20%","25%","30%","33%"],ans:1,topic:"arithmetic",exp:"30/150×100=20%. Answer: B=20%",tutorial:["📌 30÷150=20%. Answer: B"]},
      ],
      hard:[
        {q:"A price falls from $400 to $270. By what percentage has the price decreased? Give your answer to one decimal place.",opts:["30.0%","32.5%","35.0%","37.5%","40.0%"],ans:1,topic:"arithmetic",exp:"130/400×100=32.5%. Answer: B=32.5%",tutorial:["📌 130÷400=0.325=32.5%. Answer: B"]},
        {q:"After a 25% decrease, a price is $60. What was the original price?",opts:["$75","$80","$85","$90","$95"],ans:1,topic:"arithmetic",exp:"0.75×P=60 → P=80. Answer: B=$80",tutorial:["📌 Work backwards: 75%×P=60 → P=60÷0.75=80.","Answer: B=$80"]},
        {q:"A price increased 40% to reach $210. What was the original price?",opts:["$140","$150","$160","$180","$200"],ans:1,topic:"arithmetic",exp:"1.40×P=210 → P=150. Answer: B=$150",tutorial:["📌 140%×P=210 → P=210÷1.40=150.","Answer: B=$150"]},
      ]
    },
    { easy:[
        {q:"What is the decimal value of binary 101₂?",opts:["3","4","5","6","7"],ans:2,topic:"number-theory",exp:"1×4+0×2+1×1=5. Answer: C=5",tutorial:["📌 Positions: 2²=4, 2¹=2, 2⁰=1.","1×4+0×2+1×1=5. Answer: C=5"]},
        {q:"What is the decimal value of binary 110₂?",opts:["4","5","6","7","8"],ans:2,topic:"number-theory",exp:"1×4+1×2+0×1=6. Answer: C=6",tutorial:["📌 1×4+1×2+0×1=6. Answer: C=6"]},
        {q:"What is the decimal value of binary 111₂?",opts:["5","6","7","8","9"],ans:2,topic:"number-theory",exp:"1×4+1×2+1×1=7. Answer: C=7",tutorial:["📌 1×4+1×2+1×1=7. Answer: C=7"]},
      ],
      medium:[
        {q:"What is the decimal value of the binary number 1011₂?",opts:["9","10","11","13","15"],ans:2,topic:"number-theory",exp:"8+0+2+1=11. Answer: C=11",tutorial:["📌 1×8+0×4+1×2+1×1=11. Answer: C=11"]},
        {q:"What is the decimal value of the binary number 1101₂?",opts:["9","11","12","13","15"],ans:3,topic:"number-theory",exp:"8+4+0+1=13. Answer: D=13",tutorial:["📌 1×8+1×4+0×2+1×1=13. Answer: D=13"]},
        {q:"What is the decimal value of the binary number 10110₂?",opts:["18","20","22","24","26"],ans:2,topic:"number-theory",exp:"16+0+4+2+0=22. Answer: C=22",tutorial:["📌 1×16+0×8+1×4+1×2+0×1=22. Answer: C=22"]},
      ],
      hard:[
        {q:"What is 13 written in binary?",opts:["1011","1100","1101","1110","10001"],ans:2,topic:"number-theory",exp:"13=8+4+1=1×2³+1×2²+0×2¹+1×2⁰=1101₂. Answer: B",tutorial:["📌 Divide by 2 repeatedly: 13÷2=6r1, 6÷2=3r0, 3÷2=1r1, 1÷2=0r1.","Read remainders bottom-up: 1101₂. Answer: B"]},
        {q:"What is the decimal value of 1001₂ + 0110₂ (binary addition)?",opts:["11","13","14","15","16"],ans:3,topic:"number-theory",exp:"1001₂=9, 0110₂=6. Sum=15=1111₂.\nAnswer: D=15",tutorial:["📌 9+6=15. Or add in binary: 1001+0110=1111₂=15.","Answer: D=15"]},
        {q:"How many bits are needed to represent the decimal number 100 in binary?",opts:["5","6","7","8","10"],ans:2,topic:"number-theory",exp:"2⁶=64 < 100 < 128=2⁷. Need 7 bits. (1100100₂=100)\nAnswer: C=7",tutorial:["📌 100 in binary: 1100100₂ (7 digits).","2⁶=64<100<128=2⁷ → 7 bits.","Answer: C=7"]},
      ]
    },
    { easy:[
        {q:"How many multiples of 5 are there from 1 to 50?",opts:["8","9","10","11","12"],ans:2,topic:"number-theory",exp:"⌊50÷5⌋=10. Answer: C=10",tutorial:["📌 Count=⌊N÷m⌋=⌊50÷5⌋=10.","Answer: C=10"]},
        {q:"How many multiples of 4 are there from 1 to 40?",opts:["8","9","10","11","12"],ans:2,topic:"number-theory",exp:"⌊40÷4⌋=10. Answer: C=10",tutorial:["📌 ⌊40÷4⌋=10. Answer: C=10"]},
        {q:"How many even numbers are there from 1 to 20?",opts:["8","9","10","11","12"],ans:2,topic:"number-theory",exp:"Even numbers: 2,4,6,...,20. Count=10. (or ⌊20÷2⌋=10)\nAnswer: C=10",tutorial:["📌 Even multiples of 2. ⌊20÷2⌋=10. Answer: C=10"]},
      ],
      medium:[
        {q:"How many multiples of 7 are there from 1 to 200?",opts:["26","27","28","29","30"],ans:2,topic:"number-theory",exp:"⌊200÷7⌋=28. Answer: C=28",tutorial:["📌 200÷7=28.57. ⌊28.57⌋=28. Answer: C=28"]},
        {q:"How many multiples of 9 are there from 1 to 200?",opts:["20","21","22","23","24"],ans:2,topic:"number-theory",exp:"⌊200÷9⌋=22. Answer: C=22",tutorial:["📌 200÷9=22.2. ⌊22.2⌋=22. Answer: C=22"]},
        {q:"How many multiples of 11 are there from 1 to 300?",opts:["25","26","27","28","29"],ans:2,topic:"number-theory",exp:"⌊300÷11⌋=27. Answer: C=27",tutorial:["📌 300÷11=27.27. ⌊27.27⌋=27. Answer: C=27"]},
      ],
      hard:[
        {q:"How many integers from 1 to 100 are divisible by 3 but NOT by 9?",opts:["18","22","23","25","27"],ans:1,topic:"number-theory",exp:"Integers divisible by 3: ⌊100÷3⌋=33. integers divisible by 9: ⌊100÷9⌋=11. Divisible by 3 but not by 9: 33−11=22.\nAnswer: B=22",tutorial:["📌 Use inclusion-exclusion.","Divisible by 3: 33 integers. Divisible by 9 (a subset): 11 integers.","Divisible by 3 but not by 9: 33−11=22. Answer: B"]},
        {q:"How many multiples of 6 between 100 and 200 (inclusive)?",opts:["15","16","17","18","19"],ans:2,topic:"number-theory",exp:"Multiples up to 200: ⌊200÷6⌋=33. Up to 99: ⌊99÷6⌋=16. In range: 33−16=17.\nAnswer: C=17",tutorial:["📌 Count up to 200 minus count up to 99.","33−16=17. Answer: C=17"]},
        {q:"How many integers from 1 to 1000 are NOT divisible by 2, 3, or 5?",opts:["233","253","256","266","286"],ans:3,topic:"number-theory",exp:"Inclusion-exclusion: 1000 − ⌊1000/2⌋ − ⌊1000/3⌋ − ⌊1000/5⌋ + ⌊1000/6⌋ + ⌊1000/10⌋ + ⌊1000/15⌋ − ⌊1000/30⌋\n= 1000 − 500 − 333 − 200 + 166 + 100 + 66 − 33 = 266\nAnswer: D=266",tutorial:["📌 Advanced inclusion-exclusion over three sets.","1000−500−333−200+166+100+66−33=266.","Answer: D=266"]},
      ]
    },
  ]
};

// Utility
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateTest(testNum, difficulty) {
  if (testNum >= 3) {
    // Fixed tests 3-6 — keep options in original A–E order
    return FIXED_TESTS[testNum].questions.map(q => ({ ...q }));
  }
  const bank = BANKS[testNum];
  const tierKey = difficulty === 1 ? "easy" : difficulty === 3 ? "hard" : "medium";
  return bank.map((slot, i) => {
    const tier = slot[tierKey];
    if (!tier || tier.length === 0) {
      const med = slot.medium || [];
      if (med.length === 0) return null;
      const v = med[Math.floor(Math.random() * med.length)];
      return { ...v };
    }
    const v = tier[Math.floor(Math.random() * tier.length)];
    return { ...v };
  }).filter(Boolean);
}

const FIXED_TESTS = {
  3:{title:"Test 3 — Algebra & Equations",difficulty:"Moderate–Challenging",color:"bg-violet-600",light:"bg-violet-50",border:"border-violet-400",badge:"🟣",questions:[
    {num:1,q:"Solve for x:  5x − 3(2x − 4) = 14",opts:["x = −2","x = 2","x = 4","x = −4","x = 6"],ans:0,topic:"algebra",exp:"Distribute: −x+12=14 → x=−2.\nVerify: 5(−2)−3(−8)=−10+24=14 ✓",tutorial:["📌 Distribute, collect, isolate.","5x−6x+12=14 → −x=2 → x=−2."]},
    {num:2,q:"If f(x) = 2x² − 3x + 1, what is f(−2)?",opts:["3","7","11","15","−5"],ans:3,topic:"algebra",exp:"2(4)+6+1=15.",tutorial:["📌 Replace x with (−2).","2(4)−3(−2)+1=8+6+1=15."]},
    {num:3,q:"Solve: x² − 5x + 6 = 0",opts:["−2 and −3","2 and 3","1 and 6","−1 and 6","3 and −2"],ans:1,topic:"algebra",exp:"(x−2)(x−3)=0.",tutorial:["📌 Product=6, sum=−5 → (−2)(−3). Factor: (x−2)(x−3)=0."]},
    {num:4,q:"Solve:\n3x + y = 11\nx − y = 1",opts:["x=2,y=5","x=3,y=2","x=4,y=−1","x=1,y=8","x=5,y=−4"],ans:1,topic:"algebra",exp:"Add: 4x=12→x=3, y=2.",tutorial:["📌 Add equations to cancel y.","4x=12→x=3. y=11−9=2."]},
    {num:5,q:"If |2x − 6| = 10, values of x?",opts:["8 only","−2 only","3 and −5","8 and −2","2 and −8"],ans:3,topic:"algebra",exp:"x=8 or x=−2.",tutorial:["📌 Two cases: +10 and −10.","2x−6=10→x=8. 2x−6=−10→x=−2."]},
    {num:6,q:"Slope through (−1, 4) and (3, −4)?",opts:["2","−2","1/2","−1/2","0"],ans:1,topic:"algebra",exp:"(−4−4)/(3+1)=−2.",tutorial:["📌 m=(y₂−y₁)/(x₂−x₁).","(−8)/(4)=−2."]},
    {num:7,q:"2x−4>0 AND 3x+6<24. Range of x?",opts:["x>2","x<6","0<x<8","2<x<6","−2<x<6"],ans:3,topic:"algebra",exp:"x>2 AND x<6.",tutorial:["📌 Solve each, then find overlap.","x>2 and x<6 → 2<x<6."]},
    {num:8,q:"For 4x²+kx+9=0 to have one solution, |k|=?",opts:["6","9","12","16","18"],ans:2,topic:"algebra",exp:"k²=144 → |k|=12.",tutorial:["📌 b²−4ac=0. k²−4(4)(9)=0→k²=144→|k|=12."]},
    {num:9,q:"Simplify: (x²−9)÷(x+3)",opts:["x+3","x−3","x²−3","x−9","x+9"],ans:1,topic:"algebra",exp:"(x+3)(x−3)/(x+3)=x−3.",tutorial:["📌 Difference of squares: x²−9=(x+3)(x−3). Cancel (x+3)."]},
    {num:10,q:"Taxi: $3 flat + $1.75/km. Total $17. Distance?",opts:["6 km","7 km","8 km","9 km","10 km"],ans:2,topic:"algebra",exp:"1.75k=14→k=8.",tutorial:["📌 3+1.75k=17→k=8."]},
    {num:11,q:"(x+a)²=x²+8x+16. Value of a?",opts:["2","4","8","16","−4"],ans:1,topic:"algebra",exp:"2a=8→a=4.",tutorial:["📌 (x+a)²=x²+2ax+a². 2a=8→a=4."]}
  ]},
  4:{title:"Test 4 — Geometry & Measurement",difficulty:"Challenging",color:"bg-orange-500",light:"bg-orange-50",border:"border-orange-400",badge:"🟠",questions:[
    {num:1,q:"Right triangle legs 6 and 8. Hypotenuse?",opts:["10","11","12","14","√28"],ans:0,topic:"geometry",exp:"√(36+64)=10.",tutorial:["📌 a²+b²=c². 36+64=100→c=10."]},
    {num:2,q:"Circle radius doubled. Area increase factor?",opts:["2×","4×","2π×","8×","π×"],ans:1,topic:"geometry",exp:"π(2r)²=4πr². Factor=4.",tutorial:["📌 Area scales by k²=4."]},
    {num:3,q:"Rectangle: L=2W, perimeter=54. Area?",opts:["72","108","162","81","144"],ans:2,topic:"geometry",exp:"6w=54→w=9,l=18. Area=162.",tutorial:["📌 6w=54→w=9. Area=162."]},
    {num:4,q:"Triangle angles 55° and 75°. Third?",opts:["40°","45°","50°","60°","70°"],ans:2,topic:"geometry",exp:"180−130=50°.",tutorial:["📌 Angles sum to 180°. 180−55−75=50°."]},
    {num:5,q:"Cylinder r=3, h=7. Volume? (π≈3.14)",opts:["131.9","175.8","197.8","215.4","263.8"],ans:2,topic:"geometry",exp:"3.14×9×7=197.82.",tutorial:["📌 V=πr²h=3.14×9×7≈197.8."]},
    {num:6,q:"Trapezoid sides 8m & 12m, height 5m. Area?",opts:["40","50","60","70","80"],ans:1,topic:"geometry",exp:"½×20×5=50.",tutorial:["📌 ½(b₁+b₂)×h=½×20×5=50."]},
    {num:7,q:"Minute hand 10cm. Distance in 20 minutes? (π≈3.14)",opts:["20.9","31.4","41.9","62.8","125.6"],ans:0,topic:"geometry",exp:"(1/3)×62.8≈20.9.",tutorial:["📌 (20/60)×2π×10=(1/3)×62.8≈20.9."]},
    {num:8,q:"Right triangle: hyp=13, leg=5. Area?",opts:["24","30","32.5","60","65"],ans:1,topic:"geometry",exp:"b=12. Area=½×5×12=30.",tutorial:["📌 b²=169−25=144→b=12. Area=30."]},
    {num:9,q:"Parallelogram angle 110°. Adjacent angle?",opts:["55°","70°","80°","110°","90°"],ans:1,topic:"geometry",exp:"180−110=70°.",tutorial:["📌 Adjacent angles sum to 180°."]},
    {num:10,q:"Square side 6. Diagonal?",opts:["6√2","6√3","12","9","6"],ans:0,topic:"geometry",exp:"d=6√2.",tutorial:["📌 d=s√2. 6√2."]},
    {num:11,q:"Cube SA=150cm². Side?",opts:["4","5","6","7","25"],ans:1,topic:"geometry",exp:"6s²=150→s=5.",tutorial:["📌 6s²=150→s²=25→s=5."]}
  ]},
  5:{title:"Test 5 — Probability & Statistics",difficulty:"Hard",color:"bg-rose-600",light:"bg-rose-50",border:"border-rose-400",badge:"🔴",questions:[
    {num:1,q:"Bag: 4 red, 3 blue, 5 green. P(NOT red)?",opts:["1/3","1/4","2/3","3/4","5/12"],ans:2,topic:"probability",exp:"8/12=2/3.",tutorial:["📌 P(not red)=1−4/12=2/3."]},
    {num:2,q:"Two dice. P(sum≥10)?",opts:["1/6","1/12","5/36","1/9","7/36"],ans:0,topic:"probability",exp:"6/36=1/6.",tutorial:["📌 Pairs summing to 10,11,12: 6 pairs. P=6/36=1/6."]},
    {num:3,q:"Mean of 5 is 12. Add 6th; new mean=13. 6th number?",opts:["13","14","16","18","20"],ans:3,topic:"statistics",exp:"78−60=18.",tutorial:["📌 78−60=18."]},
    {num:4,q:"5 students in a line. Arrangements?",opts:["25","60","100","120","150"],ans:3,topic:"combinatorics",exp:"5!=120.",tutorial:["📌 5!=120."]},
    {num:5,q:"Fair coin, 4 flips. P(exactly 2 heads)?",opts:["1/4","3/8","1/2","5/16","3/16"],ans:1,topic:"probability",exp:"C(4,2)/16=3/8.",tutorial:["📌 C(4,2)=6. P=6/16=3/8."]},
    {num:6,q:"Median of {14,7,22,10,18,3,15}?",opts:["10","14","15","7","18"],ans:1,topic:"statistics",exp:"Sorted: 3,7,10,14,15,18,22. Median=14.",tutorial:["📌 Sort, find middle. 4th=14."]},
    {num:7,q:"Committee of 3 from 8. Possibilities?",opts:["24","56","112","168","336"],ans:1,topic:"combinatorics",exp:"C(8,3)=56.",tutorial:["📌 C(8,3)=56."]},
    {num:8,q:"Mode of {5,5,8,12,15}?",opts:["8","9","5","12","No mode"],ans:2,topic:"statistics",exp:"Mode=5.",tutorial:["📌 Most frequent=5."]},
    {num:9,q:"P(defective)=3%. Two items. P(both defective)?",opts:["0.0009","0.006","0.009","0.06","0.09"],ans:0,topic:"probability",exp:"0.03²=0.0009.",tutorial:["📌 0.03×0.03=0.0009."]},
    {num:10,q:"Range of {42,17,88,55,31,72}?",opts:["55","46","66","71","72"],ans:3,topic:"statistics",exp:"88−17=71.",tutorial:["📌 Maximum − Minimum = 88 − 17 = 71."]},
    {num:11,q:"Mutually exclusive: P(A)=0.3, P(B)=0.45. P(A or B)?",opts:["0.135","0.45","0.3","0.75","1.0"],ans:3,topic:"probability",exp:"0.3+0.45=0.75.",tutorial:["📌 Mutually exclusive: P(A∪B)=P(A)+P(B)=0.75."]}
  ]},
  6:{title:"Test 6 — Advanced Mixed Mastery",difficulty:"Expert",color:"bg-slate-700",light:"bg-slate-50",border:"border-slate-500",badge:"⚫",questions:[
    {num:1,q:"Train P: 9AM, 90km/h. Train Q: 11AM, 150km/h same dir. Q catches P when?",opts:["1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"],ans:1,topic:"algebra",exp:"Head start=180km. 180÷60=3h → 2PM.",tutorial:["📌 Head start÷closing speed=time. 2PM."]},
    {num:2,q:"$2,000 at 5% compound 3 years?",opts:["$2,100","$2,205","$2,300","$2,315.25","$2,400"],ans:3,topic:"arithmetic",exp:"2000×1.05³=$2315.25.",tutorial:["📌 A=P(1+r)ᵗ. 2000×1.157625=$2315.25."]},
    {num:3,q:"log₂(x)=5. x=?",opts:["10","16","25","32","64"],ans:3,topic:"algebra",exp:"2⁵=32.",tutorial:["📌 logₐ(x)=b↔aᵇ=x. 2⁵=32."]},
    {num:4,q:"Integers 1–300 divisible by 4 and 6?",opts:["20","25","37","50","75"],ans:1,topic:"number-theory",exp:"LCM(4,6)=12. 300÷12=25.",tutorial:["📌 LCM(4,6)=12. ⌊300/12⌋=25."]},
    {num:5,q:"Interior angle sum of hexagon?",opts:["540°","600°","720°","900°","1080°"],ans:2,topic:"geometry",exp:"(6−2)×180=720°.",tutorial:["📌 (n−2)×180. (6−2)×180=720."]},
    {num:6,q:"Geometric: 2,6,18,54... 7th term?",opts:["729","1,458","2,187","4,374","6,561"],ans:1,topic:"algebra",exp:"2×3⁶=1458.",tutorial:["📌 aₙ=a₁×rⁿ⁻¹. 2×3⁶=1458."]},
    {num:7,q:"Worker A: 6h alone. B: 4h alone. Together?",opts:["1.5h","2h","2.4h","3h","5h"],ans:2,topic:"algebra",exp:"1/6+1/4=5/12→time=12/5=2.4h.",tutorial:["📌 Add rates: 1/6+1/4=5/12. Time=12/5=2.4h."]},
    {num:8,q:"x/y=3/4, x+y=35. x−y=?",opts:["−7","5","−5","7","15"],ans:2,topic:"algebra",exp:"x=15,y=20. x−y=−5.",tutorial:["📌 x=3k,y=4k. 7k=35→k=5. x−y=−5."]},
    {num:9,q:"Sector r=6, angle=60°. Area? (π≈3.14)",opts:["6.28","9.42","18.84","37.68","113.04"],ans:2,topic:"geometry",exp:"(1/6)×3.14×36=18.84.",tutorial:["📌 (60/360)×πr²=18.84."]},
    {num:10,q:"Mean of 6 is 15. Remove 9. New mean?",opts:["15","16.2","17","18","20"],ans:1,topic:"statistics",exp:"81÷5=16.2.",tutorial:["📌 (90−9)/5=16.2."]},
    {num:11,q:"Arrangements of MATH?",opts:["4","12","16","24","48"],ans:3,topic:"combinatorics",exp:"4!=24.",tutorial:["📌 4!=24."]}
  ]}
};

const TEST_META = {
  1:{title:"Test 1 — Data Sufficiency",difficulty:"Introductory",color:"bg-sky-600",light:"bg-sky-50",border:"border-sky-400",badge:"🔵"},
  2:{title:"Test 2 — Arithmetic & Number Theory",difficulty:"Moderate",color:"bg-emerald-600",light:"bg-emerald-50",border:"border-emerald-400",badge:"🟢"},
  3:FIXED_TESTS[3],4:FIXED_TESTS[4],5:FIXED_TESTS[5],6:FIXED_TESTS[6]
};

const ALL_TOPICS=["data-sufficiency","number-theory","arithmetic","algebra","geometry","probability","statistics","combinatorics"];

export default function WindsorDukes() {
  const [screen,setScreen]=useState("username");
  const [username,setUsername]=useState("");
  const [usernameInput,setUsernameInput]=useState("");
  const [test,setTest]=useState(1);
  const [difficulty,setDifficulty]=useState(2);
  const [questions,setQuestions]=useState([]);
  const [ans,setAns]=useState({});
  const [done,setDone]=useState(false);
  const [showExp,setShowExp]=useState({});
  const [showTut,setShowTut]=useState({});
  const [hist,setHist]=useState({});
  const [allScores,setAllScores]=useState([]);
  const [leaderboard,setLeaderboard]=useState([]);
  const [dashTab,setDashTab]=useState("overview");

  useEffect(()=>{
    (async()=>{try{
      const u=await window.storage.get("wd8:username");
      if(u){setUsername(u.value);setScreen("test");}
      const h=await window.storage.get("wd8:hist");
      if(h)setHist(JSON.parse(h.value));
      const s=await window.storage.get("wd8:scores");
      if(s)setAllScores(JSON.parse(s.value));
    }catch{}})();
  },[]);

  useEffect(()=>{
    if(screen==="dashboard")(async()=>{try{const lb=await window.storage.get("wd8:lb",true);if(lb)setLeaderboard(JSON.parse(lb.value));}catch{}})();
  },[screen]);

  useEffect(()=>{
    if(screen==="test"){setQuestions(generateTest(test,difficulty));setAns({});setDone(false);setShowExp({});setShowTut({});}
  },[test,difficulty,screen]);

  const handleUsername=async()=>{
    const u=usernameInput.trim().slice(0,20);if(!u)return;
    setUsername(u);setScreen("test");
    try{await window.storage.set("wd8:username",u);}catch{}
  };

  const genNew=()=>{setQuestions(generateTest(test,difficulty));setAns({});setDone(false);setShowExp({});setShowTut({});window.scrollTo({top:0,behavior:"smooth"});};

  const submit=async()=>{
    setDone(true);window.scrollTo({top:0,behavior:"smooth"});
    const score=questions.filter((q,i)=>ans[i]===q.ans).length;
    const pct=Math.round(score/questions.length*100);
    const ts={};
    questions.forEach((q,i)=>{if(!ts[q.topic])ts[q.topic]={c:0,t:0};ts[q.topic].t++;if(ans[i]===q.ans)ts[q.topic].c++;});
    const entry={user:username,test,difficulty,score,tot:questions.length,pct,date:Date.now(),ts};
    const nh={...hist};if(!nh[test])nh[test]=[];nh[test]=[entry,...nh[test]].slice(0,50);setHist(nh);
    const ns=[entry,...allScores].slice(0,200);setAllScores(ns);
    try{await window.storage.set("wd8:hist",JSON.stringify(nh));await window.storage.set("wd8:scores",JSON.stringify(ns));}catch{}
    try{
      const lb=await window.storage.get("wd8:lb",true);
      let lbd=lb?JSON.parse(lb.value):[];
      const key=`${username}|${test}|${difficulty}`;
      const idx=lbd.findIndex(e=>e.key===key);
      if(idx>=0){if(pct>lbd[idx].pct)lbd[idx]={key,user:username,test,difficulty,pct,date:Date.now()};}
      else lbd.push({key,user:username,test,difficulty,pct,date:Date.now()});
      lbd.sort((a,b)=>b.pct-a.pct);
      await window.storage.set("wd8:lb",JSON.stringify(lbd),true);
    }catch{}
  };

  const unlocked=t=>t===1||(hist[t-1]&&hist[t-1].length>0);
  const score=done?questions.filter((q,i)=>ans[i]===q.ans).length:0;
  const pct=done?Math.round(score/(questions.length||1)*100):0;
  const answered=Object.keys(ans).length;
  const tc=TEST_META[test];

  if(screen==="username")return(
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🎓</div>
        <h1 className="text-2xl font-black text-slate-800 mb-1">Windsor Dukes</h1>
        <p className="text-slate-400 text-sm mb-6">Progressive Quantitative Reasoning</p>
        <p className="text-slate-500 text-sm mb-4">Enter a username to track your scores and appear on the leaderboard.</p>
        <input className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-center text-lg focus:outline-none focus:border-sky-400 mb-4"
          placeholder="Your name..." value={usernameInput} onChange={e=>setUsernameInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleUsername()} maxLength={20} autoFocus/>
        <button onClick={handleUsername} disabled={!usernameInput.trim()}
          className={`w-full py-3 rounded-xl font-black text-white ${usernameInput.trim()?"bg-sky-600 hover:bg-sky-700":"bg-slate-200 text-slate-400"}`}>
          Start →
        </button>
      </div>
    </div>
  );

  if(screen==="dashboard"){
    const topicTotals={};
    Object.values(hist).forEach(arr=>arr.forEach(a=>{if(!a.ts)return;Object.entries(a.ts).forEach(([topic,v])=>{if(!topicTotals[topic])topicTotals[topic]={c:0,t:0};topicTotals[topic].c+=v.c;topicTotals[topic].t+=v.t;});}));
    return(
      <div className="min-h-screen bg-slate-100 p-3">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow p-5 mb-4">
            <div className="flex justify-between items-center mb-4">
              <div><h1 className="text-xl font-black text-slate-800">📊 Dashboard</h1><p className="text-slate-400 text-sm">@{username}</p></div>
              <button onClick={()=>setScreen("test")} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold">← Tests</button>
            </div>
            <div className="flex gap-2 mb-4">
              {[["overview","📈 Overview"],["history","📋 History"],["leaderboard","🏆 Leaderboard"]].map(([id,label])=>(
                <button key={id} onClick={()=>setDashTab(id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold ${dashTab===id?"bg-slate-800 text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{label}</button>
              ))}
            </div>
            {dashTab==="overview"&&<>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {[1,2,3,4,5,6].map(n=>{
                  const h=hist[n]||[];const last=h[0];const best=h.length?Math.max(...h.map(x=>x.pct)):null;
                  return(<div key={n} className={`rounded-xl p-3 text-white ${TEST_META[n].color} cursor-pointer hover:opacity-90`} onClick={()=>{setTest(n);setScreen("test");}}>
                    <div className="font-bold text-xs">{TEST_META[n].badge} Test {n}</div>
                    <div className="text-xs opacity-70 mb-1">{TEST_META[n].difficulty}</div>
                    {last?<><div className="text-2xl font-black">{last.pct}%</div><div className="text-xs opacity-75">Best:{best}% · {h.length}x · {DIFF[last.difficulty||2].emoji}</div></>:<div className="text-xs opacity-60 mt-2">Not attempted</div>}
                  </div>);
                })}
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h2 className="font-bold text-slate-700 mb-3 text-sm">Topic Mastery</h2>
                {ALL_TOPICS.map(topic=>{
                  const v=topicTotals[topic]||{c:0,t:0};const p=v.t>0?Math.round(v.c/v.t*100):0;
                  return(<div key={topic} className="mb-2.5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="capitalize text-slate-700 font-medium">{topic.replace("-"," ")}</span>
                      <span className="text-slate-500">{v.t>0?`${v.c}/${v.t} (${p}%)`:"—"}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${p>=80?"bg-green-500":p>=60?"bg-yellow-400":p>0?"bg-red-400":"bg-slate-200"}`} style={{width:`${p}%`}}/>
                    </div>
                  </div>);
                })}
              </div>
            </>}
            {dashTab==="history"&&<div>
              <p className="text-xs text-slate-400 mb-3">All attempts, most recent first</p>
              {allScores.length===0?<p className="text-slate-400 text-sm text-center py-8">No attempts yet</p>:(
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {allScores.map((e,i)=>(
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${e.pct>=70?"bg-green-50 border-green-200":"bg-red-50 border-red-200"}`}>
                      <div>
                        <div className="font-bold text-sm text-slate-800">{TEST_META[e.test]?.badge} Test {e.test} {DIFF[e.difficulty||2].emoji} — {e.pct}%</div>
                        <div className="text-xs text-slate-500">{e.score}/{e.tot} · {DIFF[e.difficulty||2].label} · {new Date(e.date).toLocaleDateString()}</div>
                      </div>
                      <div className={`text-lg font-black ${e.pct>=70?"text-green-600":"text-red-400"}`}>{e.pct>=70?"✓":"✗"}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>}
            {dashTab==="leaderboard"&&<div>
              <p className="text-xs text-slate-400 mb-3">Personal best per test per difficulty (shared globally)</p>
              {leaderboard.length===0?<p className="text-slate-400 text-sm text-center py-8">No scores yet. Be the first!</p>:(
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {leaderboard.map((e,i)=>(
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${e.user===username?"bg-yellow-50 border border-yellow-300":"bg-slate-50 border border-slate-200"}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 ${i===0?"bg-yellow-500":i===1?"bg-slate-400":i===2?"bg-amber-600":"bg-slate-300"}`}>{i+1}</div>
                      <div className="flex-grow">
                        <div className="font-bold text-sm text-slate-800">{e.user}{e.user===username?" 👈":""}</div>
                        <div className="text-xs text-slate-500">{TEST_META[e.test]?.badge} Test {e.test} · {DIFF[e.difficulty||2].emoji} {DIFF[e.difficulty||2].label}</div>
                      </div>
                      <div className="font-black text-lg text-slate-700">{e.pct}%</div>
                    </div>
                  ))}
                </div>
              )}
            </div>}
          </div>
        </div>
      </div>
    );
  }

  return(
    <div className="min-h-screen bg-slate-100 p-3">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div><h1 className="text-xl font-black text-slate-800">🎓 Windsor Dukes</h1><p className="text-slate-400 text-xs">@{username}</p></div>
            <button onClick={()=>setScreen("dashboard")} className={`${tc.color} text-white p-2.5 rounded-xl`}><BarChart3 className="w-4 h-4"/></button>
          </div>

          {/* Test tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3">
            {[1,2,3,4,5,6].map(n=>{
              const ok=unlocked(n);const h=hist[n]||[];const best=h.length?Math.max(...h.map(x=>x.pct)):null;
              return(<button key={n} disabled={!ok} onClick={()=>{if(ok){setTest(n);setAns({});setDone(false);}}}
                className={`flex-shrink-0 rounded-xl px-3 py-2 text-xs font-bold border-2 transition ${test===n?`text-white ${TEST_META[n].color} border-transparent shadow`:ok?"bg-white border-slate-200 text-slate-600 hover:border-slate-400":"bg-slate-100 border-transparent text-slate-300 cursor-not-allowed"}`}>
                {!ok&&<Lock className="w-3 h-3 inline mr-0.5"/>}{TEST_META[n].badge} T{n}
                {best!==null&&<div className="text-xs opacity-75">{best}%</div>}
              </button>);
            })}
          </div>

          {/* Difficulty selector */}
          <div className="mb-3">
            <p className="text-xs text-slate-500 font-bold mb-2 uppercase tracking-wide">Difficulty</p>
            <div className="flex gap-2">
              {[1,2,3].map(d=>(
                <button key={d} onClick={()=>setDifficulty(d)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black border-2 transition ${difficulty===d?`${DIFF[d].color} text-white border-transparent shadow`:`${DIFF[d].bg} ${DIFF[d].border} ${DIFF[d].text} hover:opacity-80`}`}>
                  {DIFF[d].emoji} {DIFF[d].label}
                  <div className="text-xs font-normal opacity-75 mt-0.5 hidden sm:block">{DIFF[d].desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Test info bar */}
          <div className={`rounded-xl px-4 py-3 text-white ${tc.color} flex justify-between items-center`}>
            <div>
              <div className="font-bold text-sm">{tc.title}</div>
              <div className="text-xs opacity-80">{tc.difficulty} · {DIFF[difficulty].emoji} {DIFF[difficulty].label} · {questions.length} questions</div>
            </div>
            <button onClick={genNew} className="flex items-center gap-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-xs font-bold transition">
              <Shuffle className="w-3.5 h-3.5"/> New
            </button>
          </div>

          {done&&(
            <div className={`mt-3 rounded-xl p-4 border-2 ${pct>=70?"bg-green-50 border-green-300":"bg-amber-50 border-amber-300"}`}>
              <div className="flex items-center gap-3">
                <Award className={`w-8 h-8 shrink-0 ${pct>=70?"text-green-600":"text-amber-500"}`}/>
                <div className="flex-grow">
                  <div className="text-xl font-black text-slate-800">{score}/{questions.length} — {pct}% <span className="text-base">{DIFF[difficulty].emoji}</span></div>
                  <div className="text-sm text-slate-500">{pct>=70?(test<6?`✅ Test ${test+1} unlocked!`:"🏆 All complete!"):"📚 Study tutorials, then try again or reduce difficulty."}</div>
                </div>
                <button onClick={genNew} className={`shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-white ${tc.color}`}><Shuffle className="w-3 h-3"/>New</button>
              </div>
            </div>
          )}
        </div>

        {questions.map((q,idx)=>{
          const ua=ans[idx];const correct=ua===q.ans;
          return(
            <div key={idx} className={`bg-white rounded-2xl shadow mb-4 border-2 ${done?(correct?"border-green-300":ua!==undefined?"border-red-300":"border-slate-200"):"border-slate-200"}`}>
              <div className="p-5">
                <div className="flex gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-black text-white ${tc.color}`}>{idx+1}</div>
                  <p className="font-semibold text-slate-800 whitespace-pre-line leading-relaxed flex-grow">{q.q}</p>
                  <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full h-fit ${DIFF[difficulty].bg} ${DIFF[difficulty].text}`}>{DIFF[difficulty].emoji}</span>
                </div>
                <div className="space-y-2 mb-4">
                  {q.opts.map((opt,oi)=>{
                    const isRight=oi===q.ans;const isChosen=ua===oi;
                    return(<label key={oi} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer text-sm transition-all ${done?(isRight?"bg-green-50 border-green-400 text-green-900 font-semibold":isChosen?"bg-red-50 border-red-400 text-red-900":"bg-slate-50 border-transparent text-slate-500"):(isChosen?`${tc.light} ${tc.border} text-slate-900 font-semibold`:"bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100")}`}>
                      <input type="radio" name={`q${idx}`} checked={isChosen} disabled={done} onChange={()=>setAns(a=>({...a,[idx]:oi}))} className="shrink-0"/>
                      <span className="shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-600">{String.fromCharCode(65+oi)}</span>
                      <span className="flex-grow">{opt}</span>
                      {done&&isRight&&<CheckCircle className="shrink-0 text-green-600 w-4 h-4"/>}
                      {done&&isChosen&&!isRight&&<XCircle className="shrink-0 text-red-500 w-4 h-4"/>}
                    </label>);
                  })}
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden mb-2">
                  <button onClick={()=>setShowTut(t=>({...t,[idx]:!t[idx]}))}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-sm font-bold text-slate-700 transition">
                    <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-purple-600"/>📖 Step-by-Step Tutorial</span>
                    {showTut[idx]?<ChevronUp className="w-4 h-4"/>:<ChevronDown className="w-4 h-4"/>}
                  </button>
                  {showTut[idx]&&(
                    <div className="p-4 bg-purple-50 border-t border-slate-200 space-y-2">
                      {(q.tutorial||[]).map((step,i)=>(
                        <div key={i} className={`p-2.5 rounded-lg text-sm ${step.startsWith("📌")||step.startsWith("💡")?"bg-purple-100 font-semibold text-purple-900 border-l-4 border-purple-500":"bg-white border-l-4 border-purple-300 text-slate-700"}`}>{step}</div>
                      ))}
                    </div>
                  )}
                </div>
                {done&&(
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <button onClick={()=>setShowExp(e=>({...e,[idx]:!e[idx]}))}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-sm font-bold text-indigo-700 transition">
                      <span className="flex items-center gap-2"><Eye className="w-4 h-4"/>✅ Full Written Solution</span>
                      {showExp[idx]?<ChevronUp className="w-4 h-4"/>:<ChevronDown className="w-4 h-4"/>}
                    </button>
                    {showExp[idx]&&(
                      <div className="p-4 border-t bg-indigo-50">
                        <div className="font-bold text-indigo-900 text-sm mb-2">Correct: {q.opts[q.ans]}</div>
                        <div className="text-slate-700 text-sm whitespace-pre-line">{q.exp}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="sticky bottom-3 bg-white rounded-2xl shadow-xl border border-slate-200 p-4">
          <div className="flex gap-3 justify-center">
            {!done?(
              <button onClick={submit} disabled={answered!==questions.length}
                className={`px-8 py-3 rounded-xl font-black text-sm ${answered===questions.length?`text-white ${tc.color} shadow-lg hover:opacity-90`:"bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                {answered===questions.length?"Submit Test ✓":`${answered}/${questions.length} answered`}
              </button>
            ):(
              <button onClick={genNew} className={`flex items-center gap-2 px-8 py-3 text-white rounded-xl font-black text-sm ${tc.color}`}>
                <Shuffle className="w-4 h-4"/>Generate New Questions
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
