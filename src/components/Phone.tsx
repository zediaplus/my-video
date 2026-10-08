import React from 'react';
import { COLORS, FONT_FAMILY } from '../config';
import { Icon, IconName } from './Icon';
import { Storefront } from './illustrations';

/** Generic smartphone frame. The device itself is LTR; Arabic UI inside sets its own direction. */
export const Phone: React.FC<{ width?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  width = 500,
  children,
  style,
}) => {
  const height = width * 2.05;
  return (
    <div
      dir="ltr"
      style={{
        width,
        height,
        borderRadius: width * 0.14,
        background: '#0E1726',
        padding: width * 0.032,
        boxShadow: '0 60px 90px -30px rgba(10,40,90,0.45), 0 20px 40px -20px rgba(10,40,90,0.35)',
        position: 'relative',
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: width * 0.115,
          overflow: 'hidden',
          background: '#FFFFFF',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: width * 0.03,
            left: '50%',
            transform: 'translateX(-50%)',
            width: width * 0.3,
            height: width * 0.07,
            borderRadius: 40,
            background: '#0E1726',
            zIndex: 5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: width * 0.035,
            left: width * 0.08,
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: width * 0.04,
            color: COLORS.ink,
            zIndex: 5,
          }}
        >
          9:41
        </div>
        {children}
      </div>
    </div>
  );
};

const ACTIONS: { icon: IconName; label: string }[] = [
  { icon: 'phone', label: 'اتصال' },
  { icon: 'directions', label: 'الاتجاهات' },
  { icon: 'globe', label: 'الموقع' },
  { icon: 'pin', label: 'حفظ' },
];

/**
 * Illustrative business-profile screen (no real business, rating or numbers).
 * `reveal` values go 0→1 to fill each section in.
 */
export const ProfileScreen: React.FC<{
  width: number;
  header?: number;
  actions?: number;
  rows?: number[];
  rowLabels?: string[];
  gallery?: number;
  galleryNodes?: React.ReactNode[];
}> = ({ width, header = 1, actions = 1, rows = [], rowLabels = [], gallery = 0, galleryNodes = [] }) => {
  const u = width / 100; // 1% of inner screen width
  const rowIcons: IconName[] = ['list', 'post', 'phone', 'clock'];
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: FONT_FAMILY, direction: 'rtl' }}>
      <div style={{ height: u * 52, overflow: 'hidden', opacity: header, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}>
          <Storefront width={width * 1.05} />
        </div>
      </div>
      <div style={{ padding: `${u * 4}px ${u * 6}px` }}>
        <div style={{ fontSize: u * 6.4, fontWeight: 700, color: COLORS.ink, opacity: header }}>نشاطك التجاري</div>
        <div style={{ display: 'flex', gap: u * 2, alignItems: 'center', marginTop: u * 1.5, opacity: header }}>
          <div style={{ fontSize: u * 3.8, color: COLORS.inkSoft }}>التصنيف المناسب · مفتوح الآن</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: u * 5 }}>
          {ACTIONS.map((a, i) => {
            const p = Math.min(1, Math.max(0, actions * 4 - i));
            return (
              <div key={a.label} style={{ textAlign: 'center', opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
                <div
                  style={{
                    width: u * 15,
                    height: u * 15,
                    borderRadius: u * 15,
                    border: `2px solid ${COLORS.line}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    color: COLORS.blue,
                  }}
                >
                  <Icon name={a.icon} size={u * 7} />
                </div>
                <div style={{ fontSize: u * 3.4, color: COLORS.blueDeep, marginTop: u * 1.5, fontWeight: 500 }}>{a.label}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: u * 5 }}>
          {rows.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: u * 3,
                padding: `${u * 2.6}px 0`,
                borderTop: `1.5px solid ${COLORS.line}`,
                opacity: Math.min(1, r * 1.4),
              }}
            >
              <div style={{ color: COLORS.blue }}>
                <Icon name={rowIcons[i % rowIcons.length]} size={u * 6.5} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: u * 4.2, fontWeight: 600, color: COLORS.ink }}>{rowLabels[i]}</div>
                <div
                  style={{
                    height: u * 2,
                    width: `${r * (60 + ((i * 17) % 30))}%`,
                    background: '#E3ECF7',
                    borderRadius: u,
                    marginTop: u * 1.4,
                  }}
                />
              </div>
              <div
                style={{
                  width: u * 6,
                  height: u * 6,
                  borderRadius: u * 6,
                  background: COLORS.gGreen,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${Math.max(0, r * 2 - 1)})`,
                }}
              >
                <Icon name="check" size={u * 4.4} stroke={3} />
              </div>
            </div>
          ))}
        </div>
        {gallery > 0 && (
          <div style={{ opacity: Math.min(1, gallery * 2) }}>
            <div style={{ fontSize: u * 4.4, fontWeight: 700, color: COLORS.ink, margin: `${u * 2}px 0 ${u * 2}px` }}>
              الصور والفيديوهات
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: u * 2 }}>
              {galleryNodes.map((n, i) => (
                <div key={i} style={{ height: u * 30, borderRadius: u * 3, overflow: 'hidden', background: '#E8F0FA' }}>
                  {n}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
