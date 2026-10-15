// Hand-drawn product mockups for the things the voiceover names.
import {Img, staticFile} from 'remotion';
import {C, FONT} from './theme';

const bar = (w: number | string, h = 14, color = '#d9d6d1', extra?: React.CSSProperties): React.CSSProperties => ({
  width: w,
  height: h,
  borderRadius: h / 2,
  background: color,
  ...extra,
});

const pageBase: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  padding: '7% 8%',
  display: 'flex',
  flexDirection: 'column',
  direction: 'rtl',
  fontFamily: FONT,
  color: C.ink,
};

// «مستندات»: an Arabic report page
export const DocumentPage: React.FC<{u: number}> = ({u}) => (
  <div style={{...pageBase, gap: 2.2 * u}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 1.5 * u}}>
        <div style={{width: 6 * u, height: 6 * u, borderRadius: 1.2 * u, background: C.accent}} />
        <div style={{fontSize: 3.4 * u, fontWeight: 700}}>شركة الأفق التجارية</div>
      </div>
      <div style={{fontSize: 2.6 * u, color: C.muted}}>2026/10/13</div>
    </div>
    <div style={{height: 2, background: C.ink, opacity: 0.85}} />
    <div style={{fontSize: 5.6 * u, fontWeight: 700}}>التقرير الشهري</div>
    <div style={{fontSize: 3 * u, color: C.muted, marginTop: -u}}>ملخص الأداء والمبيعات</div>
    {[100, 96, 98, 70].map((w, i) => (
      <div key={i} style={bar(`${w}%`, 1.6 * u)} />
    ))}
    <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', border: `2px solid #cfcbc5`, marginTop: u}}>
      {['البند', 'الكمية', 'المبلغ', 'كروت', '500', '250', 'استيكرات', '1000', '300', 'مطويات', '200', '400'].map((c, i) => (
        <div
          key={i}
          style={{
            fontSize: 2.7 * u,
            padding: `${1.1 * u}px ${1.4 * u}px`,
            background: i < 3 ? '#efece7' : 'transparent',
            fontWeight: i < 3 ? 700 : 400,
            borderTop: i >= 3 ? '1px solid #e2ded8' : 'none',
          }}
        >
          {c}
        </div>
      ))}
    </div>
    {[100, 92, 97, 60].map((w, i) => (
      <div key={i} style={bar(`${w}%`, 1.6 * u)} />
    ))}
    <div style={{marginTop: 'auto', alignSelf: 'flex-start', ...bar(22 * u, 1.2 * u, C.ink)}} />
  </div>
);

// «عروض»: a printed presentation slide with a chart
export const SlidesPage: React.FC<{u: number}> = ({u}) => (
  <div style={{...pageBase, gap: 2.4 * u}}>
    <div style={{background: C.ink, color: '#fff', margin: '-8% -9% 0', padding: '6% 8%', fontSize: 5.4 * u, fontWeight: 700}}>
      خطة الربع القادم
      <div style={{fontSize: 2.8 * u, fontWeight: 400, opacity: 0.7, marginTop: 0.6 * u}}>عرض تقديمي · الشريحة 3</div>
    </div>
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 3 * u, height: 40 * u, padding: `0 ${2 * u}px`, borderBottom: '3px solid #cfcbc5'}}>
      {[45, 62, 52, 80, 95].map((h, i) => (
        <div key={i} style={{flex: 1, height: `${h}%`, background: i === 4 ? C.accent : '#b9b5ae', borderRadius: `${u}px ${u}px 0 0`}} />
      ))}
    </div>
    {['زيادة المبيعات 25٪', 'إطلاق منتجات جديدة', 'توسيع قنوات التوزيع'].map((s) => (
      <div key={s} style={{display: 'flex', alignItems: 'center', gap: 2 * u, fontSize: 3.6 * u, fontWeight: 600}}>
        <div style={{width: 2 * u, height: 2 * u, borderRadius: '50%', background: C.accent}} />
        {s}
      </div>
    ))}
  </div>
);

