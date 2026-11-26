import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { LESSONS, TOPICS, topicById } from '../../data/curriculum';
import { looseMatch } from '../../lib/engine';
import { generateQuestion } from '../../lib/generators';
import { useStudentProgress } from '../../hooks/dashboardHooks';
import { Avatar, LangToggle } from '../../components/dashboard/DashWidgets';
import { CapyFace, SendIcon } from '../../components/dashboard/DashIcons';

/* ---------------------------------------------------------------------------
 * "Ask Kasalig": a step-by-step tutor that guides without handing over the
 * answer. It explains the idea (in English, Filipino or Cebuano), poses a fresh
 * problem, and answers wrong tries and "hint" with the next step only.
 * The replies are scripted from the curriculum; to use a language model, swap
 * replyTo() for a backend call and keep the same "never give the answer" rule.
 * ------------------------------------------------------------------------- */

const T = {
  en: {
    hello: 'Hi! I’m Kasalig. 🧡 Pick a topic you’re struggling with and we’ll work through it together, one step at a time.',
    intro: (t) => `Let’s look at ${t}. Here’s the key idea:`,
    tryOne: 'Let’s try one together. Don’t worry about the final answer yet. What would you do first?',
    right: 'Yes! 🎉 You got it, and you did the thinking yourself. Want another one, or a different topic?',
    notYet: 'Not quite, but you’re close. Here’s a nudge:',
    hint: 'Here’s the next step:',
    noMoreHints: 'You have all the steps now. Go through them slowly and check your arithmetic in the last one. I believe in you!',
    noAnswer: 'I won’t just give you the answer: you learn it better by getting there yourself. Ask for a “hint” and I’ll show the next step.',
    pick: 'Which topic do you want help with? Tap one below, or type its name.',
    gaps: 'Kasalig labels each gap as a missed concept, a careless error or a missing prerequisite, and ranks it Mild, Moderate or Critical. Your learning path fixes prerequisites first.',
    thanks: 'Anytime! Small steps add up. 🧡',
    placeholder: 'Type your answer, “hint”, or a topic…',
    note: 'Explains step by step and never just gives the answer. Replies are scripted from the curriculum.',
  },
  fil: {
    hello: 'Kumusta! Ako si Kasalig. 🧡 Pumili ng paksang nahihirapan ka at sabay nating aaralin, isang hakbang sa bawat pagkakataon.',
    intro: (t) => `Tingnan natin ang ${t}. Ito ang pangunahing ideya:`,
    tryOne: 'Subukan natin ang isa. Huwag munang isipin ang huling sagot. Ano ang una mong gagawin?',
    right: 'Tama! 🎉 Nakuha mo, at ikaw mismo ang nag-isip. Gusto mo pa ng isa, o ibang paksa?',
    notYet: 'Hindi pa, pero malapit ka na. Heto ang tulong:',
    hint: 'Ito ang susunod na hakbang:',
    noMoreHints: 'Nasa iyo na ang lahat ng hakbang. Dahan-dahanin at suriin ang kompyutasyon sa huling hakbang. Kaya mo ’yan!',
    noAnswer: 'Hindi ko basta ibibigay ang sagot: mas matututo ka kung ikaw ang makakarating doon. Mag-type ng “hint” para sa susunod na hakbang.',
    pick: 'Anong paksa ang gusto mong pag-aralan? Pumili sa ibaba o i-type ang pangalan nito.',
    gaps: 'Binibigyan ng Kasalig ng label ang bawat gap: hindi naintindihang konsepto, careless error, o kulang na prerequisite, at may antas na Mild, Moderate o Critical. Inuuna ng learning path ang prerequisite.',
    thanks: 'Walang anuman! Ang maliliit na hakbang ay nagdadagdag. 🧡',
    placeholder: 'I-type ang sagot, “hint”, o isang paksa…',
    note: 'Nagpapaliwanag nang hakbang-hakbang at hindi basta nagbibigay ng sagot.',
  },
  ceb: {
    hello: 'Kumusta! Ako si Kasalig. 🧡 Pilia ang topic nga nalisdan ka ug atong tun-an nga duha, usa ka lakang matag higayon.',
    intro: (t) => `Atong tan-awon ang ${t}. Mao kini ang punoan nga ideya:`,
    tryOne: 'Sulayan nato ang usa. Ayaw sa hunahunaa ang katapusang tubag. Unsa man ang una nimong buhaton?',
    right: 'Sakto! 🎉 Nakuha nimo, ug ikaw mismo ang naghunahuna. Gusto ka og usa pa, o laing topic?',
    notYet: 'Dili pa, pero hapit na. Ania ang tabang:',
    hint: 'Mao kini ang sunod nga lakang:',
    noMoreHints: 'Naa na nimo ang tanang lakang. Hinay-hinaya ug susiha ang kuwenta sa katapusang lakang. Kaya nimo na!',
    noAnswer: 'Dili nako ihatag dayon ang tubag: mas makakat-on ka kung ikaw ang makaabot didto. I-type ang “hint” para sa sunod nga lakang.',
    pick: 'Unsang topic ang gusto nimong tabangan? Pilia sa ubos o i-type ang ngalan.',
    gaps: 'Ang Kasalig nagmarka sa matag gap: wala masabti nga konsepto, careless error, o kulang nga prerequisite, nga adunay lebel nga Mild, Moderate o Critical. Ang learning path mag-una sa prerequisite.',
    thanks: 'Walay sapayan! Ang gagmay nga lakang modaghan. 🧡',
    placeholder: 'I-type ang tubag, “hint”, o usa ka topic…',
    note: 'Nagpasabot sa matag lakang ug dili dayon mohatag sa tubag.',
  },
};

