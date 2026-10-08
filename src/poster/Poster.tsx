import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS, EVIDENCE, FONT_FAMILY } from '../config';
import { loadFonts } from '../fonts';
import { Icon, IconName } from '../components/Icon';
import { Phone, ProfileScreen } from '../components/Phone';
import { Logo, MapPin, PhoneNumber, SHADOW, arabic } from '../components/ui';
import { Podium } from '../scenes/Brand';

loadFonts();

// Static poster (feed 4:5) for the Zedia Google Maps services ad — same identity as the video.
export const POSTER = { id: 'ZediaMapsPoster', width: 1080, height: 1350 };

const SERVICES: { icon: IconName; text: string }[] = [
  { icon: 'edit', text: 'إنشاء ملف نشاطك أو تحسينه' },
  { icon: 'shield', text: 'المساعدة في إثبات الملكية' },
  { icon: 'pin', text: 'ضبط الموقع واختيار التصنيف' },
  { icon: 'camera', text: 'تصوير المكان والمنتجات' },
  { icon: 'star', text: 'طلب التقييمات والرد عليها' },
  { icon: 'target', text: 'حملات Google الإعلانية' },
];

const BAND_COLORS = [COLORS.gRed, '#F57C2B', COLORS.gYellow, COLORS.gGreen, COLORS.gBlue];

const Ribbons: React.FC = () => (
  <svg width={1080} height={1350} style={{ position: 'absolute', inset: 0 }}>
    <defs>
      <filter id="pGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="22" />
      </filter>
      <radialGradient id="pFocus">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
    </defs>
    {BAND_COLORS.map((color, i) => {
      const o = (i - 2) * 40;
      const d = `M-200 ${1180 + o * 1.2} C 60 ${1060 + o}, 160 ${820 + o * 0.6}, 300 ${690 + o * 0.2}`;
      return (
        <g key={color}>
          <path d={d} stroke={color} strokeWidth={70} fill="none" opacity={0.25} filter="url(#pGlow)" />
          <path d={d} stroke={color} strokeWidth={42} fill="none" opacity={0.9} />
        </g>
      );
    })}
    <circle cx={300} cy={690} r={150} fill="url(#pFocus)" />
  </svg>
);

