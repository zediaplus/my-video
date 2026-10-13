import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {A_SIZES, FOLD_RECTS, Rect} from './sizes';
import {C, FONT} from './theme';
import {T} from './timing';
import {appear, Chip, Dim, ramp, Text, useTime} from './ui';

const SCALE = 880 / 841; // px per mm, A0 fills the width
const OX = (1080 - 841 * SCALE) / 2;
const OY = 330;
const FOLD_DUR = 0.6;

const px = (r: Rect) => ({left: OX + r.x * SCALE, top: OY + r.y * SCALE, width: r.w * SCALE, height: r.h * SCALE});
const isPortrait = (r: Rect) => r.h >= r.w;
// Half of `r` that is folded over (and later left empty)
const flapOf = (r: Rect): Rect => (isPortrait(r) ? {...r, h: r.h / 2} : {...r, w: r.w / 2});
const pulse = (t: number, from: number, dur: number) =>
  interpolate(t, [from, from + dur * 0.35, from + dur], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const mm = (i: number) => `${A_SIZES[i].w} × ${A_SIZES[i].h}`;

const SheetLabel: React.FC<{i: number; r: Rect; accent: boolean}> = ({i, r, accent}) => {
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
      }}
    >
      {A_SIZES[i].name}
    </div>
  );
};

const Ghost: React.FC<{i: number; t: number}> = ({i, t}) => {
  const r = FOLD_RECTS[i];
  const p = px(r);
  const freed = px(flapOf(r));
  const tint = pulse(t, T.recap + i * 0.32, 0.9);
  const lineHot = pulse(t, T.recap + i * 0.32, 0.9);
  const fs = Math.max(20, Math.min(46, p.width * 0.075));
  return (
    <>
      <div style={{position: 'absolute', ...freed, background: C.accent, opacity: 0.16 * tint}} />
      <div
        style={{
          position: 'absolute',
          ...p,
          border: `${2 + lineHot * 2}px solid ${lineHot > 0.05 ? C.accent : C.line}`,
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

  const enter = ramp(t, T.a0, 0.7);
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
        <SheetLabel i={done} r={sheet} accent={done === 4} />
      </>
    );
  }

  return (
    <AbsoluteFill
      style={{
        opacity: enter * (1 - exit),
        transform: `scale(${(0.94 + 0.06 * enter) * (1 - 0.04 * exit)})`,
        perspective: 3200,
      }}
    >
      {Array.from({length: ghostCount}, (_, i) => (
        <Ghost key={i} i={i} t={t} />
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
      <Caption t={t} />
    </AbsoluteFill>
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
    {
      from: T.a0,
      node: <SizeCaption i={0} chip={<span style={{opacity: ramp(t, T.a0Area)}}><Chip accent>≈ 1 م²</Chip></span>} />,
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
    ...T.folds.slice(3).map((e, k) => ({
      from: e,
      node: <SizeCaption i={k + 4} chip={k === 0 ? <Chip accent>الأشهر</Chip> : <Chip><Dim>×½</Dim></Chip>} />,
    })),
    {
      from: T.recap,
      node: (
        <div>
          <Text size={66} weight={700}>
            كل طيّة = <span style={{color: C.accent}}>نصف المساحة</span>
          </Text>
          <div style={{opacity: ramp(t, T.recapShape)}}>
            <Text size={50} weight={400} color={C.muted}>
              والشكل نفسه · النسبة <Dim>1 : 1.414</Dim>
            </Text>
          </div>
        </div>
      ),
    },
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