// «مطبوعات يومية»: a flyer
export const FlyerPage: React.FC<{u: number}> = ({u}) => (
  <div style={{...pageBase, padding: 0}}>
    <div
      style={{
        height: '46%',
        background: `linear-gradient(135deg, ${C.accent}, #f2a35e)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
      }}
    >
      <div style={{fontSize: 3.6 * u, fontWeight: 600, opacity: 0.9}}>افتتاح فرعنا الجديد</div>
      <div style={{fontSize: 10 * u, fontWeight: 700, lineHeight: 1.1}}>خصم 30٪</div>
      <div style={{fontSize: 3.2 * u, marginTop: u}}>على جميع المنتجات</div>
    </div>
    <div style={{padding: '6% 8%', display: 'flex', flexDirection: 'column', gap: 2.2 * u}}>
      <div style={{display: 'flex', gap: 3 * u}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{flex: 1, aspectRatio: '1', borderRadius: 2 * u, background: ['#efe3d6', '#e6ece4', '#e9e4ef'][i]}} />
        ))}
      </div>
      {[100, 85, 92].map((w, i) => (
        <div key={i} style={bar(`${w}%`, 1.6 * u)} />
      ))}
      <div style={{fontSize: 3.4 * u, fontWeight: 700, marginTop: u}}>بريدة · طريق الملك عبدالعزيز</div>
    </div>
  </div>
);

// «كرت الأعمال» 9 × 5 cm
export const BusinessCard: React.FC<{w: number; h: number}> = ({w, h}) => {
  const u = h / 50;
  return (
    <div
      style={{
        width: w,
        height: h,
        background: '#161616',
        borderRadius: 1.5 * u,
        boxShadow: '0 20px 50px rgba(0,0,0,0.28)',
        position: 'relative',
        overflow: 'hidden',
        direction: 'rtl',
        fontFamily: FONT,
        color: '#fff',
      }}
    >
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 * u, background: C.accent}} />
      <div style={{position: 'absolute', right: 6 * u, top: 7 * u}}>
        <div style={{fontSize: 6.5 * u, fontWeight: 700}}>اسمك هنا</div>
        <div style={{fontSize: 3.8 * u, opacity: 0.7, marginTop: u}}>مدير المبيعات</div>
      </div>
      <div style={{position: 'absolute', right: 6 * u, bottom: 6 * u, fontSize: 3.4 * u, lineHeight: 1.6, opacity: 0.85}}>
        <div style={{direction: 'ltr', textAlign: 'right'}}>+966 5X XXX XXXX</div>
        <div>بريدة · القصيم</div>
      </div>
      <Img
        src={staticFile('img/logo.png')}
        style={{position: 'absolute', left: 9 * u, top: '50%', height: 22 * u, transform: 'translateY(-50%)', filter: 'invert(1)'}}
      />
    </div>
  );
};

const cardFace: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backfaceVisibility: 'hidden',
  borderRadius: 10,
  overflow: 'hidden',
  direction: 'rtl',
  fontFamily: FONT,
  boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
};

// «للبطاقات»: invitation card (14 × 10)
export const InviteCard: React.FC<{u: number}> = ({u}) => (
  <div
    style={{
      ...cardFace,
      background: '#fbf7f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1.6 * u,
      color: '#5b4a35',
    }}
  >
    <div style={{position: 'absolute', inset: 3 * u, border: `2px solid #c9a96e`, borderRadius: 6}} />
    <div style={{position: 'absolute', inset: 4.2 * u, border: `1px solid #e0cba0`, borderRadius: 4}} />
    <div style={{fontSize: 3.6 * u, letterSpacing: 2, color: '#a3824b'}}>بكل حب ندعوكم</div>
    <div style={{fontSize: 11 * u, fontWeight: 700, color: '#8a6a35', lineHeight: 1.1}}>دعوة زفاف</div>
    <div style={{width: 24 * u, height: 2, background: '#c9a96e'}} />
    <div style={{fontSize: 3.6 * u}}>الخميس · ٢٠ نوفمبر · الساعة ٨ مساءً</div>
  </div>
);

// «والعروض»: promo card (14 × 10)
export const OfferCard: React.FC<{u: number}> = ({u}) => (
  <div
    style={{
      ...cardFace,
      transform: 'rotateY(180deg)',
      background: `linear-gradient(135deg, ${C.accent}, #f2a35e)`,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: `0 ${5 * u}px`,
    }}
  >
    <div>
      <div style={{fontSize: 4.2 * u, opacity: 0.9}}>عرض خاص</div>
      <div style={{fontSize: 16 * u, fontWeight: 700, lineHeight: 1}}>‎-20٪</div>
      <div style={{fontSize: 3.4 * u, opacity: 0.9, marginTop: u}}>لفترة محدودة</div>
    </div>
    <div style={{width: 30 * u, height: 30 * u, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 6 * u, fontWeight: 700}}>
      SALE
    </div>
  </div>
);

// Round sticker used on the packaging
export const Sticker: React.FC<{d: number; tone?: 'light' | 'dark' | 'accent'; text: string}> = ({d, tone = 'light', text}) => {
  const bg = tone === 'dark' ? '#161616' : tone === 'accent' ? C.accent : '#fbfaf8';
  const fg = tone === 'light' ? C.accent : '#fff';
  return (
    <div
      style={{
        width: d,
        height: d,
        borderRadius: '50%',
        background: bg,
        boxShadow: '0 3px 8px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: tone === 'light' ? '2px solid #e8e4de' : 'none',
        position: 'relative',
      }}
    >
      <div style={{position: 'absolute', width: d * 0.8, height: d * 0.8, borderRadius: '50%', border: `2px dashed ${fg}`, opacity: 0.6}} />
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: d * 0.2, color: fg, direction: 'rtl', textAlign: 'center', lineHeight: 1.1}}>{text}</div>
    </div>
  );
};

