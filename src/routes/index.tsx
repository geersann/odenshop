import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  Clock,
  Flame,
  Lock,
  Package,
  Phone,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Wrench,
  Wind,
  Star,
  Truck,
  ShieldX,
} from "lucide-react";

import { useServerFn } from "@tanstack/react-start";
import { sendOrder } from "@/lib/order.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Зворотний клапан для каналізації — забудьте про запахи назавжди",
      },
      {
        name: "description",
        content:
          "Силіконовий зворотний клапан: пропускає воду, блокує запахи. Монтаж за 10 секунд без інструментів. Знижка -50% сьогодні!",
      },
      {
        property: "og:title",
        content: "Зворотний клапан для каналізації — забудьте про запахи назавжди",
      },
      {
        property: "og:description",
        content:
          "Силіконовий зворотний клапан: пропускає воду, блокує запахи. Монтаж за 10 секунд. Знижка -50%!",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ---------- helpers ---------- */

function useCountdown() {
  const calc = () => {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const diff = Math.max(0, end.getTime() - now.getTime());
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    return { h, m, s };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

function Timer({ compact = false }: { compact?: boolean }) {
  const { h, m, s } = useCountdown();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-2">
      {[
        { v: pad(h), l: "год" },
        { v: pad(m), l: "хв" },
        { v: pad(s), l: "сек" },
      ].map((t, i) => (
        <div key={t.l} className="flex items-center gap-2">
          <div
            className={`timer-digit bg-card border border-border rounded-lg text-primary ${
              compact ? "px-2 py-1 text-sm" : "px-3 py-2 text-2xl"
            }`}
          >
            {t.v}
          </div>
          {i < 2 && <span className="timer-tick font-bold text-primary">:</span>}
        </div>
      ))}
    </div>
  );
}

function scrollToOrder() {
  document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
}

/* ---------- page ---------- */

function Index() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [qty, setQty] = useState(1);
  const [custom, setCustom] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const sendOrderFn = useServerFn(sendOrder);

  // чим більше штук — тим дешевше кожен клапан
  const pricePer = (n: number) => (n >= 5 ? 199 : n >= 2 ? 250 : 299);
  const total = pricePer(qty) * qty;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.trim().length < 9) {
      setError("Будь ласка, вкажіть ім'я та коректний номер телефону");
      return;
    }
    if (!Number.isInteger(qty) || qty < 1) {
      setError("Вкажіть кількість");
      return;
    }
    setError("");
    setSending(true);
    try {
      const r = await sendOrderFn({ data: { name, phone, qty, total } });
      if (!r.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Не вдалося надіслати замовлення. Спробуйте ще раз або зателефонуйте нам.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen text-foreground">
      {/* animated background */}
      <div className="bg-animated" aria-hidden="true">
        <div className="orb orb-amber" />
        <div className="orb orb-deep" />
        <div className="orb orb-low" />
      </div>

      {/* sticky top bar */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2.5 text-sm">
          <span className="badge-flame flex items-center gap-1.5 font-semibold text-primary">
            <Flame className="h-4 w-4" />
            Акція -50% закінчується через:
          </span>
          <Timer compact />
          <button onClick={scrollToOrder} className="cta-btn !px-5 !py-2 !text-sm">
            Замовити зі знижкою
          </button>
        </div>
      </div>

      {/* hero */}
      <header className="mx-auto max-w-6xl px-4 pb-16 pt-14 md:pt-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Хіт продажів 2026
            </div>
            <h1 className="font-display text-4xl leading-tight font-black md:text-6xl">
              Запах з каналізації{" "}
              <span className="hl">зникне за 10 секунд</span> — без
              сантехніка
            </h1>
            <p className="mt-5 text-lg text-muted-foreground md:text-xl">
              <strong className="text-foreground">Силіконовий зворотний клапан</strong> пропускає
              воду, але <span className="hl">не пропускає жодного запаху</span> з труби. Ваш дім
              назавжди захищений від смороду.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-5xl font-black text-primary">299</span>
                  <span className="font-display text-5xl font-black text-primary">₴</span>
                  <span className="text-2xl font-semibold text-muted-foreground line-through">
                    598 ₴
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Знижка -50% · ціна за 1 шт
                </p>
              </div>
              <button onClick={scrollToOrder} className="cta-btn">
                <Package className="h-5 w-5" />
                Забрати зі знижкою -50%
              </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-primary" /> Доставка по всій Україні
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" /> Оплата при отриманні
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" /> Гарантія 12 місяців
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-primary/10 blur-2xl" aria-hidden="true" />
            <img
              src="/assets/valve-product.webp"
              alt="Силіконовий зворотний клапан для каналізації"
              width={600}
              height={600}
              className="float-slow relative w-full rounded-3xl border border-border shadow-2xl"
            />
            <div className="absolute -bottom-4 -left-4 rounded-2xl border border-primary/40 bg-card px-4 py-2 font-display text-sm font-extrabold text-primary shadow-lg">
              -50% СЬОГОДНІ
            </div>
          </div>
        </div>
      </header>

      {/* pain points */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <h2 className="font-display text-center text-3xl font-black md:text-4xl">
            Вам це знайоме? <span className="hl">Тоді читайте далі</span>
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Wind,
                title: "Сморід у ванній та на кухні",
                text: "Неприємний запах із зливу розноситься по всій квартирі. Освіжувачі не допомагають — джерело в трубі.",
              },
              {
                icon: ShieldX,
                title: "Запахи з вулиці та підвалу",
                text: "Зліви у дворі, гаражі чи на дачі теж «дихають» каналізацією прямо у ваш двір.",
              },
              {
                icon: Flame,
                title: "Сухий сифон = відкрита труба",
                text: "Коли зливом не користуються тиждень, вода в сифоні висихає — і запах проникає у дім безперешкодно.",
              },
            ].map((p) => (
              <div key={p.title} className="rounded-2xl border border-destructive/30 bg-card p-6">
                <p.icon className="h-8 w-8 text-destructive" />
                <h3 className="font-display mt-4 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
          <p className="font-display mx-auto mt-10 max-w-3xl text-center text-xl font-bold md:text-2xl">
            Проблема не у вашій чистоті. Проблема — у <span className="hl-mark">незахищеному зливі</span>.
            І вирішується вона за <span className="hl">10 секунд</span>.
          </p>
        </Reveal>
      </section>

      {/* how it works + install demo */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-black md:text-4xl">
                Монтаж, з яким справиться <span className="hl-mark">будь-хто</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Не потрібні <span className="hl">ніякі інструменти</span> та спеціальні знання —
                його зможе встановити будь-яка домогосподарка.
              </p>
              <ol className="mt-6 space-y-4">
                {[
                  "Дістаньте клапан з упаковки",
                  "Вставте його у злив (ванна, раковина, підлога, труба)",
                  "Готово! Запахи заблоковані назавжди",
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="font-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="pt-1 text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
              <button onClick={scrollToOrder} className="cta-btn mt-8">
                Хочу такий клапан
              </button>
            </div>
            <img
              src="/assets/valve-install-demo.gif"
              alt="Монтаж клапана в злив за кілька секунд"
              loading="lazy"
              width={512}
              height={512}
              className="w-full rounded-3xl border border-border shadow-2xl"
            />
          </div>
        </Reveal>
      </section>

      {/* benefits */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <h2 className="font-display text-center text-3xl font-black md:text-4xl">
            Чому <span className="hl">тисячі людей</span> обирають цей клапан
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              {
                icon: Lock,
                title: "Блокує 100% запахів",
                text: "Клапан має особливу форму та мініатюрні отвори, які забезпечують відмінну пропускну здатність води, проте не пропускають сторонні запахи з каналізаційної труби, надійно захищаючи ваше житло від смороду.",
              },
              {
                icon: Thermometer,
                title: "Витримує будь-які температури",
                text: "Силікон, з якого виготовлений клапан, витримує будь-які температури та їх перепади. Ставте у будь-які зливи в домі чи на вулиці — з гарячою та холодною водою.",
              },
              {
                icon: Wrench,
                title: "Простий монтаж",
                text: "Для монтажу не потрібні інструменти та спеціальні знання. Встановлення займає менше 10 секунд.",
              },
              {
                icon: Sparkles,
                title: "Універсальний розмір",
                text: "Еластичний силікон щільно прилягає до зливів різного діаметру — кухня, ванна, душ, пральна машина, вуличний злив.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-border bg-card p-6 transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="inline-flex rounded-xl bg-primary/15 p-3">
                  <b.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display mt-4 text-xl font-bold">
                  <span className="hl">{b.title}</span>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* odor demo gif */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <img
              src="/assets/valve-odor-demo.gif"
              alt="Демонстрація: клапан блокує прохід запахів"
              loading="lazy"
              width={400}
              height={640}
              className="mx-auto w-full max-w-sm rounded-3xl border border-border shadow-2xl"
            />
            <div>
              <h2 className="font-display text-3xl font-black md:text-4xl">
                Вода проходить. <span className="hl-mark">Запах — ні.</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Подивіться на тест: дим (запахи) повністю зупинений клапаном, тоді як вода
                вільно проходить через <span className="hl">мініатюрні отвори</span> та
                зворотний клапан. Це той самий принцип, що працює у вашому зливі.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Пропускна здатність води — відмінна",
                  "Запахи з труби — заблоковані на 100%",
                  "Зворотний потік води — також заблокований",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
                      <Check className="h-4 w-4 text-primary" />
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* MID-PAGE DISCOUNT CTA */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <div className="rounded-3xl border-2 border-primary/60 bg-card p-8 text-center shadow-2xl md:p-12">
            <div className="badge-flame mx-auto inline-flex items-center gap-2 rounded-full bg-primary px-5 py-1.5 font-display text-sm font-black uppercase tracking-wide text-primary-foreground">
              <Flame className="h-4 w-4" />
              Знижка -50% — тільки сьогодні
            </div>
            <h2 className="font-display mt-5 text-3xl font-black md:text-5xl">
              Встигніть замовити <span className="hl-mark">поки діє ціна</span>
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-6 md:flex-row">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Акція закінчиться через
                </p>
                <div className="mt-2">
                  <Timer />
                </div>
              </div>
              <div className="h-px w-full bg-border md:h-16 md:w-px" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Ціна зі знижкою
                </p>
                <p className="font-display mt-1 text-5xl font-black text-primary">
                  299 ₴{" "}
                  <span className="text-2xl text-muted-foreground line-through">598 ₴</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  А від 2 шт — <span className="hl">ще вигідніше</span>
                </p>
              </div>
            </div>
            <div className="mx-auto mt-8 max-w-md">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-primary">Залишилось 17 штук</span>
                <span className="text-muted-foreground">з 150</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
                <div className="stock-bar h-full rounded-full" style={{ width: "11%" }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Партія майже розібрана — наступна поставка за старою ціною 598 ₴
              </p>
            </div>
            <button onClick={scrollToOrder} className="cta-btn mt-9 !text-xl">
              <Package className="h-6 w-6" />
              Купити зі знижкою -50%
            </button>
          </div>
        </Reveal>
      </section>

      {/* reviews */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <h2 className="font-display text-center text-3xl font-black md:text-4xl">
            Відгуки <span className="hl">наших покупців</span>
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            Понад <span className="hl">3 200 замовлень</span> за останній місяць
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Оксана, м. Київ",
                stars: 5,
                text: "Мучилися з запахом у ванній роками, викликали сантехніка — не допомогло. Вставила цей клапан за 10 секунд і запах ЗНИК повністю. Дуже рада, що замовила!",
              },
              {
                name: "Андрій, м. Львів",
                stars: 5,
                text: "Брав одразу 3 штук: на кухню, у ванну і в гараж. Якість силікону приємна, щільно сідає в злив. Запахів немає взагалі, хоча труба стара. Рекомендую!",
              },
              {
                name: "Тетяна, м. Одеса",
                stars: 5,
                text: "Замовила для дачі — там злив на вулиці, взимку все замерзало і пахло. Клапан витримав і мороз, і спеку. Доставка прийшла за 2 дні, оплата при отриманні.",
              },
              {
                name: "Ігор, м. Харків",
                stars: 5,
                text: "Скептично ставився до такої дрібнички, але за 299 грн вирішив спробувати. Це найкращі гроші, які я витратив на дім за останній рік. Замовляйте — не пошкодуєте.",
              },
              {
                name: "Марина, м. Дніпро",
                stars: 5,
                text: "Встановила сама, чоловік ще не встиг навіть подивитися 😄 Вода йде швидко, а смороду немає. Тепер беру ще на батьків, їм теж треба!",
              },
              {
                name: "Сергій, м. Запоріжжя",
                stars: 5,
                text: "Працюю в будівельній сфері — знаю, як влаштовані сифони. Цей клапан простіший і надійніший за багато «серйозних» рішень. Установка — просто вставити і забути.",
              },
            ].map((r) => (
              <div key={r.name} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-foreground">«{r.text}»</p>
                <p className="mt-4 text-sm font-bold text-primary">{r.name}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* order form */}
      <section id="order" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-14">
        <Reveal>
          <div className="rounded-3xl border-2 border-primary/60 bg-card p-8 shadow-2xl md:p-10">
            <h2 className="font-display text-center text-3xl font-black md:text-4xl">
              Оформити <span className="hl-mark">замовлення</span>
            </h2>
            <p className="mt-3 text-center text-muted-foreground">
              Залиште заявку — ми передзвонимо протягом <span className="hl">15 хвилин</span> та
              уточнимо деталі доставки. Без передоплати!
            </p>

            {sent ? (
              <div className="mt-8 rounded-2xl border border-primary/50 bg-primary/10 p-8 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                  <Check className="h-7 w-7 text-primary-foreground" />
                </span>
                <h3 className="font-display mt-4 text-2xl font-black text-primary">
                  Замовлення прийнято!
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Дякуємо, {name || "друге"}! Наш менеджер зателефонує вам найближчим часом для
                  підтвердження замовлення.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-8 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" htmlFor="name">
                    Ваше ім'я
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Наприклад: Оксана"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none ring-ring focus:ring-2"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" htmlFor="phone">
                    Номер телефону
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+380 __ ___ __ __"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none ring-ring focus:ring-2"
                  />
                </div>
                <div>
                  <p className="mb-1.5 block text-sm font-semibold">Кількість</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          setCustom(false);
                          setQty(n);
                        }}
                        className={`rounded-xl border px-2 py-3 text-center transition-colors ${
                          !custom && qty === n
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:border-primary/50"
                        }`}
                      >
                        <span className="font-display font-bold">{n} шт</span>
                        <span className="block text-xs opacity-80">
                          {pricePer(n)} ₴/шт
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setCustom(true);
                        setQty(qty > 5 ? qty : 6);
                      }}
                      className={`rounded-xl border px-2 py-3 text-center transition-colors ${
                        custom
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/50"
                      }`}
                    >
                      <span className="font-display font-bold">5+ шт</span>
                      <span className="block text-xs opacity-80">199 ₴/шт</span>
                    </button>
                  </div>
                  {custom && (
                    <div className="mt-3">
                      <label className="mb-1.5 block text-sm font-semibold" htmlFor="qty">
                        Ваша кількість (шт)
                      </label>
                      <input
                        id="qty"
                        type="number"
                        min={6}
                        max={1000}
                        inputMode="numeric"
                        value={Number.isNaN(qty) ? "" : qty}
                        onChange={(e) => setQty(Math.min(1000, parseInt(e.target.value, 10)))}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  )}
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Чим більше берете — тим{" "}
                    <span className="hl">нижча ціна кожного клапана</span>
                  </p>
                </div>
                {error && (
                  <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
                    {error}
                  </p>
                )}
                <button type="submit" disabled={sending} className="cta-btn w-full !text-xl disabled:opacity-70">
                  <Phone className="h-6 w-6" />
                  {sending ? "Надсилаємо..." : `Замовити — ${Number.isNaN(total) ? 0 : total} ₴ за ${Number.isNaN(qty) ? 0 : qty} шт`}
                </button>
                <p className="flex items-center justify-center gap-2 pt-1 text-center text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Оплата при отриманні. Гарантія повернення коштів 14 днів.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </section>

      {/* guarantees */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Truck,
                title: "Швидка доставка",
                text: "Відправляємо в день замовлення. Доставка Новою поштою 1–2 дні по всій Україні.",
              },
              {
                icon: ShieldCheck,
                title: "Оплата при отриманні",
                text: "Огляньте товар на відділенні та лише потім платіть. Жодного ризику для вас.",
              },
              {
                icon: Clock,
                title: "Гарантія 12 місяців",
                text: "Якщо клапан втратить еластичність чи пропустить запах — замінимо безкоштовно.",
              },
            ].map((g) => (
              <div key={g.title} className="rounded-2xl border border-border bg-card p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                  <g.icon className="h-6 w-6 text-primary" />
                </span>
                <h3 className="font-display mt-4 text-lg font-bold">{g.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{g.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* final CTA + footer */}
      <footer className="border-t border-border bg-surface-deep/60 py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="font-display text-2xl font-black md:text-3xl">
            Одна дрібничка — і ваш дім <span className="hl">назавжди без запахів</span>
          </h2>
          <button onClick={scrollToOrder} className="cta-btn mt-6">
            Замовити зараз зі знижкою
          </button>
          <p className="mt-8 text-xs text-muted-foreground">
            © 2026 SilValve. Всі права захищені. Акційна пропозиція обмежена наявністю товару.
          </p>
        </div>
      </footer>
    </div>
  );
}