const HINT_WORDS = /\b(hint|help|tulong|tabang|pahiwatig|stuck|next step|sunod)\b/i;
const ANSWER_WORDS = /\b(answer|sagot|tubag|give up|solution)\b/i;
const ANOTHER_WORDS = /\b(another|again|isa pa|usa pa|more|practice|problem)\b/i;
const EXPLAIN_WORDS = /\b(explain|ipaliwanag|ipasabot|why|bakit|ngano|how)\b/i;
const GAP_WORDS = /\b(gap|careless|concept|prerequisite|severity)\b/i;
const THANKS_WORDS = /\b(thank|salamat)\b/i;

const topicFromText = (text) =>
  TOPICS.find((t) => {
    const words = [t.name, t.id, ...t.name.split(' ')].map((w) => w.toLowerCase()).filter((w) => w.length > 4);
    return words.some((w) => text.toLowerCase().includes(w));
  });

function lessonText(topicId, lang) {
  const l = LESSONS[topicId][lang] ?? LESSONS[topicId].en;
  return `${l.summary}\n\n${l.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
}

function startTopic(topicId, lang) {
  const t = T[lang];
  const problem = generateQuestion(topicId, 2);
  return {
    messages: [`${t.intro(topicById(topicId).name)}\n\n${lessonText(topicId, lang)}`, `${t.tryOne}\n\n✏️ ${problem.prompt}`],
    ctx: { topicId, problem, hints: 0 },
  };
}

/** Decide the tutor's replies. `ctx` remembers the topic, the open problem and hints used. */
function replyTo(text, ctx, lang) {
  const t = T[lang];
  const topic = topicFromText(text);

  if (THANKS_WORDS.test(text)) return { messages: [t.thanks], ctx };
  if (GAP_WORDS.test(text) && !ctx.problem) return { messages: [t.gaps], ctx };
  if (topic && topic.id !== ctx.topicId) return startTopic(topic.id, lang);
  if (!ctx.topicId) return { messages: [t.pick], ctx };

  const nextProblem = () => {
    const problem = generateQuestion(ctx.topicId, Math.min(3, 2 + (ctx.solved ?? 0)));
    return { messages: [`✏️ ${problem.prompt}`], ctx: { ...ctx, problem, hints: 0 } };
  };

  if (ANOTHER_WORDS.test(text) && !HINT_WORDS.test(text)) return nextProblem();
  if (EXPLAIN_WORDS.test(text) && !ctx.problem) return { messages: [lessonText(ctx.topicId, lang)], ctx };
  if (!ctx.problem) return nextProblem();

  const { problem } = ctx;
  const giveHint = (lead) => {
    if (ctx.hints >= problem.hints.length) return { messages: [t.noMoreHints], ctx };
    return {
      messages: [`${lead}\n💡 ${problem.hints[ctx.hints]}`],
      ctx: { ...ctx, hints: ctx.hints + 1 },
    };
  };

  if (ANSWER_WORDS.test(text)) return { messages: [t.noAnswer], ctx };
  if (HINT_WORDS.test(text)) return giveHint(t.hint);
  if (EXPLAIN_WORDS.test(text)) return { messages: [lessonText(ctx.topicId, lang)], ctx };
  if (looseMatch(problem, text)) {
    return { messages: [t.right], ctx: { ...ctx, problem: null, hints: 0, solved: (ctx.solved ?? 0) + 1 }, party: true };
  }
  return giveHint(t.notYet);
}

let messageId = 0;
const makeMessage = (from, text) => ({ id: ++messageId, from, text });

export default function TutorChat() {
  const { user } = useAuth();
  const location = useLocation();
  const { student, gaps, topics: myTopics } = useStudentProgress();
  const lang = student.lang ?? 'en';
  const startTopicId = topicById(location.state?.topicId) ? location.state.topicId : null;

  const [initial] = useState(() => (startTopicId ? startTopic(startTopicId, lang) : { messages: [T[lang].hello], ctx: { topicId: null, problem: null, hints: 0 } }));
  const [messages, setMessages] = useState(() => initial.messages.map((m) => makeMessage('tutor', m)));
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [ctx, setCtx] = useState(initial.ctx);
  const logRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const respond = (reply) => {
    setCtx(reply.ctx);
    setTyping(true);
    const delay = 450 + Math.min(1000, reply.messages.join('').length * 4);
    timers.current.push(
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [...prev, ...reply.messages.map((m) => makeMessage('tutor', m))]);
        if (reply.party) {
          setCelebrate(true);
          timers.current.push(setTimeout(() => setCelebrate(false), 1600));
        }
      }, delay)
    );
  };

  const send = (raw) => {
    const text = raw.trim();
    if (!text || typing) return;
    setMessages((prev) => [...prev, makeMessage('me', text)]);
    setDraft('');
    respond(replyTo(text, ctx, lang));
  };

  const pickTopic = (topicId) => {
    if (typing) return;
    setMessages((prev) => [...prev, makeMessage('me', topicById(topicId).name)]);
    respond(startTopic(topicId, lang));
  };

  // Topics with open gaps first, so the student's weak spots are one tap away.
  const gapIds = gaps.map((g) => g.topic.id);
  const topicChips = [...(myTopics.length ? myTopics : TOPICS)].sort((a, b) => Number(gapIds.includes(b.id)) - Number(gapIds.includes(a.id)));
  const hasProblem = Boolean(ctx.problem);

  return (
    <section className="kd-stage kd-tutor">
      <header className="kd-tutor-head">
        <span className={`kd-tutor-avatar ${celebrate ? 'is-party' : ''}`}>
          <CapyFace size={52} />
        </span>
        <div className="kd-tutor-title">
          <h1>Ask Kasalig</h1>
          <p>
            <span className="kd-dot" aria-hidden="true" /> {T[lang].note}
          </p>
        </div>
        <LangToggle value={lang} onChange={student.setLang} />
      </header>

      <div className="kd-tutor-log" ref={logRef} role="log" aria-live="polite" aria-label="Conversation">
        {messages.map((m) => (
          <div key={m.id} className={`kd-msg is-${m.from}`}>
            {m.from === 'tutor' ? <CapyFace size={34} /> : <Avatar name={user.fullName} size={34} />}
            <p className="kd-bubble">{m.text}</p>
          </div>
        ))}
        {typing && (
          <div className="kd-msg is-tutor">
            <CapyFace size={34} />
            <p className="kd-bubble kd-typing" aria-label="Kasalig is typing">
              <span /> <span /> <span />
            </p>
          </div>
        )}
      </div>

      <div className="kd-suggestions">
        {hasProblem ? (
          <>
            <button type="button" onClick={() => send('hint')} disabled={typing}>💡 Hint</button>
            <button type="button" onClick={() => send('explain')} disabled={typing}>📖 Explain the idea</button>
            <button type="button" onClick={() => send('another')} disabled={typing}>🔄 Different problem</button>
          </>
        ) : (
          topicChips.map((t) => (
            <button key={t.id} type="button" onClick={() => pickTopic(t.id)} disabled={typing}>
              {gapIds.includes(t.id) && <span className="kd-gap-flag" aria-label="open gap">●</span>} {t.name}
            </button>
          ))
        )}
      </div>

      <form
        className="kd-tutor-input"
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
      >
        <label htmlFor="kd-tutor-text" className="kd-sr-only">
          Message Kasalig
        </label>
        <input
          id="kd-tutor-text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={T[lang].placeholder}
          autoComplete="off"
        />
        <button type="submit" className="kd-send" aria-label="Send" disabled={!draft.trim() || typing}>
          <SendIcon size={20} />
        </button>
      </form>
    </section>
  );
}
