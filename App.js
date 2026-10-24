import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView, ScrollView, View, Text, TextInput, Pressable,
  StyleSheet, StatusBar, Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const C = {
  bg: "#08111F", panel: "#111F33", panel2: "#182B45", border: "#2A405D",
  text: "#F4F7FC", muted: "#A7B7CC", green: "#50E3A4", blue: "#84A8FF",
  red: "#FF828C", yellow: "#FFD479"
};

const COURSES = [
  { id:"foundations", category:"FOUNDATIONS", level:"Beginner", title:"Trading & Investing Foundations", lessons:[
    { title:"Trading vs investing", minutes:5, body:"Trading usually focuses on buying and selling over shorter periods. Investing usually focuses on building value over longer periods. Both involve uncertainty, and neither guarantees a profit.", points:["Know your goal and time horizon.","Understand the difference between price movement and business value.","Never risk money you cannot afford to lose."] },
    { title:"How markets work", minutes:6, body:"Financial markets connect buyers and sellers. Prices change as orders, expectations, available information, and liquidity change. A quoted price does not guarantee that every order will execute at that price.", points:["Learn what an exchange and a broker do.","Understand bid, ask, spread, and liquidity.","Prices can move quickly in volatile markets."] },
    { title:"Order types", minutes:6, body:"A market order seeks execution at the best available prices, but the final price can differ from what you expected. A limit order specifies the price you are willing to accept, but it may not execute.", points:["Market orders prioritize execution, not a guaranteed price.","Limit orders set a price limit, not a guarantee of execution.","Learn order rules before using any platform."] },
    { title:"Risk and return", minutes:7, body:"Higher potential returns generally come with meaningful uncertainty and risk. Diversification can reduce concentration risk, but cannot eliminate market risk. Past performance does not guarantee future results.", points:["Think about possible losses before possible gains.","Avoid borrowing to speculate.","Be wary of guaranteed-return claims."] }
  ]},
  { id:"stocks", category:"STOCKS", level:"Beginner → Intermediate", title:"Stocks & Equity Markets", lessons:[
    { title:"What is a stock?", minutes:5, body:"A stock generally represents ownership in a company. Shareholders may benefit if the business grows, but share prices can fall and dividends are not guaranteed.", points:["Understand shares and market capitalization.","Learn the difference between common and preferred shares.","Company quality does not make every price attractive."] },
    { title:"Reading financial statements", minutes:8, body:"The income statement describes performance over a period, the balance sheet summarizes assets and liabilities at a point in time, and the cash-flow statement tracks cash movement.", points:["Revenue is not the same as profit.","Debt and cash flow matter alongside earnings.","Compare companies carefully and check reporting periods."] },
    { title:"Valuation basics", minutes:8, body:"Valuation estimates what a business or asset may be worth under assumptions. Ratios such as price-to-earnings can help compare companies, but ratios vary by industry and do not give a complete answer alone.", points:["A low ratio is not automatically a bargain.","Check assumptions and industry context.","Valuations are estimates, not certainties."] },
    { title:"Dividends and corporate actions", minutes:6, body:"Some companies distribute part of their earnings as dividends; others reinvest. Dividends can change or stop. Stock splits change the number of shares and price per share, but do not by themselves create value.", points:["Dividend payments are not guaranteed.","Learn ex-dividend and record dates.","Understand splits, buybacks, and dilution."] }
  ]},
  { id:"funds", category:"FUNDS & INDICES", level:"Beginner → Intermediate", title:"ETFs, Funds & Indices", lessons:[
    { title:"Market indices", minutes:5, body:"An index tracks a defined group of securities according to a methodology. It is a measurement, not necessarily an asset you can buy directly.", points:["Understand what the index includes.","Weighting methods affect performance.","An index cannot represent every market segment."] },
    { title:"Mutual funds and ETFs", minutes:7, body:"Funds pool investments according to a stated strategy. ETFs trade on exchanges; mutual funds are generally bought or sold using fund-specific procedures. Fees, tracking differences, and holdings matter.", points:["Read the fund objective and holdings.","Compare fees and tracking error.","Diversification does not remove all risk."] }
  ]},
  { id:"forex", category:"FOREX", level:"Intermediate", title:"Foreign Exchange (Forex)", lessons:[
    { title:"Currency pairs and pips", minutes:7, body:"Forex quotes one currency against another. In a pair, the first currency is the base and the second is the quote currency. A pip is a conventional unit for describing some exchange-rate movements; conventions can differ.", points:["Learn base and quote currencies.","Understand spread, lot size, and transaction costs.","Currency values are influenced by many changing factors."] },
    { title:"Central banks and macroeconomics", minutes:8, body:"Interest rates, inflation, employment, trade, and central-bank decisions can influence currency markets. Market expectations may matter as much as the announced figure.", points:["Compare expectations with reported data.","Events can cause sudden price movements.","Do not assume news has a predictable effect."] },
    { title:"Leverage in forex", minutes:6, body:"Leverage allows a larger position relative to the funds committed. It magnifies exposure and can amplify losses rapidly. Some products may have special rules or restrictions depending on location.", points:["Understand margin and liquidation rules.","Do not confuse leverage with skill.","Practice only in a simulator while learning."] }
  ]},
  { id:"crypto", category:"CRYPTO", level:"Beginner → Advanced", title:"Cryptocurrency & Blockchain", lessons:[
    { title:"Blockchain basics", minutes:7, body:"A blockchain is a type of shared ledger maintained according to a network's rules. Different networks use different mechanisms, trade-offs, and security assumptions.", points:["Learn wallets, public addresses, and private keys.","A token and its underlying network are not the same thing.","Technical design does not guarantee economic value."] },
    { title:"Crypto risks and security", minutes:7, body:"Crypto assets can be volatile and may involve custody, fraud, software, liquidity, and regulatory risks. Transactions may be irreversible. A promise of guaranteed returns is a warning sign.", points:["Never share seed phrases or private keys.","Verify information independently.","Understand local laws and tax obligations."] }
  ]},
  { id:"commodities", category:"COMMODITIES", level:"Intermediate", title:"Gold, Oil & Commodities", lessons:[
    { title:"What are commodities?", minutes:6, body:"Commodities include raw materials such as energy products, metals, and agricultural goods. Prices can be affected by supply, demand, weather, inventories, geopolitics, and storage costs.", points:["Spot prices and futures prices can differ.","Understand the specific contract or product.","Commodity exposure can be volatile."] },
    { title:"Futures curve and roll costs", minutes:8, body:"Futures contracts have expiration dates. Differences between near and later contracts can affect the returns of products that repeatedly roll contracts. This is one reason futures-based returns may differ from spot-price changes.", points:["Know contract size and expiration.","Learn contango and backwardation.","Read product documents before evaluating exposure."] }
  ]},
  { id:"derivatives", category:"DERIVATIVES", level:"Advanced", title:"Options, Futures & Derivatives", lessons:[
    { title:"Futures contracts", minutes:8, body:"A futures contract is an agreement tied to a specified underlying asset or benchmark for a future date. Contracts can involve margin and substantial risk; contract details and settlement rules matter.", points:["Learn notional value and margin.","Understand expiry and settlement.","Losses can exceed an initial deposit in some products."] },
    { title:"Options: calls and puts", minutes:9, body:"An option gives its buyer a right, but not an obligation, under specified contract terms. Calls and puts have different payoff structures. Option prices are affected by the underlying price, time, volatility, and other factors.", points:["Learn strike, premium, expiry, and exercise.","Buying options can lose the entire premium.","Some option strategies have complex or large risks."] },
    { title:"Greeks and implied volatility", minutes:9, body:"Option Greeks describe sensitivities to factors such as underlying price, time, and volatility. They are estimates based on models and conditions; they do not guarantee how an option will behave.", points:["Delta approximates sensitivity to underlying price.","Theta describes time decay in a model.","Vega describes sensitivity to implied volatility."] }
  ]},
  { id:"analysis", category:"ANALYSIS", level:"Intermediate → Advanced", title:"Technical & Fundamental Analysis", lessons:[
    { title:"Candlesticks and trends", minutes:7, body:"Candlesticks summarize open, high, low, and close prices for a time period. Charts can help describe historical behaviour, but patterns do not guarantee future price movement.", points:["Learn trend, range, support, and resistance as concepts.","Choose a time frame consciously.","Avoid treating patterns as certainties."] },
    { title:"Indicators and their limits", minutes:7, body:"Indicators transform price or volume data into summaries. Many are based on past data and can lag or generate false signals, especially in changing market conditions.", points:["Learn what an indicator measures.","Avoid stacking indicators without a reason.","Test ideas carefully and account for costs."] },
    { title:"Fundamental analysis", minutes:8, body:"Fundamental analysis studies factors that may influence an asset's value, such as business performance, economic conditions, or the structure of a market. Estimates rely on assumptions and incomplete information.", points:["Separate facts from assumptions.","Compare multiple sources.","Update conclusions when evidence changes."] }
  ]},
  { id:"discipline", category:"RISK & DISCIPLINE", level:"All levels", title:"Risk Management & Psychology", lessons:[
    { title:"Position sizing", minutes:8, body:"Position sizing is about deciding how much exposure to take. A plan should consider the potential loss, volatility, liquidity, and the possibility that an exit may not occur at the intended price.", points:["Define risk before a simulated trade.","Include fees and slippage in practice.","A stop order cannot guarantee an exact exit price."] },
    { title:"Trading journal and backtesting", minutes:8, body:"A journal records the reasoning and outcome of decisions. Backtesting evaluates a rule on historical data, but can be distorted by overfitting, missing costs, survivorship bias, or unrealistic execution assumptions.", points:["Record the plan, not just the result.","Keep a sample large enough to evaluate cautiously.","Past simulated performance does not guarantee future results."] },
    { title:"Behavioural mistakes", minutes:6, body:"Overconfidence, loss aversion, fear of missing out, and chasing losses can distort decisions. A process with clear rules, review, and breaks can help learners notice these patterns.", points:["Do not chase losses.","Avoid making decisions under pressure.","Learning to stop is part of risk management."] }
  ]}
];

