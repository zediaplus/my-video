import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {A_SIZES, FOLD_RECTS, Rect} from './sizes';
import {C, FONT} from './theme';
import {T} from './timing';
import {appear, Chip, Dim, ramp, Text, useTime} from './ui';
import {DocumentPage, FlyerPage, SlidesPage} from './Mockups';

const SCALE = 880 / 841; // px per mm, A0 fills the width
const OX = (1080 - 841 * SCALE) / 2;
const OY = 330;
const FOLD_DUR = 0.6;
// Where A4 sits once it fills the screen
const A4_VIEW = {left: 110, width: 860, top: 330};

const px = (r: Rect) => ({left: OX + r.x * SCALE, top: OY + r.y * SCALE, width: r.w * SCALE, height: r.h * SCALE});
const isPortrait = (r: Rect) => r.h >= r.w;
// Half of `r` that is folded over (and later left empty)
const flapOf = (r: Rect): Rect => (isPortrait(r) ? {...r, h: r.h / 2} : {...r, w: r.w / 2});

const mm = (i: number) => `${A_SIZES[i].w} × ${A_SIZES[i].h}`;

const SheetLabel: React.FC<{i: number; r: Rect; accent: boolean; opacity: number}> = ({i, r, accent, opacity}) => {
  const p = px(r);
  const size = Math.max(26, Math.min(130, p.width * 0.2));
  return (
    <div
      style={{
        position: 'absolute',
        ...p,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        color: accent ? C.accent : C.ink,
        lineHeight: 1,
        opacity,
      }}
    >
      {A_SIZES[i].name}
    </div>
  );
};

const Ghost: React.FC<{i: number}> = ({i}) => {
  const r = FOLD_RECTS[i];
  const p = px(r);
  const fs = Math.max(20, Math.min(46, p.width * 0.075));
  return (
    <>
      <div
        style={{
          position: 'absolute',
          ...p,
          border: `2px solid ${C.line}`,
          opacity: 0.75,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: p.left + 12,
          top: p.top + 8,
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: fs,
          color: C.muted,
        }}
      >
        {A_SIZES[i].name}
      </div>
    </>
  );
};

const paperStyle: React.CSSProperties = {
  position: 'absolute',
  background: C.paper,
  boxShadow: '0 14px 40px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.08)',
};