const FloatCard: React.FC<{ icon: IconName; label: string; color: string; x: number; y: number }> = ({ icon, label, color, x, y }) => (
  <div
    style={{
      ...arabic,
      position: 'absolute',
      left: x,
      top: y,
      width: 150,
      padding: '16px 0 14px',
      textAlign: 'center',
      borderRadius: 26,
      background: 'rgba(255,255,255,0.85)',
      border: '2px solid rgba(255,255,255,0.95)',
      boxShadow: SHADOW,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Icon name={icon} size={46} color={color} stroke={2.2} />
    </div>
    <div style={{ fontSize: 24, fontWeight: 600, color: COLORS.ink, marginTop: 6 }}>{label}</div>
  </div>
);

export const Poster: React.FC = () => {
  const phoneW = 270;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #FFFFFF 0%, ${COLORS.bg} 55%, ${COLORS.bgDeep} 100%)`, fontFamily: FONT_FAMILY }}>
      {/* faint grid + light */}
      <AbsoluteFill
        style={{
          opacity: 0.55,
          backgroundImage: `linear-gradient(${COLORS.line} 1.5px, transparent 1.5px), linear-gradient(90deg, ${COLORS.line} 1.5px, transparent 1.5px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 25%, transparent 75%)',
        }}
      />
      <div style={{ position: 'absolute', width: 800, height: 800, borderRadius: 800, left: -360, top: -320, background: 'radial-gradient(circle, rgba(18,176,221,0.18), transparent 65%)' }} />
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: 900, right: -420, bottom: -380, background: 'radial-gradient(circle, rgba(11,127,199,0.16), transparent 65%)' }} />

      {/* header */}
      <div style={{ position: 'absolute', top: 44, left: 64, right: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'rtl' }}>
        <Logo width={190} />
        <div
          style={{
            ...arabic,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 26,
            fontWeight: 600,
            color: COLORS.blueDeep,
            background: 'white',
            border: `1.5px solid ${COLORS.line}`,
            borderRadius: 40,
            padding: '10px 22px',
            boxShadow: '0 10px 24px -14px rgba(14,46,96,0.3)',
          }}
        >
          <Icon name="map" size={30} color={COLORS.blue} />
          خدمات خرائط Google
        </div>
      </div>

      {/* headline */}
      <div style={{ ...arabic, position: 'absolute', top: 200, left: 64, right: 64, textAlign: 'center' }}>
        <div style={{ fontSize: 72, fontWeight: 700, color: COLORS.ink, lineHeight: 1.28 }}>
          هل يجدك عملاؤك
          <br />
          على <span style={{ color: COLORS.blue }}>خرائط Google</span>؟
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
          <div
            style={{
              width: 190,
              height: 9,
              borderRadius: 9,
              background: `linear-gradient(90deg, ${COLORS.gBlue} 0 25%, ${COLORS.gRed} 25% 50%, ${COLORS.gYellow} 50% 75%, ${COLORS.gGreen} 75%)`,
            }}
          />
        </div>
        <div style={{ fontSize: 31, fontWeight: 500, color: COLORS.inkSoft, marginTop: 16 }}>
          نبني لنشاطك حضورًا واضحًا ومتكاملًا… يجعل الوصول إليك أسهل
        </div>
      </div>

      {/* visual: ribbons + phone on podium (left) */}
      <Ribbons />
      <div style={{ position: 'absolute', left: 300 - 210, top: 1030 }}>
        <Podium width={420} />
      </div>
      <div style={{ position: 'absolute', left: 300 - phoneW / 2, top: 540 }}>
        <Phone width={phoneW}>
          <ProfileScreen width={phoneW * 0.936} actions={1} rows={[1, 1, 1, 1]} rowLabels={['الخدمات', 'وصف النشاط', 'رقم التواصل', 'ساعات العمل']} />
        </Phone>
      </div>
      <FloatCard icon="phone" label="اتصال" color={COLORS.gGreen} x={40} y={600} />
      <FloatCard icon="star" label="التقييمات" color={COLORS.gYellow} x={372} y={900} />
      <div style={{ position: 'absolute', left: 370, top: 520 }}>
        <MapPin size={76} />
      </div>

      {/* services (right) */}
      <div style={{ ...arabic, position: 'absolute', top: 540, right: 64, width: 470, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SERVICES.map((s) => (
          <div
            key={s.text}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: 'white',
              border: `1.5px solid ${COLORS.line}`,
              borderRadius: 24,
              padding: '12px 18px',
              boxShadow: '0 14px 30px -20px rgba(14,46,96,0.35)',
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 18,
                background: `linear-gradient(160deg, ${COLORS.cyan}, ${COLORS.blue})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name={s.icon} size={32} color="white" stroke={2.1} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, color: COLORS.ink }}>{s.text}</div>
          </div>
        ))}
      </div>

      {/* real proof */}
      <div style={{ ...arabic, position: 'absolute', top: 1112, left: 64, right: 64, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 27, color: COLORS.inkSoft, fontWeight: 500 }}>
          <Icon name="eye" size={32} color={COLORS.blue} />
          <span>
            <span dir="ltr" style={{ unicodeBidi: 'isolate', fontWeight: 700, color: COLORS.blueDeep }}>
              {EVIDENCE.photosTab.views}
            </span>{' '}
            مشاهدة لصورنا ومساهماتنا على خرائط Google
          </span>
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          ...arabic,
          position: 'absolute',
          left: 64,
          right: 64,
          bottom: 44,
          height: 150,
          borderRadius: 36,
          background: `linear-gradient(135deg, ${COLORS.blueDeep}, ${COLORS.blue})`,
          boxShadow: SHADOW,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 34px',
        }}
      >
        <div style={{ color: 'white' }}>
          <div style={{ fontSize: 34, fontWeight: 700 }}>أرسل رابط نشاطك</div>
          <div style={{ fontSize: 26, fontWeight: 500, opacity: 0.9, marginTop: 4 }}>ولنحدّد معًا فرص تطويره</div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: `linear-gradient(180deg, #27B85A, ${COLORS.call})`,
            borderRadius: 60,
            padding: '12px 30px 12px 12px',
            direction: 'ltr',
            boxShadow: '0 16px 30px -14px rgba(0,0,0,0.45)',
          }}
        >
          <div style={{ width: 70, height: 70, borderRadius: 70, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="phone" size={38} color={COLORS.call} stroke={2.4} />
          </div>
          <PhoneNumber size={48} color="white" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
