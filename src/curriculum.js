// ═══════════════════════════════════════════════════════════════════
// STELLAR MINDS — 2ND GRADE CURRICULUM
// Aligned to CCSS Math & NGSS Science | Ages 7–8
// 6 Math Units + 6 Science Units
// Each unit: 5–6 lessons with grade-level content + 15 quiz questions
// ═══════════════════════════════════════════════════════════════════

export const CURRICULUM = {

  "2-3": {

    // ─────────────────────────────────────────────────────────────
    // MATHEMATICS  —  6 Units
    // ─────────────────────────────────────────────────────────────
    Math: {
      color: "#00D4FF",
      units: [

        // ── UNIT 1: Numbers to 1,000 ──────────────────────────
        {
          id: "m1", title: "Numbers to 1,000", emoji: "🔢",
          xp: 120, progress: 0,
          standard: "CCSS 2.NBT.1 · 2.NBT.2 · 2.NBT.3",
          weeks: "Weeks 1–4",
          lessons: [
            {
              id: "m1-l1", title: "Counting by 1s, 5s, and 10s", emoji: "🔟", type: "📖",
              steps: [
                "Counting by 1s means going up one at a time: 1, 2, 3, 4, 5... you know this one!",
                "Counting by 5s means SKIPPING ahead by 5 each jump: 5, 10, 15, 20, 25, 30... Notice they always end in 5 or 0!",
                "Counting by 10s is the fastest — just add a zero or go up by 10: 10, 20, 30, 40, 50... all the way to 100 in just 10 steps!",
                "Counting by 100s gets us to 1,000 fast: 100, 200, 300, 400, 500, 600, 700, 800, 900, 1,000 — that's only 10 jumps!",
                "Real life tip: Counting by 5s helps count nickels. Counting by 10s helps count dimes. Counting by 100s helps count $100 bills!"
              ]
            },
            {
              id: "m1-l2", title: "Place Value: Hundreds, Tens, Ones", emoji: "🏛️", type: "📖",
              steps: [
                "Every number is built from three place value positions: HUNDREDS, TENS, and ONES.",
                "Think of it like a building: the ones column is the ground floor, tens is the middle, hundreds is the top!",
                "The number 247 means: 2 hundreds (200) + 4 tens (40) + 7 ones (7). Put them together: 200 + 40 + 7 = 247.",
                "Base-ten blocks show this perfectly: a flat = 100, a rod = 10, a small cube = 1. So 247 = 2 flats + 4 rods + 7 cubes.",
                "Try it yourself: What does 315 look like? 3 hundreds (300) + 1 ten (10) + 5 ones (5) = 315 ✓"
              ]
            },
            {
              id: "m1-l3", title: "Reading and Writing Numbers to 1,000", emoji: "✍️", type: "💡",
              steps: [
                "Numbers have two forms: STANDARD form (digits like 456) and WORD form (four hundred fifty-six).",
                "To write a number in words: say the hundreds first, then the tens and ones together.",
                "456 → 'four hundred fifty-six'. 730 → 'seven hundred thirty'. 801 → 'eight hundred one'.",
                "Expanded form breaks a number into its parts: 456 = 400 + 50 + 6. This shows exactly what each digit is worth!",
                "Watch out: 801 has a ZERO in the tens place. Zero means 'nothing' in that spot. We say 'eight hundred one', NOT 'eight hundred zero one'."
              ]
            },
            {
              id: "m1-l4", title: "Comparing Numbers with <, >, =", emoji: "⚖️", type: "💡",
              steps: [
                "When comparing two numbers, we use three symbols: < (less than), > (greater than), = (equal to).",
                "Memory trick for < and >: the symbol always opens toward (points at) the BIGGER number — like a hungry alligator eating the bigger fish!",
                "To compare 364 and 389: both have 3 hundreds, so look at tens. 6 tens vs 8 tens. 6 < 8, so 364 < 389.",
                "Always compare from LEFT to RIGHT — hundreds first, then tens, then ones. Stop as soon as one digit is bigger.",
                "Example: 527 vs 527. All digits match! So 527 = 527. Equal!"
              ]
            },
            {
              id: "m1-l5", title: "Number Lines to 1,000", emoji: "📏", type: "🌟",
              steps: [
                "A number line is like a ruler for ALL numbers — it shows them in order from smallest to biggest.",
                "On a number line, every number has ONE exact spot. Numbers get bigger as you go right, smaller as you go left.",
                "To find 450 on a number line from 0–1,000: it's exactly halfway! 500 is the middle, so 450 is a little to the left.",
                "Number lines help us see which numbers are close together and which are far apart.",
                "Pro tip: when rounding, ask 'which hundred am I closer to?' 456 is closer to 500 than 400, so it rounds to 500."
              ]
            },
            {
              id: "m1-l6", title: "Counting Patterns to 1,000", emoji: "🔄", type: "🌟",
              steps: [
                "A counting pattern is when you add (or subtract) the same amount each time. It's like a secret code!",
                "Pattern: 100, 200, 300, ___ → adding 100 each time → next is 400. This is skip counting by 100s!",
                "Pattern: 25, 50, 75, 100, ___ → adding 25 each time → next is 125.",
                "Even harder: 5, 10, 20, 40, ___ — wait, this one is DOUBLING each time! Next is 80.",
                "Finding patterns makes you a math detective. Ask yourself: 'what's the rule?' and test it on every number in the list."
              ]
            },
          ],
          quiz: [
            { id: 1001, q: "What is the value of the digit 3 in the number 374?", opts: ["3", "30", "300", "3,000"], ans: 2, diff: 1, topic: "Place Value", explain: "In 374, the digit 3 is in the HUNDREDS place, so its value is 300." },
            { id: 1002, q: "What number is shown by 5 hundreds + 6 tens + 2 ones?", opts: ["526", "562", "625", "652"], ans: 1, diff: 1, topic: "Place Value", explain: "5 hundreds = 500, 6 tens = 60, 2 ones = 2. Put together: 500 + 60 + 2 = 562." },
            { id: 1003, q: "Count by 10s: 340, 350, 360, ___", opts: ["361", "365", "370", "380"], ans: 2, diff: 1, topic: "Skip Counting", explain: "Skip counting by 10s means adding 10 each time. 360 + 10 = 370." },
            { id: 1004, q: "Which number is GREATER: 482 or 428?", opts: ["428", "482", "They are equal", "Can't tell"], ans: 1, diff: 1, topic: "Comparing", explain: "Both have 4 hundreds. Compare the tens: 8 tens (80) vs 2 tens (20). 8 > 2, so 482 > 428." },
            { id: 1005, q: "What is 700 + 30 + 9 in standard form?", opts: ["739", "793", "937", "973"], ans: 0, diff: 1, topic: "Place Value", explain: "700 (7 hundreds) + 30 (3 tens) + 9 (9 ones) = 739." },
            { id: 1006, q: "Count by 5s: 45, 50, 55, ___", opts: ["56", "60", "65", "70"], ans: 1, diff: 1, topic: "Skip Counting", explain: "Skip counting by 5s adds 5 each time. 55 + 5 = 60." },
            { id: 1007, q: "Which symbol correctly compares 563 and 536?", opts: ["563 < 536", "563 = 536", "563 > 536", "Cannot compare"], ans: 2, diff: 2, topic: "Comparing", explain: "Both have 5 hundreds. Compare tens: 6 tens vs 3 tens. 6 > 3, so 563 > 536." },
            { id: 1008, q: "Write 845 in expanded form.", opts: ["8+4+5", "800+40+5", "80+40+5", "800+4+5"], ans: 1, diff: 2, topic: "Expanded Form", explain: "845 = 8 hundreds + 4 tens + 5 ones = 800 + 40 + 5." },
            { id: 1009, q: "How many tens are in the number 630?", opts: ["3", "6", "30", "63"], ans: 3, diff: 2, topic: "Place Value", explain: "630 has 6 hundreds and 3 tens. There are 63 tens total in 630 (because 100 = 10 tens)." },
            { id: 1010, q: "What number comes just before 500?", opts: ["400", "490", "499", "501"], ans: 2, diff: 2, topic: "Number Sequence", explain: "Just before means one less. 500 - 1 = 499." },
            { id: 1011, q: "Which number is the LEAST? 279, 297, 209, 270", opts: ["279", "297", "209", "270"], ans: 2, diff: 2, topic: "Comparing", explain: "Compare hundreds: all have 2. Compare tens: 7, 9, 0, 7. Zero tens is the least, so 209 is the smallest." },
            { id: 1012, q: "Count by 100s: 300, 400, 500, ___", opts: ["506", "510", "600", "700"], ans: 2, diff: 1, topic: "Skip Counting", explain: "Skip counting by 100s adds 100 each time. 500 + 100 = 600." },
            { id: 1013, q: "The number 'six hundred eight' in digits is:", opts: ["6,008", "680", "608", "68"], ans: 2, diff: 2, topic: "Word Form", explain: "Six hundred = 600. Eight = 8. There are NO tens (the tens digit is zero). So: 608." },
            { id: 1014, q: "Sam has 4 hundreds, 2 tens, and 7 ones in base-ten blocks. What number does he have?", opts: ["247", "274", "427", "472"], ans: 2, diff: 2, topic: "Place Value", explain: "4 hundreds = 400, 2 tens = 20, 7 ones = 7. Total: 400 + 20 + 7 = 427." },
            { id: 1015, q: "Which number is between 650 and 700 on a number line?", opts: ["599", "640", "675", "701"], ans: 2, diff: 3, topic: "Number Line", explain: "Between 650 and 700 means greater than 650 AND less than 700. Only 675 fits." },
          ]
        },

        // ── UNIT 2: Addition & Subtraction ────────────────────
        {
          id: "m2", title: "Addition & Subtraction", emoji: "➕",
          xp: 150, progress: 0,
          standard: "CCSS 2.OA.1 · 2.NBT.5 · 2.NBT.6",
          weeks: "Weeks 5–9",
          lessons: [
            {
              id: "m2-l1", title: "Mental Math: Adding Tens and Hundreds", emoji: "🧠", type: "📖",
              steps: [
                "Mental math means solving problems IN YOUR HEAD — no pencil needed! It's all about smart shortcuts.",
                "Adding tens: 45 + 30. Just add the tens: 4 tens + 3 tens = 7 tens. So 45 + 30 = 75. The ones digit (5) never changes!",
                "Adding hundreds: 300 + 400. Just add the hundreds: 3 + 4 = 7, so 300 + 400 = 700.",
                "Making 10 first: to add 8 + 5, take 2 from 5 to make 8 into 10. Now it's 10 + 3 = 13. This trick works every time!",
                "Near doubles: 6 + 7. I know 6 + 6 = 12, and 7 is just 1 more. So 6 + 7 = 13!"
              ]
            },
            {
              id: "m2-l2", title: "Adding within 100 with Regrouping", emoji: "🔄", type: "📖",
              steps: [
                "When ones digits add up to 10 or more, we need to REGROUP (carry). This is the key skill for bigger addition!",
                "Example: 47 + 35. Ones: 7 + 5 = 12. We can't write 12 in the ones column, so we write 2 and CARRY the 1 ten.",
                "Now add the tens: 4 + 3 = 7 tens, plus the 1 we carried = 8 tens. Answer: 82.",
                "Think of it like money: if you have 12 pennies, that's 1 dime and 2 pennies. You regroup 10 pennies into 1 dime!",
                "Always check your work: 47 + 35 should be close to 50 + 35 = 85. Our answer 82 is close, so it looks right!"
              ]
            },
            {
              id: "m2-l3", title: "Subtracting within 100 with Regrouping", emoji: "➖", type: "💡",
              steps: [
                "When the top ones digit is SMALLER than the bottom ones digit, we need to borrow (regroup).",
                "Example: 63 - 27. Ones: 3 - 7 doesn't work! So we borrow 1 ten from the tens column.",
                "After borrowing: the ones column is now 13 - 7 = 6. The tens column is now 5 - 2 = 3. Answer: 36.",
                "Think of it like borrowing 10 pennies from a dime. You break the dime into 10 pennies so you have enough to subtract.",
                "Check with addition: 36 + 27 should = 63. Let's verify: 36 + 27 = 63 ✓ Correct!"
              ]
            },
            {
              id: "m2-l4", title: "Word Problems: One and Two Steps", emoji: "📝", type: "💡",
              steps: [
                "Word problems tell a math story. Your job: find the hidden math operation and solve it!",
                "STEP 1: Read carefully. What is the question asking you to FIND?",
                "STEP 2: Identify key words. 'In all / total / altogether' → add. 'Left / fewer / difference / how many more' → subtract.",
                "STEP 3: Write the number sentence. Example: 'Maya had 24 stickers. She gave away 8. How many left?' → 24 - 8 = 16.",
                "Two-step problems have TWO operations. 'Jack had 15 apples. He bought 12 more, then ate 6. How many now?' → 15 + 12 = 27, then 27 - 6 = 21."
              ]
            },
            {
              id: "m2-l5", title: "Adding Three 2-Digit Numbers", emoji: "🔢", type: "🌟",
              steps: [
                "Adding three numbers is just adding two at a time — choose the easiest pair to start with!",
                "Example: 23 + 14 + 16. Look for pairs that make 10 or a round number: 14 + 16 = 30! Then 23 + 30 = 53.",
                "Or just add left to right: 23 + 14 = 37, then 37 + 16 = 53. Same answer!",
                "The ORDER you add doesn't change the answer — this rule is called the Commutative Property.",
                "This is VERY useful in real life: adding up a shopping list, counting scores, totalling points in a game!"
              ]
            },
          ],
          quiz: [
            { id: 2001, q: "What is 56 + 30?", opts: ["76", "80", "86", "96"], ans: 2, diff: 1, topic: "Mental Math", explain: "Add the tens: 5 tens + 3 tens = 8 tens. The ones (6) stay the same. 56 + 30 = 86." },
            { id: 2002, q: "What is 47 + 35?", opts: ["72", "82", "83", "92"], ans: 1, diff: 2, topic: "Adding with Regrouping", explain: "Ones: 7 + 5 = 12. Write 2, carry 1. Tens: 4 + 3 + 1 = 8. Answer: 82." },
            { id: 2003, q: "What is 63 - 27?", opts: ["26", "34", "36", "44"], ans: 2, diff: 2, topic: "Subtracting with Regrouping", explain: "Borrow from tens: ones become 13 - 7 = 6. Tens become 5 - 2 = 3. Answer: 36." },
            { id: 2004, q: "Which adds up to 71? (Choose the correct sum)", opts: ["38 + 24", "43 + 28", "55 + 16", "62 + 8"], ans: 1, diff: 2, topic: "Addition", explain: "43 + 28: ones 3+8=11, write 1 carry 1; tens 4+2+1=7. Answer: 71 ✓" },
            { id: 2005, q: "Maya had 45 crayons. She lost 18. How many does she have now?", opts: ["25", "27", "33", "37"], ans: 1, diff: 2, topic: "Word Problems", explain: "45 - 18: borrow from tens: 15-8=7 ones, 3-1=2 tens. Wait — 45-18=27. Ones: 15-8=7, tens: 3-1=2. Answer: 27." },
            { id: 2006, q: "What is 8 + 7 using the 'make 10' strategy?", opts: ["13", "14", "15", "16"], ans: 2, diff: 1, topic: "Mental Math", explain: "Give 2 from 7 to 8 to make 10. Now it's 10 + 5 = 15." },
            { id: 2007, q: "A store had 72 apples. They received 19 more. How many apples total?", opts: ["81", "88", "91", "93"], ans: 2, diff: 2, topic: "Word Problems", explain: "72 + 19: ones 2+9=11, write 1 carry 1; tens 7+1+1=9. Answer: 91." },
            { id: 2008, q: "What is 25 + 37 + 15?", opts: ["67", "72", "77", "87"], ans: 2, diff: 2, topic: "Adding Three Numbers", explain: "25 + 15 = 40 first (they make a round number). Then 40 + 37 = 77." },
            { id: 2009, q: "Jack had 90 points. He lost 34 points. How many does he have?", opts: ["46", "54", "56", "64"], ans: 2, diff: 2, topic: "Word Problems", explain: "90 - 34: ones 0-4, need to borrow: 10-4=6; tens: 8-3=5. Answer: 56." },
            { id: 2010, q: "Which is the BEST estimate for 48 + 53?", opts: ["About 80", "About 90", "About 100", "About 110"], ans: 2, diff: 2, topic: "Estimation", explain: "Round 48 to 50 and 53 to 50. 50 + 50 = 100. So about 100." },
            { id: 2011, q: "Lila read 24 pages on Monday and 38 pages on Tuesday. How many pages total?", opts: ["52", "58", "62", "68"], ans: 2, diff: 2, topic: "Word Problems", explain: "24 + 38: ones 4+8=12, write 2 carry 1; tens 2+3+1=6. Answer: 62." },
            { id: 2012, q: "What is 300 + 500?", opts: ["350", "550", "800", "850"], ans: 2, diff: 1, topic: "Mental Math", explain: "Adding hundreds: 3 hundreds + 5 hundreds = 8 hundreds = 800." },
            { id: 2013, q: "There are 85 students. 29 go home sick. How many stay?", opts: ["54", "56", "64", "66"], ans: 1, diff: 2, topic: "Word Problems", explain: "85 - 29: borrow; ones 15-9=6, tens 7-2=5. Answer: 56." },
            { id: 2014, q: "Near doubles: 7 + 8 = ?", opts: ["13", "14", "15", "16"], ans: 2, diff: 1, topic: "Mental Math", explain: "7 + 7 = 14 (double), and 8 is one more than 7, so 7 + 8 = 15." },
            { id: 2015, q: "A two-step problem: Ben scored 42 points in game 1, 31 in game 2, and lost 15 in game 3. Total score?", opts: ["48", "55", "58", "73"], ans: 2, diff: 3, topic: "Two-Step Problems", explain: "Step 1: 42 + 31 = 73. Step 2: 73 - 15 = 58. Answer: 58." },
          ]
        },

        // ── UNIT 3: Measurement & Data ────────────────────────
        {
          id: "m3", title: "Measurement & Data", emoji: "📏",
          xp: 130, progress: 0,
          standard: "CCSS 2.MD.1 · 2.MD.4 · 2.MD.9 · 2.MD.10",
          weeks: "Weeks 10–13",
          lessons: [
            {
              id: "m3-l1", title: "Measuring Length in Inches", emoji: "📐", type: "📖",
              steps: [
                "Inches are used to measure short things in the US customary system. 12 inches = 1 foot.",
                "To measure with a ruler: line up the LEFT end of the object with the ZERO mark (not the edge of the ruler!).",
                "Read where the right end of the object reaches on the ruler — that's the measurement.",
                "Common lengths to know: a paperclip is about 1 inch, a pencil is about 7 inches, a school desk is about 24 inches (2 feet).",
                "Always write the UNIT with your answer: say '5 inches', not just '5'. The unit tells people what you measured with!"
              ]
            },
            {
              id: "m3-l2", title: "Measuring Length in Centimetres", emoji: "📏", type: "📖",
              steps: [
                "Centimetres (cm) are used in the metric system — most of the world uses this system!",
                "100 centimetres = 1 metre. A centimetre is about the width of your pinky fingernail.",
                "Rulers have both inches AND centimetres — centimetres are the smaller marks (there are more of them!).",
                "A pencil is about 18 cm long. A door is about 200 cm (2 metres) tall.",
                "Metric vs inches: 1 inch is about 2.5 centimetres. So 4 inches ≈ 10 cm (roughly). Metric numbers are always bigger for the same object!"
              ]
            },
            {
              id: "m3-l3", title: "Estimating and Comparing Lengths", emoji: "🤔", type: "💡",
              steps: [
                "ESTIMATING means making a smart guess before you measure. It's not random — you compare to something you already know!",
                "Benchmark lengths to memorise: 1 inch ≈ a paperclip. 1 foot ≈ a ruler. 1 cm ≈ a fingernail width. 1 metre ≈ a guitar.",
                "To estimate: hold your hands apart the width of the object, then compare that to your benchmark.",
                "COMPARING lengths: 'How much longer is A than B?' Subtract the shorter length from the longer one.",
                "Example: Pencil = 18 cm. Crayon = 12 cm. How much longer is the pencil? 18 - 12 = 6 cm longer."
              ]
            },
            {
              id: "m3-l4", title: "Reading Bar Graphs", emoji: "📊", type: "💡",
              steps: [
                "A bar graph uses bars (rectangles) to show data. The TALLER or LONGER the bar, the MORE of that thing there is.",
                "Every bar graph has: a TITLE (what it's about), LABELS on each axis, and a SCALE (the numbers on the side).",
                "To read a bar: look at the top of the bar and trace across to the number scale on the left side.",
                "You can answer comparison questions from bar graphs: 'Which bar is tallest?' = most popular/most of something.",
                "You can also add or subtract bar values: 'How many more liked cats than dogs?' Subtract the dog bar from the cat bar."
              ]
            },
            {
              id: "m3-l5", title: "Reading Picture Graphs and Tally Charts", emoji: "📈", type: "🌟",
              steps: [
                "A PICTURE GRAPH uses small pictures or symbols. Each picture represents a certain number (shown in the KEY/LEGEND).",
                "If one 🌟 = 2 students, then 3 stars means 3 × 2 = 6 students. Always check the key!",
                "A TALLY CHART uses tally marks: four vertical lines then a diagonal: ||||. Each group of 5 is easy to count fast.",
                "To count tallies: count the groups of 5, then add the leftovers. |||| |||| | = 5 + 5 + 1 = 11.",
                "Both graphs help you organise and understand information — scientists, teachers, and businesses use them every day!"
              ]
            },
          ],
          quiz: [
            { id: 3001, q: "A pencil measures 7 inches. A crayon measures 4 inches. How much LONGER is the pencil?", opts: ["2 inches", "3 inches", "4 inches", "11 inches"], ans: 1, diff: 1, topic: "Comparing Lengths", explain: "Difference = longer - shorter = 7 - 4 = 3 inches." },
            { id: 3002, q: "Where do you line up the object when using a ruler?", opts: ["At the 1 mark", "At the zero (0) mark", "At the middle", "At the end"], ans: 1, diff: 1, topic: "Measuring", explain: "Always start at the ZERO mark on the ruler, not the edge. This gives an accurate measurement." },
            { id: 3003, q: "How many centimetres are in 1 metre?", opts: ["10", "50", "100", "1000"], ans: 2, diff: 1, topic: "Measurement Units", explain: "100 centimetres = 1 metre. This is like 100 pennies = 1 dollar!" },
            { id: 3004, q: "A bar graph shows: Cats = 8, Dogs = 12, Fish = 5. How many more dogs than cats?", opts: ["3", "4", "6", "8"], ans: 1, diff: 2, topic: "Bar Graphs", explain: "More dogs than cats = 12 - 8 = 4 more dogs." },
            { id: 3005, q: "In a picture graph, one 🐟 = 3 students. There are 4 fish shown. How many students chose fish?", opts: ["4", "7", "12", "34"], ans: 2, diff: 2, topic: "Picture Graphs", explain: "4 fish × 3 students each = 12 students total." },
            { id: 3006, q: "Which unit would you use to measure the length of your classroom?", opts: ["Inches", "Centimetres", "Feet or metres", "Millimetres"], ans: 2, diff: 1, topic: "Choosing Units", explain: "Large spaces like classrooms are best measured in feet (US) or metres (metric). Inches/cm are too small and awkward." },
            { id: 3007, q: "A plant grew 15 cm in May and 23 cm in June. How tall did it grow in total?", opts: ["8 cm", "28 cm", "38 cm", "38 inches"], ans: 2, diff: 2, topic: "Adding Measurements", explain: "15 + 23 = 38 cm total growth." },
            { id: 3008, q: "Tally marks shown: |||| |||| ||| How many is this?", opts: ["8", "10", "13", "15"], ans: 2, diff: 2, topic: "Tally Charts", explain: "First group = 5, second group = 5, remaining marks = 3. Total: 5 + 5 + 3 = 13." },
            { id: 3009, q: "The bar graph shows students' favourite seasons: Spring=7, Summer=15, Autumn=9, Winter=4. Which season is LEAST popular?", opts: ["Spring", "Summer", "Autumn", "Winter"], ans: 3, diff: 1, topic: "Bar Graphs", explain: "The least popular is the smallest bar. Winter = 4, which is the smallest number." },
            { id: 3010, q: "Emma's ribbon is 35 cm. She cuts off 12 cm. How long is the ribbon now?", opts: ["23 cm", "27 cm", "33 cm", "47 cm"], ans: 0, diff: 2, topic: "Subtracting Measurements", explain: "35 - 12 = 23 cm remaining." },
            { id: 3011, q: "About how long is a school desk — your best estimate?", opts: ["2 inches", "2 feet", "2 metres", "20 metres"], ans: 1, diff: 2, topic: "Estimating", explain: "A school desk is about 2 feet (24 inches) long. 2 inches is too tiny; 2 metres is as tall as a door!" },
            { id: 3012, q: "A graph shows: Red=6, Blue=10, Green=8, Yellow=4. How many students picked Red or Yellow?", opts: ["6", "8", "10", "12"], ans: 2, diff: 2, topic: "Bar Graphs", explain: "Red (6) + Yellow (4) = 10 students total." },
            { id: 3013, q: "Which measurement is LONGER: 18 inches or 1 foot?", opts: ["18 inches", "1 foot", "They are equal", "Cannot compare"], ans: 0, diff: 2, topic: "Comparing Units", explain: "1 foot = 12 inches. 18 inches > 12 inches, so 18 inches is longer than 1 foot." },
            { id: 3014, q: "In a picture graph, ⭐ = 5 votes. The pizza row has 6 stars. How many votes for pizza?", opts: ["6", "11", "30", "56"], ans: 2, diff: 2, topic: "Picture Graphs", explain: "6 stars × 5 votes each = 30 votes for pizza." },
            { id: 3015, q: "Jake measured a book: it was 28 cm long. Maria said her book is 5 cm shorter. How long is Maria's book?", opts: ["23 cm", "25 cm", "33 cm", "5 cm"], ans: 0, diff: 2, topic: "Comparing Measurements", explain: "Maria's book = 28 - 5 = 23 cm." },
          ]
        },

        // ── UNIT 4: Geometry ──────────────────────────────────
        {
          id: "m4", title: "Geometry", emoji: "🔷",
          xp: 120, progress: 0,
          standard: "CCSS 2.G.1 · 2.G.2 · 2.G.3",
          weeks: "Weeks 14–17",
          lessons: [
            {
              id: "m4-l1", title: "2D Shapes: Sides and Angles", emoji: "⬜", type: "📖",
              steps: [
                "2D shapes are flat — like drawings on paper. 2D means two dimensions: length and width.",
                "Shapes are defined by their SIDES (straight lines) and ANGLES (corners where sides meet).",
                "Triangle: 3 sides, 3 angles. Quadrilateral: 4 sides, 4 angles (squares, rectangles, rhombuses are all quadrilaterals!).",
                "Pentagon: 5 sides, 5 angles. Hexagon: 6 sides. Octagon: 8 sides. The name tells you the number!",
                "Key rule: the number of SIDES always equals the number of ANGLES in any polygon."
              ]
            },
            {
              id: "m4-l2", title: "3D Shapes: Faces, Edges, Vertices", emoji: "📦", type: "📖",
              steps: [
                "3D shapes are solid — they take up real space. Think of a dice, a can, a ball, or a pyramid.",
                "3D shapes have three key features: FACES (flat surfaces), EDGES (where two faces meet), VERTICES (corners).",
                "Cube: 6 faces, 12 edges, 8 vertices. Sphere: 0 faces/edges/vertices (it's completely round!).",
                "Cylinder: 2 circular faces, 1 curved surface, 2 edges, 0 vertices. Like a can of soup!",
                "Rectangular prism (box): 6 faces, 12 edges, 8 vertices — same counts as a cube but faces aren't all squares."
              ]
            },
            {
              id: "m4-l3", title: "Partitioning Shapes into Equal Shares", emoji: "🍕", type: "💡",
              steps: [
                "PARTITIONING means dividing a shape into equal parts — every part must be exactly the SAME size!",
                "2 equal parts: each part is called a HALF (1/2). The shape is divided in two equal pieces.",
                "3 equal parts: each part is called a THIRD (1/3). 4 equal parts: each part is a FOURTH or QUARTER (1/4).",
                "Example: A rectangle cut into 4 equal columns — each column is one fourth. 4 one-fourths make 1 whole!",
                "Key idea: more equal parts = SMALLER each part. 1/4 is smaller than 1/2 because the pizza is cut more ways!"
              ]
            },
            {
              id: "m4-l4", title: "Halves, Thirds, and Fourths", emoji: "🥧", type: "💡",
              steps: [
                "A HALF is when you cut something into 2 equal parts. Each part = 1/2. Two halves make 1 whole.",
                "A THIRD is when you cut into 3 equal parts. Each part = 1/3. Three thirds make 1 whole.",
                "A FOURTH (quarter) is when you cut into 4 equal parts. Each part = 1/4. Four fourths make 1 whole.",
                "Compare: cutting a pizza into more pieces makes each slice SMALLER. 1/2 > 1/3 > 1/4.",
                "Real life: a quarter dollar is 1/4 of a dollar. A half hour is 1/2 of 60 minutes = 30 minutes!"
              ]
            },
            {
              id: "m4-l5", title: "Understanding Area Informally", emoji: "🔲", type: "🌟",
              steps: [
                "AREA is how much FLAT SPACE is inside a shape — like how much carpet you'd need to cover a floor.",
                "We can measure area by COUNTING SQUARE TILES inside a shape. Each square tile = 1 square unit.",
                "A rectangle 4 tiles wide and 3 tiles tall: count them all = 12 square tiles = area of 12 square units.",
                "Shortcut: instead of counting every tile, multiply: 4 × 3 = 12. Length times width!",
                "Area is always measured in SQUARE units (square inches, square cm) because we're measuring flat 2D space."
              ]
            },
          ],
          quiz: [
            { id: 4001, q: "How many sides does a hexagon have?", opts: ["4", "5", "6", "8"], ans: 2, diff: 1, topic: "2D Shapes", explain: "Hexa- means 6. A hexagon has 6 sides and 6 angles." },
            { id: 4002, q: "How many FACES does a cube have?", opts: ["4", "6", "8", "12"], ans: 1, diff: 1, topic: "3D Shapes", explain: "A cube has 6 square faces — top, bottom, front, back, left side, right side." },
            { id: 4003, q: "A rectangle is divided into 4 equal parts. Each part is called a:", opts: ["Half", "Third", "Fourth", "Whole"], ans: 2, diff: 1, topic: "Fractions", explain: "When a shape is divided into 4 equal parts, each part is one fourth (1/4)." },
            { id: 4004, q: "Which shape has exactly 4 sides and 4 right angles?", opts: ["Triangle", "Pentagon", "Rectangle", "Hexagon"], ans: 2, diff: 1, topic: "2D Shapes", explain: "A rectangle has 4 sides and 4 right (90°) angles. A square is a special rectangle!" },
            { id: 4005, q: "A circle is divided in HALF. How many equal parts are there?", opts: ["1", "2", "3", "4"], ans: 1, diff: 1, topic: "Fractions", explain: "A half divides the shape into 2 equal parts." },
            { id: 4006, q: "How many EDGES does a cube have?", opts: ["6", "8", "12", "24"], ans: 2, diff: 2, topic: "3D Shapes", explain: "A cube has 12 edges — 4 on top, 4 on bottom, 4 going vertically." },
            { id: 4007, q: "Which fraction is LARGEST?", opts: ["1/4", "1/2", "1/3", "They are equal"], ans: 1, diff: 2, topic: "Comparing Fractions", explain: "When the numerator (top number) is the same, FEWER parts = bigger piece. 1/2 means only 2 pieces, so each is biggest." },
            { id: 4008, q: "A grid rectangle is 5 tiles wide and 3 tiles tall. What is the area?", opts: ["8 sq units", "10 sq units", "15 sq units", "25 sq units"], ans: 2, diff: 2, topic: "Area", explain: "Area = length × width = 5 × 3 = 15 square units." },
            { id: 4009, q: "What 3D shape has 0 faces, 0 edges, and 0 vertices?", opts: ["Cube", "Cylinder", "Cone", "Sphere"], ans: 3, diff: 2, topic: "3D Shapes", explain: "A sphere is perfectly round — it has no flat faces, no edges, and no vertices (corners)." },
            { id: 4010, q: "A pizza is cut into 3 equal slices. You eat one. You ate ___ of the pizza.", opts: ["1/2", "1/3", "1/4", "3/1"], ans: 1, diff: 1, topic: "Fractions", explain: "The pizza is divided into 3 equal parts. You ate 1 part = 1/3." },
            { id: 4011, q: "Which shape is NOT a quadrilateral?", opts: ["Square", "Rectangle", "Pentagon", "Rhombus"], ans: 2, diff: 2, topic: "2D Shapes", explain: "A quadrilateral has exactly 4 sides. A pentagon has 5 sides, so it is NOT a quadrilateral." },
            { id: 4012, q: "How many VERTICES does a rectangular prism have?", opts: ["4", "6", "8", "12"], ans: 2, diff: 2, topic: "3D Shapes", explain: "A rectangular prism (box) has 8 vertices — one at each corner." },
            { id: 4013, q: "A shape has 5 sides and 5 angles. It is a:", opts: ["Hexagon", "Octagon", "Pentagon", "Quadrilateral"], ans: 2, diff: 1, topic: "2D Shapes", explain: "Penta- means 5. A pentagon has 5 sides and 5 angles." },
            { id: 4014, q: "Sara folds a square in half. Each half is a:", opts: ["Square", "Rectangle", "Triangle", "Trapezoid"], ans: 1, diff: 2, topic: "Fractions", explain: "Folding a square in half creates two equal rectangles." },
            { id: 4015, q: "A shape with 8 sides is called a(n):", opts: ["Hexagon", "Octagon", "Heptagon", "Nonagon"], ans: 1, diff: 2, topic: "2D Shapes", explain: "Octo- means 8. An octagon has 8 sides — like a STOP sign!" },
          ]
        },

        // ── UNIT 5: Time & Money ──────────────────────────────
        {
          id: "m5", title: "Time & Money", emoji: "🕐",
          xp: 140, progress: 0,
          standard: "CCSS 2.MD.7 · 2.MD.8",
          weeks: "Weeks 18–21",
          lessons: [
            {
              id: "m5-l1", title: "Telling Time to the Nearest 5 Minutes", emoji: "🕐", type: "📖",
              steps: [
                "An analogue clock has two hands: the SHORT hour hand and the LONG minute hand.",
                "The short hand tells the HOUR — it moves slowly, once around in 12 hours.",
                "The long hand tells the MINUTES — it moves faster. Each number on the clock = 5 minutes.",
                "Reading time: look at the hour hand first (gives the hour), then the minute hand (count by 5s from 12).",
                "Example: hour hand → 3, minute hand → pointing at 4 (which is 20 minutes). Time = 3:20."
              ]
            },
            {
              id: "m5-l2", title: "A.M. and P.M.", emoji: "🌅", type: "📖",
              steps: [
                "A.M. is the time from midnight (12:00 AM) to just before noon (11:59 AM) — the morning hours.",
                "P.M. is the time from noon (12:00 PM) to just before midnight (11:59 PM) — afternoon, evening, and night.",
                "7:30 AM = breakfast time. 12:00 PM = noon/lunchtime. 3:00 PM = after school. 8:00 PM = bedtime.",
                "Noon (12 PM) and midnight (12 AM) are the tricky ones — remember: noon is the MIDDLE of the day.",
                "Quick test: if you say 'I eat breakfast at 7:30 PM', that's wrong! Breakfast is in the morning, so 7:30 AM."
              ]
            },
            {
              id: "m5-l3", title: "Counting Coins", emoji: "🪙", type: "💡",
              steps: [
                "US coins you need to know: Penny = 1¢. Nickel = 5¢. Dime = 10¢. Quarter = 25¢.",
                "Memory trick: Dime is the SMALLEST coin but worth MORE than a nickel — size doesn't equal value!",
                "To count a mix of coins: start with the largest coin first, then add smaller coins.",
                "Example: 2 quarters + 1 dime + 2 nickels + 3 pennies = 50¢ + 10¢ + 10¢ + 3¢ = 73¢.",
                "4 quarters = $1.00 (one dollar). 10 dimes = $1.00. 20 nickels = $1.00. 100 pennies = $1.00."
              ]
            },
            {
              id: "m5-l4", title: "Counting Bills and Making Change", emoji: "💵", type: "💡",
              steps: [
                "US bills: $1 (one dollar), $5 (five dollars), $10 (ten dollars), $20 (twenty dollars).",
                "To count bills: start with the largest and add down. $10 + $5 + $1 + $1 = $17.",
                "MAKING CHANGE means figuring out how much money you get BACK after paying.",
                "Counting-up method: something costs $3.40, you pay $5.00. Count up from $3.40 to $5.00: $3.40 → $3.50 → $4.00 → $5.00 = $1.60 change.",
                "Always check: price + change = amount paid. $3.40 + $1.60 = $5.00 ✓"
              ]
            },
            {
              id: "m5-l5", title: "Money Word Problems", emoji: "💰", type: "🌟",
              steps: [
                "Money word problems are like regular word problems but with dollar signs and cents!",
                "KEY WORDS: 'How much does it cost in total?' → add. 'How much change?' → subtract. 'Can she afford it?' → compare.",
                "Example: A book costs $4.25 and a pencil costs $1.50. How much total? $4.25 + $1.50 = $5.75.",
                "Example: You have $10.00. You buy a toy for $6.75. Change = $10.00 - $6.75 = $3.25.",
                "Always write the $ sign AND decimal point in your answer. $3.25, not just 3.25 or 325¢."
              ]
            },
          ],
          quiz: [
            { id: 5001, q: "The minute hand points at the 6. How many minutes is that?", opts: ["6 minutes", "12 minutes", "30 minutes", "60 minutes"], ans: 2, diff: 1, topic: "Telling Time", explain: "Each number on the clock = 5 minutes. The 6 is halfway around = 5 × 6 = 30 minutes." },
            { id: 5002, q: "School starts at 8:00 in the morning. Is that A.M. or P.M.?", opts: ["A.M.", "P.M.", "Both", "Neither"], ans: 0, diff: 1, topic: "AM/PM", explain: "Morning hours (12:00 midnight to 11:59 just before noon) are A.M. School in the morning = 8:00 A.M." },
            { id: 5003, q: "How much is 1 quarter + 2 dimes + 1 nickel?", opts: ["35¢", "40¢", "45¢", "50¢"], ans: 3, diff: 2, topic: "Counting Coins", explain: "Quarter=25¢, 2 dimes=20¢, nickel=5¢. Total: 25+20+5=50¢." },
            { id: 5004, q: "The clock shows 4:45. What will the time be in 10 minutes?", opts: ["4:50", "4:55", "5:00", "5:10"], ans: 1, diff: 2, topic: "Elapsed Time", explain: "4:45 + 10 minutes = 4:55." },
            { id: 5005, q: "You buy a snack for $2.75. You pay $5.00. How much change do you get?", opts: ["$1.25", "$2.25", "$2.75", "$3.25"], ans: 1, diff: 2, topic: "Making Change", explain: "$5.00 - $2.75 = $2.25 change." },
            { id: 5006, q: "Which coin is worth 10 cents?", opts: ["Penny", "Nickel", "Dime", "Quarter"], ans: 2, diff: 1, topic: "Coins", explain: "A dime = 10 cents. Remember: dime is the SMALLEST coin but worth MORE than a penny or nickel." },
            { id: 5007, q: "Bedtime is 8:30 at night. Is this A.M. or P.M.?", opts: ["A.M.", "P.M.", "Both", "Neither"], ans: 1, diff: 1, topic: "AM/PM", explain: "Night time (after noon) is P.M. Bedtime at 8:30 at night = 8:30 P.M." },
            { id: 5008, q: "How many quarters make $1.00?", opts: ["2", "3", "4", "5"], ans: 2, diff: 1, topic: "Coins", explain: "4 quarters × 25¢ = 100¢ = $1.00." },
            { id: 5009, q: "A toy costs $6.50. Marcus has $10.00. Can he afford it, and how much change?", opts: ["No, not enough", "Yes, $3.50 change", "Yes, $4.50 change", "Yes, $3.00 change"], ans: 1, diff: 2, topic: "Money Word Problems", explain: "$10.00 - $6.50 = $3.50 change. He can afford it!" },
            { id: 5010, q: "The hour hand points between 7 and 8, the minute hand points at 9. What time is it?", opts: ["7:09", "7:45", "8:45", "9:07"], ans: 1, diff: 2, topic: "Telling Time", explain: "Hour hand past 7 = 7 something. Minute hand at 9 = 9 × 5 = 45 minutes. Time = 7:45." },
            { id: 5011, q: "Ava has 3 dimes and 4 pennies. How much money does she have?", opts: ["7¢", "34¢", "43¢", "70¢"], ans: 1, diff: 2, topic: "Counting Coins", explain: "3 dimes = 30¢, 4 pennies = 4¢. Total: 30 + 4 = 34¢." },
            { id: 5012, q: "Which of these times is in the AFTERNOON?", opts: ["9:00 A.M.", "11:30 A.M.", "1:00 P.M.", "12:00 A.M."], ans: 2, diff: 2, topic: "AM/PM", explain: "Afternoon is after noon (12:00 PM). 1:00 P.M. is 1 hour after noon, so it's in the afternoon." },
            { id: 5013, q: "A book costs $3.25 and a pen costs $1.50. How much is the total?", opts: ["$4.25", "$4.50", "$4.75", "$5.25"], ans: 2, diff: 2, topic: "Money Word Problems", explain: "$3.25 + $1.50: cents 25+50=75¢, dollars 3+1=$4. Total = $4.75." },
            { id: 5014, q: "The clock shows 10:15. School ends at 3:30. How many hours and minutes until school ends? (tricky!)", opts: ["4 hours 15 min", "5 hours", "5 hours 15 min", "6 hours"], ans: 2, diff: 3, topic: "Elapsed Time", explain: "10:15 to 3:30. From 10:15 to 3:15 = 5 hours. From 3:15 to 3:30 = 15 more minutes. Total: 5 hours 15 minutes." },
            { id: 5015, q: "Leo has $20. He buys a book for $8.75 and a snack for $2.50. How much money does he have left?", opts: ["$7.75", "$8.75", "$9.25", "$11.25"], ans: 1, diff: 3, topic: "Money Word Problems", explain: "Spent: $8.75 + $2.50 = $11.25. Remaining: $20.00 - $11.25 = $8.75." },
          ]
        },

        // ── UNIT 6: Review & Math Showcase ────────────────────
        {
          id: "m6", title: "Math Review & Showcase", emoji: "🏆",
          xp: 200, progress: 0,
          standard: "All 2nd Grade CCSS Standards",
          weeks: "Weeks 22–24",
          lessons: [
            {
              id: "m6-l1", title: "Place Value and Numbers Review", emoji: "🔢", type: "📖",
              steps: [
                "Let's review the big ideas from Unit 1! Numbers up to 1,000 use hundreds, tens, and ones.",
                "Standard form: 428. Expanded form: 400 + 20 + 8. Word form: four hundred twenty-eight.",
                "Comparing: look left to right. Compare hundreds first, then tens, then ones.",
                "Skip counting helps us count faster: by 2s, 5s, 10s, 100s.",
                "Challenge: put these in order from least to greatest: 756, 675, 567, 765. Answer: 567, 675, 756, 765."
              ]
            },
            {
              id: "m6-l2", title: "Addition and Subtraction Review", emoji: "➕", type: "📖",
              steps: [
                "Review: adding with regrouping means carrying to the next column when a column adds to 10 or more.",
                "Review: subtracting with regrouping means borrowing from the next column when the top digit is smaller.",
                "Always ESTIMATE first: round to the nearest 10 to check your answer makes sense.",
                "Fact families: addition and subtraction are opposites! If 45 + 37 = 82, then 82 - 37 = 45.",
                "Word problem strategy: underline the question, circle the numbers, cross out the extras, choose the operation."
              ]
            },
            {
              id: "m6-l3", title: "Measurement and Geometry Review", emoji: "📐", type: "💡",
              steps: [
                "Measurement: always start at zero on the ruler. Include the unit (cm or inches) in your answer.",
                "Reading graphs: match the top of the bar to the scale. Check the key for picture graphs.",
                "2D shapes: name them by counting sides. Triangle=3, square/rectangle=4, pentagon=5, hexagon=6.",
                "3D shapes: cube (6 faces, 12 edges, 8 vertices), sphere (no flat faces), cylinder (2 circular faces).",
                "Fractions: 1/2 > 1/3 > 1/4. More pieces means each piece is smaller."
              ]
            },
            {
              id: "m6-l4", title: "Time and Money Review", emoji: "🕐", type: "💡",
              steps: [
                "Telling time: short hand = hour, long hand = minutes. Each clock number = 5 minutes.",
                "A.M. = midnight to noon (morning). P.M. = noon to midnight (afternoon, evening, night).",
                "Coins: penny=1¢, nickel=5¢, dime=10¢, quarter=25¢. Count largest to smallest.",
                "Making change: subtract price from amount paid. Check: price + change = amount paid.",
                "Always write $ and decimal in money answers: $4.75 not just 4.75."
              ]
            },
            {
              id: "m6-l5", title: "Real-World Math Connections", emoji: "🌍", type: "🌟",
              steps: [
                "Math is everywhere in real life! Let's connect what we've learned to the world around us.",
                "SHOPPING: you use addition (total cost), subtraction (change back), and comparing (can I afford this?).",
                "COOKING: recipes use fractions! 1/2 cup of sugar, 1/4 teaspoon of salt, 3/4 cup of flour.",
                "TELLING TIME: every day you use time — bus schedules, TV shows, sports games.",
                "MEASURING: building things, sewing, cooking — all need accurate measurement. The same skills you practised!"
              ]
            },
          ],
          quiz: [
            { id: 6001, q: "What is 500 + 40 + 7 in standard form?", opts: ["457", "547", "574", "745"], ans: 1, diff: 1, topic: "Place Value Review", explain: "500 (5 hundreds) + 40 (4 tens) + 7 (7 ones) = 547." },
            { id: 6002, q: "What is 74 + 58?", opts: ["122", "132", "142", "152"], ans: 1, diff: 2, topic: "Addition Review", explain: "Ones: 4+8=12, write 2 carry 1. Tens: 7+5+1=13, write 3 carry 1. Hundreds: 1. Answer: 132." },
            { id: 6003, q: "What is 91 - 46?", opts: ["35", "45", "54", "55"], ans: 1, diff: 2, topic: "Subtraction Review", explain: "Borrow: ones 11-6=5, tens 8-4=4. Answer: 45." },
            { id: 6004, q: "Which number means 'seven hundred two'?", opts: ["720", "702", "7,002", "270"], ans: 1, diff: 2, topic: "Place Value Review", explain: "Seven hundred = 700. Two = 2. No tens (zero in tens place). Answer: 702." },
            { id: 6005, q: "How many sides does an octagon have?", opts: ["6", "7", "8", "9"], ans: 2, diff: 1, topic: "Geometry Review", explain: "Octo- means 8. An octagon has 8 sides." },
            { id: 6006, q: "3 quarters + 1 dime = how many cents?", opts: ["35¢", "75¢", "85¢", "90¢"], ans: 2, diff: 2, topic: "Money Review", explain: "3 quarters = 75¢, 1 dime = 10¢. Total = 75 + 10 = 85¢." },
            { id: 6007, q: "The clock shows 6:30. What time will it be in 15 minutes?", opts: ["6:35", "6:40", "6:45", "7:00"], ans: 2, diff: 2, topic: "Time Review", explain: "6:30 + 15 minutes = 6:45." },
            { id: 6008, q: "A rectangle is divided into 3 equal parts. Each part is called a:", opts: ["Half", "Third", "Quarter", "Sixth"], ans: 1, diff: 1, topic: "Fractions Review", explain: "3 equal parts → each part is one third (1/3)." },
            { id: 6009, q: "A bar graph shows book types: Fiction=14, Non-fiction=9, Comics=11. How many books total?", opts: ["24", "30", "34", "44"], ans: 2, diff: 2, topic: "Data Review", explain: "14 + 9 + 11 = 34 books total." },
            { id: 6010, q: "Sam buys lunch for $3.50 and a drink for $1.25. He pays $10. How much change?", opts: ["$4.75", "$5.25", "$6.25", "$6.75"], ans: 1, diff: 3, topic: "Money Review", explain: "Total spent: $3.50 + $1.25 = $4.75. Change: $10.00 - $4.75 = $5.25." },
            { id: 6011, q: "Which shows the numbers in order from LEAST to GREATEST?", opts: ["345, 534, 435, 453", "534, 453, 435, 345", "345, 435, 453, 534", "453, 534, 345, 435"], ans: 2, diff: 2, topic: "Comparing Numbers", explain: "345 < 435 < 453 < 534. Compare hundreds first (3 < 4), then when hundreds are equal compare tens." },
            { id: 6012, q: "Mia reads 23 pages on Monday, 31 on Tuesday, and 27 on Wednesday. How many pages total?", opts: ["71", "81", "87", "91"], ans: 1, diff: 2, topic: "Adding Three Numbers", explain: "23 + 31 + 27. Try 23+27=50 first, then 50+31=81." },
            { id: 6013, q: "A book costs $5.99. About how much is this rounded to the nearest dollar?", opts: ["$5", "$6", "$7", "$10"], ans: 1, diff: 2, topic: "Estimation", explain: "5.99 is very close to 6 (only 1 cent away). Round up to $6." },
            { id: 6014, q: "The perimeter of a square with each side 6 cm is:", opts: ["12 cm", "18 cm", "24 cm", "36 cm"], ans: 2, diff: 3, topic: "Geometry Review", explain: "Perimeter = all sides added up. Square has 4 equal sides: 6+6+6+6 = 24 cm." },
            { id: 6015, q: "What time is 30 minutes after 11:45 A.M.?", opts: ["11:75 A.M.", "12:00 P.M.", "12:15 P.M.", "1:15 P.M."], ans: 2, diff: 3, topic: "Time Review", explain: "11:45 + 30 min: first 15 min gets to 12:00, then 15 more = 12:15 P.M. (crosses into PM!)" },
          ]
        },

      ] // end Math units
    },

    // ─────────────────────────────────────────────────────────────
    // SCIENCE  —  6 Units
    // ─────────────────────────────────────────────────────────────
    Science: {
      color: "#39FF14",
      units: [

        // ── UNIT 1: Properties of Matter ──────────────────────
        {
          id: "s1", title: "Properties of Matter", emoji: "🧪",
          xp: 120, progress: 0,
          standard: "NGSS 2-PS1-1 · 2-PS1-2 · 2-PS1-3",
          weeks: "Weeks 1–5",
          lessons: [
            {
              id: "s1-l1", title: "Describing Objects by Their Properties", emoji: "🔍", type: "📖",
              steps: [
                "A PROPERTY is a describing word that tells you what something is like — its characteristics.",
                "We describe objects by: colour, size, shape, texture, weight, hardness, and whether it sinks or floats.",
                "Touch: rough or smooth? Hard or soft? Bumpy or flat? These are TEXTURE properties.",
                "Look: what colour? What shape? How big or small? Clear or opaque? These are VISUAL properties.",
                "Scientists use properties to SORT objects into groups. Can you sort a pile of objects by colour? By whether they sink or float? That's science!"
              ]
            },
            {
              id: "s1-l2", title: "Solids, Liquids, and Gases", emoji: "🧊", type: "📖",
              steps: [
                "All matter exists in one of three states: SOLID, LIQUID, or GAS. You've seen all three today!",
                "SOLID: keeps its own shape no matter what container you put it in. Examples: ice, rock, pencil, book.",
                "LIQUID: takes the SHAPE of its container but keeps the same VOLUME (amount). Examples: water, juice, lava, honey.",
                "GAS: spreads out to fill the ENTIRE container. It has no fixed shape or fixed volume. Air is a gas! So is steam.",
                "Key test: can it be poured? If yes → liquid. Does it hold its shape? If yes → solid. Is it invisible and spreads out? → gas."
              ]
            },
            {
              id: "s1-l3", title: "Heating and Cooling Change Matter", emoji: "🔥", type: "💡",
              steps: [
                "HEATING adds energy to matter and can change its state — from solid to liquid, or liquid to gas.",
                "Ice (solid) + heat → melts into water (liquid). Water + more heat → boils into steam (gas). This is evaporation!",
                "COOLING removes energy from matter. Water (liquid) + cold → freezes into ice (solid). Steam + cold → condenses back to water.",
                "Melting point of water: 0°C (32°F). Boiling point of water: 100°C (212°F). These are important science facts!",
                "Many of these changes are REVERSIBLE — you can melt ice, then freeze the water again and get ice back. But some changes, like burning wood, are IRREVERSIBLE (you can't un-burn it!)."
              ]
            },
            {
              id: "s1-l4", title: "Reversible vs Irreversible Changes", emoji: "🔄", type: "💡",
              steps: [
                "A REVERSIBLE change can be UNDONE — you can get the original material back.",
                "Examples of reversible changes: melting ice → freeze it → ice again. Dissolving sugar in water → boil water away → sugar returns.",
                "An IRREVERSIBLE change CANNOT be undone — the original material is gone forever.",
                "Examples of irreversible changes: burning wood → turns to ash (you can't unburn it!). Cooking an egg → raw egg becomes hard (you can't uncook it!).",
                "Clue words: reversible = melt, freeze, dissolve, evaporate. Irreversible = burn, cook, rust, corrode, decay."
              ]
            },
            {
              id: "s1-l5", title: "Mixing and Separating Materials", emoji: "⚗️", type: "🌟",
              steps: [
                "When you MIX materials, you combine them together. Sometimes you can separate them again — sometimes you can't!",
                "MIXTURES: sand and water can be separated by filtering. Salt and water — salt dissolves and seems gone, but evaporate the water and the salt comes back!",
                "SOLUTIONS: when one material dissolves completely in another (like salt in water). The salt seems to disappear but it's still there!",
                "How to separate mixtures: FILTERING (pour through a small-hole filter to catch solids), EVAPORATING (heat to remove liquid), USING A MAGNET (if one part is magnetic).",
                "Real-life example: making lemonade mixes lemon juice, sugar, and water into a solution. You can taste the sugar even though you can't see it!"
              ]
            },
          ],
          quiz: [
            { id: 7001, q: "Which of these is a SOLID?", opts: ["Juice", "Steam", "Ice cube", "Air"], ans: 2, diff: 1, topic: "States of Matter", explain: "A solid keeps its own shape. Ice is solid — it maintains its cube shape no matter where you put it." },
            { id: 7002, q: "What happens to ice when it is heated?", opts: ["It becomes a gas", "It melts into liquid water", "It gets harder", "Nothing changes"], ans: 1, diff: 1, topic: "Changes of State", explain: "Heating adds energy to ice, causing it to MELT and become liquid water." },
            { id: 7003, q: "A liquid always takes the SHAPE of its ___.", opts: ["Temperature", "Colour", "Container", "Weight"], ans: 2, diff: 1, topic: "States of Matter", explain: "Liquids don't have their own shape — they take the shape of whatever container holds them." },
            { id: 7004, q: "Which property describes how something FEELS when you touch it?", opts: ["Colour", "Texture", "Shape", "Size"], ans: 1, diff: 1, topic: "Properties", explain: "Texture is how something feels — rough, smooth, bumpy, soft, hard. You find out by touching!" },
            { id: 7005, q: "Burning wood is an example of a ___ change.", opts: ["Reversible", "Irreversible", "Physical only", "Heating only"], ans: 1, diff: 2, topic: "Reversible Changes", explain: "Burning is irreversible — you can't unburn wood. It turns to ash permanently." },
            { id: 7006, q: "Steam is an example of which state of matter?", opts: ["Solid", "Liquid", "Gas", "None of the above"], ans: 2, diff: 1, topic: "States of Matter", explain: "Steam is water in its gas state. It forms when water is heated past 100°C." },
            { id: 7007, q: "Melting ice and then refreezing the water is a ___ change.", opts: ["Irreversible", "Reversible", "Chemical", "Permanent"], ans: 1, diff: 2, topic: "Reversible Changes", explain: "Melting and freezing are reversible — you can melt ice into water, then freeze it back into ice." },
            { id: 7008, q: "Which material would a magnet help you separate from a mixture?", opts: ["Sand", "Salt", "Iron filings", "Sugar"], ans: 2, diff: 2, topic: "Separating Materials", explain: "Magnets attract iron (magnetic metals). Iron filings in sand can be separated using a magnet." },
            { id: 7009, q: "When water is cooled below 0°C it:", opts: ["Evaporates into steam", "Freezes into ice", "Dissolves", "Becomes heavier"], ans: 1, diff: 1, topic: "Changes of State", explain: "Water freezes (becomes solid ice) when cooled below 0°C (32°F)." },
            { id: 7010, q: "You mix sand into water and stir. This is an example of a:", opts: ["Solution", "Mixture", "Irreversible change", "Solid becoming liquid"], ans: 1, diff: 2, topic: "Mixtures", explain: "Sand and water form a MIXTURE — they combine but don't dissolve. You can see both materials." },
            { id: 7011, q: "Which describes a property you can observe with your EYES?", opts: ["Texture", "Temperature", "Colour", "Smell"], ans: 2, diff: 1, topic: "Properties", explain: "Colour is a visual property — you observe it with your eyes. Texture = touch; smell = nose; temperature = touch." },
            { id: 7012, q: "What change happens when liquid water is heated to 100°C?", opts: ["It freezes", "It evaporates into steam (gas)", "It dissolves", "It becomes solid"], ans: 1, diff: 2, topic: "Changes of State", explain: "Boiling water evaporates into steam (water vapour). This happens at 100°C (212°F)." },
            { id: 7013, q: "Cooking an egg is an example of a ___ change because:", opts: ["Reversible — you can uncook it", "Irreversible — you cannot uncook it", "Reversible — eggs return to raw", "Physical — no new material forms"], ans: 1, diff: 2, topic: "Reversible Changes", explain: "Cooking changes the egg's proteins permanently. You cannot uncook a cooked egg — it's irreversible." },
            { id: 7014, q: "What method would BEST separate salt from salt water?", opts: ["Filtering", "Using a magnet", "Evaporating the water", "Shaking the jar"], ans: 2, diff: 3, topic: "Separating Materials", explain: "Salt dissolves in water — filtering won't work. But if you EVAPORATE the water (heat it away), the salt is left behind." },
            { id: 7015, q: "Which of these has NO definite shape AND fills its entire container?", opts: ["Rock", "Water", "Air", "Ice"], ans: 2, diff: 2, topic: "States of Matter", explain: "Air is a gas. Gases have no definite shape and expand to fill whatever container they're in." },
          ]
        },

        // ── UNIT 2: Plant & Animal Life Cycles ────────────────
        {
          id: "s2", title: "Plant & Animal Life Cycles", emoji: "🌱",
          xp: 130, progress: 0,
          standard: "NGSS 2-LS2-2 · 2-LS4-1",
          weeks: "Weeks 6–10",
          lessons: [
            {
              id: "s2-l1", title: "Stages of a Plant Life Cycle", emoji: "🌻", type: "📖",
              steps: [
                "A LIFE CYCLE is the series of stages a living thing goes through from beginning to end — and back to beginning!",
                "A flowering plant's life cycle: SEED → GERMINATION → SEEDLING → MATURE PLANT → FLOWER → POLLINATION → SEED.",
                "GERMINATION is when a seed starts to grow. It needs water, warmth, and the right conditions to 'wake up'.",
                "The SEEDLING is the young plant with its first tiny leaves. It's fragile and needs light to grow!",
                "The MATURE plant flowers, gets pollinated (by bees, wind, butterflies), makes seeds, and the cycle begins again!"
              ]
            },
            {
              id: "s2-l2", title: "What Plants Need to Survive", emoji: "☀️", type: "📖",
              steps: [
                "Plants are amazing — they make their own food! But they need certain ingredients to do it.",
                "Plants need: SUNLIGHT (energy source), WATER (absorbed through roots), AIR / CO₂ (through tiny pores in leaves), and NUTRIENTS from SOIL.",
                "PHOTOSYNTHESIS is the process plants use to make food: sunlight + water + CO₂ → sugar (food) + oxygen.",
                "The oxygen plants release during photosynthesis is what WE breathe! Without plants, animals couldn't survive.",
                "What happens without each ingredient? No water → plant wilts. No sunlight → plant turns yellow and weak. No soil nutrients → plant grows slowly."
              ]
            },
            {
              id: "s2-l3", title: "Animal Life Cycles: Butterfly and Frog", emoji: "🦋", type: "💡",
              steps: [
                "Different animals have different life cycles — some look very different at each stage!",
                "BUTTERFLY life cycle (COMPLETE metamorphosis, 4 stages): EGG → LARVA (caterpillar) → PUPA (chrysalis) → ADULT butterfly.",
                "The caterpillar eats leaves to grow. Inside the chrysalis, it transforms completely. The adult butterfly lays eggs, starting the cycle again.",
                "FROG life cycle (INCOMPLETE metamorphosis): FROG EGG → TADPOLE (lives in water, has a tail) → FROGLET (growing legs) → ADULT FROG (lives on land and water).",
                "Both start life very differently from their adult form. This is called METAMORPHOSIS — a dramatic transformation!"
              ]
            },
            {
              id: "s2-l4", title: "Animal Life Cycles: Bird and Mammal", emoji: "🐦", type: "💡",
              steps: [
                "Not all animals go through dramatic metamorphosis — birds and mammals look like smaller versions of adults!",
                "BIRD life cycle: EGG → HATCHLING (baby bird, needs parents) → FLEDGLING (learning to fly) → ADULT BIRD (can reproduce).",
                "MAMMAL life cycle: BORN LIVE (not from egg — most mammals!) → INFANT (nurses milk) → JUVENILE → ADULT.",
                "Humans, dogs, cats, elephants, whales — all mammals. They grow up looking like small versions of their parents.",
                "Comparing cycles: butterflies have 4 very different stages. Birds skip the tadpole-like stage and look like small birds straight away."
              ]
            },
            {
              id: "s2-l5", title: "Comparing Life Cycles Across Species", emoji: "⚖️", type: "🌟",
              steps: [
                "All living things have life cycles — but they vary a LOT in length, stages, and complexity!",
                "MAYFLY: lives as an adult for just ONE DAY. Giant tortoises can live 150 years! Life cycle length varies hugely.",
                "Some animals (butterflies, frogs, beetles) have COMPLETE metamorphosis (4 very different stages).",
                "Others (grasshoppers, dragonflies) have INCOMPLETE metamorphosis (3 stages — no pupal stage).",
                "What's the same? ALL life cycles include: being born/hatched, growing, reproducing, and eventually dying. Life cycles ensure species survive generation after generation!"
              ]
            },
          ],
          quiz: [
            { id: 8001, q: "What is GERMINATION?", opts: ["When a plant grows flowers", "When a seed starts to grow", "When a leaf falls off", "When a plant is watered"], ans: 1, diff: 1, topic: "Plant Life Cycle", explain: "Germination is when a seed wakes up and begins to grow. It needs water and warmth to germinate." },
            { id: 8002, q: "What are the 4 stages of a butterfly's life cycle in order?", opts: ["Egg, Adult, Chrysalis, Caterpillar", "Egg, Caterpillar, Chrysalis, Butterfly", "Caterpillar, Egg, Butterfly, Chrysalis", "Chrysalis, Egg, Butterfly, Caterpillar"], ans: 1, diff: 2, topic: "Butterfly Life Cycle", explain: "Butterfly: Egg → Caterpillar (larva) → Chrysalis (pupa) → Adult butterfly. This is complete metamorphosis." },
            { id: 8003, q: "Plants make their own food using sunlight, water, and:", opts: ["Soil and worms", "Carbon dioxide (CO₂) from air", "Other plants", "Sugar from the ground"], ans: 1, diff: 2, topic: "Photosynthesis", explain: "Photosynthesis = sunlight + water + CO₂ → food (sugar) + oxygen." },
            { id: 8004, q: "What does a tadpole grow into?", opts: ["A fish", "A salamander", "A frog", "A newt"], ans: 2, diff: 1, topic: "Frog Life Cycle", explain: "A tadpole is a young frog. It lives in water, then grows legs and develops into an adult frog." },
            { id: 8005, q: "Which life cycle stage comes AFTER the egg in a bird's life?", opts: ["Fledgling", "Adult", "Hatchling", "Juvenile"], ans: 2, diff: 2, topic: "Bird Life Cycle", explain: "After hatching from an egg, the bird is a HATCHLING — a helpless baby that needs its parents." },
            { id: 8006, q: "What gas do plants RELEASE during photosynthesis?", opts: ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"], ans: 2, diff: 2, topic: "Photosynthesis", explain: "Plants absorb CO₂ and RELEASE OXYGEN. This oxygen is what animals (including us) breathe!" },
            { id: 8007, q: "A caterpillar wraps itself in a ___ to transform into a butterfly.", opts: ["Web", "Nest", "Chrysalis", "Shell"], ans: 2, diff: 1, topic: "Butterfly Life Cycle", explain: "The caterpillar forms a CHRYSALIS (or pupa) around itself. Inside, it transforms into an adult butterfly." },
            { id: 8008, q: "What do plants absorb through their ROOTS?", opts: ["Sunlight", "Carbon dioxide", "Water and nutrients", "Oxygen"], ans: 2, diff: 2, topic: "What Plants Need", explain: "Roots anchor the plant and absorb water and minerals/nutrients from the soil." },
            { id: 8009, q: "Which animal has INCOMPLETE metamorphosis (no pupa stage)?", opts: ["Butterfly", "Frog", "Grasshopper", "Beetle"], ans: 2, diff: 3, topic: "Life Cycles", explain: "Grasshoppers have incomplete metamorphosis: Egg → Nymph → Adult. No pupa/chrysalis stage!" },
            { id: 8010, q: "What is PHOTOSYNTHESIS?", opts: ["How animals eat plants", "How plants make food using sunlight", "How seeds germinate", "How frogs grow legs"], ans: 1, diff: 1, topic: "Photosynthesis", explain: "Photosynthesis is the process plants use to make their own food from sunlight, water, and carbon dioxide." },
            { id: 8011, q: "Mammals are different from birds because most mammals:", opts: ["Lay eggs", "Have feathers", "Are born live (not from eggs)", "Can fly"], ans: 2, diff: 2, topic: "Animal Life Cycles", explain: "Most mammals give birth to live young (babies). Birds hatch from eggs. (Platypuses are an exception!)" },
            { id: 8012, q: "What will happen to a plant if it gets NO sunlight?", opts: ["It will grow faster", "It turns yellow and becomes weak", "It makes more seeds", "Nothing changes"], ans: 1, diff: 2, topic: "What Plants Need", explain: "Without sunlight, plants can't do photosynthesis (make food). They turn yellow (chlorophyll breaks down) and weaken." },
            { id: 8013, q: "Which stage comes AFTER the seedling in a plant's life cycle?", opts: ["Seed", "Germination", "Mature plant with flowers", "Pollination only"], ans: 2, diff: 2, topic: "Plant Life Cycle", explain: "Life cycle order: Seed → Germination → Seedling → Mature plant (which flowers and produces seeds)." },
            { id: 8014, q: "What do ALL life cycles have in common?", opts: ["They all involve eggs", "They all include being born, growing, reproducing, and dying", "They all take exactly one year", "They all happen in water"], ans: 1, diff: 2, topic: "Life Cycles", explain: "All life cycles include birth/hatching, growth, reproduction (making more of the species), and death." },
            { id: 8015, q: "A frog egg → tadpole → froglet → adult frog is called:", opts: ["Complete metamorphosis", "Incomplete metamorphosis", "Germination", "Pollination"], ans: 1, diff: 3, topic: "Frog Life Cycle", explain: "Frogs have incomplete metamorphosis (3 main stages, not 4). There is no separate pupa stage like in butterflies." },
          ]
        },

        // ── UNIT 3: Habitats & Ecosystems ─────────────────────
        {
          id: "s3", title: "Habitats & Ecosystems", emoji: "🌊",
          xp: 130, progress: 0,
          standard: "NGSS 2-LS4-1 · 2-ESS2-2",
          weeks: "Weeks 11–15",
          lessons: [
            {
              id: "s3-l1", title: "Major Habitats of the World", emoji: "🌍", type: "📖",
              steps: [
                "A HABITAT is the natural environment where a plant or animal lives — it provides food, water, shelter, and space.",
                "OCEAN: covers 71% of Earth! Home to fish, whales, sharks, coral, jellyfish, and millions more species.",
                "FOREST: dense trees, rain, shade. Home to bears, deer, owls, foxes, mushrooms, ferns. Tropical rainforests have MORE species than anywhere else on Earth!",
                "DESERT: very dry (less than 25cm of rain a year), extreme temperatures. Home to camels, lizards, snakes, cacti, scorpions.",
                "GRASSLAND: wide open flat land, grasses (no trees). Home to zebras, lions, bison, prairie dogs, meerkats, eagles."
              ]
            },
            {
              id: "s3-l2", title: "How Animals Adapt to Their Habitats", emoji: "🐪", type: "📖",
              steps: [
                "An ADAPTATION is a special body feature or behaviour that helps an animal survive in its habitat.",
                "Desert adaptations: camels store fat in their humps (not water!) for energy; thick eyelashes block sand; can go days without water.",
                "Arctic adaptations: polar bears have white fur (camouflage in snow), thick fat layer (insulation), large paws (for swimming and walking on ice).",
                "Ocean adaptations: fish have GILLS to breathe underwater. Sharks have a streamlined body to swim fast. Deep-sea fish glow in the dark!",
                "Key idea: adaptations develop over many generations. Animals that were BETTER suited to their environment survived and had babies — passing on those helpful traits."
              ]
            },
            {
              id: "s3-l3", title: "Food Chains", emoji: "🍃", type: "💡",
              steps: [
                "A FOOD CHAIN shows what eats what in a habitat — who gets energy from whom.",
                "Every food chain starts with a PRODUCER — a plant that makes food from sunlight.",
                "Next comes the CONSUMER — an animal that eats the plant. This is called a herbivore (plant eater).",
                "Then a PREDATOR eats the herbivore — this is called a carnivore (meat eater). Or it might be an omnivore (eats both!).",
                "Example grassland food chain: Grass (producer) → Grasshopper (herbivore/consumer) → Frog (carnivore) → Snake → Hawk. Each arrow means 'is eaten by'."
              ]
            },
            {
              id: "s3-l4", title: "What Would Happen If...? (Ecosystems)", emoji: "🌐", type: "💡",
              steps: [
                "An ECOSYSTEM is all the living things (plants and animals) AND non-living things (water, soil, air, sun) in a habitat working together.",
                "Everything in an ecosystem is CONNECTED. If one thing changes, everything else is affected!",
                "Example: if all the rabbits in a forest disappeared, what happens? Foxes (who eat rabbits) would go hungry. Grass (that rabbits eat) would grow out of control.",
                "This connection is called INTERDEPENDENCE — living things depend on each other to survive.",
                "Human impact: when we cut down forests, we destroy habitats. Animals lose their food, shelter, and water sources. This is why conservation matters!"
              ]
            },
            {
              id: "s3-l5", title: "Human Impact on Habitats", emoji: "🏭", type: "🌟",
              steps: [
                "Humans have changed more of Earth's habitats than any other species — and not always in good ways.",
                "DEFORESTATION: cutting down forests for farms, cities, and wood. This destroys habitats for millions of species.",
                "POLLUTION: plastics in the ocean harm fish and seabirds. Air pollution harms forest animals. Chemical runoff poisons rivers.",
                "CLIMATE CHANGE: warming temperatures melt Arctic ice, which polar bears need. Rising sea levels threaten coastal habitats.",
                "But humans can also HELP! Conservation areas protect habitats. Recycling reduces pollution. Planting trees restores forests. Every action — even small ones — counts!"
              ]
            },
          ],
          quiz: [
            { id: 9001, q: "What is a HABITAT?", opts: ["A type of food chain", "The natural place where a plant or animal lives", "A kind of adaptation", "A type of ecosystem graph"], ans: 1, diff: 1, topic: "Habitats", explain: "A habitat is the natural environment where an organism lives and finds everything it needs to survive." },
            { id: 9002, q: "Which animal is BEST adapted for the desert?", opts: ["Polar bear", "Penguin", "Camel", "Shark"], ans: 2, diff: 1, topic: "Adaptations", explain: "Camels are desert animals — they store fat in their humps, have thick eyelashes to block sand, and can survive days without water." },
            { id: 9003, q: "In a food chain, what is a PRODUCER?", opts: ["An animal that eats plants", "A plant that makes food from sunlight", "An animal that eats meat", "A consumer"], ans: 1, diff: 2, topic: "Food Chains", explain: "Producers are plants (and some bacteria) that make their own food using sunlight — they are ALWAYS first in a food chain." },
            { id: 9004, q: "Which habitat covers 71% of Earth's surface?", opts: ["Forest", "Desert", "Grassland", "Ocean"], ans: 3, diff: 1, topic: "Habitats", explain: "The ocean covers about 71% of Earth's surface, making it the largest habitat on our planet." },
            { id: 9005, q: "Why do polar bears have WHITE fur?", opts: ["To stay cool", "As camouflage in the snow", "Because they live near ice cream", "To attract mates"], ans: 1, diff: 1, topic: "Adaptations", explain: "White fur acts as CAMOUFLAGE — it blends in with the snow and ice, helping polar bears sneak up on prey." },
            { id: 9006, q: "In the food chain: Grass → Rabbit → Fox, the rabbit is a:", opts: ["Producer", "Herbivore/Consumer", "Carnivore", "Decomposer"], ans: 1, diff: 2, topic: "Food Chains", explain: "The rabbit eats grass (a plant), making it a HERBIVORE and a PRIMARY CONSUMER in this food chain." },
            { id: 9007, q: "What is DEFORESTATION?", opts: ["Planting new trees", "Cutting down forests", "Recycling paper", "Protecting wildlife"], ans: 1, diff: 1, topic: "Human Impact", explain: "Deforestation = cutting down forests. It destroys habitats, harms biodiversity, and contributes to climate change." },
            { id: 9008, q: "Fish are able to breathe underwater because they have:", opts: ["Lungs", "Gills", "Scales", "Fins"], ans: 1, diff: 1, topic: "Adaptations", explain: "Fish have GILLS — special organs that extract oxygen from water so fish can breathe underwater." },
            { id: 9009, q: "If all the plants in a food chain disappeared, what would happen?", opts: ["Animals would find other food easily", "Herbivores would starve, then carnivores too", "Nothing — animals don't need plants", "Only carnivores would be affected"], ans: 1, diff: 2, topic: "Ecosystems", explain: "Plants are producers at the BASE of every food chain. Without them, herbivores starve — and then the carnivores that eat herbivores starve too." },
            { id: 9010, q: "An ADAPTATION is:", opts: ["A type of habitat", "A feature that helps an organism survive in its environment", "A food chain link", "A type of ecosystem"], ans: 1, diff: 2, topic: "Adaptations", explain: "An adaptation is a special feature (or behaviour) that helps an animal or plant survive in its specific habitat." },
            { id: 9011, q: "Which habitat is home to lions, zebras, and bison?", opts: ["Ocean", "Arctic", "Desert", "Grassland"], ans: 3, diff: 2, topic: "Habitats", explain: "Grasslands (also called savanna, prairie, or steppe) are open, grassy environments home to large herds like zebras, bison, and their predators like lions." },
            { id: 9012, q: "What does the ARROW mean in a food chain (e.g., Grass → Rabbit)?", opts: ["'Is friends with'", "'Is the same as'", "'Is eaten by' / 'energy passes to'", "'Lives near'"], ans: 2, diff: 2, topic: "Food Chains", explain: "In a food chain, arrows show the direction energy flows. Grass → Rabbit means 'the rabbit eats the grass' / energy passes from grass to rabbit." },
            { id: 9013, q: "What is INTERDEPENDENCE in an ecosystem?", opts: ["Animals competing for food", "Living things depending on each other to survive", "Plants making food", "Animals migrating"], ans: 1, diff: 3, topic: "Ecosystems", explain: "Interdependence means all parts of an ecosystem depend on each other. Remove one part and it affects everything else." },
            { id: 9014, q: "Which of these HELPS protect habitats?", opts: ["Cutting down forests", "Dumping plastic in oceans", "Creating conservation areas", "Burning fossil fuels"], ans: 2, diff: 1, topic: "Human Impact", explain: "Conservation areas (like national parks and nature reserves) protect habitats from development and hunting." },
            { id: 9015, q: "Why do deep-sea fish sometimes GLOW in the dark?", opts: ["They eat luminous food", "It's an adaptation to attract prey or find mates in dark, deep water", "All fish glow", "To scare predators (trick question — they don't)"], ans: 1, diff: 3, topic: "Adaptations", explain: "Deep-sea fish have bioluminescence — they produce their own light. This helps them attract prey, find mates, and communicate in the pitch-black deep ocean." },
          ]
        },

        // ── UNIT 4: Earth's Materials & Land ──────────────────
        {
          id: "s4", title: "Earth's Materials & Land", emoji: "🌋",
          xp: 130, progress: 0,
          standard: "NGSS 2-ESS1-1 · 2-ESS2-1 · 2-ESS2-3",
          weeks: "Weeks 16–19",
          lessons: [
            {
              id: "s4-l1", title: "Rocks, Soil, and Minerals", emoji: "🪨", type: "📖",
              steps: [
                "Earth's surface is made of ROCKS. Rocks are made of MINERALS — natural solid materials with a specific chemical makeup.",
                "MINERALS are the building blocks of rocks. Common minerals: quartz (clear/white), feldspar (pink/white), mica (shiny flakes), calcite (white, found in limestone).",
                "SOIL is a mix of tiny broken rock pieces, water, air, and decomposed plant and animal material (humus). Soil takes THOUSANDS of years to form.",
                "Three types of soil: SANDY (good drainage, not great for plants), CLAY (holds water, heavy), LOAM (mix of sand, clay, and humus — BEST for growing plants).",
                "Scientists who study rocks and minerals are called GEOLOGISTS. They identify minerals by hardness, colour, streak, and shine (luster)."
              ]
            },
            {
              id: "s4-l2", title: "How Water Shapes the Land: Erosion", emoji: "💧", type: "📖",
              steps: [
                "EROSION is when rock and soil are worn away and carried to a new place by water, wind, ice, or gravity.",
                "Water erosion: rainwater flows downhill, picking up soil and rock particles and carrying them into rivers and streams. Over millions of years, this carved the Grand Canyon!",
                "Rivers transport eroded material downstream. Where rivers slow down (near the sea), they DROP the material — this builds up DELTAS.",
                "Wind erosion: in deserts, wind picks up sand and blasts rock surfaces. This is why desert rocks often have a smooth, rounded appearance.",
                "DEPOSITION is the opposite of erosion — when water or wind DROPS the material it was carrying. Together, erosion and deposition constantly reshape Earth's surface."
              ]
            },
            {
              id: "s4-l3", title: "Landforms", emoji: "⛰️", type: "💡",
              steps: [
                "LANDFORMS are the shapes and features on Earth's surface — mountains, valleys, plains, and more.",
                "MOUNTAIN: very high land, steep sides. Formed by tectonic plates pushing together over millions of years.",
                "VALLEY: low land between mountains or hills. Often formed by rivers cutting through rock over time.",
                "PLAIN: flat, low land. Very good for farming! The Great Plains in the US are famous for wheat and corn.",
                "PENINSULA: land that sticks out into water on THREE sides (like Florida or Italy). ISLAND: land completely surrounded by water on ALL sides."
              ]
            },
            {
              id: "s4-l4", title: "Maps and Reading Landforms", emoji: "🗺️", type: "💡",
              steps: [
                "A PHYSICAL MAP shows landforms (mountains, rivers, plains) and bodies of water using colours and symbols.",
                "Map colours: GREEN = low-lying land (plains). BROWN/TAN = high land (mountains and hills). BLUE = water (rivers, lakes, oceans).",
                "A MAP KEY (legend) explains what every colour and symbol means. ALWAYS check the key before reading a map!",
                "CONTOUR LINES on topographic maps connect points of equal elevation. Lines close together = steep slope. Lines far apart = gentle slope.",
                "The compass rose shows directions: N (North), S (South), E (East), W (West). Rivers always flow FROM high ground TO lower ground."
              ]
            },
            {
              id: "s4-l5", title: "Natural Resources and Conservation", emoji: "♻️", type: "🌟",
              steps: [
                "NATURAL RESOURCES are materials from Earth that humans use: water, soil, wood, metals, oil, coal, sunlight, and air.",
                "RENEWABLE resources can be replaced in a reasonable time: trees (if replanted), sunlight, wind, and water.",
                "NON-RENEWABLE resources take millions of years to form and will run out: oil, coal, natural gas, and most metals.",
                "CONSERVATION means using resources wisely so they last longer and causing as little damage as possible.",
                "What YOU can do: turn off lights (save electricity), take shorter showers (save water), recycle paper and plastic, don't waste food (saved through soil and water!)."
              ]
            },
          ],
          quiz: [
            { id: 10001, q: "Rocks are made of:", opts: ["Soil and mud", "Minerals", "Water and air", "Plants"], ans: 1, diff: 1, topic: "Rocks & Minerals", explain: "Rocks are made of one or more MINERALS. Minerals are natural solid materials — the building blocks of rocks." },
            { id: 10002, q: "What is EROSION?", opts: ["When rocks form from minerals", "When rock and soil are worn away and moved by water or wind", "When plants grow in soil", "When water freezes into ice"], ans: 1, diff: 1, topic: "Erosion", explain: "Erosion is the process of rock and soil being worn away and transported by water, wind, ice, or gravity." },
            { id: 10003, q: "Which type of soil is BEST for growing plants?", opts: ["Sandy soil", "Clay soil", "Loam soil", "Rocky soil"], ans: 2, diff: 2, topic: "Soil", explain: "Loam is the best soil for plants — it's a balanced mix of sand, clay, and humus (organic material) that holds moisture and nutrients." },
            { id: 10004, q: "What landform is COMPLETELY surrounded by water?", opts: ["Peninsula", "Cape", "Island", "Delta"], ans: 2, diff: 1, topic: "Landforms", explain: "An island is land completely surrounded by water on all sides. A peninsula only sticks into water on 3 sides." },
            { id: 10005, q: "On a physical map, what does the colour BLUE usually represent?", opts: ["Mountains", "Plains", "Forests", "Water (rivers, lakes, oceans)"], ans: 3, diff: 1, topic: "Maps", explain: "Blue on physical maps represents water — oceans, lakes, rivers, and other bodies of water." },
            { id: 10006, q: "What is DEPOSITION?", opts: ["When rocks form", "When erosion speeds up", "When water or wind DROPS the material it was carrying", "When volcanoes erupt"], ans: 2, diff: 2, topic: "Erosion", explain: "Deposition is when moving water or wind slows down and drops the material it was transporting. It's the opposite of erosion." },
            { id: 10007, q: "Which resource is NON-RENEWABLE?", opts: ["Wind energy", "Sunlight", "Coal", "Water"], ans: 2, diff: 2, topic: "Natural Resources", explain: "Coal is non-renewable — it takes millions of years to form from compressed ancient plants. Once used, it's gone." },
            { id: 10008, q: "What force carved the Grand Canyon over millions of years?", opts: ["Wind", "Earthquakes", "Water (the Colorado River)", "Volcanoes"], ans: 2, diff: 2, topic: "Erosion", explain: "The Colorado River's water erosion carved the Grand Canyon over approximately 5–6 million years." },
            { id: 10009, q: "A PENINSULA has water on:", opts: ["All 4 sides", "No sides", "1 side only", "3 sides"], ans: 3, diff: 2, topic: "Landforms", explain: "A peninsula is land that extends into water on THREE sides — like Florida, Italy, or South Korea." },
            { id: 10010, q: "What does a MAP KEY (legend) tell you?", opts: ["How far apart places are", "What the symbols and colours on the map mean", "The age of the map", "The height of mountains"], ans: 1, diff: 1, topic: "Maps", explain: "The map key (legend) explains what each symbol, colour, and marking on the map represents." },
            { id: 10011, q: "Which soil type drains water FASTEST and is found in beaches and deserts?", opts: ["Clay soil", "Sandy soil", "Loam soil", "Peat soil"], ans: 1, diff: 2, topic: "Soil", explain: "Sandy soil has large particles with big gaps between them, so water drains through it very quickly." },
            { id: 10012, q: "What is CONSERVATION?", opts: ["Using as many resources as possible", "Using resources wisely to make them last and reduce damage", "Discovering new minerals", "Building new landforms"], ans: 1, diff: 1, topic: "Natural Resources", explain: "Conservation means using natural resources carefully and wisely so they last longer and cause minimum environmental damage." },
            { id: 10013, q: "Rivers always flow from ___ to ___ ground.", opts: ["Low, high", "High, low", "Flat, steep", "Wet, dry"], ans: 1, diff: 2, topic: "Erosion", explain: "Gravity pulls water downhill. Rivers always flow from HIGH ground (mountains) to LOW ground (sea or lake)." },
            { id: 10014, q: "Which is a RENEWABLE resource?", opts: ["Oil", "Natural gas", "Coal", "Sunlight"], ans: 3, diff: 1, topic: "Natural Resources", explain: "Sunlight is renewable — the sun will keep producing energy for billions more years. Oil, gas, and coal take millions of years to form." },
            { id: 10015, q: "On a topographic map, contour lines CLOSE TOGETHER indicate:", opts: ["Flat land", "A gentle slope", "A steep slope", "A valley bottom"], ans: 2, diff: 3, topic: "Maps", explain: "Close contour lines mean elevation changes rapidly over a short distance = a STEEP slope." },
          ]
        },

        // ── UNIT 5: Weather & Sky ─────────────────────────────
        {
          id: "s5", title: "Weather & Sky", emoji: "⛅",
          xp: 130, progress: 0,
          standard: "NGSS 2-ESS2-1 · 2-PS1-1",
          weeks: "Weeks 20–23",
          lessons: [
            {
              id: "s5-l1", title: "Types of Weather and Measurement Tools", emoji: "🌡️", type: "📖",
              steps: [
                "WEATHER is what the atmosphere (air around Earth) is doing right now — it changes from day to day!",
                "Types of weather: sunny, cloudy, rainy, snowy, windy, foggy, stormy, icy, humid.",
                "THERMOMETER: measures TEMPERATURE in degrees Celsius (°C) or Fahrenheit (°F). Higher number = warmer.",
                "RAIN GAUGE: measures how much RAIN fell. WIND VANE: shows which DIRECTION the wind is coming FROM. ANEMOMETER: measures WIND SPEED.",
                "BAROMETER: measures air PRESSURE. Falling pressure often means bad weather coming; rising pressure means better weather!"
              ]
            },
            {
              id: "s5-l2", title: "Seasonal Weather Patterns", emoji: "🍂", type: "📖",
              steps: [
                "A SEASON is a time of year with a typical kind of weather. The 4 seasons are Spring, Summer, Autumn, and Winter.",
                "SPRING: warming up, flowers bloom, rain is common, animals have babies, trees get new leaves.",
                "SUMMER: hottest season, long sunny days, less rain in many places, lots of outdoor activities.",
                "AUTUMN (Fall): cooling down, leaves change colour and fall, days get shorter, animals prepare for winter.",
                "WINTER: coldest season, possible snow and ice, shortest days, many animals hibernate or migrate.",
                "Seasons are caused by Earth's TILT as it orbits the Sun — not by how close Earth is to the Sun!"
              ]
            },
            {
              id: "s5-l3", title: "The Sun, Moon, and Stars", emoji: "☀️", type: "💡",
              steps: [
                "The SUN is a STAR — a huge ball of hot gas that produces energy through nuclear fusion.",
                "The Sun is the centre of our solar system. It's 150 million km from Earth, and its light takes 8 minutes to reach us!",
                "The MOON is Earth's natural satellite. It doesn't make its own light — it REFLECTS sunlight.",
                "Moon phases: as the Moon orbits Earth (~29.5 days), we see different amounts of its lit side. New Moon → Crescent → Quarter → Gibbous → Full Moon → back.",
                "STARS look tiny because they are incredibly far away. Even the closest star (Proxima Centauri) is 4.2 LIGHT YEARS away — the light we see left 4.2 years ago!"
              ]
            },
            {
              id: "s5-l4", title: "Weather Safety", emoji: "⚡", type: "💡",
              steps: [
                "Different severe weather events require different safety responses — knowing them could save your life!",
                "THUNDERSTORM safety: go inside. Stay away from windows, tall trees, and metal. Never go in a swimming pool or lake during lightning!",
                "TORNADO safety: go to the lowest floor of a building, away from windows, into a small room (closet or bathroom). If outside, lie flat in a ditch.",
                "HURRICANE safety: evacuate (leave) if told to. Board up windows. Have an emergency kit: water, food, first aid, flashlight, batteries.",
                "BLIZZARD safety: stay inside. Keep warm. Don't drive in blizzard conditions. Have extra food, water, and blankets at home."
              ]
            },
            {
              id: "s5-l5", title: "Patterns in the Sky", emoji: "🌙", type: "🌟",
              steps: [
                "Scientists look for PATTERNS in the sky — things that happen regularly and predictably.",
                "DAILY pattern: the Sun appears to rise in the East every morning and set in the West every evening. This happens because Earth ROTATES (spins) every 24 hours.",
                "MONTHLY pattern: the Moon goes through all its phases (new moon to full moon and back) every 29.5 days.",
                "YEARLY pattern: seasons repeat the same order every year (Spring → Summer → Autumn → Winter → Spring) because of Earth's orbit around the Sun.",
                "Stars also have yearly patterns — different constellations are visible in different seasons because Earth's position in its orbit changes."
              ]
            },
          ],
          quiz: [
            { id: 11001, q: "What tool measures TEMPERATURE?", opts: ["Rain gauge", "Barometer", "Thermometer", "Anemometer"], ans: 2, diff: 1, topic: "Weather Tools", explain: "A THERMOMETER measures temperature in degrees Celsius or Fahrenheit." },
            { id: 11002, q: "Which season has the LONGEST days and hottest temperatures?", opts: ["Spring", "Summer", "Autumn", "Winter"], ans: 1, diff: 1, topic: "Seasons", explain: "Summer has the longest days (most hours of sunlight) and is the hottest season of the year." },
            { id: 11003, q: "The Moon makes its OWN light. True or False?", opts: ["True", "False — it reflects the Sun's light", "True at night only", "Depends on the phase"], ans: 1, diff: 1, topic: "Moon", explain: "The Moon does NOT make its own light. It REFLECTS sunlight from the Sun back toward Earth." },
            { id: 11004, q: "What causes seasons on Earth?", opts: ["Distance from the Sun changing", "Earth's tilt as it orbits the Sun", "The Moon's gravity", "Clouds blocking sunlight"], ans: 1, diff: 2, topic: "Seasons", explain: "Seasons are caused by Earth's TILT (23.5°) as it orbits the Sun. This changes how directly the Sun's rays hit each hemisphere." },
            { id: 11005, q: "What should you do during a TORNADO?", opts: ["Go to the roof", "Stand near windows to watch it", "Go to the lowest floor, away from windows", "Run outside"], ans: 2, diff: 2, topic: "Weather Safety", explain: "During a tornado, go to the LOWEST level of the building (basement if possible), into a small room away from windows." },
            { id: 11006, q: "The Sun appears to RISE in the ___.", opts: ["North", "South", "East", "West"], ans: 2, diff: 1, topic: "Sky Patterns", explain: "The Sun rises in the EAST every morning and sets in the WEST every evening, due to Earth's west-to-east rotation." },
            { id: 11007, q: "What does a RAIN GAUGE measure?", opts: ["Wind speed", "Temperature", "Amount of rainfall", "Air pressure"], ans: 2, diff: 1, topic: "Weather Tools", explain: "A rain gauge measures how much rain has fallen over a period of time." },
            { id: 11008, q: "In which season do leaves change colour and fall from trees?", opts: ["Spring", "Summer", "Autumn", "Winter"], ans: 2, diff: 1, topic: "Seasons", explain: "Autumn (Fall) is when many trees change to red, orange, and yellow and drop their leaves before winter." },
            { id: 11009, q: "How long does it take the Moon to go through all its phases?", opts: ["1 week", "14 days", "29.5 days", "365 days"], ans: 2, diff: 2, topic: "Moon", explain: "The Moon completes a full cycle of phases (New Moon back to New Moon) in approximately 29.5 days." },
            { id: 11010, q: "A BAROMETER that shows FALLING pressure means:", opts: ["Better weather is coming", "Bad weather may be coming", "No change in weather", "It's winter"], ans: 1, diff: 3, topic: "Weather Tools", explain: "Falling air pressure often signals an approaching storm or bad weather. Rising pressure usually means improving, clearer weather." },
            { id: 11011, q: "The Sun rises in the East because:", opts: ["The Sun moves around Earth", "Earth rotates (spins) from west to east", "The Moon pulls the Sun", "Seasons change the Sun's position"], ans: 1, diff: 2, topic: "Sky Patterns", explain: "Earth rotates on its axis from west to east. This makes the Sun APPEAR to move from east to west across our sky." },
            { id: 11012, q: "Which weather event requires you to EVACUATE if officials tell you to?", opts: ["Light rain", "Tornado warning", "Hurricane", "Both B and C"], ans: 3, diff: 2, topic: "Weather Safety", explain: "Both tornadoes and hurricanes can require evacuation. However, hurricanes usually give more advance warning and officials may order evacuation of whole areas." },
            { id: 11013, q: "Stars look small in the night sky because:", opts: ["They ARE very small", "They are incredibly FAR away", "The atmosphere shrinks them", "They only appear small at night"], ans: 1, diff: 2, topic: "Stars", explain: "Stars are actually ENORMOUS — our Sun is a medium-sized star. They look tiny because they are incredibly far away (light-years away)." },
            { id: 11014, q: "What sky pattern repeats DAILY?", opts: ["Moon phases", "The Sun rising and setting", "Seasons", "Shooting stars"], ans: 1, diff: 1, topic: "Sky Patterns", explain: "The Sun rising in the East and setting in the West is a daily pattern — it happens every single day because Earth rotates every 24 hours." },
            { id: 11015, q: "In SPRING, what changes can you observe?", opts: ["Days get shorter, leaves fall", "Temperatures drop, animals hibernate", "Warming up, flowers bloom, animals have babies", "Coldest temperatures, possible snow"], ans: 2, diff: 1, topic: "Seasons", explain: "Spring brings warming temperatures, blooming flowers, new animal babies, and trees growing new leaves." },
          ]
        },

        // ── UNIT 6: Science Showcase & Review ─────────────────
        {
          id: "s6", title: "Science Showcase & Review", emoji: "🏅",
          xp: 200, progress: 0,
          standard: "All 2nd Grade NGSS Standards",
          weeks: "Week 24",
          lessons: [
            {
              id: "s6-l1", title: "Matter Review", emoji: "🧪", type: "📖",
              steps: [
                "Let's review everything about matter! Matter is anything that has mass and takes up space.",
                "3 states: SOLID (definite shape), LIQUID (takes shape of container), GAS (fills entire container).",
                "Changes of state: melting (solid→liquid), freezing (liquid→solid), evaporation (liquid→gas), condensation (gas→liquid).",
                "Reversible changes can be undone (melting ice). Irreversible changes cannot (burning wood).",
                "Properties help us describe and sort matter: colour, texture, size, shape, mass, and state."
              ]
            },
            {
              id: "s6-l2", title: "Life Cycles Review", emoji: "🌱", type: "📖",
              steps: [
                "All living things have life cycles: born/germinate → grow → reproduce → die.",
                "Plant life cycle: seed → germination → seedling → mature plant → flower → seeds.",
                "Butterfly: egg → caterpillar → chrysalis → butterfly (COMPLETE metamorphosis, 4 stages).",
                "Frog: egg → tadpole → froglet → adult frog (INCOMPLETE metamorphosis, 3 stages).",
                "Birds and mammals: hatch or born → juvenile → adult (look like smaller versions of adults throughout)."
              ]
            },
            {
              id: "s6-l3", title: "Habitats and Earth Review", emoji: "🌍", type: "💡",
              steps: [
                "Major habitats: ocean, forest, desert, grassland, Arctic. Each has unique plants and animals.",
                "Adaptations help organisms survive in their habitat — white fur for Arctic, humps for desert, gills for water.",
                "Food chains: producer (plant) → herbivore → carnivore. Energy flows along the chain.",
                "Rocks are made of minerals. Soil takes thousands of years to form. Erosion wears away land; deposition builds it up.",
                "Renewable resources (wind, solar) vs non-renewable (coal, oil). Conservation protects both!"
              ]
            },
            {
              id: "s6-l4", title: "Weather and Sky Review", emoji: "⛅", type: "💡",
              steps: [
                "Weather tools: thermometer (temperature), rain gauge (rainfall), barometer (pressure), wind vane (direction), anemometer (wind speed).",
                "Seasons: Spring (warm, new life), Summer (hot, long days), Autumn (cooling, leaves fall), Winter (cold, short days).",
                "The Sun is a star; the Moon reflects sunlight. The Sun rises East and sets West — daily pattern from Earth's rotation.",
                "Moon phases complete a cycle every 29.5 days. Seasons repeat yearly due to Earth's orbital tilt.",
                "Weather safety: tornado → lowest floor; hurricane → evacuate; blizzard → stay inside."
              ]
            },
            {
              id: "s6-l5", title: "Science in Your World", emoji: "🔬", type: "🌟",
              steps: [
                "Science isn't just in school — it's happening EVERYWHERE around you every single day!",
                "When you cook food → chemistry (changes of state, irreversible changes).",
                "When it rains → the water cycle in action (evaporation, condensation, precipitation).",
                "When leaves turn in Autumn → plant biology responding to shorter days and temperature.",
                "When you use your phone → physics (electricity, screens). When you eat → biology (digestion is chemistry!).",
                "Ask questions, observe carefully, test your ideas, and share what you find. THAT is what scientists do!"
              ]
            },
          ],
          quiz: [
            { id: 12001, q: "What are the three states of matter?", opts: ["Hot, warm, cold", "Solid, liquid, gas", "Water, air, fire", "Big, medium, small"], ans: 1, diff: 1, topic: "Matter Review", explain: "The three states of matter are SOLID (fixed shape), LIQUID (takes shape of container), and GAS (fills container)." },
            { id: 12002, q: "A butterfly life cycle has how many stages?", opts: ["2", "3", "4", "5"], ans: 2, diff: 1, topic: "Life Cycles Review", explain: "Butterfly: Egg → Caterpillar → Chrysalis → Adult = 4 stages (complete metamorphosis)." },
            { id: 12003, q: "Which habitat has the MOST biodiversity (most types of species)?", opts: ["Desert", "Arctic", "Tropical rainforest", "Grassland"], ans: 2, diff: 2, topic: "Habitats Review", explain: "Tropical rainforests have the highest biodiversity on Earth — they cover about 6% of land but contain over 50% of all plant and animal species!" },
            { id: 12004, q: "What tool measures how fast the wind is blowing?", opts: ["Barometer", "Thermometer", "Wind vane", "Anemometer"], ans: 3, diff: 2, topic: "Weather Review", explain: "An ANEMOMETER measures wind SPEED. A wind vane shows wind DIRECTION — these are two different things!" },
            { id: 12005, q: "What causes day and night?", opts: ["Earth orbiting the Sun", "The Moon blocking the Sun", "Earth ROTATING (spinning) on its axis", "Clouds covering the Sun"], ans: 2, diff: 2, topic: "Sky Review", explain: "Day and night are caused by Earth ROTATING on its axis every 24 hours. The side facing the Sun has day; the side facing away has night." },
            { id: 12006, q: "In a food chain, which organism is ALWAYS the producer?", opts: ["A large animal", "A predator", "A plant", "A decomposer"], ans: 2, diff: 1, topic: "Habitats Review", explain: "Producers are always PLANTS (or organisms that photosynthesise). They produce food from sunlight — the base of every food chain." },
            { id: 12007, q: "Rocks that form from cooled volcanic lava are called:", opts: ["Sedimentary rocks", "Metamorphic rocks", "Igneous rocks", "Mineral rocks"], ans: 2, diff: 3, topic: "Earth Review", explain: "IGNEOUS rocks form when molten lava or magma cools and solidifies. Examples: basalt, granite, obsidian." },
            { id: 12008, q: "Which change is REVERSIBLE?", opts: ["Burning wood", "Cooking an egg", "Rusting iron", "Melting chocolate"], ans: 3, diff: 2, topic: "Matter Review", explain: "Melting chocolate is reversible — you can melt it, then cool it and it solidifies again into chocolate." },
            { id: 12009, q: "What happens to most deciduous trees in WINTER?", opts: ["They grow new leaves", "They flower", "They lose their leaves and go dormant", "They produce fruit"], ans: 2, diff: 1, topic: "Weather Review", explain: "Deciduous trees lose their leaves in autumn/winter to conserve energy and water. They go dormant (like sleep) until spring." },
            { id: 12010, q: "What is the water cycle process where water vapour turns back into liquid droplets to form clouds?", opts: ["Evaporation", "Precipitation", "Condensation", "Erosion"], ans: 2, diff: 2, topic: "Weather Review", explain: "CONDENSATION is when water vapour (gas) cools and becomes tiny water droplets — this forms clouds!" },
            { id: 12011, q: "An adaptation that helps an arctic fox survive is:", opts: ["Its bright coloured fur", "Its thick white fur that camouflages in snow", "Its ability to swim underwater", "Its large ears that cool it down"], ans: 1, diff: 2, topic: "Habitats Review", explain: "Arctic foxes have thick white fur. White = camouflage in snow. Thick = insulation against extreme cold." },
            { id: 12012, q: "What is the MAIN difference between complete and incomplete metamorphosis?", opts: ["Number of eggs laid", "Whether there is a pupa (chrysalis) stage", "Whether it happens in water", "Speed of growth"], ans: 1, diff: 3, topic: "Life Cycles Review", explain: "Complete metamorphosis has 4 stages INCLUDING a pupa stage (egg, larva, pupa, adult). Incomplete has 3 stages with NO pupa (egg, nymph, adult)." },
            { id: 12013, q: "What do all living things need to survive?", opts: ["Only sunlight", "Only water", "Food/energy, water, air, and suitable temperature", "Only soil"], ans: 2, diff: 1, topic: "Life Cycles Review", explain: "All living things need food (energy), water, air, and an appropriate temperature range to survive and grow." },
            { id: 12014, q: "Why is SOIL important to life on Earth?", opts: ["It provides water for the ocean", "It supports plant growth, which feeds most life on Earth", "It is a source of sunlight", "It creates weather patterns"], ans: 1, diff: 2, topic: "Earth Review", explain: "Soil is essential because it supports plant growth. Plants feed herbivores, which feed carnivores — and provide oxygen for all animals. No soil = no plants = no life as we know it!" },
            { id: 12015, q: "What is the correct order of the water cycle?", opts: ["Precipitation → Evaporation → Condensation", "Condensation → Precipitation → Evaporation", "Evaporation → Condensation → Precipitation", "Precipitation → Condensation → Evaporation"], ans: 2, diff: 3, topic: "Weather Review", explain: "Water EVAPORATES (turns to vapour) → rises and CONDENSES (forms clouds) → falls as PRECIPITATION (rain/snow). Then the cycle repeats!" },
          ]
        },

      ] // end Science units
    },

    // ─────────────────────────────────────────────────────────────
    // ENGLISH & SOCIAL STUDIES — placeholders (coming in next build)
    // ─────────────────────────────────────────────────────────────
    English: {
      color: "#FF10F0",
      units: []
    },
    SocialStudies: {
      color: "#FFD700",
      units: []
    },
  }
};

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────
export function getQuizBank(grade, subject) {
  const gradeData = CURRICULUM[grade];
  if (!gradeData) return [];
  const subjectData = gradeData[subject];
  if (!subjectData) return [];
  return subjectData.units.flatMap(u => u.quiz || []);
}

export function getUnits(grade, subject) {
  return CURRICULUM[grade]?.[subject]?.units || [];
}

export function getSubjectColor(grade, subject) {
  return CURRICULUM[grade]?.[subject]?.color || "#00D4FF";
}