export const PaperStage: React.FC = () => {
  const t = useTime();
  const ends = T.folds;
  const starts = ends.map((e) => e - FOLD_DUR);
  const done = ends.filter((e) => t >= e).length; // index of current sheet
  const folding = done < ends.length && t >= starts[done];
  const j = done + 1; // the fold in progress (if any)
  const prog = folding
    ? interpolate(t, [starts[done], ends[done]], [0, 1], {easing: Easing.inOut(Easing.cubic)})
    : 0;

  const enter = ramp(t, T.basics, 0.7);
  const exit = ramp(t, T.stageOut, 0.5, Easing.in(Easing.cubic));
  const ghostCount = done + (folding ? 1 : 0);

  // Midline that glows before each fold
  const sheet = FOLD_RECTS[done];
  const hintFrom = done === 0 ? T.foldHint : starts[done] - 0.35;
  const hint =
    done < ends.length && !folding
      ? done === 0
        ? ramp(t, hintFrom, 0.4) * (0.6 + 0.4 * Math.sin((t - hintFrom) * 6))
        : ramp(t, hintFrom, 0.2)
      : 0;
  const sp = px(sheet);
  const mid = isPortrait(sheet)
    ? {left: sp.left - 20, top: sp.top + sp.height / 2 - 2, width: sp.width + 40, height: 4}
    : {left: sp.left + sp.width / 2 - 2, top: sp.top - 20, width: 4, height: sp.height + 40};

  let paper: React.ReactNode;
  if (folding) {
    const parent = FOLD_RECTS[j - 1];
    const flap = px(flapOf(parent));
    const portrait = isPortrait(parent);
    const angle = prog * 180;
    const shade = 1 - 0.22 * Math.sin(prog * Math.PI);
    paper = (
      <>
        <div style={{...paperStyle, ...px(FOLD_RECTS[j])}} />
        <div
          style={{
            ...paperStyle,
            ...flap,
            background: prog > 0.5 ? '#efede9' : C.paper,
            filter: `brightness(${shade})`,
            transformOrigin: portrait ? '50% 100%' : '100% 50%',
            transform: portrait ? `rotateX(${angle}deg)` : `rotateY(${angle}deg)`,
            boxShadow: `0 ${10 + 30 * Math.sin(prog * Math.PI)}px 50px rgba(0,0,0,${0.12 + 0.12 * Math.sin(prog * Math.PI)})`,
          }}
        />
      </>
    );
  } else {
    const pop = done > 0 ? interpolate(t - ends[done - 1], [0, 0.12, 0.35], [1, 1.035, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
    paper = (
      <>
        <div style={{...paperStyle, ...sp, transform: `scale(${pop})`}} />
        <SheetLabel i={done} r={sheet} accent={done === 4} opacity={done === 0 ? ramp(t, T.a0, 0.3) : done === 4 ? 1 - ramp(t, T.a4Docs, 0.3) : 1} />
      </>
    );
  }

  // Camera: A4 fills the screen while its uses are shown
  const zoom =
    ramp(t, T.folds[3], 0.65, Easing.inOut(Easing.cubic)) * (1 - ramp(t, T.goOn, 0.55, Easing.inOut(Easing.cubic)));
  const a4 = px(FOLD_RECTS[4]);
  const S = 1 + (A4_VIEW.width / a4.width - 1) * zoom;
  const tx = (A4_VIEW.left - (A4_VIEW.width / a4.width) * a4.left) * zoom;
  const ty = (A4_VIEW.top - (A4_VIEW.width / a4.width) * a4.top) * zoom;
  const a4Now = {left: a4.left * S + tx, top: a4.top * S + ty, width: a4.width * S, height: a4.height * S};

  return (
    <AbsoluteFill
      style={{
        opacity: enter * (1 - exit),
        transform: `scale(${(0.94 + 0.06 * enter) * (1 - 0.04 * exit)})`,
      }}
    >
      <AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${S})`, perspective: 3200}}>
      {Array.from({length: ghostCount}, (_, i) => (
        <Ghost key={i} i={i} />
      ))}
      {paper}
      <div
        style={{
          position: 'absolute',
          ...mid,
          background: C.accent,
          opacity: hint,
          boxShadow: `0 0 18px ${C.accent}`,
          borderRadius: 2,
        }}
      />
      </AbsoluteFill>
      {done === 4 && <A4Uses t={t} rect={a4Now} />}
      <Caption t={t} />
    </AbsoluteFill>
  );
};

// «للمستندات والعروض والمطبوعات اليومية»: printed A4 pages stacked on the full-screen A4
const A4Uses: React.FC<{t: number; rect: {left: number; top: number; width: number; height: number}}> = ({t, rect}) => {
  const u = rect.width / 100;
  const leave = ramp(t, T.goOn, 0.45, Easing.in(Easing.cubic));
  const docs = ramp(t, T.a4Docs, 0.35) * (1 - leave);
  const pages = [
    {from: T.a4Slides, dir: 1, rot: 3, node: <SlidesPage u={u} />, label: 'عروض'},
    {from: T.a4Daily, dir: -1, rot: -2.5, node: <FlyerPage u={u} />, label: 'مطبوعات يومية'},
  ];
  const label = (text: string, o: number) => (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: -28, display: 'flex', justifyContent: 'center', opacity: o}}>
      <Chip accent style={{fontSize: 46, padding: '10px 36px', boxShadow: '0 8px 20px rgba(0,0,0,0.2)'}}>{text}</Chip>
    </div>
  );
  return (
    <>
      <div style={{position: 'absolute', ...rect, opacity: docs}}>
        <DocumentPage u={u} />
        {label('مستندات', ramp(t, T.a4Docs + 0.1, 0.3) * (1 - ramp(t, T.a4Slides, 0.2)))}
      </div>
      {pages.map((p, k) => {
        const inP = ramp(t, p.from, 0.45, Easing.out(Easing.cubic));
        const x = (1 - inP) * 1100 * p.dir + leave * 1200 * p.dir;
        const nextFrom = pages[k + 1]?.from;
        return (
          <div
            key={k}
            style={{
              ...paperStyle,
              ...rect,
              transform: `translateX(${x}px) rotate(${p.rot * inP}deg)`,
              opacity: inP > 0 ? 1 : 0,
            }}
          >
            {p.node}
            {label(p.label, ramp(t, p.from + 0.15, 0.3) * (nextFrom ? 1 - ramp(t, nextFrom, 0.2) : 1))}
          </div>
        );
      })}
    </>
  );
};

type Cap = {from: number; node: React.ReactNode};

const SizeCaption: React.FC<{i: number; chip?: React.ReactNode}> = ({i, chip}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 28, direction: 'rtl'}}>
      <Text size={112} weight={700} color={i === 4 ? C.accent : C.ink} style={{direction: 'ltr'}}>
        {A_SIZES[i].name}
      </Text>
      {chip}
    </div>
    <Text size={52} weight={400} color={C.muted}>
      <Dim>{mm(i)}</Dim> مم
    </Text>
  </div>
);

const Caption: React.FC<{t: number}> = ({t}) => {
  const caps: Cap[] = [
    {from: T.basics, node: <Text size={72} weight={700}>نبدأ بالأساس</Text>},
    {
      from: T.a0,
      node: <SizeCaption i={0} chip={<span style={{opacity: ramp(t, T.a0Area)}}><Chip accent>≈ 1 م²</Chip></span>} />,
    },
    {
      from: T.secret,
      node: (
        <Text size={66} weight={700}>
          وسرّ السلسلة كلها… <span style={{color: C.accent}}>بسيط</span>
        </Text>
      ),
    },
    {
      from: T.foldHint,
      node: (
        <div>
          <Text size={66} weight={700}>نطوي الورقة نصفين</Text>
          <Text size={50} weight={400} color={C.muted}>فنحصل على المقاس اللي بعده</Text>
        </div>
      ),
    },
    ...T.folds.slice(0, 3).map((e, k) => ({
      from: e,
      node: <SizeCaption i={k + 1} chip={<Chip><Dim>×½</Dim></Chip>} />,
    })),
    {
      from: T.famous,
      node: <Text size={72} weight={700}>وهنا المقاس الأشهر…</Text>,
    },
    {from: T.folds[3], node: <SizeCaption i={4} chip={<Chip accent>الأشهر</Chip>} />},
    {from: T.goOn, node: <Text size={72} weight={700}>ونكمل…</Text>},
    ...T.folds.slice(4).map((e, k) => ({
      from: e,
      node: <SizeCaption i={k + 5} chip={<Chip><Dim>×½</Dim></Chip>} />,
    })),
  ];
  return (
    <>
      {caps.map((c, k) => {
        const to = caps[k + 1]?.from;
        if (t < c.from - 0.1 || (to !== undefined && t > to)) return null;
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 1598,
              height: 300,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              ...appear(t, c.from, to === undefined ? undefined : to - 0.38, 24),
            }}
          >
            {c.node}
          </div>
        );
      })}
    </>
  );
};