// Packaging: kraft box, glass jar, paper bag
export const KraftBox: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <div style={{position: 'relative', width: 300, height: 260}}>
    <div style={{position: 'absolute', left: 0, top: 50, width: 300, height: 210, background: 'linear-gradient(180deg,#c99a64,#b88752)', borderRadius: 6, boxShadow: '0 18px 40px rgba(0,0,0,0.22)'}} />
    <div style={{position: 'absolute', left: -10, top: 20, width: 320, height: 50, background: 'linear-gradient(180deg,#d8ab75,#c99a64)', borderRadius: 6}} />
    <div style={{position: 'absolute', left: 140, top: 20, width: 20, height: 240, background: 'rgba(255,255,255,0.18)'}} />
    <div style={{position: 'absolute', left: 150, top: 155, transform: 'translate(-50%,-50%)'}}>{children}</div>
  </div>
);

export const Jar: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <div style={{position: 'relative', width: 220, height: 300}}>
    <div style={{position: 'absolute', left: 25, top: 0, width: 170, height: 50, background: 'linear-gradient(180deg,#2b2b2b,#111)', borderRadius: 8}} />
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 44,
        width: 220,
        height: 256,
        background: 'linear-gradient(90deg,#e7d3b4 0%,#f4e6cf 35%,#dcc39c 100%)',
        borderRadius: '30px 30px 36px 36px',
        boxShadow: '0 18px 40px rgba(0,0,0,0.22), inset 0 0 0 3px rgba(255,255,255,0.35)',
      }}
    />
    <div style={{position: 'absolute', left: 30, top: 70, width: 22, height: 190, borderRadius: 11, background: 'rgba(255,255,255,0.45)'}} />
    <div style={{position: 'absolute', left: 110, top: 175, transform: 'translate(-50%,-50%)'}}>{children}</div>
  </div>
);

export const PaperBag: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <div style={{position: 'relative', width: 240, height: 320}}>
    <div style={{position: 'absolute', left: 60, top: 0, width: 120, height: 90, border: '10px solid #1a1a1a', borderBottom: 'none', borderRadius: '60px 60px 0 0'}} />
    <div style={{position: 'absolute', left: 0, top: 70, width: 240, height: 250, background: 'linear-gradient(180deg,#fbfaf8,#ebe8e3)', borderRadius: 6, boxShadow: '0 18px 40px rgba(0,0,0,0.2)'}} />
    <div style={{position: 'absolute', left: 120, top: 195, transform: 'translate(-50%,-50%)'}}>{children}</div>
  </div>
);