const QUESTIONS = [
  { q:"What does a stock generally represent?", options:["Guaranteed profit","Ownership in a company","A fixed bank deposit","A currency pair"], a:1, why:"A stock generally represents a share of ownership in a company." },
  { q:"What is true about a limit order?", options:["It always executes","It guarantees a profit","It sets a price limit but may not execute","It removes market risk"], a:2, why:"A limit order specifies a price boundary, but there may not be a matching order." },
  { q:"What does diversification do?", options:["Guarantees gains","Spreads exposure across holdings","Eliminates all risk","Predicts prices"], a:1, why:"Diversification can reduce concentration risk, but cannot remove all market risk." },
  { q:"What can leverage do?", options:["Magnify gains and losses","Stop volatility","Guarantee a return","Remove fees"], a:0, why:"Leverage increases exposure and can magnify losses as well as gains." },
  { q:"What is a blockchain?", options:["A guaranteed investment","A type of shared digital ledger","A stock exchange only","A bank account"], a:1, why:"Blockchains maintain shared records according to network-specific rules." },
  { q:"What does a call option give its buyer?", options:["An obligation to buy any stock","A guaranteed return","A right to buy under specified terms","Unlimited protection"], a:2, why:"A call option gives the buyer a right to buy the underlying under the contract terms, not an obligation." },
  { q:"What does a candlestick show?", options:["Guaranteed future prices","Open, high, low, and close for a period","Company profits only","A broker's fees only"], a:1, why:"Candlesticks summarize open, high, low, and close prices for a selected period." },
  { q:"Which statement about backtesting is correct?", options:["It guarantees future performance","It makes costs irrelevant","It can be distorted by overfitting and unrealistic assumptions","It removes all risk"], a:2, why:"Historical tests can be misleading if assumptions are unrealistic or a strategy is overfit." },
  { q:"What is a warning sign?", options:["Reading product documents","Keeping a learning journal","A claim of guaranteed trading profits","Comparing fees"], a:2, why:"Trading returns are uncertain. Guaranteed-profit claims are a warning sign." },
  { q:"What is the purpose of a trading journal?", options:["To guarantee a win","To record decisions and review learning","To predict every move","To replace risk controls"], a:1, why:"A journal helps review reasoning, process, and outcomes over time." }
];

