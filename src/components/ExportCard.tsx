'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { type DivinationResult } from '@/lib/meihua';
import { type CharacterInfo } from '@/lib/character';
import { type FortuneResult } from '@/lib/fortune';
import { getWuXingColor } from '@/lib/wuxing';
import { useLanguage } from '@/lib/i18n';

interface ExportCardProps {
  divination: DivinationResult;
  characters: CharacterInfo[];
  fortune: FortuneResult;
}

export default function ExportCard({ divination, characters, fortune }: ExportCardProps) {
  const { t } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleExport = useCallback(async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: '#F5F0EB',
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `天机测字_${characters.map(c => c.char).join('')}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  }, [characters]);

  const scoreLabel = (score: number) => ['凶', '小凶', '中平', '小吉', '大吉'][score - 1] || '中平';

  return (
    <>
      {/* 导出按钮 */}
      <motion.button
        onClick={() => setShowPreview(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full max-w-lg mx-auto mt-6 py-3 px-6 border-2 border-[var(--color-zhu-sha)]
                   text-[var(--color-zhu-sha)] text-sm tracking-[0.3em] block
                   transition-all duration-300
                   hover:bg-[var(--color-zhu-sha)] hover:text-white"
      >
        {t('export.button')}
      </motion.button>

      {/* 预览弹窗 */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
             onClick={() => setShowPreview(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-[420px] w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* === 导出用的精美排版卡片 === */}
            <div ref={cardRef} style={{
              width: '400px',
              padding: '40px 32px',
              backgroundColor: '#F5F0EB',
              fontFamily: '"Noto Serif SC", "Source Han Serif SC", serif',
              color: '#2C2C2C',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* 水印纹理 */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.03, fontSize: '180px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#8B7355', pointerEvents: 'none',
              }}>☯</div>

              {/* 顶部边框装饰 */}
              <div style={{
                borderTop: '2px solid #8B7355',
                borderBottom: '1px solid #D4C5B0',
                padding: '2px 0',
                marginBottom: '24px',
              }}>
                <div style={{ borderTop: '1px solid #D4C5B0' }} />
              </div>

              {/* 标题 */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '28px', letterSpacing: '0.5em', color: '#1a1a1a', fontWeight: 700 }}>
                  {t('app.title')}
                </div>
                <div style={{
                  width: '40px', height: '1px', margin: '8px auto',
                  background: 'linear-gradient(90deg, transparent, #8B7355, transparent)',
                }} />
                <div style={{ fontSize: '11px', color: '#8B7355', letterSpacing: '0.3em' }}>
                  {t('app.subtitle')}
                </div>
              </div>

              {/* 字解 */}
              <div style={{
                display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '20px',
              }}>
                {characters.map((info, i) => (
                  <div key={i} style={{
                    border: '1px solid #D4C5B0', borderRadius: '6px',
                    padding: '12px 16px', textAlign: 'center',
                    background: 'rgba(255,255,255,0.5)', minWidth: '80px',
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#1a1a1a', marginBottom: '2px' }}>
                      {info.traditionalChar}
                    </div>
                    {info.traditionalChar !== info.char && (
                      <div style={{ fontSize: '10px', color: '#8B7355', marginBottom: '2px' }}>{t('char.simplified')}{info.char}</div>
                    )}
                    <div style={{ fontSize: '11px', color: '#5a4a3a', marginBottom: '6px' }}>{info.pinyin}</div>
                    <div style={{ width: '30px', height: '1px', background: '#D4C5B0', margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '10px', color: '#3a3a3a' }}>
                      {info.traditionalStrokes}画 ·{' '}
                      <span style={{ color: getWuXingColor(info.wuxing), fontWeight: 600 }}>{info.wuxing}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 卦象 */}
              <div style={{
                textAlign: 'center', marginBottom: '20px',
                padding: '16px', border: '1px solid #D4C5B0', borderRadius: '6px',
                background: 'rgba(255,255,255,0.4)',
              }}>
                <div style={{ fontSize: '10px', color: '#8B7355', letterSpacing: '0.3em', marginBottom: '12px' }}>
                  {t('export.hexSection')}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#8B7355' }}>{t('hex.upper')}</div>
                    <div style={{ fontSize: '24px' }}>{divination.upperTrigram.symbol}</div>
                    <div style={{ fontSize: '11px' }}>{divination.upperTrigram.name}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ fontSize: '20px', color: '#C93756' }}>☯</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#8B7355' }}>{t('hex.lower')}</div>
                    <div style={{ fontSize: '24px' }}>{divination.lowerTrigram.symbol}</div>
                    <div style={{ fontSize: '11px' }}>{divination.lowerTrigram.name}</div>
                  </div>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '12px',
                  padding: '8px 0', borderTop: '1px solid #E8DED0', marginTop: '8px',
                }}>
                  <span><span style={{ color: '#8B7355' }}>{t('hex.original')}</span> {divination.originalHex.name}</span>
                  <span style={{ color: '#D4C5B0' }}>|</span>
                  <span><span style={{ color: '#8B7355' }}>{t('hex.mutual')}</span> {divination.mutualHex.name}</span>
                  <span style={{ color: '#D4C5B0' }}>|</span>
                  <span><span style={{ color: '#8B7355' }}>{t('hex.changed')}</span> {divination.changedHex.name}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#5a4a3a', marginTop: '6px', fontStyle: 'italic' }}>
                  「{divination.originalHex.description}」
                </div>
              </div>

              {/* 批语 */}
              <div style={{
                marginBottom: '20px', padding: '14px',
                border: '1px solid #D4C5B0', borderRadius: '6px',
                background: 'rgba(255,255,255,0.4)', position: 'relative',
              }}>
                <div style={{ fontSize: '10px', color: '#8B7355', letterSpacing: '0.3em', textAlign: 'center', marginBottom: '10px' }}>
                  {t('export.commentSection')}
                </div>
                {/* 印章 */}
                <div style={{
                  position: 'absolute', top: '10px', right: '12px',
                  width: '32px', height: '32px', border: '2px solid #C93756',
                  borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', color: '#C93756', fontWeight: 700,
                  transform: 'rotate(-5deg)', opacity: 0.6,
                }}>{t('export.seal')}</div>
                <div style={{ fontSize: '12px', lineHeight: '2', whiteSpace: 'pre-line', paddingRight: '36px' }}>
                  {fortune.overallFortune}
                </div>
              </div>

              {/* 四柱运势 */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px',
              }}>
                {fortune.aspects.map((aspect) => (
                  <div key={aspect.name} style={{
                    border: '1px solid #D4C5B0', borderRadius: '6px', padding: '10px',
                    background: 'rgba(255,255,255,0.4)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <span>{aspect.icon}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{aspect.name}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#C93756', marginBottom: '4px', letterSpacing: '0.1em' }}>
                      {'✿'.repeat(aspect.score)}
                      <span style={{ color: '#D4C5B0' }}>{'✿'.repeat(5 - aspect.score)}</span>
                      <span style={{ fontSize: '10px', color: '#8B7355', marginLeft: '4px' }}>
                        {scoreLabel(aspect.score)}
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#5a4a3a', lineHeight: '1.6' }}>
                      {aspect.summary}
                    </div>
                  </div>
                ))}
              </div>

              {/* 底部信息 */}
              <div style={{
                borderTop: '1px solid #D4C5B0', paddingTop: '12px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ fontSize: '9px', color: '#8B7355' }}>
                  {fortune.dateGanZhi.label}日 · {fortune.wuxingRelation}
                </div>
                <div style={{ fontSize: '9px', color: '#8B7355' }}>
                  {t('export.footer')}
                </div>
              </div>

              {/* 底部边框装饰 */}
              <div style={{
                borderTop: '1px solid #D4C5B0',
                borderBottom: '2px solid #8B7355',
                padding: '2px 0',
                marginTop: '12px',
              }}>
                <div style={{ borderTop: '1px solid #D4C5B0' }} />
              </div>
            </div>

            {/* 弹窗操作栏 */}
            <div className="bg-[var(--color-xuan-zhi)] p-4 flex gap-3 border-t border-[var(--color-border)]">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1 py-2.5 bg-[var(--color-zhu-sha)] text-white text-sm tracking-[0.2em]
                           rounded transition-all hover:opacity-90 disabled:opacity-50"
              >
                {isExporting ? t('export.saving') : t('export.save')}
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2.5 border border-[var(--color-border)] text-sm text-[#5a4a3a]
                           rounded transition-all hover:bg-white/50"
              >
                {t('export.close')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