const SIM_ASSETS = [
  { symbol:"EDU1", name:"Example Stock A", price:100 },
  { symbol:"EDU2", name:"Example Stock B", price:65 },
  { symbol:"FX01", name:"Example Currency Unit", price:1.25 },
  { symbol:"CM01", name:"Example Commodity Unit", price:80 },
  { symbol:"CR01", name:"Example Digital Asset", price:40 }
];

const formatMoney = n => "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 });

function Btn({ title, onPress, secondary=false, danger=false, disabled=false }) {
  return <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled}
    style={({pressed}) => [styles.btn, secondary && styles.btnSecondary, danger && styles.btnDanger, disabled && styles.btnDisabled, pressed && !disabled && {opacity:0.78}]}>
    <Text style={[styles.btnText, secondary && {color:C.text}, danger && {color:C.text}, disabled && {color:C.muted}]}>{title}</Text>
  </Pressable>;
}
function Panel({ children, style }) { return <View style={[styles.panel, style]}>{children}</View>; }
function Heading({ title, subtitle }) { return <View style={{gap:5, marginBottom:4}}><Text style={styles.h1}>{title}</Text>{subtitle ? <Text style={styles.muted}>{subtitle}</Text> : null}</View>; }

export default function App() {
  const [tab, setTab] = useState("Home");
  const [search, setSearch] = useState("");
  const [completed, setCompleted] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [cash, setCash] = useState(10000);
  const [holdings, setHoldings] = useState({});
  const [trades, setTrades] = useState(0);
  const [selected, setSelected] = useState(SIM_ASSETS[0].symbol);
  const [quantity, setQuantity] = useState("1");
  const [notice, setNotice] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [courseOpen, setCourseOpen] = useState(null);
  const [lessonOpen, setLessonOpen] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("tradewise-free-v1");
        if (raw) {
          const d = JSON.parse(raw);
          setCompleted(Array.isArray(d.completed) ? d.completed : []);
          setBookmarks(Array.isArray(d.bookmarks) ? d.bookmarks : []);
          setBestScore(Number(d.bestScore) || 0);
          setCash(typeof d.cash === "number" ? d.cash : 10000);
          setHoldings(d.holdings && typeof d.holdings === "object" ? d.holdings : {});
          setTrades(Number(d.trades) || 0);
        }
      } catch (e) {
        console.warn("Could not load local progress", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem("tradewise-free-v1", JSON.stringify({
      completed, bookmarks, bestScore, cash, holdings, trades
    })).catch(e => console.warn("Could not save progress", e));
  }, [loaded, completed, bookmarks, bestScore, cash, holdings, trades]);

  const allLessons = useMemo(() => COURSES.flatMap(course =>
    course.lessons.map((lesson, index) => ({
      ...lesson, courseId:course.id, courseTitle:course.title,
      courseCategory:course.category, id:`${course.id}-${index}`
    }))
  ), []);
  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COURSES.map(course => ({
      ...course,
      lessons: course.lessons.map((lesson, index) => ({
        ...lesson, id:`${course.id}-${index}`, courseId:course.id, courseTitle:course.title
      })).filter(lesson => !q || (course.title+" "+course.category+" "+lesson.title+" "+lesson.body.map(x=>x.text).join(" ")).toLowerCase().includes(q))
    })).filter(course => !q || course.lessons.length > 0 || course.title.toLowerCase().includes(q));
  }, [search]);
  const chosenAsset = SIM_ASSETS.find(a => a.symbol === selected) || SIM_ASSETS[0];
  const holdingsValue = SIM_ASSETS.reduce((sum, a) => sum + (holdings[a.symbol] || 0) * a.price, 0);
  const totalValue = cash + holdingsValue;
  const progress = Math.round(completed.length / allLessons.length * 100);

  function completeLesson(id) {
    setCompleted(old => old.includes(id) ? old : [...old, id]);
  }
  function toggleBookmark(id) {
    setBookmarks(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  }
  function answerQuestion(index) {
    if (quizAnswered) return;
    setQuizChoice(index);
    setQuizAnswered(true);
    if (index === QUESTIONS[quizIndex].a) {
      const nextScore = quizScore + 1;
      setQuizScore(nextScore);
      setBestScore(old => Math.max(old, nextScore));
    }
  }
  function nextQuestion() {
    setQuizIndex(i => (i + 1) % QUESTIONS.length);
    setQuizChoice(null);
    setQuizAnswered(false);
  }
  function resetQuiz() {
    setQuizIndex(0); setQuizChoice(null); setQuizAnswered(false); setQuizScore(0);
  }
  function trade(direction) {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 100000) {
      setNotice("Enter a whole-number quantity from 1 to 100,000.");
      return;
    }
    const owned = holdings[selected] || 0;
    const amount = qty * chosenAsset.price;
    if (direction === "buy") {
      if (amount > cash) { setNotice("Not enough virtual cash for this practice trade."); return; }
      setCash(v => v - amount);
      setHoldings(h => ({...h, [selected]:(h[selected] || 0) + qty}));
      setTrades(v => v + 1);
      setNotice(`Virtual buy recorded: ${qty} unit(s) of ${selected}.`);
    } else {
      if (qty > owned) { setNotice("You do not own enough units to sell in the simulator."); return; }
      setCash(v => v + amount);
      setHoldings(h => ({...h, [selected]:(h[selected] || 0) - qty}));
      setTrades(v => v + 1);
      setNotice(`Virtual sale recorded: ${qty} unit(s) of ${selected}.`);
    }
  }
  function resetSimulator() {
    setCash(10000); setHoldings({}); setTrades(0); setQuantity("1");
    setNotice("Simulator reset. Starting virtual cash restored to $10,000.");
  }

  function homeScreen() {
    const continueLesson = allLessons.find(l => !completed.includes(l.id));
    return <>
      <View style={styles.hero}>
        <Text style={styles.kicker}>FREE FINANCIAL EDUCATION</Text>
        <Text style={styles.heroTitle}>Understand markets.{ "\n" }Build your knowledge.</Text>
        <Text style={styles.heroText}>From beginner concepts to advanced market mechanics — learn at your own pace, with no subscription fees.</Text>
        <Btn title="Explore free courses →" onPress={() => {setTab("Learn"); setCourseOpen(null);}} />
      </View>
      <View style={styles.statsRow}>
        <Panel style={styles.stat}><Text style={styles.statNumber}>{completed.length}/{allLessons.length}</Text><Text style={styles.muted}>Lessons completed</Text></Panel>
        <Panel style={styles.stat}><Text style={styles.statNumber}>{progress}%</Text><Text style={styles.muted}>Learning progress</Text></Panel>
      </View>
      <Panel>
        <View style={styles.rowBetween}><Text style={styles.h2}>Your learning path</Text><Text style={styles.green}>{progress}%</Text></View>
        <View style={styles.progressTrack}><View style={[styles.progressFill,{width:`${progress}%`}]} /></View>
        <Text style={styles.muted}>{continueLesson ? `Next up: ${continueLesson.title}` : "You completed every lesson. Great work!"}</Text>
        {continueLesson ? <Btn title="Continue learning" onPress={() => {setTab("Learn"); setCourseOpen(continueLesson.courseId); setLessonOpen(continueLesson.id);}} /> : null}
      </Panel>
      <Heading title="Explore market topics" subtitle="Every course is free." />
      {COURSES.map(course => <Pressable key={course.id} onPress={() => {setTab("Learn");setCourseOpen(course.id);setLessonOpen(null);}} style={styles.courseRow}>
        <View style={styles.courseIcon}><Text style={styles.courseIconText}>{course.category.slice(0,1)}</Text></View>
        <View style={{flex:1,gap:4}}><Text style={styles.h2}>{course.title}</Text><Text style={styles.muted}>{course.lessons.length} lessons · {course.level}</Text></View>
        <Text style={styles.arrow}>›</Text>
      </Pressable>)}
      <Panel><Text style={styles.h2}>Important note</Text><Text style={styles.body}>TradeWise is an educational app, not a broker or financial adviser. It does not execute real trades or provide personalized financial recommendations.</Text></Panel>
    </>;
  }

  function learnScreen() {
    if (lessonOpen) {
      const lesson = allLessons.find(l => l.id === lessonOpen);
      if (lesson) return <>
        <Btn title="← Back to courses" secondary onPress={() => setLessonOpen(null)} />
        <Text style={styles.kicker}>{lesson.courseTitle.toUpperCase()}</Text>
        <Heading title={lesson.title} subtitle={`${lesson.minutes} min · Educational lesson`} />
        {lesson.body.map((part,i) => <Panel key={i}><Text style={styles.h2}>{part.heading}</Text><Text style={styles.body}>{part.text}</Text></Panel>)}
        <Panel><Text style={styles.h2}>Key takeaways</Text>{lesson.points.map((p,i)=><Text key={i} style={styles.bullet}>•  {p}</Text>)}</Panel>
        <Btn title={completed.includes(lesson.id) ? "Lesson completed ✓" : "Mark lesson complete"} disabled={completed.includes(lesson.id)} onPress={() => completeLesson(lesson.id)} />
        <Btn title={bookmarks.includes(lesson.id) ? "Remove bookmark" : "Bookmark lesson"} secondary onPress={() => toggleBookmark(lesson.id)} />
        <Btn title="Next lesson →" onPress={() => {
          const index = allLessons.findIndex(l=>l.id===lesson.id);
          const next = allLessons[(index+1)%allLessons.length];
          setLessonOpen(next.id);
        }} />
      </>;
    }
    return <>
      <Heading title="Free learning library" subtitle="Search lessons, choose a course, and mark lessons complete." />
      <TextInput value={search} onChangeText={setSearch} placeholder="Search stocks, forex, risk, options..." placeholderTextColor={C.muted} style={styles.input} />
      {filteredCourses.map(course => <Panel key={course.id}>
        <Pressable onPress={() => setCourseOpen(courseOpen === course.id ? null : course.id)} style={styles.rowBetween}>
          <View style={{flex:1,gap:5}}><Text style={styles.kicker}>{course.category}</Text><Text style={styles.h2}>{course.title}</Text><Text style={styles.muted}>{course.lessons.length} matching lessons · {course.level}</Text></View>
          <Text style={styles.arrow}>{courseOpen === course.id ? "−" : "+"}</Text>
        </Pressable>
        {courseOpen === course.id || search.trim() ? course.lessons.map(lesson => <Pressable key={lesson.id} onPress={() => setLessonOpen(lesson.id)} style={styles.lessonRow}>
          <View style={{flex:1,gap:4}}><Text style={styles.lessonTitle}>{completed.includes(lesson.id) ? "✓ " : ""}{lesson.title}</Text><Text style={styles.muted}>{lesson.minutes} min</Text></View>
          <Text style={styles.green}>{completed.includes(lesson.id) ? "Done" : "Read →"}</Text>
        </Pressable>) : null}
      </Panel>)}
      {filteredCourses.length === 0 ? <Panel><Text style={styles.body}>No lessons found. Try a different search term.</Text></Panel> : null}
    </>;
  }

  function quizScreen() {
    const q = QUESTIONS[quizIndex];
    return <>
      <Heading title="Knowledge check" subtitle="Practice concepts. These questions are educational, not a financial qualification." />
      <Panel>
        <View style={styles.rowBetween}><Text style={styles.kicker}>QUESTION {quizIndex+1} / {QUESTIONS.length}</Text><Text style={styles.green}>Score {quizScore}</Text></View>
        <Text style={styles.question}>{q.q}</Text>
        {q.options.map((option,i) => {
          const correct = quizAnswered && i === q.a;
          const wrong = quizAnswered && quizChoice === i && i !== q.a;
          return <Pressable key={option} disabled={quizAnswered} onPress={() => answerQuestion(i)} style={[styles.option,correct&&styles.optionCorrect,wrong&&styles.optionWrong]}>
            <Text style={styles.optionLetter}>{String.fromCharCode(65+i)}</Text><Text style={styles.body}>{option}</Text>
          </Pressable>;
        })}
        {quizAnswered ? <View style={styles.feedback}><Text style={quizChoice === q.a ? styles.green : styles.red}>{quizChoice === q.a ? "Correct!" : "Review this concept"}</Text><Text style={styles.body}>{q.why}</Text><Btn title="Next question →" onPress={nextQuestion} /></View> : <Text style={styles.muted}>Select an answer to see the explanation.</Text>}
        <Text style={styles.muted}>Best score this session: {bestScore}</Text>
        <Btn title="Restart quiz" secondary onPress={resetQuiz} />
      </Panel>
    </>;
  }

  function simulatorScreen() {
    return <>
      <Heading title="Virtual trading lab" subtitle="Practice with fictional sample prices and virtual money only." />
      <View style={styles.statsRow}>
        <Panel style={styles.stat}><Text style={styles.muted}>Virtual cash</Text><Text style={styles.statSmall}>{formatMoney(cash)}</Text></Panel>
        <Panel style={styles.stat}><Text style={styles.muted}>Portfolio total</Text><Text style={styles.statSmall}>{formatMoney(totalValue)}</Text></Panel>
      </View>
      <Panel>
        <Text style={styles.h2}>Choose a sample asset</Text>
        <Text style={styles.muted}>These prices are invented examples. They are not live or historical market prices.</Text>
        {SIM_ASSETS.map(a=><Pressable key={a.symbol} onPress={()=>{setSelected(a.symbol);setNotice("");}} style={[styles.assetRow,selected===a.symbol&&styles.assetSelected]}>
          <View style={{flex:1,gap:4}}><Text style={styles.h2}>{a.name}</Text><Text style={styles.muted}>{a.symbol}</Text></View>
          <Text style={styles.assetPrice}>{formatMoney(a.price)}</Text>
        </Pressable>)}
        <Text style={styles.label}>Quantity (whole units)</Text>
        <TextInput value={quantity} onChangeText={setQuantity} keyboardType="number-pad" placeholder="1" placeholderTextColor={C.muted} style={styles.input} />
        <View style={styles.statsRow}>
          <View style={{flex:1}}><Btn title="Buy virtual" onPress={()=>trade("buy")} /></View>
          <View style={{flex:1}}><Btn title="Sell virtual" danger onPress={()=>trade("sell")} /></View>
        </View>
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
      </Panel>
      <Panel>
        <Text style={styles.h2}>Holdings</Text>
        {SIM_ASSETS.filter(a=>(holdings[a.symbol]||0)>0).length===0 ? <Text style={styles.muted}>No virtual holdings yet. Choose an example asset above to practise.</Text> : SIM_ASSETS.filter(a=>(holdings[a.symbol]||0)>0).map(a=><View key={a.symbol} style={styles.holdingRow}><View style={{flex:1}}><Text style={styles.h2}>{a.name}</Text><Text style={styles.muted}>{holdings[a.symbol]} unit(s)</Text></View><Text style={styles.green}>{formatMoney((holdings[a.symbol]||0)*a.price)}</Text></View>)}
        <Text style={styles.muted}>Practice trades recorded: {trades}</Text>
        <Btn title="Reset simulator" secondary onPress={resetSimulator} />
      </Panel>
    </>;
  }

  function progressScreen() {
    return <>
      <Heading title="Your progress" subtitle="Progress is saved locally on this device." />
      <Panel><Text style={styles.kicker}>COURSE COMPLETION</Text><Text style={styles.bigNumber}>{progress}%</Text><View style={styles.progressTrack}><View style={[styles.progressFill,{width:`${progress}%`}]} /></View><Text style={styles.muted}>{completed.length} of {allLessons.length} lessons completed</Text></Panel>
      <View style={styles.statsRow}>
        <Panel style={styles.stat}><Text style={styles.statNumber}>{bookmarks.length}</Text><Text style={styles.muted}>Bookmarks</Text></Panel>
        <Panel style={styles.stat}><Text style={styles.statNumber}>{trades}</Text><Text style={styles.muted}>Practice trades</Text></Panel>
      </View>
      <Panel><Text style={styles.h2}>Bookmarked lessons</Text>
        {bookmarks.length===0 ? <Text style={styles.muted}>Bookmark lessons to find them here.</Text> : allLessons.filter(l=>bookmarks.includes(l.id)).map(l=><Pressable key={l.id} onPress={()=>{setTab("Learn");setLessonOpen(l.id);}} style={styles.lessonRow}><Text style={[styles.lessonTitle,{flex:1}]}>{l.title}</Text><Text style={styles.green}>Open →</Text></Pressable>)}
      </Panel>
      <Panel><Text style={styles.h2}>Reset learning progress</Text><Text style={styles.muted}>This removes completed lessons and bookmarks. Your simulator balance is not affected.</Text><Btn title="Reset progress" danger onPress={()=>{setCompleted([]);setBookmarks([]);setNotice("Learning progress reset.");}} /></Panel>
    </>;
  }

  const screens = {Home:homeScreen, Learn:learnScreen, Quiz:quizScreen, Simulator:simulatorScreen, Progress:progressScreen};

  return <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="light-content" backgroundColor={C.bg} />
    <View style={styles.app}>
      <View style={styles.header}>
        <Pressable onPress={()=>{setTab("Home");setLessonOpen(null);}}>
          <View style={styles.brandRow}><View style={styles.logo}><Text style={styles.logoText}>T</Text></View><View><Text style={styles.brand}>TradeWise</Text><Text style={styles.brandTag}>FREE MARKET EDUCATION</Text></View></View>
        </Pressable>
        <View style={styles.freePill}><Text style={styles.freeText}>100% FREE</Text></View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {["Home","Learn","Quiz","Simulator","Progress"].map(t=><Pressable key={t} onPress={()=>setTab(t)} style={[styles.tab,t===tab&&styles.tabActive]}><Text style={[styles.tabText,t===tab&&styles.tabTextActive]}>{t}</Text></Pressable>)}
      </ScrollView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {screens[tab]()}
        <View style={styles.footer}><Text style={styles.footerTitle}>TradeWise · Learn for free</Text><Text style={styles.muted}>Educational content only. Not investment advice. No real trades, broker links, or live market prices. Financial products can be risky; learn independently and check applicable laws.</Text></View>
      </ScrollView>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg},
  app:{flex:1,width:"100%",maxWidth:1000,alignSelf:"center",backgroundColor:C.bg},
  header:{paddingHorizontal:18,paddingVertical:15,minHeight:74,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderBottomWidth:1,borderBottomColor:C.border},
  brandRow:{flexDirection:"row",alignItems:"center",gap:10},
  logo:{width:42,height:42,borderRadius:14,backgroundColor:C.green,alignItems:"center",justifyContent:"center"},
  logoText:{color:C.bg,fontWeight:"900",fontSize:24},
  brand:{color:C.text,fontSize:20,fontWeight:"900"},
  brandTag:{color:C.muted,fontSize:9,letterSpacing:1.1,marginTop:3},
  freePill:{borderWidth:1,borderColor:C.green,borderRadius:20,paddingHorizontal:10,paddingVertical:7},
  freeText:{color:C.green,fontSize:10,fontWeight:"900"},
  tabs:{paddingHorizontal:12,paddingVertical:10,gap:7,borderBottomWidth:1,borderBottomColor:C.border},
  tab:{paddingHorizontal:14,paddingVertical:10,borderRadius:11},
  tabActive:{backgroundColor:C.panel2},
  tabText:{color:C.muted,fontSize:13,fontWeight:"700"},
  tabTextActive:{color:C.green},
  scroll:{flex:1},
  content:{padding:16,paddingBottom:35,gap:14,width:"100%",maxWidth:820,alignSelf:"center"},
  hero:{padding:23,borderRadius:23,backgroundColor:C.panel,borderWidth:1,borderColor:C.border,gap:15},
  kicker:{color:C.green,fontSize:10,fontWeight:"900",letterSpacing:1.3},
  heroTitle:{color:C.text,fontSize:34,lineHeight:41,fontWeight:"900"},
  heroText:{color:C.muted,fontSize:14,lineHeight:22},
  panel:{backgroundColor:C.panel,borderColor:C.border,borderWidth:1,borderRadius:18,padding:17,gap:12},
  statsRow:{flexDirection:"row",gap:10},
  stat:{flex:1,minWidth:0},
  statNumber:{color:C.text,fontSize:26,fontWeight:"900"},
  statSmall:{color:C.text,fontSize:17,fontWeight:"900",marginTop:6},
  h1:{color:C.text,fontSize:25,fontWeight:"900"},
  h2:{color:C.text,fontSize:15,fontWeight:"800"},
  muted:{color:C.muted,fontSize:12,lineHeight:18},
  green:{color:C.green,fontSize:12,fontWeight:"800"},
  red:{color:C.red,fontSize:12,fontWeight:"800"},
  body:{color:"#D8E1F0",fontSize:13,lineHeight:21},
  bullet:{color:"#D8E1F0",fontSize:13,lineHeight:22},
  sectionRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  sectionTitle:{color:C.text,fontSize:19,fontWeight:"900"},
  progressTrack:{height:8,borderRadius:8,backgroundColor:C.panel2,overflow:"hidden"},
  progressFill:{height:8,borderRadius:8,backgroundColor:C.green},
  btn:{minHeight:44,backgroundColor:C.green,borderRadius:12,paddingHorizontal:15,paddingVertical:12,alignItems:"center",justifyContent:"center",marginTop:2},
  btnSecondary:{backgroundColor:C.panel2,borderWidth:1,borderColor:C.border},
  btnDanger:{backgroundColor:"#8E3443"},
  btnDisabled:{backgroundColor:C.panel2,opacity:0.7},
  btnText:{color:C.bg,fontSize:13,fontWeight:"900",textAlign:"center"},
  btnPressed:{opacity:0.8},
  rowBetween:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:10},
  courseRow:{flexDirection:"row",alignItems:"center",gap:12,padding:15,borderRadius:17,backgroundColor:C.panel,borderWidth:1,borderColor:C.border},
  courseIcon:{width:40,height:40,borderRadius:13,backgroundColor:C.panel2,alignItems:"center",justifyContent:"center"},
  courseIconText:{color:C.green,fontSize:18,fontWeight:"900"},
  arrow:{color:C.green,fontSize:26,fontWeight:"700"},
  lessonRow:{paddingVertical:13,borderTopWidth:1,borderTopColor:C.border,flexDirection:"row",alignItems:"center",gap:10},
  lessonTitle:{color:C.text,fontSize:14,fontWeight:"800"},
  input:{borderWidth:1,borderColor:C.border,backgroundColor:C.bg,color:C.text,borderRadius:12,paddingHorizontal:13,paddingVertical:12,fontSize:14},
  question:{color:C.text,fontSize:19,lineHeight:27,fontWeight:"800",marginVertical:8},
  option:{flexDirection:"row",alignItems:"center",gap:10,padding:13,borderWidth:1,borderColor:C.border,borderRadius:13,marginVertical:4,backgroundColor:C.bg},
  optionCorrect:{borderColor:C.green,backgroundColor:"#102D2A"},
  optionWrong:{borderColor:C.red,backgroundColor:"#351C2A"},
  optionLetter:{color:C.green,fontWeight:"900",width:20},
  feedback:{backgroundColor:C.bg,borderRadius:13,padding:13,gap:10,marginTop:7},
  assetRow:{flexDirection:"row",alignItems:"center",padding:12,borderWidth:1,borderColor:C.border,borderRadius:12,marginTop:7,gap:10},
  assetSelected:{borderColor:C.green,backgroundColor:C.panel2},
  assetPrice:{color:C.green,fontSize:13,fontWeight:"900"},
  label:{color:C.muted,fontSize:12,fontWeight:"800",marginTop:5},
  notice:{color:C.yellow,fontSize:12,lineHeight:18},
  holdingRow:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:10,paddingVertical:11,borderBottomWidth:1,borderBottomColor:C.border},
  bigNumber:{color:C.green,fontSize:42,fontWeight:"900"},
  footer:{borderTopWidth:1,borderTopColor:C.border,paddingTop:18,marginTop:10,gap:8},
  footerTitle:{color:C.text,fontWeight:"900",fontSize:14}
});
